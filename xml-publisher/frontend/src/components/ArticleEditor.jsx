import { useState } from "react";

export default function ArticleEditor({ article, setArticle }) {
  const handleChange = (field, value) => {
    setArticle({
      ...article,
      [field]: value
    });
  };

  const handleParagraphChange = (index, value) => {
    const updatedParagraphs = [...article.paragraphs];
    updatedParagraphs[index] = value;

    setArticle({
      ...article,
      paragraphs: updatedParagraphs
    });
  };

  const addParagraph = () => {
    setArticle({
      ...article,
      paragraphs: [...article.paragraphs, ""]
    });
  };

  return (
    <div>
      <h2>News Article Editor</h2>

      <div>
        <label>Title</label><br />
        <input
          type="text"
          value={article.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div>
        <label>Author</label><br />
        <input
          type="text"
          value={article.author}
          onChange={(e) => handleChange("author", e.target.value)}
        />
      </div>

      <div>
        <label>Date</label><br />
        <input
          type="date"
          value={article.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>

      <div>
        <label>Content</label>
        {article.paragraphs.map((para, index) => (
          <div key={index}>
            <textarea
              rows="3"
              value={para}
              onChange={(e) =>
                handleParagraphChange(index, e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <button onClick={addParagraph}>Add Paragraph</button>
    </div>
  );
}
