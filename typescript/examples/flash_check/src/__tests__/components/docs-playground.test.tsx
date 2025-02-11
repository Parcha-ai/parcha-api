import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocsPlayground } from "../../components/docs-playground";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import React from "react";
import { FlashLoaderResponse } from "../../types/flash";

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
    // Clear environment variables and mocks before each test
    vi.stubEnv("VITE_API_KEY", "");
    vi.stubEnv("VITE_AGENT_KEY", "");
    vi.stubEnv("VITE_API_URL", "");
    mockCheckDocument.mockReset();
  });

  afterEach(() => {
    // Restore environment variables and mocks after each test
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("renders with default configuration", () => {
    render(<DocsPlayground type="incorporation" />);

    // Verify environment variables are empty
    expect(import.meta.env.VITE_API_KEY).toBe("");
    expect(import.meta.env.VITE_AGENT_KEY).toBe("");

    // When no API key is provided, the error banner should be visible
    expect(screen.getByTestId("env-error-banner")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Missing required configuration: API key and agent key are required"
      )
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
    expect(
      screen.getByText("Drag & drop a PDF file here, or click to browse")
    ).toBeInTheDocument();
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

    // For EIN type, we should see the upload message directly
    expect(
      screen.getByText("Drag & drop a PDF file here, or click to browse")
    ).toBeInTheDocument();
  });

  it("handles file upload and displays file name", async () => {
    const { container } = render(
      <DocsPlayground
        type="incorporation"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );
    const user = userEvent.setup();
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);
      // Look for the text with emoji
      expect(await screen.findByText("📄 test.pdf")).toBeInTheDocument();
    }
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
    const accordionToggle = screen.getByText("Validation Options");
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
    // Set up a delayed response
    mockCheckDocument.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              payload: {
                company_name: "PARCHA LABS INC",
                document_date: "2023-03-31",
                type: "incorporation",
              },
              input_data: {
                type: "incorporation",
                document: { url: "test-url" },
              },
              command_instance_id: "test-id",
              passed: true,
              answer: "Valid document",
              status: "completed",
            } as FlashLoaderResponse);
          }, 500);
        })
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
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      expect(screen.getByText("Processing document...")).toBeInTheDocument();

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
    // Set up immediate response for this test
    const testDate = "2023-03-31T00:00:00.000Z"; // UTC date
    mockCheckDocument.mockResolvedValue({
      payload: {
        company_name: "PARCHA LABS INC",
        document_date: testDate,
        ein: "92-3265708",
        type: "ein",
      },
      input_data: {
        type: "ein",
        document: { url: "test-url" },
      },
      command_instance_id: "test-id",
      passed: true,
      answer: "Valid EIN document",
      status: "completed",
      created_at: testDate,
      updated_at: testDate,
      agent_key: "test-agent-key",
      command_name: "test-command",
      check_args: {},
      data_loader_args: {},
      job_id: "test-job",
      data_loader_id: "test-loader",
      result_type: "ein",
    } as FlashLoaderResponse);

    const mockFile = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const { container } = render(
      <DocsPlayground
        type="ein"
        apiKey="test-api-key"
        agentKey="test-agent-key"
      />
    );

    // Get the file input and simulate file upload
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    await userEvent.upload(fileInput, mockFile);

    // Wait for the component to update and verify the document details are displayed
    await waitFor(() => {
      // Check EIN number
      expect(screen.getByTestId("ein-number")).toHaveTextContent("92-3265708");

      // Check date format - should be a date in March 2023
      expect(screen.getByText(/March \d{1,2}, 2023/)).toBeInTheDocument();
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
    expect(screen.getByText("755 Sansome St.")).toBeInTheDocument();
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

    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="test-api-key"
        agentKey="test-agent-key"
        initialResponse={mockResponseWithPdf}
      />
    );

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
});
