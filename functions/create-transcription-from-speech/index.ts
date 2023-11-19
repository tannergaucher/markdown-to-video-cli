// Imports the Google Cloud client library
import * as cloudSpeech from "@google-cloud/speech");
import { google } from "@google-cloud/text-to-speech/build/protos/protos";

type CreateTranscriptionFromSpeechParams = {
  gcsUri: string;
  client: cloudSpeech.SpeechClient;
};

export async function createTranscriptionFromSpeech({
  gcsUri,
     client,

}: CreateTranscriptionFromSpeechParams) {
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: google.cloud.texttospeech.v1.AudioEncoding,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}
