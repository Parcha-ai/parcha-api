import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  FlashLoaderResponse,
  DocumentFile,
  DocumentTypeValue,
  DOCUMENT_TYPES,
  VALIDITY_PERIODS,
  ValidityPeriod,
} from "../types/flash";
import { fileToBase64, isValidPDF } from "../utils/file";
import { checkDocument } from "../services/flashLoader";
import { log } from "../utils/logger";
import "./FlashLoader.css";

const API_URL = "http://localhost:8001/api/v1/runFlashCheck";
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
const API_KEY_STORAGE_KEY = "parcha_flash_loader_api_key";

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const FlashLoader: React.FC = () => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
  });
  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [response, setResponse] = useState<FlashLoaderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState<number | null>(null);
  const [acceptedTypes, setAcceptedTypes] = useState<Set<DocumentTypeValue>>(
    new Set(DOCUMENT_TYPES.map((dt) => dt.value))
  );
  const [showDocumentTypes, setShowDocumentTypes] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [validityPeriod, setValidityPeriod] = useState<ValidityPeriod>(
    VALIDITY_PERIODS[0]
  );

  useEffect(() => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  }, [apiKey]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const toggleDocumentType = (value: DocumentTypeValue) => {
    const newTypes = new Set(acceptedTypes);
    if (newTypes.has(value)) {
      if (newTypes.size > 1) {
        newTypes.delete(value);
        setAcceptedTypes(newTypes);
      }
    } else {
      newTypes.add(value);
      setAcceptedTypes(newTypes);
    }
  };

  const checkDocumentWithApi = async (doc: DocumentFile) => {
    if (!apiKey) {
      setError("Please provide an API key");
      return;
    }

    if (acceptedTypes.size === 0) {
      setError("Please select at least one document type");
      return;
    }

    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const result = await checkDocument(
        { apiKey, baseUrl: API_URL },
        doc.base64,
        doc.file.name,
        Array.from(acceptedTypes),
        validityPeriod.days
      );
      const endTime = Date.now();
      setTimeSpent((endTime - startTime) / 1000); // Convert to seconds
      log.info("flash_loader_response", {
        time_spent: (endTime - startTime) / 1000,
        full_response: result,
      });
      setResponse(result);
    } catch (err) {
      setError((err as Error).message);
      setTimeSpent(null);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!isValidPDF(file)) {
        setError("Please upload a PDF file");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        const newDoc = { file, base64 };
        setDocument(newDoc);
        setError(null);
        await checkDocumentWithApi(newDoc);
      } catch (err) {
        setError("Error processing file");
        log.error("file_processing_error", err as Error);
      }
    },
    [apiKey, acceptedTypes, validityPeriod]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: !apiKey || loading,
  });

  const getPdfUrl = (response: FlashLoaderResponse) => {
    const url = response.input_data.document.url;
    if (!url) return null;

    const proxyUrl = new URL("https://demo.parcha.ai/getDocument");
    proxyUrl.searchParams.set("case_id", response.command_instance_id);
    proxyUrl.searchParams.set("expired_url", url);

    return proxyUrl.toString();
  };

  const pdfUrl = response ? getPdfUrl(response) : null;

  const getCurlCommand = () => {
    if (!document || !apiKey) return "";

    const documentTypes = Array.from(acceptedTypes).join(",");
    const command = [
      `curl -X POST '${API_URL}' \\`,
      `-H 'Authorization: Bearer ......' \\`,
      `-H 'Content-Type: application/json' \\`,
      `-d '{`,
      `  "agent_key": "mercury-poa-v1",`,
      `  "check_id": "kyb.proof_of_address_verification",`,
      `  "check_args": {`,
      `    "validity_period": ${validityPeriod.days},`,
      `    "accepted_documents": ["${documentTypes}"]`,
      `  },`,
      `  "kyb_schema": {`,
      `    "id": "parcha-latest",`,
      `    "self_attested_data": {`,
      `      "business_name": "Parcha",`,
      `      "registered_business_name": "Parcha Labs Inc",`,
      `      "proof_of_address_documents": [`,
      `        {`,
      `          "b64_document": "<B64_DOC>",`,
      `          "file_name": "${document.file.name}",`,
      `          "source_type": "file_url"`,
      `        }`,
      `      ]`,
      `    }`,
      `  }`,
      `}'`,
    ].join("\n");
    return command;
  };

  return (
    <div className="flash-loader">
      <div className="config-section">
        <input
          type="password"
          placeholder="Enter your API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="api-input"
        />
        {document && (
          <button
            onClick={() => setShowCodeModal(true)}
            className="view-code-button"
          >
            View Code
          </button>
        )}
      </div>

      {showCodeModal && (
        <div className="modal-overlay" onClick={() => setShowCodeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>API Request Code</h3>
              <button
                className="modal-close"
                onClick={() => setShowCodeModal(false)}
              >
                ×
              </button>
            </div>
            <pre className="code-block">{getCurlCommand()}</pre>
          </div>
        </div>
      )}

      <div className="document-types-accordion">
        <button
          className="accordion-toggle"
          onClick={() => setShowDocumentTypes(!showDocumentTypes)}
        >
          <span>Advanced Options</span>
          <span className="accordion-icon">
            {showDocumentTypes ? "▼" : "▶"}
          </span>
        </button>
        {showDocumentTypes && (
          <div className="document-types">
            <h3>Accepted Document Types</h3>
            <div className="document-types-grid">
              {DOCUMENT_TYPES.map((type) => (
                <label key={type.value} className="document-type-checkbox">
                  <input
                    type="checkbox"
                    checked={acceptedTypes.has(type.value)}
                    onChange={() => toggleDocumentType(type.value)}
                    disabled={
                      loading ||
                      (acceptedTypes.size === 1 &&
                        acceptedTypes.has(type.value))
                    }
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>

            <h3 className="validity-title">Validity Period</h3>
            <div className="validity-options">
              {VALIDITY_PERIODS.map((period) => (
                <label key={period.days} className="validity-option">
                  <input
                    type="radio"
                    name="validity"
                    checked={validityPeriod.days === period.days}
                    onChange={() => setValidityPeriod(period)}
                    disabled={loading}
                  />
                  <span>{period.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} ${
          document ? "has-file" : ""
        } ${!apiKey || loading ? "disabled" : ""}`}
      >
        <input {...getInputProps()} />
        {document ? (
          <div className="file-info">
            <p>📄 {document.file.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDocument(null);
                setResponse(null);
              }}
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ) : (
          <p>
            {!apiKey
              ? "Enter API key to upload"
              : loading
              ? "Processing..."
              : isDragActive
              ? "Drop the PDF here"
              : "Drag & drop a PDF here, or click to select"}
          </p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading-text">Analyzing document...</div>}

      {response && (
        <div className="results-container">
          <div className={`result ${response.passed ? "success" : "failure"}`}>
            <h3>Result:</h3>
            <p>Status: {response.passed ? "Passed ✅" : "Failed ❌"}</p>
            <p>
              Time Spent:{" "}
              {timeSpent ? `${timeSpent.toFixed(2)}s` : "Not available"}
            </p>
            {response.alerts && Object.keys(response.alerts).length > 0 && (
              <div className="alerts">
                <p>
                  <strong>⚠️ Warnings:</strong>
                </p>
                <ul>
                  {Object.entries(response.alerts).map(([key, message]) => (
                    <li key={key}>{message as string}</li>
                  ))}
                </ul>
              </div>
            )}
            <p>Analysis: {response.answer}</p>

            <div className="document-details">
              <h4>Document Information</h4>
              <div className="document-item">
                <p>
                  <strong>Company:</strong>{" "}
                  {response.payload.company_name || "Not available"}
                </p>
                <p>
                  <strong>Document Type:</strong>{" "}
                  {response.payload.document_type || "Not available"}
                </p>
                <p>
                  <strong>Document Date:</strong>{" "}
                  {formatDate(response.payload.document_date) ||
                    "Not available"}
                </p>

                {response.payload.document_address && (
                  <div className="address-details">
                    <p>
                      <strong>Address:</strong>
                    </p>
                    {response.payload.document_address.street_1 && (
                      <p>{response.payload.document_address.street_1}</p>
                    )}
                    {response.payload.document_address.street_2 && (
                      <p>{response.payload.document_address.street_2}</p>
                    )}
                    {(response.payload.document_address.city ||
                      response.payload.document_address.state ||
                      response.payload.document_address.postal_code) && (
                      <p>
                        {[
                          response.payload.document_address.city,
                          response.payload.document_address.state,
                          response.payload.document_address.postal_code,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {response.payload.document_address.country_code && (
                      <p>{response.payload.document_address.country_code}</p>
                    )}
                  </div>
                )}
              </div>

              {(response.follow_up || response.recommendation) && (
                <div className="document-item">
                  {response.follow_up && (
                    <p>
                      <strong>Follow-up:</strong> {response.follow_up}
                    </p>
                  )}
                  {response.recommendation && (
                    <p>
                      <strong>Recommendation:</strong> {response.recommendation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pdf-viewer">
            {pdfUrl ? (
              <Worker workerUrl={WORKER_URL}>
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            ) : (
              <div className="pdf-loading">Loading PDF...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
