import React, { useState, useCallback, useMemo, useEffect } from "react";
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
  VALIDITY_PERIODS,
  ValidityPeriod,
  FlashLoaderType,
  FLASH_LOADER_CONFIGS,
  JurisdictionOption,
  IncorporationFlashCheckResult,
  ProofOfAddressFlashCheckResult,
  EinFlashCheckResult,
} from "../types/flash";
import { fileToBase64, isValidPDF } from "../utils/file";
import { checkDocument } from "../services/flashLoader";
import { log } from "../utils/logger";
import "./docs-playground.css";

const DEFAULT_API_URL = "https://demo.parcha.ai/api/v1";
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export interface DocsPlaygroundProps {
  type: FlashLoaderType;
  descope_user_id?: string;
  apiKey?: string;
  baseUrl?: string;
  agentKey?: string;
  initialResponse?: FlashLoaderResponse;
  playgroundMode?: boolean;
  showDebugPanel?: boolean;
}

export const DocsPlayground: React.FC<DocsPlaygroundProps> = ({
  type,
  descope_user_id,
  apiKey = import.meta.env.VITE_API_KEY,
  baseUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  agentKey = import.meta.env.VITE_AGENT_KEY,
  initialResponse,
  playgroundMode = true,
  showDebugPanel = false,
}) => {
  const config = useMemo(() => FLASH_LOADER_CONFIGS[type], [type]);
  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [response, setResponse] = useState<FlashLoaderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState<number | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [acceptedTypes, setAcceptedTypes] = useState<Set<DocumentTypeValue>>(
    new Set(config.documentTypes?.map((dt) => dt.value) || [])
  );
  const [selectedJurisdiction, setSelectedJurisdiction] =
    useState<JurisdictionOption>(
      config.jurisdictions?.[0] || { label: "", state: "", country: "" }
    );
  const [showDocumentTypes, setShowDocumentTypes] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [validityPeriod, setValidityPeriod] = useState<ValidityPeriod>(
    VALIDITY_PERIODS[0]
  );
  const [einNumber, setEinNumber] = useState<string>("");

  const effectiveBaseUrl = `${baseUrl}/runFlashCheck`;
  const isConfigured = !!(apiKey && agentKey);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Add debug info
  const addDebugInfo = useCallback((info: string) => {
    setDebugInfo((prev) => [...prev.slice(-4), info]); // Keep last 5 messages
  }, []);

  useEffect(() => {
    addDebugInfo(`Type changed to: ${type}`);
  }, [type, addDebugInfo]);

  // Force update response when initialResponse changes
  useEffect(() => {
    if (initialResponse) {
      setResponse(initialResponse);
      if (initialResponse.input_data?.document?.url) {
        setDocument({
          file: new File(
            [],
            initialResponse.input_data.document.file_name || "document.pdf",
            {
              type: "application/pdf",
            }
          ),
          base64: "",
        });
      }
    }
  }, [initialResponse]);

  // Reset state when type changes
  useEffect(() => {
    if (!initialResponse) {
      setDocument(null);
      setResponse(null);
    }
  }, [type, initialResponse]);

  // Add debug panel to the UI
  const renderDebugPanel = () => (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        background: "#f0f0f0",
        padding: "10px",
        maxWidth: "400px",
        zIndex: 9999,
        fontSize: "12px",
        fontFamily: "monospace",
      }}
    >
      <div>Debug Info:</div>
      <div>Type: {type}</div>
      <div>Has Initial Response: {initialResponse ? "Yes" : "No"}</div>
      <div>Has Response State: {response ? "Yes" : "No"}</div>
      <div>Response ID: {response?.command_instance_id || "None"}</div>
      <div>Recent Events:</div>
      {debugInfo.map((info, i) => (
        <div key={i}>{info}</div>
      ))}
    </div>
  );

  const checkDocumentWithApi = useCallback(
    async (doc: DocumentFile) => {
      if (!isConfigured) return;

      if (config.documentTypes && acceptedTypes.size === 0) {
        setError("Please select at least one document type");
        return;
      }

      setLoading(true);
      setError(null);
      const startTime = Date.now();

      try {
        const checkArgs = {
          ...config.checkArgs,
          ...(config.showValidityPeriod
            ? { validity_period: validityPeriod.days }
            : {}),
          ...(config.documentTypes
            ? { accepted_documents: Array.from(acceptedTypes) }
            : {}),
          ...(type === "ein" && einNumber ? { ein_number: einNumber } : {}),
        };

        const kybSchema = {
          id: "parcha-latest",
          self_attested_data: {
            business_name: "Parcha",
            registered_business_name: "Parcha Labs Inc",
            ...(type === "incorporation" &&
              selectedJurisdiction.state && {
                address_of_operation: {
                  state: selectedJurisdiction.state,
                  country_code: "US",
                },
              }),
            [config.documentField]: [
              {
                b64_document: doc.base64,
                file_name: doc.file.name,
                source_type: "file_url",
              },
            ],
          },
        };

        const result = await checkDocument(
          {
            apiKey,
            baseUrl: effectiveBaseUrl,
            agentKey,
          },
          doc.base64,
          doc.file.name,
          checkArgs,
          config.checkId,
          config.documentField,
          descope_user_id,
          kybSchema
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
    },
    [
      config,
      acceptedTypes,
      validityPeriod,
      selectedJurisdiction,
      isConfigured,
      apiKey,
      effectiveBaseUrl,
      agentKey,
      descope_user_id,
      type,
      einNumber,
    ]
  );

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
    [checkDocumentWithApi]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled:
      !isConfigured ||
      loading ||
      (!playgroundMode && !!(document || initialResponse)),
  });

  const getPdfUrl = (response: FlashLoaderResponse) => {
    const url = response.input_data.document.url;
    if (!url) return null;

    if (url.startsWith("https://demo.parcha.ai/getDocument")) {
      return url;
    }

    const proxyUrl = new URL("https://demo.parcha.ai/getDocument");
    proxyUrl.searchParams.set("case_id", response.command_instance_id);
    proxyUrl.searchParams.set("expired_url", url);

    return proxyUrl.toString();
  };

  const pdfUrl = response ? getPdfUrl(response) : null;

  const getCurlCommand = () => {
    if (!document) return "";

    const checkArgs = {
      ...config.checkArgs,
      ...(config.showValidityPeriod
        ? { validity_period: validityPeriod.days }
        : {}),
      ...(config.documentTypes
        ? { accepted_documents: Array.from(acceptedTypes) }
        : {}),
    };

    const command = [
      `curl -X POST '${effectiveBaseUrl}' \\`,
      `-H 'Authorization: Bearer ${
        apiKey ? "*".repeat(apiKey.length) : "*****"
      }' \\`,
      `-H 'Content-Type: application/json' \\`,
      `-d '{`,
      `  "agent_key": "${agentKey}",`,
      `  "check_id": "${config.checkId}",`,
      `  "check_args": ${JSON.stringify(checkArgs, null, 4)
        .split("\n")
        .join("\n  ")},`,
      `  "kyb_schema": {`,
      `    "id": "parcha-latest",`,
      `    "self_attested_data": {`,
      `      "business_name": "Parcha",`,
      `      "registered_business_name": "Parcha Labs Inc",`,
      ...(type === "incorporation" && selectedJurisdiction.state
        ? [
            `      "address_of_operation": {`,
            `        "state": "${selectedJurisdiction.state}",`,
            `        "country_code": "US"`,
            `      },`,
          ]
        : []),
      `      "${config.documentField}": [`,
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
    setAcceptedTypes((prevTypes) => {
      const currentTypes = Array.from(prevTypes);
      const isCurrentlyChecked = currentTypes.includes(value);

      // If trying to uncheck and it would leave us with no checkboxes, prevent it
      if (isCurrentlyChecked && currentTypes.length <= 1) {
        return prevTypes;
      }

      // Otherwise update the types
      const newTypes = isCurrentlyChecked
        ? currentTypes.filter((t) => t !== value)
        : [...currentTypes, value];

      // Double check we're not somehow ending up with no checkboxes
      if (newTypes.length === 0) {
        return prevTypes;
      }

      return new Set(newTypes);
    });
  };

  return (
    <div
      key={`${type}-${initialResponse?.command_instance_id || "new"}`}
      className="docs-playground"
      data-response-id={response?.command_instance_id}
      data-has-response={!!response}
      data-type={type}
      data-playground-mode={playgroundMode}
    >
      {showDebugPanel && renderDebugPanel()}
      {!isConfigured && (
        <div className="env-error-banner" data-testid="env-error-banner">
          <span>⚠️</span>
          <p>
            Missing required configuration: API key and agent key are required
          </p>
        </div>
      )}

      <div
        className={`main-content ${loading ? "loading" : ""} ${
          document || initialResponse?.input_data?.document?.url
            ? "has-document"
            : ""
        }`}
        data-testid="main-content"
      >
        <div className="upload-section">
          <div className="controls-panel">
            {(config.documentTypes ||
              config.showValidityPeriod ||
              config.jurisdictions) && (
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
                    {config.jurisdictions && (
                      <>
                        <h3>Jurisdiction</h3>
                        <div className="jurisdiction-select">
                          <select
                            value={`${selectedJurisdiction.state},${selectedJurisdiction.country}`}
                            onChange={(e) => {
                              const [state, country] =
                                e.target.value.split(",");
                              const jurisdiction = config.jurisdictions?.find(
                                (j) =>
                                  j.state === state && j.country === country
                              );
                              if (jurisdiction) {
                                setSelectedJurisdiction(jurisdiction);
                              }
                            }}
                            disabled={
                              loading ||
                              (!playgroundMode &&
                                !!(document || initialResponse))
                            }
                          >
                            {config.jurisdictions.map((jurisdiction) => (
                              <option
                                key={`${jurisdiction.state},${jurisdiction.country}`}
                                value={`${jurisdiction.state},${jurisdiction.country}`}
                              >
                                {jurisdiction.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {type === "ein" && (
                      <>
                        <h3>EIN Number (Optional)</h3>
                        <div className="ein-input">
                          <input
                            type="text"
                            value={einNumber}
                            onChange={(e) => setEinNumber(e.target.value)}
                            placeholder="Enter EIN number to validate"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled={loading}
                          />
                        </div>
                      </>
                    )}

                    {config.documentTypes && (
                      <>
                        <h3>Document Types</h3>
                        <div className="document-types-grid">
                          {config.documentTypes.map((type) => (
                            <label
                              key={type.value}
                              className="document-type-checkbox"
                            >
                              <input
                                type="checkbox"
                                checked={acceptedTypes.has(type.value)}
                                onChange={() => {
                                  toggleDocumentType(type.value);
                                }}
                                disabled={
                                  loading ||
                                  (acceptedTypes.size === 1 &&
                                    acceptedTypes.has(type.value)) ||
                                  (!playgroundMode &&
                                    !!(document || initialResponse))
                                }
                                data-testid={`checkbox-${type.value}`}
                              />
                              <span>{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}

                    {config.showValidityPeriod && (
                      <>
                        <h3>Age Limit</h3>
                        <div className="validity-options">
                          {VALIDITY_PERIODS.map((period) => (
                            <label
                              key={period.days}
                              className="validity-option"
                            >
                              <input
                                type="radio"
                                name="validity"
                                checked={validityPeriod.days === period.days}
                                onChange={() => setValidityPeriod(period)}
                                disabled={
                                  loading ||
                                  (!playgroundMode &&
                                    !!(document || initialResponse))
                                }
                              />
                              <span>{period.label}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <div
                {...getRootProps()}
                className={`flex-1 dropzone ${isDragActive ? "active" : ""} ${
                  document ? "has-file" : ""
                } ${
                  !isConfigured ||
                  loading ||
                  (!playgroundMode && (document || initialResponse))
                    ? "disabled"
                    : ""
                }`}
              >
                <input {...getInputProps()} />
                {document ? (
                  <div className="file-info">
                    <p>📄 {document.file.name}</p>
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
                          : !playgroundMode && (document || initialResponse)
                          ? "Document loaded"
                          : "Upload your document"}
                      </p>
                      {isConfigured &&
                        !loading &&
                        !isDragActive &&
                        playgroundMode &&
                        !(document || initialResponse) && (
                          <p className="dropzone-subtitle">
                            Drag & drop a PDF file here, or click to browse
                          </p>
                        )}
                    </div>
                  </div>
                )}
              </div>
              {document && playgroundMode && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowCodeModal(true)}
                    disabled={loading}
                    title="View API Request"
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <CodeIcon />
                  </button>
                  <button
                    onClick={() => {
                      setDocument(null);
                      setResponse(null);
                    }}
                    disabled={loading}
                    title="Remove document"
                    className="p-2 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>
              )}
              {document && !playgroundMode && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowCodeModal(true)}
                    disabled={loading}
                    title="View API Request"
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <CodeIcon />
                  </button>
                </div>
              )}
            </div>
          </div>

          {response && (
            <div className="results-container" data-testid="results-container">
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

                <div
                  className="document-details"
                  data-testid="document-details"
                >
                  <h4>Document Information</h4>
                  <div className="document-item">
                    {type === "incorporation" ? (
                      <>
                        <p>
                          <strong>Company Name: </strong>
                          {response.payload.company_name || "Not available"}
                        </p>
                        <p>
                          <strong>Jurisdiction: </strong>
                          {(response.payload as IncorporationFlashCheckResult)
                            .jurisdiction?.state || "Not available"}
                        </p>
                        <p>
                          <strong>Document Date: </strong>
                          {formatDate(response.payload.document_date) ||
                            "Not available"}
                        </p>
                      </>
                    ) : type === "ein" ? (
                      <>
                        <p>
                          <strong>Company Name: </strong>
                          {response.payload.company_name || "Not available"}
                        </p>
                        <p>
                          <strong>Document Date: </strong>
                          {formatDate(response.payload.document_date) ||
                            "Not available"}
                        </p>
                        <p data-testid="ein-number">
                          <strong>EIN Number: </strong>
                          {(response.payload as EinFlashCheckResult).ein ||
                            "Not available"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Company: </strong>
                          {response.payload.company_name || "Not available"}
                        </p>
                        {response.payload.type ===
                          "ProofOfAddressFlashCheckResult" && (
                          <>
                            <p>
                              <strong>Document Type: </strong>
                              {(
                                response.payload as ProofOfAddressFlashCheckResult
                              ).document_type || "Not available"}
                            </p>
                            <p>
                              <strong>Document Date: </strong>
                              {formatDate(response.payload.document_date) ||
                                "Not available"}
                            </p>

                            {(
                              response.payload as ProofOfAddressFlashCheckResult
                            ).document_address && (
                              <div className="address-details">
                                <p>
                                  <strong>Address</strong>
                                </p>
                                i{" "}
                                {(
                                  response.payload as ProofOfAddressFlashCheckResult
                                ).document_address.street_1 && (
                                  <p>
                                    {
                                      (
                                        response.payload as ProofOfAddressFlashCheckResult
                                      ).document_address.street_1
                                    }
                                  </p>
                                )}
                                {(
                                  response.payload as ProofOfAddressFlashCheckResult
                                ).document_address.street_2 && (
                                  <p>
                                    {
                                      (
                                        response.payload as ProofOfAddressFlashCheckResult
                                      ).document_address.street_2
                                    }
                                  </p>
                                )}
                                {((
                                  response.payload as ProofOfAddressFlashCheckResult
                                ).document_address.city ||
                                  (
                                    response.payload as ProofOfAddressFlashCheckResult
                                  ).document_address.state ||
                                  (
                                    response.payload as ProofOfAddressFlashCheckResult
                                  ).document_address.postal_code) && (
                                  <p>
                                    {[
                                      (
                                        response.payload as ProofOfAddressFlashCheckResult
                                      ).document_address.city,
                                      (
                                        response.payload as ProofOfAddressFlashCheckResult
                                      ).document_address.state,
                                      (
                                        response.payload as ProofOfAddressFlashCheckResult
                                      ).document_address.postal_code,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                )}
                                {(
                                  response.payload as ProofOfAddressFlashCheckResult
                                ).document_address.country_code && (
                                  <p>
                                    {
                                      (
                                        response.payload as ProofOfAddressFlashCheckResult
                                      ).document_address.country_code
                                    }
                                  </p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="preview-section">
          {error && (
            <div className="error-message" data-testid="error-message">
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-overlay" data-testid="loading-spinner">
              <div className="loading-spinner"></div>
              <p>Processing document...</p>
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
