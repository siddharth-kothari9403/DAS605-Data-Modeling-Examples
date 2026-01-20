import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export default function ArticleEditor({ article, setArticle }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({ inline: false }),
    ],
    content: "<p></p>",
    onUpdate: ({ editor }) => {
      setArticle(prev => ({
        ...prev,
        contentHTML: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    if (!editor) return;
    
    if (article.contentHTML) {
      editor.commands.setContent(article.contentHTML, false); // load once
    }
  }, [editor]); // only depend on editor, NOT article.contentHTML
  

  if (!editor) return null;

  const loadFromXML = (e) => {
    if (!editor) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(reader.result, "text/xml");

      const title = xmlDoc.querySelector("metadata > title")?.textContent || "";
      const author = xmlDoc.querySelector("metadata > author")?.textContent || "";
      const date = xmlDoc.querySelector("metadata > date")?.textContent || "";

      let contentHTML = "";
      const blocks = Array.from(xmlDoc.querySelectorAll("content > block"));

      blocks.forEach(block => {
        const type = block.getAttribute("type");

        if (type === "paragraph" || type === "heading") {
          contentHTML += block.textContent;
        }

        if (type === "image") {
          const src = block.getAttribute("src");
          const alt = block.getAttribute("alt") || "";
          contentHTML += `<img src="${src}" alt="${alt}" />`;
        }
      });

      setArticle({ title, author, date, contentHTML });
      editor.commands.setContent(contentHTML, false);
    };

    reader.readAsText(file);
  };

  const addParagraph = () => {
    editor
      .chain()
      .focus()
      .command(({ state, tr }) => {
        const pos = state.selection.to;
  
        tr.insert(pos, state.schema.nodes.paragraph.create());
        tr.setSelection(
          state.selection.constructor.near(tr.doc.resolve(pos + 1))
        );
  
        return true;
      })
      .run();
  };   

  const addHeading = (level = 2) => {
    editor
      .chain()
      .focus()
      .command(({ state, tr }) => {
        const pos = state.selection.to;
        const heading = state.schema.nodes.heading.create({ level });
  
        tr.insert(pos, heading);
        tr.setSelection(
          state.selection.constructor.near(tr.doc.resolve(pos + 1))
        );
  
        return true;
      })
      .run();
  };  

  const addImage = () => {
    const url = prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div>
      <h2>News Article Editor</h2>

      <div>
        <label>Title</label><br />
        <input
          type="text"
          value={article.title}
          onChange={e =>
            setArticle({ ...article, title: e.target.value })
          }
        />
      </div>

      <div>
        <label>Author</label><br />
        <input
          type="text"
          value={article.author}
          onChange={e =>
            setArticle({ ...article, author: e.target.value })
          }
        />
      </div>

      <div>
        <label>Date</label><br />
        <input
          type="date"
          value={article.date}
          onChange={e =>
            setArticle({ ...article, date: e.target.value })
          }
        />
      </div>

      <div style={{ marginTop: "12px" }}>
        <button onClick={addParagraph}>Add Paragraph</button>
        <button onClick={() => addHeading(1)}>H1</button>
        <button onClick={() => addHeading(2)}>H2</button>
        <button onClick={() => addHeading(3)}>H3</button>
        <button onClick={addImage}>Add Image</button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "10px",
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <hr/>
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
    </div>
  );
}
