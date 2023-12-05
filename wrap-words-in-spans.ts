export function wrapWordsWithSpans(html: string): string {
  let id = 0;

  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const document = parser.parseFromString(html, "text/html");

  traverse(document.body);

  function traverse(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = (node.textContent || "").split(" ");
      const wrappedWords = words.map(
        (word) => `<span id="${id++}">${word}</span>`
      );
      const newNode = document.createElement("span");
      newNode.innerHTML = wrappedWords.join(" ");
      node.parentNode?.replaceChild(newNode, node);
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i];

        if (!childNode) {
          return;
        }

        traverse(childNode);
      }
    }
  }

  return serializer.serializeToString(document);
}
