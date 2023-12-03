import * as CloudSpeech from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as util from "util";

import { BUCKET_NAME } from "../../cli.js";

type TranscribeSpeech = {
  client: CloudSpeech.SpeechClient;
  storage: Storage;
  gcsUri: string;
};

export async function transcribeSpeech({
  gcsUri,
  client,
  storage,
}: TranscribeSpeech) {
  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding:
      CloudSpeech.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
        .MP3,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio,
    config,
  };

  const [response] = await client.recognize(request);

  if (!response?.results) {
    throw new Error("No response");
  }

  const filename = getFilenameFromSpeechUri(gcsUri);

  const writeFile = util.promisify(fs.writeFile);

  await writeFile(filename, response.results.toString());

  await storage
    .bucket(BUCKET_NAME)
    .upload(filename, {
      destination: filename,
    })
    .catch((err) => {
      throw new Error(`Error uploading file ${filename}`, err);
    })
    .finally(() => {
      fs.unlink(filename, (err) => {
        if (err) {
          throw new Error(`Error deleting file ${filename}`, err);
        }
      });
    });

  return {
    transcriptionUri: `gs://${BUCKET_NAME}/${filename}`,
  };
}

function getFilenameFromSpeechUri(uri: string) {
  const uriParts = uri.split("/speech-");

  if (uriParts.length < 2) {
    throw new Error("Invalid URI format");
  }

  const timestampParts = uriParts[1] ? uriParts[1].split(".mp3") : [];

  if (timestampParts.length < 1) {
    throw new Error("Invalid timestamp format");
  }
  const timestamp = timestampParts[0];
  const filename = `transcription-${timestamp}.json`;

  return filename;
}
