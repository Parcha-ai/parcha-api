import { log } from "./logger";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(",")[1];
        log.info("file_converted_to_base64", { fileName: file.name });
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    reader.onerror = () => {
      const error = new Error("Error reading file");
      log.error("file_conversion_error", error);
      reject(error);
    };
  });
};

export const isValidPDF = (file: File): boolean => {
  return file.type === "application/pdf";
};
