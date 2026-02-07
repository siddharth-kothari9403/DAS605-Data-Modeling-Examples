export function buildArticleXML(article) {
  const doc = document.implementation.createDocument("", "", null);

  const articleEl = doc.createElement("article");
  articleEl.setAttribute("version", "1.0");

  /* ---------- metadata ---------- */
  const metadataEl = doc.createElement("metadata");

  const titleEl = doc.createElement("title");
  titleEl.textContent = article.title || "";

  const authorEl = doc.createElement("author");
  authorEl.textContent = article.author || "";

  const dateEl = doc.createElement("date");
  dateEl.textContent = article.date || "";

  metadataEl.append(titleEl, authorEl, dateEl);

  /* ---------- content ---------- */
  const contentEl = doc.createElement("content");

  if (article.contentHTML) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(article.contentHTML, "text/html");

    htmlDoc.body.childNodes.forEach(node => {

      /* ---- headings ---- */
      if (/^H[1-6]$/.test(node.nodeName)) {
        const blockEl = doc.createElement("block");
        blockEl.setAttribute("type", "heading");
        blockEl.setAttribute("level", node.nodeName.substring(1));
        blockEl.textContent = node.textContent.trim();

        contentEl.appendChild(blockEl);
      }

      /* ---- paragraphs ---- */
      if (node.nodeName === "P") {
        const text = node.textContent.trim();
        if (!text) return;

        const blockEl = doc.createElement("block");
        blockEl.setAttribute("type", "paragraph");
        blockEl.textContent = text;

        contentEl.appendChild(blockEl);
      }

      /* ---- images ---- */
      if (node.nodeName === "IMG") {
        const blockEl = doc.createElement("block");
        blockEl.setAttribute("type", "image");
        blockEl.setAttribute("src", node.getAttribute("src") || "");
        blockEl.setAttribute("alt", node.getAttribute("alt") || "");

        contentEl.appendChild(blockEl);
      }
    });
  }

  articleEl.append(metadataEl, contentEl);
  doc.appendChild(articleEl);

  return new XMLSerializer().serializeToString(doc);
}
