import { FlashLoaderResponse } from "../types/flash";

export interface Config {
  apiKey: string;
  baseUrl: string;
  agentKey: string;
}

export const checkDocument = async (
  config: Config,
  document: string,
  filename: string,
  checkArgs: Record<string, any>,
  checkId: string,
  documentField: string,
  descope_user_id?: string
): Promise<FlashLoaderResponse> => {
  const response = await fetch(`${config.baseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      agent_key: config.agentKey,
      check_id: checkId,
      check_args: checkArgs,
      kyb_schema: {
        id: "parcha-latest",
        self_attested_data: {
          business_name: "Parcha",
          registered_business_name: "Parcha Labs Inc",
          [documentField]: [
            {
              b64_document: document,
              file_name: filename,
              source_type: "file_url",
            },
          ],
        },
      },
      ...(descope_user_id ? { descope_user_id } : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to check document");
  }

  return response.json();
};
