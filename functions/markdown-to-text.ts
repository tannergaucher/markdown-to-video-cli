import { type MarkdownToText } from "../cli.js";

export async function markdownToText({
  remark,
  strip,
  markdown,
}: MarkdownToText) {
  const result = await remark().use(strip).process(markdown);

  return result.toString();
}
