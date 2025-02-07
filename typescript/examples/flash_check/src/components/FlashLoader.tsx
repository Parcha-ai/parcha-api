import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  Upload as UploadFileIcon,
  Code as CodeIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
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

const API_URL = `${
  import.meta.env.VITE_API_URL || "https://demo.parcha.ai/api/v1"
}/runFlashCheck`;
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
const AGENT_KEY = import.meta.env.VITE_AGENT_KEY;
const API_KEY = import.meta.env.VITE_API_KEY;

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

interface FlashLoaderProps {
  descope_user_id?: string;
  apiKey?: string;
  baseUrl?: string;
}

export const FlashLoader: React.FC<FlashLoaderProps> = ({
  descope_user_id,
  apiKey,
  baseUrl,
}) => {
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

  const effectiveBaseUrl = baseUrl ? `${baseUrl}/runFlashCheck` : API_URL;

  const getMissingEnvVars = () => {
    const missing = [];
    if (!apiKey && !API_KEY) missing.push("VITE_API_KEY");
    if (!AGENT_KEY) missing.push("VITE_AGENT_KEY");
    return missing;
  };

  const missingEnvVars = getMissingEnvVars();
  const isConfigured = missingEnvVars.length === 0;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const checkDocumentWithApi = async (doc: DocumentFile) => {
    if (!isConfigured) return;

    if (acceptedTypes.size === 0) {
      setError("Please select at least one document type");
      return;
    }

    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const result = await checkDocument(
        {
          apiKey: apiKey || API_KEY,
          baseUrl: effectiveBaseUrl,
          agentKey: AGENT_KEY,
        },
        doc.base64,
        doc.file.name,
        Array.from(acceptedTypes),
        validityPeriod.days,
        descope_user_id
      );
      const endTime = Date.now();
      setTimeSpent((endTime - startTime) / 1000);
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
    [acceptedTypes, validityPeriod]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: !isConfigured || loading,
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
    if (!document) return "";

    const documentTypes = Array.from(acceptedTypes).join(",");
    const command = [
      `curl -X POST '${effectiveBaseUrl}' \\`,
      `-H 'Authorization: Bearer ${
        apiKey ? "*".repeat(apiKey.length) : "*****"
      }' \\`,
      `-H 'Content-Type: application/json' \\`,
      `-d '{`,
      `  "agent_key": "${AGENT_KEY}",`,
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
      ...(descope_user_id
        ? [`  "descope_user_id": "${descope_user_id}",`]
        : []),
      `}'`,
    ].join("\n");
    return command;
  };

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

  return (
    <div className="parcha-flash-loader">
      {!isConfigured && (
        <div className="env-error-banner">
          <span>⚠️</span>
          <p>Missing environment variables: {missingEnvVars.join(", ")}</p>
        </div>
      )}

      <div
        className={`main-content ${loading ? "loading" : ""} ${
          document ? "has-document" : ""
        }`}
      >
        <div className="upload-section">
          <div className="controls-panel">
            <div className="document-types-accordion">
              <button
                className="accordion-toggle"
                onClick={() => setShowDocumentTypes(!showDocumentTypes)}
                disabled={loading}
              >
                <span>Validation Options</span>
                {showDocumentTypes ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </button>
              {showDocumentTypes && (
                <div className="document-types">
                  <h3>Document Types</h3>
                  <div className="document-types-grid">
                    {DOCUMENT_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className="document-type-checkbox"
                      >
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

                  <h3>Age Limit</h3>
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
              } ${!isConfigured || loading ? "disabled" : ""}`}
            >
              <input {...getInputProps()} />
              {document ? (
                <div className="file-info">
                  <p>📄 {document.file.name}</p>
                  <div className="action-buttons">
                    <button
                      onClick={() => setShowCodeModal(true)}
                      disabled={loading}
                      title="View API Request"
                    >
                      <CodeIcon />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDocument(null);
                        setResponse(null);
                      }}
                      disabled={loading}
                      className="delete-button"
                      title="Remove document"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dropzone-content">
                  <div className="dropzone-icon">
                    <UploadFileIcon
                      style={{ fontSize: "2.5rem", color: "#6366f1" }}
                    />
                  </div>
                  <div className="dropzone-text">
                    <p className="dropzone-title">
                      {!isConfigured
                        ? "Configure environment variables to start"
                        : loading
                        ? "Processing..."
                        : isDragActive
                        ? "Drop your document here"
                        : "Upload your document"}
                    </p>
                    {isConfigured && !loading && !isDragActive && (
                      <p className="dropzone-subtitle">
                        Drag & drop a PDF file here, or click to browse
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {response && (
            <div className="results-container">
              <div
                className={`result ${response.passed ? "success" : "failure"}`}
              >
                <div className="result-status">
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={
                        response.passed ? "success-text" : "failure-text"
                      }
                    >
                      {response.passed ? "Passed ✅" : "Failed ❌"}
                    </span>
                  </p>
                  <p>
                    <strong>Processing Time:</strong>
                    {timeSpent
                      ? `${timeSpent.toFixed(2)} seconds`
                      : "Not available"}
                  </p>
                </div>

                <div className="analysis-section">
                  <p>
                    <strong>Analysis</strong>
                  </p>
                  <p>{response.answer}</p>
                </div>

                {response.alerts && Object.keys(response.alerts).length > 0 && (
                  <div className="alerts">
                    <p>
                      <strong>⚠️ Validation Warnings</strong>
                    </p>
                    <ul>
                      {Object.entries(response.alerts).map(([key, message]) => (
                        <li key={key}>{message as string}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="document-details">
                  <h4>Document Information</h4>
                  <div className="document-item">
                    <p>
                      <strong>Company</strong>
                      {response.payload.company_name || "Not available"}
                    </p>
                    <p>
                      <strong>Document Type</strong>
                      {response.payload.document_type || "Not available"}
                    </p>
                    <p>
                      <strong>Document Date</strong>
                      {formatDate(response.payload.document_date) ||
                        "Not available"}
                    </p>

                    {response.payload.document_address && (
                      <div className="address-details">
                        <p>
                          <strong>Address</strong>
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
                          <p>
                            {response.payload.document_address.country_code}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="preview-section">
          {error && <div className="error-message">{error}</div>}

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Analyzing your document... This usually takes 5-10 seconds.</p>
            </div>
          )}

          <div className="pdf-container">
            {document && pdfUrl ? (
              <Worker workerUrl={WORKER_URL}>
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            ) : document ? (
              <div className="pdf-loading">Loading PDF...</div>
            ) : null}
          </div>
        </div>
      </div>

      {showCodeModal && (
        <div className="modal-overlay" onClick={() => setShowCodeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>API Request</h3>
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
    </div>
  );
};
