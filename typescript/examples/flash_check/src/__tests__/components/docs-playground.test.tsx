import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DocsPlayground } from "../../components/docs-playground";

vi.mock("../../services/flashLoader", () => ({
  checkDocument: vi.fn(() =>
    Promise.resolve({
      passed: true,
      answer: "Document verified successfully",
      payload: {
        company_name: "Test Company",
        document_type: "BANK_STATEMENT",
        document_date: "2024-02-08",
        document_address: {
          street_1: "123 Test St",
          city: "Test City",
          state: "CA",
          postal_code: "12345",
          country_code: "US",
        },
      },
    })
  ),
}));

describe("DocsPlayground Component", () => {
  it("renders without crashing", () => {
    render(<DocsPlayground type="business_proof_of_address" />);
    expect(
      screen.getByText(/Configure environment variables to start/i)
    ).toBeInTheDocument();
  });

  it("renders upload message when configured", () => {
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="custom-api-key"
        agentKey="custom-agent-key"
      />
    );
    expect(screen.getByText(/Upload your document/i)).toBeInTheDocument();
  });

  it("shows validation options when clicking the accordion", async () => {
    const user = userEvent.setup();
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="custom-api-key"
        agentKey="custom-agent-key"
      />
    );
    const accordionButton = screen.getByText("Validation Options");
    await user.click(accordionButton);
    expect(screen.getByText("Document Types")).toBeInTheDocument();
    expect(screen.getByText("Age Limit")).toBeInTheDocument();
  });

  it("shows error banner when API key and agent key are missing", () => {
    render(<DocsPlayground type="business_proof_of_address" />);

    const errorBanner = screen.getByTestId("env-error-banner");
    expect(errorBanner).toBeInTheDocument();
    expect(errorBanner).toHaveTextContent(/Missing required configuration/i);
    expect(errorBanner).toHaveTextContent(
      /API key and agent key are required/i
    );

    // Verify the dropzone shows the correct message
    expect(
      screen.getByText(/Configure environment variables to start/i)
    ).toBeInTheDocument();
  });

  it("does not show error banner when API key and agent key are provided", () => {
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="custom-api-key"
        agentKey="custom-agent-key"
      />
    );

    expect(screen.queryByTestId("env-error-banner")).not.toBeInTheDocument();
  });

  it("handles document type selection", async () => {
    const user = userEvent.setup();
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="custom-api-key"
        agentKey="custom-agent-key"
      />
    );

    // Open validation options
    await user.click(screen.getByText("Validation Options"));

    // Find and click a document type checkbox
    const bankStatementCheckbox = screen.getByLabelText("Bank statement");
    await user.click(bankStatementCheckbox);

    // Verify the checkbox state changed
    expect(bankStatementCheckbox).not.toBeChecked();
  });

  it("handles validity period selection", async () => {
    const user = userEvent.setup();
    render(
      <DocsPlayground
        type="business_proof_of_address"
        apiKey="custom-api-key"
        agentKey="custom-agent-key"
      />
    );

    // Open validation options
    await user.click(screen.getByText("Validation Options"));

    // Find and click a validity period radio button
    const yearOption = screen.getByLabelText("1 year");
    await user.click(yearOption);

    // Verify the radio button is selected
    expect(yearOption).toBeChecked();
  });
});
