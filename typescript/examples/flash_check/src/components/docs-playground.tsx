import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
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
  KYCProofOfAddressFlashCheckResult,
} from "../types/flash";
import { fileToBase64, isValidFile, SUPPORTED_FILE_TYPES } from "../utils/file";
import { checkDocument } from "../services/flashLoader";
import { log } from "../utils/logger";
import "./docs-playground.css";

const DEFAULT_API_URL = "https://demo.parcha.ai/api/v1";
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

const SAMPLE_DOCUMENTS: Record<FlashLoaderType, string> = {
  incorporation: isDevelopment
    ? "/parcha-inc.pdf"
    : "assets/sample-docs/parcha-inc.pdf",
  business_proof_of_address: isDevelopment
    ? "/parcha-poa.pdf"
    : "assets/sample-docs/parcha-poa.pdf",
  individual_proof_of_address: isDevelopment
    ? "/customer-poai.pdf"
    : "assets/sample-docs/customer-poai.pdf",
  ein: isDevelopment ? "/parcha_ein.pdf" : "assets/sample-docs/parcha_ein.pdf",
};

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
  onResponse?: (response: FlashLoaderResponse) => void;
}

export const DocsPlayground: React.FC<DocsPlaygroundProps> = ({
  type,
  descope_user_id,
  apiKey = import.meta.env.VITE_API_KEY,
  baseUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  agentKey = type === "individual_proof_of_address"
    ? import.meta.env.VITE_KYC_AGENT_KEY
    : import.meta.env.VITE_AGENT_KEY,
  initialResponse,
  playgroundMode = true,
  showDebugPanel = false,
  onResponse,
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
  const isConfigured = !!(
    apiKey &&
    (type === "individual_proof_of_address"
      ? import.meta.env.VITE_KYC_AGENT_KEY
      : import.meta.env.VITE_AGENT_KEY)
  );
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
      // Calculate time spent from job timestamps
      if (initialResponse.started_at && initialResponse.completed_at) {
        const startTime = new Date(initialResponse.started_at).getTime();
        const endTime = new Date(initialResponse.completed_at).getTime();
        setTimeSpent((endTime - startTime) / 1000);
      }
      if (initialResponse.check_results[0]?.input_data?.document?.url) {
        const fileName =
          initialResponse.check_results[0].input_data.document.file_name ||
          "document.pdf";
        const fileExtension = fileName.split(".").pop()?.toLowerCase();

        // Determine file type based on extension
        let fileType = "application/pdf"; // default
        if (fileExtension) {
          if (["png"].includes(fileExtension)) {
            fileType = "image/png";
          } else if (["jpg", "jpeg"].includes(fileExtension)) {
            fileType = "image/jpeg";
          } else if (["tif", "tiff"].includes(fileExtension)) {
            fileType = "image/tiff";
          } else if (["webp"].includes(fileExtension)) {
            fileType = "image/webp";
          }
        }

        setDocument({
          file: new File([], fileName, { type: fileType }),
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
      <div>
        Response ID: {response?.check_results[0].command_instance_id || "None"}
      </div>
      <div>Recent Events:</div>
      {debugInfo.map((info, i) => (
        <div key={i}>{info}</div>
      ))}
    </div>
  );

  const checkDocumentWithApi = useCallback(
    async (doc: DocumentFile) => {
      console.log("=== checkDocumentWithApi called ===");
      console.log("Current type:", type);
      console.log("Config:", config);
      console.log("Document:", doc.file.name);
      console.log("isConfigured:", isConfigured);
      console.log("acceptedTypes:", Array.from(acceptedTypes));

      if (!isConfigured) {
        console.log("Not configured, returning early");
        return;
      }

      if (config.documentTypes && acceptedTypes.size === 0) {
        console.log("No accepted types selected");
        setError("Please select at least one document type");
        return;
      }

      setLoading(true);
      setError(null);

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
        console.log("Constructed checkArgs:", checkArgs);

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
        console.log("Constructed kybSchema:", kybSchema);

        console.log("Calling checkDocument with:", {
          apiKey: apiKey ? "***" : undefined,
          baseUrl: effectiveBaseUrl,
          agentKey: agentKey ? "***" : undefined,
          checkId: config.checkId,
          documentField: config.documentField,
          descope_user_id,
          type,
        });

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
          kybSchema,
          type
        );

        // Calculate time spent from job timestamps
        if (result.started_at && result.completed_at) {
          const startTime = new Date(result.started_at).getTime();
          const endTime = new Date(result.completed_at).getTime();
          setTimeSpent((endTime - startTime) / 1000);
        }

        log.info("flash_loader_response", {
          time_spent: timeSpent,
          full_response: result,
        });
        setResponse(result);
        onResponse?.(result);
      } catch (err) {
        console.error("Error in checkDocumentWithApi:", err);
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
      onResponse,
    ]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!isValidFile(file)) {
        setError("Please upload a valid file");
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
    accept: SUPPORTED_FILE_TYPES,
    maxFiles: 1,
    disabled:
      !isConfigured ||
      loading ||
      (!playgroundMode && !!(document || initialResponse)),
  });

  const getFileUrl = (response: FlashLoaderResponse) => {
    const url = response.check_results[0].input_data.document.url;
    if (!url) return null;

    if (url.startsWith("https://demo.parcha.ai/getDocument")) {
      return url;
    }

    const proxyUrl = new URL("https://demo.parcha.ai/getDocument");
    proxyUrl.searchParams.set(
      "case_id",
      response.check_results[0].command_instance_id
    );
    proxyUrl.searchParams.set("expired_url", url);

    return proxyUrl.toString();
  };

  const fileUrl = response ? getFileUrl(response) : null;

  const renderFilePreview = () => {
    if (!document || !fileUrl) return null;

    const fileType = document.file.type;

    if (fileType === "application/pdf") {
      return (
        <Worker workerUrl={WORKER_URL}>
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      );
    } else if (fileType.startsWith("image/")) {
      return (
        <div
          className="image-preview-container"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={fileUrl}
            alt="Document preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      );
    }

    return <div>Unsupported file type</div>;
  };

  const getCurlCommand = () => {
    if (!document || !response) return "";

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
      `  "${
        type === "individual_proof_of_address" ? "kyc_schema" : "kyb_schema"
      }": {`,
      `    "id": "parcha-latest",`,
      `    "self_attested_data": {`,
      ...(type === "individual_proof_of_address"
        ? [`      "first_name": "Miguel",`, `      "last_name": "Rios",`]
        : [
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
          ]),
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

  const loadSampleDocument = useCallback(async () => {
    try {
      log.info("loading_sample_document", {
        type,
        url: SAMPLE_DOCUMENTS[type],
      });
      console.log("=== loadSampleDocument called ===");
      console.log("Current type:", type);
      console.log("Sample document URL:", SAMPLE_DOCUMENTS[type]);

      const response = await fetch(SAMPLE_DOCUMENTS[type]);
      console.log("Fetch response received:", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch sample document: ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      log.info("sample_document_response", {
        contentType,
        status: response.status,
      });
      console.log("Content type:", contentType);

      if (!contentType?.includes("application/pdf")) {
        const error = new Error(`Expected PDF but got ${contentType}`);
        log.error("invalid_content_type", error);
        setError("Error: Sample document not found or invalid format");
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      log.info("sample_document_size", { size: arrayBuffer.byteLength });
      console.log("Array buffer size:", arrayBuffer.byteLength);

      const file = new File(
        [arrayBuffer],
        SAMPLE_DOCUMENTS[type].split("/").pop() || "sample.pdf",
        { type: "application/pdf" }
      );
      console.log("File created:", file.name);

      if (!isValidFile(file)) {
        setError("Invalid PDF file");
        return;
      }

      const base64 = await fileToBase64(file);
      log.info("sample_document_base64", { length: base64.length });
      console.log("Base64 created, length:", base64.length);

      const newDoc = { file, base64 };
      console.log("Setting document and calling checkDocumentWithApi");
      setDocument(newDoc);
      setError(null);

      // Ensure state is updated before calling checkDocumentWithApi
      await new Promise((resolve) => setTimeout(resolve, 0));
      await checkDocumentWithApi(newDoc);
      console.log("checkDocumentWithApi completed");
    } catch (err) {
      console.error("Error in loadSampleDocument:", err);
      log.error("sample_document_error", err as Error);
      setError(
        "Error loading sample document. Please try uploading a file manually."
      );
    }
  }, [type, checkDocumentWithApi]);

  return (
    <div
      key={`${type}-${
        initialResponse?.check_results[0].command_instance_id || "new"
      }`}
      className="docs-playground"
      data-response-id={response?.check_results[0].command_instance_id}
      data-has-response={!!response}
      data-type={type}
      data-playground-mode={playgroundMode}
    >
      {showDebugPanel && renderDebugPanel()}
      {!isConfigured && (
        <div className="env-error-banner" data-testid="env-error-banner">
          <span>⚠️</span>
          <p>
            Missing required configuration: {!apiKey && "API key"}
            {!apiKey && !agentKey && " and "}
            {!agentKey &&
              (type === "individual_proof_of_address"
                ? "KYC agent key"
                : "agent key")}{" "}
            are required
          </p>
        </div>
      )}

      <div
        className={`main-content ${loading ? "loading" : ""} ${
          document ||
          initialResponse?.check_results[0].input_data?.document?.url
            ? "has-document"
            : ""
        }`}
        data-testid="main-content"
      >
        <div className="upload-section">
          <div className="controls-panel border-none">
            {(config.documentTypes ||
              config.showValidityPeriod ||
              config.jurisdictions) && (
              <div className="document-types-accordion rounded-xl">
                <button
                  className="accordion-toggle text-lg"
                  onClick={() => setShowDocumentTypes(!showDocumentTypes)}
                  disabled={loading}
                >
                  {showDocumentTypes ? (
                    <>
                      <KeyboardArrowDownIcon className="text-lg" />
                      <span className="text-lg">Hide Validation Options</span>
                    </>
                  ) : (
                    <>
                      <KeyboardArrowRightIcon className="text-lg" />
                      <span className="text-lg">View Validation Options</span>
                    </>
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

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Upload Document
                </h3>
                {(playgroundMode || (!document && !initialResponse)) && (
                  <button
                    onClick={loadSampleDocument}
                    className="text-xs text-indigo-600 hover:text-indigo-900 font-medium"
                    disabled={
                      loading ||
                      (!playgroundMode && !!(document || initialResponse))
                    }
                  >
                    Load Sample Document
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <div
                  {...getRootProps()}
                  className={`flex-1 dropzone border-none rounded-xl ${
                    isDragActive ? "active" : ""
                  } ${document ? "has-file" : ""} ${
                    !isConfigured ||
                    loading ||
                    (!playgroundMode && (document || initialResponse))
                      ? "disabled"
                      : ""
                  }`}
                >
                  <input {...getInputProps()} data-testid="file-input" />
                  {document ? (
                    <div className="file-info">
                      <p>📄 {document.file.name}</p>
                    </div>
                  ) : (
                    <div className="dropzone-content border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                      <div className="dropzone-text flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                          </svg>
                          <p className="dropzone-title">
                            Drag & drop or{" "}
                            <span
                              style={{ color: "#6366f1", cursor: "pointer" }}
                            >
                              choose documents
                            </span>{" "}
                            to upload
                          </p>
                        </div>
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
          </div>

          {response && (
            <div className="results-container" data-testid="results-container">
              <div
                className={`result ${
                  response.check_results[0].passed ? "success" : "failure"
                }`}
              >
                <div className="result-status">
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={
                        response.check_results[0].passed
                          ? "success-text"
                          : "failure-text"
                      }
                    >
                      {response.check_results[0].passed
                        ? "Passed ✅"
                        : "Failed ❌"}
                    </span>
                  </p>
                  {timeSpent !== null && (
                    <p>
                      <strong>Processing Time:</strong>
                      {timeSpent.toFixed(2)} seconds
                    </p>
                  )}
                </div>

                <div className="analysis-section">
                  <p>
                    <strong>Analysis</strong>
                  </p>
                  <p>{response.check_results[0].answer}</p>
                </div>

                {response.check_results[0].alerts &&
                  Object.keys(response.check_results[0].alerts).length > 0 && (
                    <div className="alerts">
                      <p>
                        <strong>⚠️ Validation Warnings</strong>
                      </p>
                      <ul>
                        {Object.entries(response.check_results[0].alerts).map(
                          ([key, message]) => (
                            <li key={key}>{message as string}</li>
                          )
                        )}
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
                          {(
                            response.check_results[0]
                              .payload as IncorporationFlashCheckResult
                          ).company_name || "Not available"}
                        </p>
                        <p>
                          <strong>Jurisdiction: </strong>
                          {(
                            response.check_results[0]
                              .payload as IncorporationFlashCheckResult
                          ).jurisdiction?.state || "Not available"}
                        </p>
                        <p>
                          <strong>Document Date: </strong>
                          {formatDate(
                            response.check_results[0].payload.document_date
                          ) || "Not available"}
                        </p>
                      </>
                    ) : type === "ein" ? (
                      <>
                        <p>
                          <strong>Company Name: </strong>
                          {(
                            response.check_results[0]
                              .payload as EinFlashCheckResult
                          ).company_name || "Not available"}
                        </p>
                        <p>
                          <strong>Document Date: </strong>
                          {formatDate(
                            response.check_results[0].payload.document_date
                          ) || "Not available"}
                        </p>
                        <p data-testid="ein-number">
                          <strong>EIN Number: </strong>
                          {(
                            response.check_results[0]
                              .payload as EinFlashCheckResult
                          ).ein || "Not available"}
                        </p>
                      </>
                    ) : type === "individual_proof_of_address" ? (
                      <>
                        <p>
                          <strong>Individual Name: </strong>
                          {(
                            response.check_results[0]
                              .payload as KYCProofOfAddressFlashCheckResult
                          ).individual_name || "Not available"}
                        </p>
                        <p>
                          <strong>Document Type: </strong>
                          {(
                            response.check_results[0]
                              .payload as KYCProofOfAddressFlashCheckResult
                          ).document_type || "Not available"}
                        </p>
                        <p>
                          <strong>Document Date: </strong>
                          {formatDate(
                            response.check_results[0].payload.document_date
                          ) || "Not available"}
                        </p>

                        {(
                          response.check_results[0]
                            .payload as KYCProofOfAddressFlashCheckResult
                        ).document_address && (
                          <div className="address-details">
                            <p>
                              <strong>Address</strong>
                            </p>
                            {(
                              response.check_results[0]
                                .payload as KYCProofOfAddressFlashCheckResult
                            ).document_address.street_1 && (
                              <p>
                                {
                                  (
                                    response.check_results[0]
                                      .payload as KYCProofOfAddressFlashCheckResult
                                  ).document_address.street_1
                                }
                              </p>
                            )}
                            {(
                              response.check_results[0]
                                .payload as KYCProofOfAddressFlashCheckResult
                            ).document_address.street_2 && (
                              <p>
                                {
                                  (
                                    response.check_results[0]
                                      .payload as KYCProofOfAddressFlashCheckResult
                                  ).document_address.street_2
                                }
                              </p>
                            )}
                            {((
                              response.check_results[0]
                                .payload as KYCProofOfAddressFlashCheckResult
                            ).document_address.city ||
                              (
                                response.check_results[0]
                                  .payload as KYCProofOfAddressFlashCheckResult
                              ).document_address.state ||
                              (
                                response.check_results[0]
                                  .payload as KYCProofOfAddressFlashCheckResult
                              ).document_address.postal_code) && (
                              <p>
                                {[
                                  (
                                    response.check_results[0]
                                      .payload as KYCProofOfAddressFlashCheckResult
                                  ).document_address.city,
                                  (
                                    response.check_results[0]
                                      .payload as KYCProofOfAddressFlashCheckResult
                                  ).document_address.state,
                                  (
                                    response.check_results[0]
                                      .payload as KYCProofOfAddressFlashCheckResult
                                  ).document_address.postal_code,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}
                            {(
                              response.check_results[0]
                                .payload as KYCProofOfAddressFlashCheckResult
                            ).document_address.country_code && (
                              <p>
                                {
                                  (
                                    response.check_results[0]
                                      .payload as KYCProofOfAddressFlashCheckResult
                                  ).document_address.country_code
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Company: </strong>
                          {(
                            response.check_results[0]
                              .payload as ProofOfAddressFlashCheckResult
                          ).company_name || "Not available"}
                        </p>
                        {response.check_results[0].payload.type ===
                          "ProofOfAddressFlashCheckResult" && (
                          <>
                            <p>
                              <strong>Document Type: </strong>
                              {(
                                response.check_results[0]
                                  .payload as ProofOfAddressFlashCheckResult
                              ).document_type || "Not available"}
                            </p>
                            <p>
                              <strong>Document Date: </strong>
                              {formatDate(
                                response.check_results[0].payload.document_date
                              ) || "Not available"}
                            </p>

                            {(
                              response.check_results[0]
                                .payload as ProofOfAddressFlashCheckResult
                            ).document_address && (
                              <div className="address-details">
                                <p>
                                  <strong>Address</strong>
                                </p>
                                {(
                                  response.check_results[0]
                                    .payload as ProofOfAddressFlashCheckResult
                                ).document_address.street_1 && (
                                  <p>
                                    {
                                      (
                                        response.check_results[0]
                                          .payload as ProofOfAddressFlashCheckResult
                                      ).document_address.street_1
                                    }
                                  </p>
                                )}
                                {(
                                  response.check_results[0]
                                    .payload as ProofOfAddressFlashCheckResult
                                ).document_address.street_2 && (
                                  <p>
                                    {
                                      (
                                        response.check_results[0]
                                          .payload as ProofOfAddressFlashCheckResult
                                      ).document_address.street_2
                                    }
                                  </p>
                                )}
                                {((
                                  response.check_results[0]
                                    .payload as ProofOfAddressFlashCheckResult
                                ).document_address.city ||
                                  (
                                    response.check_results[0]
                                      .payload as ProofOfAddressFlashCheckResult
                                  ).document_address.state ||
                                  (
                                    response.check_results[0]
                                      .payload as ProofOfAddressFlashCheckResult
                                  ).document_address.postal_code) && (
                                  <p>
                                    {[
                                      (
                                        response.check_results[0]
                                          .payload as ProofOfAddressFlashCheckResult
                                      ).document_address.city,
                                      (
                                        response.check_results[0]
                                          .payload as ProofOfAddressFlashCheckResult
                                      ).document_address.state,
                                      (
                                        response.check_results[0]
                                          .payload as ProofOfAddressFlashCheckResult
                                      ).document_address.postal_code,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                )}
                                {(
                                  response.check_results[0]
                                    .payload as ProofOfAddressFlashCheckResult
                                ).document_address.country_code && (
                                  <p>
                                    {
                                      (
                                        response.check_results[0]
                                          .payload as ProofOfAddressFlashCheckResult
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

        <div className="preview-section" data-testid="preview-section">
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

          <div className="pdf-container">{renderFilePreview()}</div>
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
