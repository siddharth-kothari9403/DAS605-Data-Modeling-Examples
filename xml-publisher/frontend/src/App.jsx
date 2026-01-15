import { useState } from "react";
import ArticleEditor from "./components/ArticleEditor";
import { buildArticleXML } from "./utils/xmlBuilder";
import { transformXML } from "./utils/xsltRunner";

function App() {
  const [article, setArticle] = useState({
    title: "",
    author: "",
    date: "",
    paragraphs: [""]
  });

  const saveAsXML = () => {
    const xmlString = buildArticleXML(article);

    const blob = new Blob([xmlString], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "article.xml";
    a.click();

    URL.revokeObjectURL(url);
  };

  const publishToHTML = async () => {
    const xmlString = buildArticleXML(article);
    const result = await transformXML(
      xmlString,
      "/xslt/article-to-html.xsl"
    );
  
    const win = window.open("", "_blank");
    win.document.body.appendChild(result);
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

  const loadFromXML = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = () => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(reader.result, "text/xml");
  
      const title = xmlDoc.querySelector("title")?.textContent || "";
      const author = xmlDoc.querySelector("author")?.textContent || "";
      const date = xmlDoc.querySelector("date")?.textContent || "";
  
      const paragraphs = Array.from(
        xmlDoc.querySelectorAll("content > paragraph")
      ).map(p => p.textContent);
  
      setArticle({
        title,
        author,
        date,
        paragraphs: paragraphs.length ? paragraphs : [""]
      });
    };
  
    reader.readAsText(file);
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
