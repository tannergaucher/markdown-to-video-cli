import { type DetectImageText } from "../cli.js";

export function detectImageText({
  bucketName,
  fileName,
  client,
}: DetectImageText) {
  return client.textDetection(`gs://${bucketName}/${fileName}`);
}
