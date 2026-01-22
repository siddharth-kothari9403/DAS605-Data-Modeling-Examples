import { useState } from "react";
import ArticleEditor from "./components/ArticleEditor";
import { buildArticleXML } from "./utils/xmlBuilder";
import { transformXML } from "./utils/xsltRunner";

function App() {
  const [article, setArticle] = useState({
    title: "",
    author: "",
    date: "",
    blocks: [{ type: "paragraph", value: "" }]
  });  

  const saveAsXML = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<article version="1.0">\n`;
  
    xml += `  <metadata>\n`;
    xml += `    <title>${article.title}</title>\n`;
    xml += `    <author>${article.author}</author>\n`;
    xml += `    <date>${article.date}</date>\n`;
    xml += `  </metadata>\n`;
  
    xml += `  <content>\n`;
  
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.contentHTML, "text/html");
  
    doc.body.childNodes.forEach(node => {
  
      /* Paragraphs */
      if (node.nodeName === "P") {
        if (node.innerHTML === "<br>" || node.textContent.trim() === "") return;
  
        xml += `
          <block type="paragraph">
            <![CDATA[${node.outerHTML}]]>
          </block>`;
      }
  
      /* Headings */
      if (/^H[1-6]$/.test(node.nodeName)) {
        const level = node.nodeName.substring(1);
        const innerText = node.textContent.replace(/"/g, "&quot;");
  
        xml += `
          <block type="heading" level="${level}" text="${innerText}">
            <![CDATA[${node.outerHTML}]]>
          </block>`;
      }
  
      /* Images */
      if (node.nodeName === "IMG") {
        const src = node.getAttribute("src") || "";
        const alt = node.getAttribute("alt") || "";
  
        xml += `
          <block type="image" src="${src}" alt="${alt}" />`;
      }
    });
  
    xml += `
    </content>
  </article>`;
  
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "article.xml";
    a.click();
  
    URL.revokeObjectURL(url);
  };
  
  const publishToHTML = async () => {
    const xmlString = buildArticleXML(article);
  
    const fragment = await transformXML(
      xmlString,
      "/xslt/article-to-html.xsl"
    );
  
    const container = document.createElement("html");
    container.appendChild(fragment.cloneNode(true));
  
    const htmlString = "<!DOCTYPE html>\n" + container.outerHTML;
  
    const blob = new Blob([htmlString], { type: "text/html" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "article.html";
    a.click();
  
    URL.revokeObjectURL(url);
  };
  
  const publishToRSS = async () => {
    const xmlString = buildArticleXML(article);
  
    const result = await transformXML(
      xmlString,
      "/xslt/article-to-rss.xsl"
    );
  
    const serializer = new XMLSerializer();
    const rssString = serializer.serializeToString(result);
  
    const blob = new Blob([rssString], { type: "application/rss+xml" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "rss.xml";
    a.click();
  
    URL.revokeObjectURL(url);
  };

  const publishToPDF = async () => {
    const xmlString = buildArticleXML(article);
  
    const response = await fetch("http://localhost:3001/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlString
    });
  
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "article.pdf";
    a.click();
  
    URL.revokeObjectURL(url);
  };  

  return (
    <div style={{ padding: "20px" }}>
      <h1>XML News Publishing Demo</h1>

      <ArticleEditor
        article={article}
        setArticle={setArticle}
      />

      <div style={{ marginTop: "20px" }}>
        
        <div>
          <hr />
          <h3>Publishing Actions</h3>

          <button className="your-button-class" onClick={saveAsXML}>Save as XML</button>
          <button className="your-button-class" onClick={publishToHTML}>Publish to HTML</button>
          <button className="your-button-class" onClick={publishToPDF}>Publish to PDF</button>
          <button className="your-button-class" onClick={publishToRSS}>Publish to RSS</button>
        </div>
      </div>

    </div>
  );
}

export default App;
