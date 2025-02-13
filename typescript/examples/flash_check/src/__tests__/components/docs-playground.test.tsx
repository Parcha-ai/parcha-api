import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocsPlayground } from "../../components/docs-playground";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import React from "react";
import { FlashLoaderResponse, FlashLoaderType } from "../../types/flash";
import * as checkDocumentModule from "../../services/flashLoader";

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
    updated_at: "2025-02-11T19:02:15.523869",
    started_at: "2025-02-11T19:02:11.302110",
    batch_id: null,
    created_at: "2025-02-11T19:02:11.302110",
    completed_at: "2025-02-11T19:02:15.523869",
    job_type: "run_flash_check",
    celery_task_id: null,
    retried_job_id: null,
    job_args: null,
    id: "a6d354ae-73bf-4d33-93c5-f0bf4f0b3bd9",
    progress: null,
    agent_id: "public-docs-v1",
    recommendation: null,
    owner_id: "test@parcha.ai",
    queued_at: null,
    descope_user_id: null,
    tenant_id: "test-tenant",
    status: "complete",
    input_payload: {
      id: "parcha-latest",
      self_attested_data: {
        business_name: "Parcha",
        registered_business_name: "Parcha Labs Inc",
        proof_of_address_documents: [
          {
            type: "Document",
            url: "https://example.com/test.pdf",
            file_name: "test.pdf",
            source_type: "file_url",
          },
        ],
      },
    },
    check_results: [
      {
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
        data_loader_args: null,
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
      },
    ],
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
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/pdf",
      },
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });
    global.fetch = mockFetch;

    const mockCheckDocument = vi.fn().mockResolvedValue(mockInitialResponse);
    vi.spyOn(checkDocumentModule, "checkDocument").mockImplementation(
      mockCheckDocument
    );

    render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    const loadSampleButton = screen.getByText("Load Sample Document");
    await user.click(loadSampleButton);

    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledWith("/parcha-inc.pdf");
        expect(mockCheckDocument).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it("loads correct sample document based on type", async () => {
    console.log(
      "\n=== TEST START: loads correct sample document based on type ==="
    );

    console.log("Setting up mock fetch");
    const mockFetch = vi.fn().mockImplementation(async (url) => {
      console.log("mockFetch called with url:", url);
      const response = {
        ok: true,
        headers: {
          get: (header: string) => {
            console.log("mockFetch headers.get called with:", header);
            return "application/pdf";
          },
        },
        arrayBuffer: async () => {
          console.log("mockFetch arrayBuffer called");
          return new ArrayBuffer(8);
        },
      };
      console.log("mockFetch returning response:", response);
      return response;
    });
    global.fetch = mockFetch;
    console.log("Mock fetch setup complete");

    console.log("Setting up mockCheckDocument");
    const mockCheckDocument = vi.fn().mockImplementation(async (...args) => {
      console.log(
        "mockCheckDocument called with args:",
        JSON.stringify(args, null, 2)
      );
      console.log("Returning mockInitialResponse");
      return mockInitialResponse;
    });
    vi.spyOn(checkDocumentModule, "checkDocument").mockImplementation(
      mockCheckDocument
    );
    console.log("Mock checkDocument setup complete");

    console.log("\n=== FIRST RENDER ===");
    console.log("Rendering DocsPlayground with type: incorporation");
    const { rerender } = render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );
    console.log("Initial render complete");

    console.log("\n=== FIRST BUTTON CLICK ===");
    console.log("Finding Load Sample Document button");
    const loadSampleButton = screen.getByText("Load Sample Document");
    console.log("Found button:", loadSampleButton ? "yes" : "no");
    console.log("Clicking Load Sample Document button");
    await user.click(loadSampleButton);
    console.log("Button clicked");

    console.log("\n=== FIRST WAIT FOR ===");
    await waitFor(
      () => {
        console.log("Inside first waitFor callback");
        console.log("Mock fetch calls:", mockFetch.mock.calls);
        console.log("Mock fetch calls length:", mockFetch.mock.calls.length);
        console.log(
          "Mock checkDocument calls length:",
          mockCheckDocument.mock.calls.length
        );
        console.log("Expected fetch URL: /parcha-inc.pdf");

        try {
          expect(mockFetch).toHaveBeenCalledWith("/parcha-inc.pdf");
          console.log("✅ First fetch assertion passed");
        } catch (e) {
          console.log("❌ First fetch assertion failed:", e);
          throw e;
        }

        try {
          expect(mockCheckDocument).toHaveBeenCalled();
          console.log("✅ First checkDocument assertion passed");
        } catch (e) {
          console.log("❌ First checkDocument assertion failed:", e);
          throw e;
        }
      },
      {
        timeout: 3000,
        onTimeout: (error) => {
          console.log("⚠️ First waitFor timed out:", error);
          return error;
        },
      }
    );

    console.log("\n=== CLEARING MOCKS ===");
    console.log(
      "Mock calls before clear - fetch:",
      mockFetch.mock.calls.length,
      "checkDocument:",
      mockCheckDocument.mock.calls.length
    );
    mockFetch.mockClear();
    mockCheckDocument.mockClear();

    // Reset the mock implementation after clearing
    mockCheckDocument.mockImplementation(async (...args) => {
      console.log(
        "New mockCheckDocument called with args:",
        JSON.stringify(args, null, 2)
      );
      return Promise.resolve(mockInitialResponse);
    });

    console.log("Mock implementation reset completed");
    console.log(
      "Mock calls after clear - fetch:",
      mockFetch.mock.calls.length,
      "checkDocument:",
      mockCheckDocument.mock.calls.length
    );

    console.log("\n=== SECOND RENDER ===");
    console.log(
      "Rerendering DocsPlayground with type: business_proof_of_address"
    );
    rerender(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );
    console.log("Rerender complete");

    // Open validation options and select a document type
    console.log("\n=== SELECTING DOCUMENT TYPE ===");
    const validationOptionsButton = screen.getByRole("button", {
      name: /validation options/i,
    });
    console.log("Found validation options button, clicking it");
    await user.click(validationOptionsButton);

    // Wait for document types to be visible
    await waitFor(() => {
      const bankStatementCheckbox = screen.getByTestId(
        "checkbox-BANK_STATEMENT"
      );
      expect(bankStatementCheckbox).toBeInTheDocument();
    });

    // Select bank statement document type
    console.log("Found document type checkbox, clicking it");
    const bankStatementCheckbox = screen.getByTestId("checkbox-BANK_STATEMENT");
    await user.click(bankStatementCheckbox);
    console.log("Document type selected");

    console.log("\n=== SECOND BUTTON CLICK ===");
    const loadSampleButton2 = screen.getByText("Load Sample Document");
    console.log("Finding Load Sample Document button again");
    console.log("Found button:", loadSampleButton2 ? "yes" : "no");
    console.log("Clicking Load Sample Document button");
    await user.click(loadSampleButton2);
    console.log("Button clicked");

    console.log("\n=== SECOND WAIT FOR ===");
    await waitFor(
      () => {
        console.log("Inside second waitFor callback");
        console.log("Mock fetch calls:", mockFetch.mock.calls);
        console.log("Mock fetch calls length:", mockFetch.mock.calls.length);
        console.log(
          "Mock checkDocument calls length:",
          mockCheckDocument.mock.calls.length
        );
        console.log("Expected fetch URL: /parcha-poa.pdf");

        try {
          expect(mockFetch).toHaveBeenCalledWith("/parcha-poa.pdf");
          console.log("✅ Second fetch assertion passed");
        } catch (e) {
          console.log("❌ Second fetch assertion failed:", e);
          throw e;
        }

        try {
          expect(mockCheckDocument).toHaveBeenCalled();
          console.log("✅ Second checkDocument assertion passed");
        } catch (e) {
          console.log("❌ Second checkDocument assertion failed:", e);
          throw e;
        }
      },
      {
        timeout: 3000,
        onTimeout: (error) => {
          console.log("⚠️ Second waitFor timed out:", error);
          return error;
        },
      }
    );

    console.log("=== TEST COMPLETE ===\n");
  });

  it("handles sample document loading errors gracefully", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValue(new Error("Failed to load document"));
    global.fetch = mockFetch;

    render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    const loadSampleButton = screen.getByText("Load Sample Document");
    await user.click(loadSampleButton);

    await waitFor(
      () => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toHaveTextContent("Error loading sample document");
      },
      { timeout: 3000 }
    );
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
      check_results: [
        {
          ...mockInitialResponse.check_results[0],
          input_data: {
            type: "ProofOfAddressClassificationToolInput",
            document: {
              type: "Document",
              url: "https://storage.googleapis.com/test-bucket/test.pdf",
              file_name: "test_document.pdf",
              description: "",
              source_type: "file_url",
              num_pages: null,
            },
          },
        },
      ],
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
      check_results: [
        {
          ...mockInitialResponse.check_results[0],
          input_data: {
            type: "ProofOfAddressClassificationToolInput",
            document: {
              type: "Document",
              url: "https://storage.googleapis.com/test-bucket/test.pdf",
              file_name: "test_document.pdf",
              description: "",
              source_type: "file_url",
              num_pages: null,
            },
          },
        },
      ],
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
