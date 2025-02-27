import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import {
  Code as CodeIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  DeleteForeverRounded,
  Code,
  CheckCircle,
  CancelOutlined,
  ReplayRounded,
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

const DEFAULT_API_URL = "https://demo.parcha.ai/api/v1";
const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

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
  sampleDocumentUrls?: Partial<Record<FlashLoaderType, string>>;
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
  sampleDocumentUrls,
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
  // const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
    <div className="fixed bottom-0 right-0 bg-slate-100 p-2.5 max-w-sm z-50 text-xs font-mono">
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
      if (!isConfigured) {
        return;
      }

      if (config.documentTypes && acceptedTypes.size === 0) {
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
          kybSchema,
          type
        );

        // Calculate time spent from job timestamps
        if (result.started_at && result.completed_at) {
          const startTime = new Date(result.started_at).getTime();
          const endTime = new Date(result.completed_at).getTime();
          setTimeSpent((endTime - startTime) / 1000);
        }

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
          <Viewer fileUrl={fileUrl} />
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
      const response = await fetch(
        sampleDocumentUrls?.[type] || SAMPLE_DOCUMENTS[type]
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch sample document: ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/pdf")) {
        const error = new Error(`Expected PDF but got ${contentType}`);
        console.error("invalid_content_type", error);
        setError("Error: Sample document not found or invalid format");
        return;
      }

      const arrayBuffer = await response.arrayBuffer();

      const file = new File(
        [arrayBuffer],
        sampleDocumentUrls?.[type]?.split("/").pop() ||
          SAMPLE_DOCUMENTS[type].split("/").pop() ||
          "sample.pdf",
        { type: "application/pdf" }
      );

      if (!isValidFile(file)) {
        setError("Invalid PDF file");
        return;
      }

      const base64 = await fileToBase64(file);

      const newDoc = { file, base64 };
      setDocument(newDoc);
      setError(null);

      // Ensure state is updated before calling checkDocumentWithApi
      await new Promise((resolve) => setTimeout(resolve, 0));
      await checkDocumentWithApi(newDoc);
    } catch (err) {
      console.error("Error in loadSampleDocument:", err);
      log.error("sample_document_error", err as Error);
      setError(
        "Error loading sample document. Please try uploading a file manually."
      );
    }
  }, [type, checkDocumentWithApi, sampleDocumentUrls]);

  // Update the SAMPLE_DOCUMENTS constant to use props if available
  const SAMPLE_DOCUMENTS: Record<FlashLoaderType, string> = {
    incorporation:
      sampleDocumentUrls?.incorporation ||
      (isDevelopment ? "/parcha-inc.pdf" : "assets/sample-docs/parcha-inc.pdf"),
    business_proof_of_address:
      sampleDocumentUrls?.business_proof_of_address ||
      (isDevelopment ? "/parcha-poa.pdf" : "assets/sample-docs/parcha-poa.pdf"),
    individual_proof_of_address:
      sampleDocumentUrls?.individual_proof_of_address ||
      (isDevelopment
        ? "/customer-poai.pdf"
        : "assets/sample-docs/customer-poai.pdf"),
    ein:
      sampleDocumentUrls?.ein ||
      (isDevelopment ? "/parcha_ein.pdf" : "assets/sample-docs/parcha_ein.pdf"),
  };

  return (
    <div
      key={`${type}-${
        initialResponse?.check_results[0].command_instance_id || "new"
      }`}
      className="w-full h-full bg-white"
      data-response-id={response?.check_results[0].command_instance_id}
      data-has-response={!!response}
      data-type={type}
      data-playground-mode={playgroundMode}
    >
      {showDebugPanel && renderDebugPanel()}
      {!isConfigured && (
        <div
          className="mx-8 bg-amber-100 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center gap-2"
          data-testid="env-error-banner"
        >
          <span>⚠️</span>
          <p className="m-0">
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
        className={`p-8 grid gap-8 h-full overflow-hidden relative transition-all duration-300 ease-in-out ${
          loading ? "opacity-70 pointer-events-none" : ""
        } ${
          document ||
          initialResponse?.check_results[0].input_data?.document?.url
            ? "grid-cols-2"
            : "grid-cols-1"
        }`}
        data-testid="main-content"
      >
        <div className="flex flex-col gap-4 h-[calc(100%-2rem)] overflow-y-auto min-w-0 mx-auto max-w-[600px] w-full transition-all duration-600 ease-in-out">
          <div className="bg-white border-none p-5 flex flex-col gap-4 transition-all duration-300 ease-in-out origin-center">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-900">
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
              {(config.documentTypes ||
                config.showValidityPeriod ||
                config.jurisdictions) && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <button
                    className="flex items-center text-slate-700 w-full"
                    onClick={() => setShowDocumentTypes(!showDocumentTypes)}
                    disabled={loading}
                  >
                    {showDocumentTypes ? (
                      <KeyboardArrowDownIcon className="mr-2" />
                    ) : (
                      <KeyboardArrowRightIcon className="mr-2" />
                    )}
                    <span>View Validation Options</span>
                  </button>
                  {showDocumentTypes && (
                    <div className="py-4 border-t border-slate-200 mt-4">
                      {config.jurisdictions && (
                        <>
                          <h3 className="text-sm uppercase tracking-wider text-slate-600 font-semibold mb-4">
                            Jurisdiction
                          </h3>
                          <div>
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
                              className="w-full py-3 px-4 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 cursor-pointer transition-all hover:border-indigo-500 hover:bg-slate-50 disabled:bg-slate-100"
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
                          <h3 className="text-sm uppercase tracking-wider text-slate-600 font-semibold mb-4">
                            EIN Number (Optional)
                          </h3>
                          <div className="mb-8">
                            <input
                              type="text"
                              value={einNumber}
                              onChange={(e) => setEinNumber(e.target.value)}
                              placeholder="Enter EIN number to validate"
                              className="w-full px-3 py-2 border border-slate-300 rounded-md"
                              disabled={loading}
                            />
                          </div>
                        </>
                      )}

                      {config.documentTypes && (
                        <>
                          <h3 className="text-sm uppercase tracking-wider text-slate-600 font-semibold mb-4">
                            Document Types
                          </h3>
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mb-8">
                            {config.documentTypes.map((type) => (
                              <label
                                key={type.value}
                                className="flex items-center py-3 px-4 bg-white border border-slate-200 rounded-lg cursor-pointer transition-all hover:border-indigo-500 hover:bg-slate-50 hover:-translate-y-0.5"
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
                                  className="appearance-none w-5 h-5 border-2 border-slate-300 rounded checked:bg-indigo-500 checked:border-indigo-500 relative cursor-pointer transition-all disabled:bg-slate-100 disabled:border-slate-200  after:content-['✓'] after:absolute after:text-white after:font-bold after:text-xs after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100"
                                />
                                <span className="ml-3 text-sm text-slate-700 font-medium">
                                  {type.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}

                      {config.showValidityPeriod && (
                        <>
                          <h3 className="text-sm uppercase tracking-wider text-slate-600 font-semibold mb-4">
                            Age Limit
                          </h3>
                          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
                            {VALIDITY_PERIODS.map((period) => (
                              <label
                                key={period.days}
                                className="flex items-center py-3 px-4 bg-white border border-slate-200 rounded-lg cursor-pointer transition-all hover:border-indigo-500 hover:bg-slate-50 hover:-translate-y-0.5"
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
                                  className="appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-indigo-500 relative cursor-pointer transition-all disabled:bg-slate-100 disabled:border-slate-200 disabled:cursor-not-allowed after:content-[''] after:absolute after:w-3 after:h-3 after:bg-indigo-500 after:rounded-full after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100"
                                />
                                <span className="ml-3 text-sm text-slate-700 font-medium">
                                  {period.label}
                                </span>
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
                  className={`flex flex-col gap-4 flex-1 bg-slate-50 transition-all p-4 ${
                    isDragActive ? "border-indigo-400 bg-indigo-50" : ""
                  } ${document ? "has-file" : ""} ${
                    !isConfigured ||
                    loading ||
                    (!playgroundMode && (document || initialResponse))
                      ? ""
                      : "cursor-pointer"
                  }`}
                >
                  <input {...getInputProps()} data-testid="file-input" />
                  {document ? (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex items-center justify-between w-full p-5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-slate-900 font-semibold">
                          {document.file.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-md hover:bg-indigo-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCodeModal(true);
                            }}
                          >
                            <Code className="text-indigo-700" />
                          </button>
                          <button
                            className="text-slate-400 hover:text-slate-600 p-2 rounded-md hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDocument(null);
                              setResponse(null);
                            }}
                          >
                            <span>
                              <DeleteForeverRounded className="text-red-600" />
                            </span>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocument(null);
                          setResponse(null);
                        }}
                        disabled={loading}
                        className="place-self-center w-fit inline-flex items-center gap-2 text-slate-900 px-4 py-2 rounded-md bg-white border border-slate-200"
                      >
                        <span>
                          <ReplayRounded
                            sx={{ fontSize: "1rem" }}
                            className="text-slate-900"
                          />
                        </span>
                        Re-Run Document
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center p-6">
                      <div className="flex flex-col items-center gap-2">
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
                          <p className="m-0">
                            Drag & drop or{" "}
                            <span className="text-indigo-500 cursor-pointer">
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
                      className="p-2 rounded-md text-indigo-900 hover:bg-slate-100 transition-colors"
                    >
                      <CodeIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {response && (
            <div
              className="flex flex-col gap-4 relative"
              data-testid="results-container"
            >
              <div className="p-8 animate-[slideIn_0.3s_ease-out]">
                <div
                  className={`flex flex-col gap-2 p-5 rounded-md ${
                    response.check_results[0].passed
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      {response.check_results[0].passed ? (
                        <CheckCircle
                          sx={{ fontSize: "1.25rem" }}
                          className="text-green-700"
                        />
                      ) : (
                        <CancelOutlined
                          sx={{ fontSize: "1.25rem" }}
                          className="text-red-700"
                        />
                      )}
                      <span className="font-semibold">
                        {response.check_results[0].passed ? "Pass" : "Fail"}
                      </span>
                    </div>
                    {timeSpent !== null && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-700 font-semibold">
                          Processing Time:
                        </span>
                        <span className="text-slate-900">
                          {timeSpent.toFixed(2)} seconds
                        </span>
                      </div>
                    )}
                  </div>
                  {response.check_results[0].answer}
                </div>

                {response.check_results[0].alerts &&
                  Object.keys(response.check_results[0].alerts).length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 p-6 my-6 rounded-lg">
                      <p className="font-bold text-amber-800 mb-2">
                        ⚠️ Validation Warnings
                      </p>
                      <ul className="mt-4 pl-2 list-none space-y-3">
                        {Object.entries(response.check_results[0].alerts).map(
                          ([key, message]) => (
                            <li key={key} className="text-amber-800 relative">
                              {message as string}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <div className="mt-8" data-testid="document-details">
                  <h4 className="text-xl font-semibold text-slate-900 mb-6">
                    Document Information
                  </h4>
                  <div>
                    {type === "incorporation" ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Company Name
                          </span>
                          <span>
                            {(
                              response.check_results[0]
                                .payload as IncorporationFlashCheckResult
                            ).company_name || "Not available"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Jurisdiction
                          </span>
                          <span>
                            {(
                              response.check_results[0]
                                .payload as IncorporationFlashCheckResult
                            ).jurisdiction?.state || "Not available"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Document Date
                          </span>
                          <span>
                            {formatDate(
                              response.check_results[0].payload.document_date
                            ) || "Not available"}
                          </span>
                        </div>
                      </div>
                    ) : type === "ein" ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Company Name
                          </span>
                          <span>
                            {(
                              response.check_results[0]
                                .payload as EinFlashCheckResult
                            ).company_name || "Not available"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Document Date
                          </span>
                          <span>
                            {formatDate(
                              response.check_results[0].payload.document_date
                            ) || "Not available"}
                          </span>
                        </div>
                        <div
                          className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4"
                          data-testid="ein-number"
                        >
                          <span className="text-slate-900 font-semibold mr-3">
                            EIN Number
                          </span>
                          <span>
                            {(
                              response.check_results[0]
                                .payload as EinFlashCheckResult
                            ).ein || "Not available"}
                          </span>
                        </div>
                      </div>
                    ) : type === "individual_proof_of_address" ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Individual Name
                          </span>
                          <span>
                            {(
                              response.check_results[0]
                                .payload as KYCProofOfAddressFlashCheckResult
                            ).individual_name || "Not available"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Document Type
                          </span>
                          <span>
                            {(
                              response.check_results[0]
                                .payload as KYCProofOfAddressFlashCheckResult
                            ).document_type || "Not available"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Document Date
                          </span>
                          <span>
                            {formatDate(
                              response.check_results[0].payload.document_date
                            ) || "Not available"}
                          </span>
                        </div>

                        {(
                          response.check_results[0]
                            .payload as KYCProofOfAddressFlashCheckResult
                        ).document_address && (
                          <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                            <p className="font-semibold text-slate-900">
                              Address
                            </p>
                            <div>
                              {(
                                response.check_results[0]
                                  .payload as KYCProofOfAddressFlashCheckResult
                              ).document_address.street_1 && (
                                <p className="my-1 text-slate-700">
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
                                <p className="my-1 text-slate-700">
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
                                <p className="my-1 text-slate-700">
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
                                <p className="my-1 text-slate-700">
                                  {
                                    (
                                      response.check_results[0]
                                        .payload as KYCProofOfAddressFlashCheckResult
                                    ).document_address.country_code
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                          <span className="text-slate-900 font-semibold mr-3">
                            Company
                          </span>
                          <span>
                            {(
                              response.check_results[0]
                                .payload as ProofOfAddressFlashCheckResult
                            ).company_name || "Not available"}
                          </span>
                        </div>
                        {response.check_results[0].payload.type ===
                          "ProofOfAddressFlashCheckResult" && (
                          <>
                            <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                              <span className="text-slate-900 font-semibold mr-3">
                                Document Type
                              </span>
                              <span>
                                {(
                                  response.check_results[0]
                                    .payload as ProofOfAddressFlashCheckResult
                                ).document_type || "Not available"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                              <span className="text-slate-900 font-semibold mr-3">
                                Document Date
                              </span>
                              <span>
                                {formatDate(
                                  response.check_results[0].payload
                                    .document_date
                                ) || "Not available"}
                              </span>
                            </div>

                            {(
                              response.check_results[0]
                                .payload as ProofOfAddressFlashCheckResult
                            ).document_address && (
                              <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4">
                                <p className="font-semibold text-slate-900">
                                  Address
                                </p>
                                <div>
                                  {(
                                    response.check_results[0]
                                      .payload as ProofOfAddressFlashCheckResult
                                  ).document_address.street_1 && (
                                    <p className="my-1 text-slate-700">
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
                                    <p className="my-1 text-slate-700">
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
                                    <p className="my-1 text-slate-700">
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
                                    <p className="my-1 text-slate-700">
                                      {
                                        (
                                          response.check_results[0]
                                            .payload as ProofOfAddressFlashCheckResult
                                        ).document_address.country_code
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`flex flex-col h-full overflow-hidden min-w-0 relative ${
            document ||
            initialResponse?.check_results[0].input_data?.document?.url
              ? "opacity-100 translate-x-0 w-auto"
              : "opacity-0 translate-x-[100px] w-0"
          } transition-all duration-600 ease-in-out`}
          data-testid="preview-section"
        >
          {error && (
            <div
              className="bg-red-100 text-red-600 py-3 px-4 rounded-md mb-4 font-medium text-sm flex items-center justify-center text-center border border-red-200"
              data-testid="error-message"
            >
              {error}
            </div>
          )}

          {loading && (
            <div
              className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-4 z-10 backdrop-blur-sm"
              data-testid="loading-spinner"
            >
              <div className="w-10 h-10 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p>Processing document...</p>
            </div>
          )}

          <div
            className={`bg-white border border-slate-200 overflow-hidden flex-1 min-h-0 flex relative ${
              document ||
              initialResponse?.check_results[0].input_data?.document?.url
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[40px]"
            } transition-all duration-600 ease-in-out delay-200`}
          >
            {renderFilePreview()}
          </div>
        </div>
      </div>

      {showCodeModal && (
        <div
          className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 animate-[fadeIn_0.2s_ease-out] backdrop-blur-sm"
          onClick={() => setShowCodeModal(false)}
        >
          <div
            className="bg-white p-8 w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto border border-slate-200 animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="m-0 text-slate-900 text-xl font-semibold">
                API Request
              </h3>
              <button
                className="bg-transparent border-none text-2xl text-slate-500 cursor-pointer p-2 leading-none transition-all hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setShowCodeModal(false)}
              >
                ×
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-6 overflow-x-auto font-mono text-sm leading-relaxed m-0 whitespace-pre text-left tab-[2]">
              {getCurlCommand()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
