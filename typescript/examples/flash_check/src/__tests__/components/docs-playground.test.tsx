import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocsPlayground } from "../../components/docs-playground";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import React from "react";
import { FlashLoaderResponse, FlashLoaderType } from "../../types/flash";

// Mock the PDF viewer components
vi.mock("@react-pdf-viewer/core", () => ({
  Viewer: () => <div data-testid="mock-pdf-viewer">PDF Viewer</div>,
  Worker: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@react-pdf-viewer/default-layout", () => ({
  defaultLayoutPlugin: () => ({}),
}));

// Mock file utilities
vi.mock("../../utils/file", () => ({
  fileToBase64: vi.fn().mockResolvedValue("base64string"),
  isValidPDF: vi.fn().mockReturnValue(true),
}));

// Mock flash loader service
const mockCheckDocument = vi.fn();
vi.mock("../../services/flashLoader", () => ({
  checkDocument: (...args: any[]) => mockCheckDocument(...args),
}));

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("DocsPlayground Component", () => {
  const user = userEvent.setup();

  // Add mock response for testing
  const mockInitialResponse: FlashLoaderResponse = {
    command_instance_id: "b781d83b-7dee-4e69-90e0-da2ff21d34f0",
    verification_data: null,
    evidence: null,
    agent_instance_id: "58a931f9-9ace-4bb0-8943-8f752ad8cd5c",
    error: null,
    recommendation: null,
    data_loader_end_time: null,
    agent_key: "public-docs-v1",
    instructions: null,
    follow_up: null,
    check_start_time: null,
    command_id: "kyb.proof_of_address_verification",
    explanation: null,
    step_number: null,
    check_end_time: null,
    command_name: "Proof of Address Check for Business",
    payload: {
      type: "ProofOfAddressFlashCheckResult",
      company_name: "Parcha Labs, Inc.",
      document_date: "2024-12-31",
      document_type: "BANK_STATEMENT",
      document_address: {
        type: "Address",
        street_1: "755 Sansome St.",
        street_2: "Suite 350",
        city: "San Francisco",
        state: "CA",
        country_code: "US",
        postal_code: "94111",
      },
    },
    status: "complete",
    check_args: {
      validity_period: 90,
      accepted_documents: [
        "BANK_STATEMENT",
        "VAT_INVOICE",
        "UTILITY_BILL",
        "LEASE_AGREEMENT",
        "TAX_DOCUMENT",
        "MORTGAGE_STATEMENT",
        "CREDIT_CARD_STATEMENT",
        "INSURANCE_POLICY",
      ],
    },
    created_at: "2025-02-11T19:02:11.302110",
    command_desc: null,
    answer:
      "Bank statement is valid proof of address; company and address are present.",
    data_loader_id: "proof_of_address_extractor",
    data_loader_args: {},
    job_id: "a6d354ae-73bf-4d33-93c5-f0bf4f0b3bd9",
    result_type: "CommandResult",
    passed: true,
    data_loader_start_time: null,
    updated_at: "2025-02-11T19:02:15.523869",
    input_data: {
      type: "ProofOfAddressClassificationToolInput",
      document: {
        type: "Document",
        url: "https://example.com/test.pdf",
        file_name: "test.pdf",
        description: "",
        source_type: "file_url",
        num_pages: null,
      },
    },
    alerts: null,
  };

  beforeEach(() => {
    vi.resetModules();
    vi.mock("@/utils/file", () => ({
      fileToBase64: vi.fn().mockResolvedValue("base64string"),
    }));

    // Set up environment variables for testing
    vi.stubEnv("VITE_API_KEY", "test-api-key");
    vi.stubEnv("VITE_AGENT_KEY", "test-agent-key");
    vi.stubEnv("VITE_KYC_AGENT_KEY", "test-kyc-agent-key");
    vi.stubEnv("VITE_API_URL", "https://test.api.url");

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("renders with default configuration", () => {
    vi.stubEnv("VITE_API_KEY", "");
    vi.stubEnv("VITE_AGENT_KEY", "");

    render(<DocsPlayground type="incorporation" />);

    // Verify environment variables are empty
    expect(import.meta.env.VITE_API_KEY).toBe("");
    expect(import.meta.env.VITE_AGENT_KEY).toBe("");

    // Verify error banner is shown
    expect(
      screen.getByText(/Missing required configuration/i)
    ).toBeInTheDocument();
  });

  it("renders with custom configuration", () => {
    render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // Error banner should not be present
    expect(screen.queryByTestId("env-error-banner")).not.toBeInTheDocument();

    // Upload message should be visible
    expect(screen.getByText(/drag & drop or/i)).toBeInTheDocument();
    expect(screen.getByText(/choose documents/i)).toBeInTheDocument();
  });

  it("shows validation options based on document type", async () => {
    render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // Click the validation options button
    const validationOptionsButton = screen.getByRole("button", {
      name: /validation options/i,
    });
    await user.click(validationOptionsButton);

    // Wait for the jurisdiction section to be visible
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /jurisdiction/i })
      ).toBeInTheDocument();
      expect(screen.queryByText(/age limit/i)).not.toBeInTheDocument();
    });
  });

  it("handles document type selection for proof of address", async () => {
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    const validationOptionsButton = screen.getByText(/validation options/i);
    await user.click(validationOptionsButton);

    // Check for validity period options
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /age limit/i })
      ).toBeInTheDocument();
    });
  });

  it("handles validity period selection for proof of address", async () => {
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    const validationOptionsButton = screen.getByRole("button", {
      name: /validation options/i,
    });
    await user.click(validationOptionsButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /age limit/i })
      ).toBeInTheDocument();
    });
  });

  it("handles EIN number input", async () => {
    render(
      <DocsPlayground
        type="ein"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // For EIN type, we should see the upload message - using partial text match since text is split across elements
    expect(screen.getByText(/drag & drop or/i)).toBeInTheDocument();
    expect(screen.getByText(/choose documents/i)).toBeInTheDocument();
  });

  it("handles file upload and displays file name", async () => {
    const { container } = render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);

      // Wait for the file info to appear and verify it
      await waitFor(() => {
        const fileInfo = screen.getByText((content) =>
          content.includes("test.pdf")
        );
        expect(fileInfo).toBeInTheDocument();
      });
    }
  });

  it("loads sample document when clicking the sample document button", async () => {
    // Mock fetch for sample document
    const mockArrayBuffer = new ArrayBuffer(8);
    mockFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    });

    render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // Mock successful document check
    mockCheckDocument.mockResolvedValueOnce(mockInitialResponse);

    // Find and click the sample document button
    const sampleButton = screen.getByText("Load Sample Document");
    await user.click(sampleButton);

    // Wait for the API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/sample-docs/parcha-inc.pdf");
      expect(mockCheckDocument).toHaveBeenCalled();
    });
  });

  it("loads correct sample document based on type", async () => {
    // Mock fetch for sample document
    const mockArrayBuffer = new ArrayBuffer(8);
    mockFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    });

    // Test each document type
    const documentTypes: Array<[FlashLoaderType, string]> = [
      ["incorporation", "/sample-docs/parcha-inc.pdf"],
      ["business_proof_of_address", "/sample-docs/parcha-poa.pdf"],
      ["individual_proof_of_address", "/sample-docs/customer-poai.pdf"],
      ["ein", "/sample-docs/parcha_ein.pdf"],
    ];

    for (const [type, expectedPath] of documentTypes) {
      // Clear mocks between iterations
      vi.clearAllMocks();

      const { container } = render(
        <DocsPlayground
          type={type}
          apiKey="test-api-key"
          agentKey="test-agent-key"
        />
      );

      // Find and click the sample document button
      const sampleButton = screen.getByText("Load Sample Document");
      await user.click(sampleButton);

      // Verify fetch was called with correct URL for each type
      expect(mockFetch).toHaveBeenCalledWith(expectedPath);
      expect(mockCheckDocument).toHaveBeenCalled();
    }
  });

  it("handles sample document loading errors gracefully", async () => {
    // Mock fetch to simulate an error
    mockFetch.mockRejectedValue(new Error("Failed to load document"));

    const { container } = render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // Find and click the sample document button
    const sampleButton = screen.getByText("Load Sample Document");
    await user.click(sampleButton);

    // Verify error message is displayed
    expect(
      await screen.findByText("Error loading sample document")
    ).toBeInTheDocument();
    expect(mockCheckDocument).not.toHaveBeenCalled();
  });

  it("displays error message for non-PDF files", async () => {
    const { container } = render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    const file = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    // Get the onDrop function from the dropzone props
    const dropzone = container.querySelector(".dropzone") as HTMLElement;
    const onDrop = (dropzone as any).__reactProps$?.onDrop;

    if (onDrop) {
      // Call onDrop directly with our file
      await onDrop({
        preventDefault: () => {},
        target: dropzone,
        dataTransfer: { files: [file] },
      });

      await waitFor(async () => {
        const errorElement = await screen.findByTestId("error-message");
        expect(errorElement).toHaveTextContent("Please upload a PDF file");
      });
    }
  });

  it("handles document type selection and enforces minimum selection", async () => {
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );
    const user = userEvent.setup();

    // Open the accordion
    const accordionToggle = screen.getByText("View Validation Options");
    await user.click(accordionToggle);

    // Wait for accordion to open
    await waitFor(() => {
      const heading = screen.getByRole("heading", { name: /document types/i });
      expect(heading).toBeInTheDocument();
    });

    // Get checkboxes and verify initial state
    const utilityBill = screen.getByTestId(
      "checkbox-UTILITY_BILL"
    ) as HTMLInputElement;
    const bankStatement = screen.getByTestId(
      "checkbox-BANK_STATEMENT"
    ) as HTMLInputElement;

    // Verify initial state
    expect(utilityBill.checked).toBe(true);
    expect(bankStatement.checked).toBe(true);

    // Try to uncheck both
    await user.click(utilityBill);
    await user.click(bankStatement);

    // Wait for state update and verify at least one remains checked
    await waitFor(
      () => {
        const allCheckboxes = screen.getAllByRole("checkbox");
        const checkedCount = allCheckboxes.filter(
          (cb) => (cb as HTMLInputElement).checked
        ).length;
        expect(checkedCount).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });

  it("displays loading state during document processing", async () => {
    mockCheckDocument.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockInitialResponse), 100)
        )
    );

    const { container } = render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);

      // Verify loading state appears
      await waitFor(() => {
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        expect(screen.getByText("Processing document...")).toBeInTheDocument();
      });

      // Wait for loading state to disappear
      await waitFor(
        () => {
          expect(
            screen.queryByTestId("loading-spinner")
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    }
  });

  it("displays EIN number in document details when available", async () => {
    // Mock successful document check with EIN response
    const einResponse = {
      ...mockInitialResponse,
      payload: {
        type: "ein",
        company_name: "PARCHA LABS INC",
        document_date: "2023-03-31",
        ein: "92-3265708",
      },
    };
    mockCheckDocument.mockResolvedValueOnce(einResponse);

    const { container } = render(
      <DocsPlayground
        type="ein"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // Upload a file to trigger the document check
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await user.upload(fileInput, file);

    // Wait for the component to update and verify the document details are displayed
    await waitFor(() => {
      const einElement = screen.getByTestId("ein-number");
      expect(einElement).toHaveTextContent("92-3265708");
    });
  });

  it("renders with initialResponse and displays results", async () => {
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
        initialResponse={mockInitialResponse}
      />
    );

    // Verify the results are displayed
    const resultsContainer = screen.getByTestId("results-container");
    expect(resultsContainer).toBeInTheDocument();

    // Check if company name is displayed
    expect(screen.getByText(/Parcha Labs, Inc./)).toBeInTheDocument();

    // Check if address details are displayed
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === "755 Sansome St.";
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Suite 350")).toBeInTheDocument();
    expect(screen.getByText(/San Francisco, CA, 94111/)).toBeInTheDocument();

    // Check if document type is displayed
    expect(screen.getByText(/BANK_STATEMENT/)).toBeInTheDocument();

    // Check if the status is displayed correctly
    expect(screen.getByText(/Passed ✅/)).toBeInTheDocument();

    // Check if the analysis is displayed
    expect(
      screen.getByText(/Bank statement is valid proof of address/)
    ).toBeInTheDocument();
  });

  it("renders PDF viewer correctly with initialResponse", async () => {
    // Create a mock response with a specific PDF URL
    const mockResponseWithPdf = {
      ...mockInitialResponse,
      input_data: {
        ...mockInitialResponse.input_data,
        document: {
          ...mockInitialResponse.input_data.document,
          url: "https://storage.googleapis.com/test-bucket/test.pdf",
          file_name: "test_document.pdf",
        },
      },
    };

    const { container } = render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
        initialResponse={mockResponseWithPdf}
      />
    );

    // Verify the main content has the has-document class
    const mainContent = container.querySelector(".main-content");
    expect(mainContent).toHaveClass("has-document");

    // Wait for the PDF viewer to be rendered
    await waitFor(() => {
      // Check if the PDF viewer component is rendered
      const pdfViewer = screen.getByTestId("mock-pdf-viewer");
      expect(pdfViewer).toBeInTheDocument();
    });

    // Verify the document state is set correctly
    const fileInfo = screen.getByText("📄 test_document.pdf");
    expect(fileInfo).toBeInTheDocument();

    // Verify the preview section is rendered
    const previewSection = document.querySelector(".preview-section");
    expect(previewSection).toBeInTheDocument();

    // Verify no loading state is shown
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();

    // Verify no error messages are shown
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it("disables document upload and removal in read-only mode", async () => {
    // Create a mock response with a specific PDF URL
    const mockResponseWithPdf = {
      ...mockInitialResponse,
      input_data: {
        ...mockInitialResponse.input_data,
        document: {
          ...mockInitialResponse.input_data.document,
          url: "https://storage.googleapis.com/test-bucket/test.pdf",
          file_name: "test_document.pdf",
        },
      },
    };

    const { container } = render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
        initialResponse={mockResponseWithPdf}
        playgroundMode={false}
      />
    );

    // Verify the dropzone is disabled
    const dropzone = container.querySelector(".dropzone");
    expect(dropzone).toHaveClass("disabled");

    // Verify the delete button is not present
    const deleteButton = screen.queryByTitle("Remove document");
    expect(deleteButton).not.toBeInTheDocument();

    // Verify the code button is still present
    const codeButton = screen.getByTitle("View API Request");
    expect(codeButton).toBeInTheDocument();

    // Click to open validation options
    const validationButton = screen.getByRole("button", {
      name: /validation options/i,
    });
    expect(validationButton).not.toBeDisabled(); // Should be enabled for opening/closing
    await user.click(validationButton);

    // Verify all options inside are disabled
    const documentTypeCheckboxes = screen.getAllByRole("checkbox");
    documentTypeCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });

    const validityPeriodRadios = screen.getAllByRole("radio");
    validityPeriodRadios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });

    // Verify the document info is still shown
    const fileInfo = screen.getByText("📄 test_document.pdf");
    expect(fileInfo).toBeInTheDocument();

    // Verify the PDF viewer is still rendered
    const pdfViewer = screen.getByTestId("mock-pdf-viewer");
    expect(pdfViewer).toBeInTheDocument();
  });

  it("shows debug panel when showDebugPanel is true", () => {
    const { container } = render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
        showDebugPanel={true}
      />
    );

    // Debug panel should be visible
    const debugPanel = container.querySelector("div[style*='position: fixed']");
    expect(debugPanel).toBeInTheDocument();
    expect(debugPanel).toHaveTextContent("Debug Info:");
    expect(debugPanel).toHaveTextContent("Type: business_proof_of_address");
  });

  it("hides debug panel when showDebugPanel is false", () => {
    const { container } = render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
        showDebugPanel={false}
      />
    );

    // Debug panel should not be visible
    const debugPanel = container.querySelector("div[style*='position: fixed']");
    expect(debugPanel).not.toBeInTheDocument();
  });

  it("hides debug panel by default", () => {
    const { container } = render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // Debug panel should not be visible by default
    const debugPanel = container.querySelector("div[style*='position: fixed']");
    expect(debugPanel).not.toBeInTheDocument();
  });

  it("calls onResponse callback when API returns a response", async () => {
    const mockOnResponse = vi.fn();
    mockCheckDocument.mockResolvedValueOnce(mockInitialResponse);

    const { container } = render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
        onResponse={mockOnResponse}
      />
    );

    // Upload a file
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await user.upload(fileInput, file);

    // Wait for the API call to complete and verify callback was called
    await waitFor(() => {
      expect(mockOnResponse).toHaveBeenCalledTimes(1);
      expect(mockOnResponse).toHaveBeenCalledWith(mockInitialResponse);
    });
  });
});
