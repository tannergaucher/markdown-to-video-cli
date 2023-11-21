import { remark } from "remark";
import strip from "strip-markdown";

export async function markdownToPlainText(markdown: string) {
  const result = await remark().use(strip).process(markdown);
  return result.toString();
}
