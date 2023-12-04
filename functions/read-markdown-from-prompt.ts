import { question } from "zx";
import fs from "fs";

export async function readMarkdownFromPrompt() {
  const filePath = await question("Please enter the file path\n");

  const markdownFile = fs.readFileSync(filePath, "utf-8");

  return markdownFile;
}
