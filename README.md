# XML News Publishing Demo

A full-stack application for creating, editing, and publishing news articles in multiple formats (XML, HTML, RSS, PDF) using XML as the core data format and XSL transformations. This allows us to do various kinds of Content Repurposing, which is used extensively in Content Publishing. 

## Application Functionality

This application demonstrates XML-based content management with multi-format publishing capabilities. Users can create news articles through a web interface, save them as XML, and publish them to various formats using XSLT transformations.

### Architecture

1. **Frontend (React)** - The frontend provides an intuitive interface for article creation and management.
2. **Backend (Node.js/Express)** - The backend handles PDF generation using Apache FOP (Formatting Objects Processor).

### Key Features

1. **Create & Edit Articles**: Rich article editor with title, author, date, and multi-paragraph content
2. **XML Persistence**: Save articles as XML for later editing and version control
3. **Multi-Format Publishing**:
    - HTML: Styled web page using XSLT transformation
    - RSS: Syndication feed for news aggregators
    - PDF: Print-ready document with professional formatting


### Key Design Decisions

1. **XML as Source of Truth**: All articles are stored and transferred as XML, ensuring data portability and standard compliance

2. **XSLT for Transformations**: Using XSLT allows separation of data (XML) from presentation (XSL stylesheets), making it easy to add new output formats

3. **Client-side vs Server-side Processing**:
   - HTML/RSS: Client-side (faster, no server load)
   - PDF: Server-side (requires Apache FOP, complex formatting)

### Application Screen

![Alt text](Application%20Screen.png)

### Directory Structure

```
xml-publisher/
├── backend/
│   ├── node_modules/
│   ├── generate-pdf.js      # Express server for PDF generation
│   ├── package.json
│   ├── package-lock.json
│   ├── template.fo          # Temporary XSL-FO file (generated)
│   ├── temp.xml             # Temporary XML file (generated)
│   └── article.pdf          # Generated PDF output
│
└── frontend/
    ├── public/
    │   ├── xslfo/
    │   │   └── article-to-pdf.xsl   # XSL-FO stylesheet for PDF
    │   └── xslt/
    │       ├── article-to-html.xsl  # XSLT for HTML output
    │       └── article-to-rss.xsl   # XSLT for RSS feed
    │
    └── src/
        ├── assets/
        ├── components/
        │   └── ArticleEditor.jsx     # Main article editing component
        ├── utils/
        │   ├── xmlBuilder.js         # Builds XML from article data
        │   └── xsltRunner.js         # Client-side XSLT processor
        ├── App.jsx                   # Main app with publish actions
        ├── App.css                   # Styling
        ├── index.css
        ├── main.jsx                  # React entry point
        └── vite.svg
```
### XML Structure

The application uses this XML Structure to represent a news object.

```
<article>
  <metadata>
    <title>Article Title</title>
    <author>Author Name</author>
    <date>2026-01-15</date>
  </metadata>
  <content>
    <paragraph>First paragraph content...</paragraph>
    <paragraph>Second paragraph content...</paragraph>
    <!-- More paragraphs -->
  </content>
</article>
```

### Frontend Components

#### `App.jsx`
The main application container that orchestrates all publishing actions:
- **Save as XML**: Exports the current article as an XML file
- **Publish to HTML**: Transforms XML to styled HTML using XSLT
- **Publish to RSS**: Generates RSS feed from article data
- **Publish to PDF**: Sends XML to backend for PDF generation
- **Load from XML**: Imports previously saved XML articles for editing

#### `ArticleEditor.jsx`
The article editing interface component featuring:
- Title input field
- Author input field
- Date picker
- Multi-paragraph content editor with dynamic paragraph addition
- Form state management

### Utility Functions

#### `utils/xmlBuilder.js`
Contains the `buildArticleXML()` function that:
- Converts the article JavaScript object into valid XML structure
- Structures content with proper `<article>`, `<metadata>`, and `<content>` elements
- Ensures proper XML encoding and formatting

#### `utils/xsltRunner.js`
Handles client-side XSLT transformations:
- Loads XSL stylesheets from `/public` directory
- Transforms XML using browser's native XSLT processor
- Returns transformed HTML/RSS output
- Used for HTML and RSS publishing (client-side transformations)

### XSL Stylesheets

#### `public/xslfo/article-to-pdf.xsl`
XSL-FO (Formatting Objects) stylesheet for PDF generation:
- Defines page layout (A4 size, margins)
- Specifies typography (fonts, sizes, colors)
- Creates styled containers with backgrounds and borders
- Formats metadata and content sections
- Processed server-side by Apache FOP

#### `public/xslt/article-to-html.xsl`
XSLT stylesheet for HTML transformation:
- Generates complete HTML document with embedded CSS
- Creates responsive container layout
- Styles title, metadata, and content sections
- Includes shadow effects and modern design elements
- Processed client-side in browser

#### `public/xslt/article-to-rss.xsl`
XSLT stylesheet for RSS feed generation:
- Creates valid RSS 2.0 XML structure
- Maps article data to RSS `<item>` elements
- Includes title, description, author, and publication date
- Suitable for news aggregators and RSS readers

### Backend

#### `backend/generate-pdf.js`
Express server that handles PDF generation:
1. Receives XML content via POST request
2. Writes XML to temporary file (`temp.xml`)
3. Copies XSL-FO stylesheet to working directory (`template.fo`)
4. Executes Apache FOP command-line tool:
   ```bash
   fop -xml temp.xml -xsl template.xsl -pdf article.pdf
   ```
5. Returns generated PDF as downloadable file


## Instructions to run

### Clone Repository

Clone the repository using 

```
git clone https://github.com/siddharth-kothari9403/DAS605-Data-Modeling-Examples.git

cd DAS605-Data-Modeling-Examples
```
### Apache FOP Installation and Setup

There is an additional setup of Apache FOP which will be required for the application to run (Java 11+ should be preinstalled)

```
cd /tmp
wget https://archive.apache.org/dist/xmlgraphics/fop/binaries/fop-2.9-bin.tar.gz
sudo tar -xzf fop-2.9-bin.tar.gz -C /opt
sudo ln -s /opt/fop-2.9 /opt/fop
```

FOP version can now be verified using - 

```
/opt/fop/fop/fop -version
```

Additionally, a small test program can be used to verify the FOP installation. First, change the directory to reach the cloned repository. Then run the following steps - 

```
cd xml-publisher/backend

cat > test.xml << 'EOF'
<article>
  <metadata>
    <title>Demo News</title>
    <author>Siddharth</author>
    <date>2026-01-15</date>
  </metadata>
  <content>
    <paragraph>Hello this is a Demo Article.</paragraph>
    <paragraph>The application supports various things including saving as XML, and publishing.</paragraph>
  </content>
</article>
EOF

cp ../frontend/public/xslfo/article-to-pdf.xsl ./test.xsl

/opt/fop/fop/fop -xml test.xml -xsl test.xsl -pdf test.pdf
```

test.pdf should be generated in the backend folder, and can be viewed. 

### Backend Setup

Run the following commands to start the backend (navigate to the github repository folder if not done already)

```
cd xml-publisher/backend
npm install express cors
node generate-pdf.js
```

The backend should be up and listening on port 3001. 

If needed, change the fopPath variable in the generate-pdf.js file to point to your fop installation. 

### Frontend Setup

Run the following commands in a separate terminal to start the frontend (navigate to the github repository folder if not done already)

```
cd xml-publisher/frontend
npm install
npm run dev
```

The frontend will now be started on http://localhost:5173/, which can be opened in a browser. 

## License

This is a demonstration project for educational purposes.

