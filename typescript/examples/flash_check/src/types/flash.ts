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

export type FlashLoaderType = "incorporation" | "business_proof_of_address";

export interface FlashLoaderConfig {
  type: FlashLoaderType;
  checkId: string;
  documentField: string;
  checkArgs: Record<string, any>;
  documentTypes?: DocumentTypeOption[];
  showValidityPeriod?: boolean;
  jurisdictions?: JurisdictionOption[];
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

export interface JurisdictionOption {
  label: string;
  state: string;
  country: string;
}

export const US_JURISDICTIONS: JurisdictionOption[] = [
  { label: "Any Jurisdiction", state: "", country: "" },
  { label: "Alabama", state: "AL", country: "US" },
  { label: "Alaska", state: "AK", country: "US" },
  { label: "Arizona", state: "AZ", country: "US" },
  { label: "Arkansas", state: "AR", country: "US" },
  { label: "California", state: "CA", country: "US" },
  { label: "Colorado", state: "CO", country: "US" },
  { label: "Connecticut", state: "CT", country: "US" },
  { label: "Delaware", state: "DE", country: "US" },
  { label: "Florida", state: "FL", country: "US" },
  { label: "Georgia", state: "GA", country: "US" },
  { label: "Hawaii", state: "HI", country: "US" },
  { label: "Idaho", state: "ID", country: "US" },
  { label: "Illinois", state: "IL", country: "US" },
  { label: "Indiana", state: "IN", country: "US" },
  { label: "Iowa", state: "IA", country: "US" },
  { label: "Kansas", state: "KS", country: "US" },
  { label: "Kentucky", state: "KY", country: "US" },
  { label: "Louisiana", state: "LA", country: "US" },
  { label: "Maine", state: "ME", country: "US" },
  { label: "Maryland", state: "MD", country: "US" },
  { label: "Massachusetts", state: "MA", country: "US" },
  { label: "Michigan", state: "MI", country: "US" },
  { label: "Minnesota", state: "MN", country: "US" },
  { label: "Mississippi", state: "MS", country: "US" },
  { label: "Missouri", state: "MO", country: "US" },
  { label: "Montana", state: "MT", country: "US" },
  { label: "Nebraska", state: "NE", country: "US" },
  { label: "Nevada", state: "NV", country: "US" },
  { label: "New Hampshire", state: "NH", country: "US" },
  { label: "New Jersey", state: "NJ", country: "US" },
  { label: "New Mexico", state: "NM", country: "US" },
  { label: "New York", state: "NY", country: "US" },
  { label: "North Carolina", state: "NC", country: "US" },
  { label: "North Dakota", state: "ND", country: "US" },
  { label: "Ohio", state: "OH", country: "US" },
  { label: "Oklahoma", state: "OK", country: "US" },
  { label: "Oregon", state: "OR", country: "US" },
  { label: "Pennsylvania", state: "PA", country: "US" },
  { label: "Puerto Rico", state: "PR", country: "US" },
  { label: "Rhode Island", state: "RI", country: "US" },
  { label: "South Carolina", state: "SC", country: "US" },
  { label: "South Dakota", state: "SD", country: "US" },
  { label: "Tennessee", state: "TN", country: "US" },
  { label: "Texas", state: "TX", country: "US" },
  { label: "Utah", state: "UT", country: "US" },
  { label: "Vermont", state: "VT", country: "US" },
  { label: "Virginia", state: "VA", country: "US" },
  { label: "Washington", state: "WA", country: "US" },
  { label: "West Virginia", state: "WV", country: "US" },
  { label: "Wisconsin", state: "WI", country: "US" },
  { label: "Wyoming", state: "WY", country: "US" },
];

export const FLASH_LOADER_CONFIGS: Record<FlashLoaderType, FlashLoaderConfig> =
  {
    business_proof_of_address: {
      type: "business_proof_of_address",
      checkId: "kyb.proof_of_address_verification",
      documentField: "proof_of_address_documents",
      checkArgs: {
        validity_period: 90,
        accepted_documents: DOCUMENT_TYPES.map((dt) => dt.value),
      },
      documentTypes: DOCUMENT_TYPES,
      showValidityPeriod: true,
    },
    incorporation: {
      type: "incorporation",
      checkId: "kyb.documentextraction",
      documentField: "incorporation_documents",
      checkArgs: {},
      showValidityPeriod: false,
      jurisdictions: US_JURISDICTIONS,
    },
  };

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

export interface DocsPlaygroundProps {
  type: FlashLoaderType;
  descope_user_id?: string;
  apiKey?: string;
  baseUrl?: string;
  agentKey?: string;
}
