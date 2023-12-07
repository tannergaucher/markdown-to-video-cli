import { ImageAnnotatorClient } from "@google-cloud/vision";

interface DetectImageText {
  bucketName: string;
  fileName: string;
  client: ImageAnnotatorClient;
}

export function detectImageText({
  bucketName,
  fileName,
  client,
}: DetectImageText) {
  return client.textDetection(`gs://${bucketName}/${fileName}`);
}
