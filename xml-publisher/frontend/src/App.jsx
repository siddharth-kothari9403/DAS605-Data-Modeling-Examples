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
  
        xml += `
          <block type="heading" level="${level}">
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
  
  const loadFromXML = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = () => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(reader.result, "text/xml");
  
      const title =
        xmlDoc.querySelector("metadata > title")?.textContent || "";
      const author =
        xmlDoc.querySelector("metadata > author")?.textContent || "";
      const date =
        xmlDoc.querySelector("metadata > date")?.textContent || "";
  
      let contentHTML = "";
  
      const blocks = Array.from(
        xmlDoc.querySelectorAll("content > block")
      );
  
      blocks.forEach(block => {
        const type = block.getAttribute("type");
  
        if (type === "paragraph") {
          contentHTML += block.textContent;
        }
  
        if (type === "heading") {
          // CDATA already contains <h1>..<h6>
          contentHTML += block.textContent;
        }
  
        if (type === "image") {
          const src = block.getAttribute("src");
          const alt = block.getAttribute("alt") || "";
          contentHTML += `<img src="${src}" alt="${alt}" />`;
        }
      });
  
      setArticle({
        title,
        author,
        date,
        contentHTML
      });
    };
  
    reader.readAsText(file);
  };
  
  const publishToHTML = async () => {
    const xmlString = buildArticleXML(article);

    const result = await transformXML(
      xmlString, 
      "/xsl/article-to-html.xsl"
    )

    const htmlString = new XMLSerializer().serializeToString(result);
  
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

      <hr />

      <div style={{ marginTop: "20px" }}>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <h3>Load Article from XML</h3>
          <label className="your-button-class" style={{ cursor: "pointer" }}>
            <input
              type="file"
              accept=".xml"
              onChange={loadFromXML}
              style={{ display: "inline-block", width: "auto", marginLeft: "8px" }}
            />
          </label>
        </div>
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
