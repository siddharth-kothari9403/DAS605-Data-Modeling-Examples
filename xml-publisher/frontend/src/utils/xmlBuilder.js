export function buildArticleXML(article) {
    const doc = document.implementation.createDocument("", "", null);
  
    const articleEl = doc.createElement("article");
  
    const metadataEl = doc.createElement("metadata");
  
    const titleEl = doc.createElement("title");
    titleEl.textContent = article.title;
  
    const authorEl = doc.createElement("author");
    authorEl.textContent = article.author;
  
    const dateEl = doc.createElement("date");
    dateEl.textContent = article.date;
  
    metadataEl.append(titleEl, authorEl, dateEl);
  
    const contentEl = doc.createElement("content");
  
    article.paragraphs.forEach((p) => {
      if (p.trim() !== "") {
        const paraEl = doc.createElement("paragraph");
        paraEl.textContent = p;
        contentEl.appendChild(paraEl);
      }
    });
  
    articleEl.append(metadataEl, contentEl);
    doc.appendChild(articleEl);
  
    return new XMLSerializer().serializeToString(doc);
  }
  