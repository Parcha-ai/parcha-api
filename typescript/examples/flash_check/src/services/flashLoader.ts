import { FlashLoaderResponse, DocumentTypeValue } from "../types/flash";
import { log } from "../utils/logger";

export interface Config {
  apiKey: string;
  baseUrl: string;
  agentKey: string;
}

export const checkDocument = async (
  config: Config,
  document: string,
  filename: string,
  documentTypes: DocumentTypeValue[],
  validityPeriod: number = 90
): Promise<FlashLoaderResponse> => {
  const response = await fetch(`${config.baseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      agent_key: "mercury-poa-v1",
      check_id: "kyb.proof_of_address_verification",
      check_args: {
        validity_period: validityPeriod,
        accepted_documents: documentTypes,
      },
      kyb_schema: {
        id: "parcha-latest",
        self_attested_data: {
          business_name: "Parcha",
          registered_business_name: "Parcha Labs Inc",
          proof_of_address_documents: [
            {
              b64_document: document,
              file_name: filename,
              source_type: "file_url",
            },
          ],
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to check document");
  }

  return response.json();
};
