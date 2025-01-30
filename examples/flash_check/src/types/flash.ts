export interface FlashMessage {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
  id?: string;
}

export interface FlashState {
  messages: FlashMessage[];
}

export interface FlashContextType {
  messages: FlashMessage[];
  addMessage: (message: FlashMessage) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

export interface FlashLoaderConfig {
  apiKey: string;
  baseUrl: string;
}

export type DocumentTypeValue =
  | "BANK_STATEMENT"
  | "VAT_INVOICE"
  | "UTILITY_BILL"
  | "TENANCY_AGREEMENT"
  | "TAX_DOCUMENT"
  | "MORTGAGE_STATEMENT"
  | "CREDIT_CARD_STATEMENT"
  | "INSURANCE_POLICY"
  | "LEASE_AGREEMENT"
  | "DRIVER_LICENSE";

export interface DocumentTypeOption {
  label: string;
  value: DocumentTypeValue;
}

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { label: "Bank statement", value: "BANK_STATEMENT" },
  { label: "VAT invoice", value: "VAT_INVOICE" },
  { label: "Utility bill", value: "UTILITY_BILL" },
  { label: "Signed tenancy or lease agreement", value: "TENANCY_AGREEMENT" },
  { label: "Tax document", value: "TAX_DOCUMENT" },
  { label: "Mortgage statement", value: "MORTGAGE_STATEMENT" },
  { label: "Credit card statement", value: "CREDIT_CARD_STATEMENT" },
  { label: "Home or renter's insurance policy", value: "INSURANCE_POLICY" },
  { label: "Lease agreement", value: "LEASE_AGREEMENT" },
  { label: "Driver's license", value: "DRIVER_LICENSE" },
];

export interface CheckArguments {
  validity_period: number;
  accepted_documents: DocumentTypeValue[];
}

export interface Address {
  type: string;
  street_1: string | null;
  street_2: string | null;
  city: string | null;
  state: string | null;
  country_code: string | null;
  postal_code: string | null;
}

export interface Document {
  type: string;
  url: string;
  file_name: string;
  description: string | null;
  source_type: string;
  num_pages: number | null;
}

export interface ProofOfAddressFlashCheckResult {
  type: string;
  company_name: string;
  document_date: string;
  document_type: string;
  document_address: Address;
}

export interface FlashLoaderResponse {
  agent_instance_id: string;
  error: string | null;
  recommendation: string | null;
  check_start_time: string | null;
  agent_key: string;
  instructions: string | null;
  follow_up: string | null;
  check_end_time: string | null;
  command_id: string;
  explanation: string | null;
  step_number: number | null;
  check_args: CheckArguments;
  created_at: string;
  command_name: string;
  payload: ProofOfAddressFlashCheckResult;
  status: string;
  data_loader_args: Record<string, unknown>;
  job_id: string;
  command_desc: string | null;
  answer: string;
  data_loader_id: string;
  updated_at: string;
  result_type: string;
  passed: boolean;
  data_loader_start_time: string | null;
  command_instance_id: string;
  input_data: {
    type: string;
    document: Document;
  };
  alerts: Record<string, unknown> | null;
  verification_data: Record<string, unknown> | null;
  evidence: Record<string, unknown> | null;
  data_loader_end_time: string | null;
}

export interface DocumentFile {
  file: File;
  base64: string;
}

export interface ValidityPeriod {
  label: string;
  days: number;
}

export const VALIDITY_PERIODS: ValidityPeriod[] = [
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
  { label: "5 years", days: 1825 },
];
