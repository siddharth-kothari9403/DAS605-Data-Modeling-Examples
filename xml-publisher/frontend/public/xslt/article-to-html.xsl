<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/article">
    <html>
      <head>
        <title>
          <xsl:value-of select="metadata/title"/>
        </title>

        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            margin: 40px auto;
            background: #ffffff;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          h1 {
            margin-top: 0;
            color: #333;
          }
          .meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 20px;
          }
          .meta span {
            margin-right: 15px;
          }
          .content p {
            line-height: 1.6;
            color: #444;
            margin-bottom: 15px;
          }
          hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 20px 0;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <h1>
            <xsl:value-of select="metadata/title"/>
          </h1>

          <div class="meta">
            <span>
              <strong>Author:</strong>
              <xsl:value-of select="metadata/author"/>
            </span>
            <span>
              <strong>Date:</strong>
              <xsl:value-of select="metadata/date"/>
            </span>
          </div>

          <hr />

          <div class="content">
            <xsl:for-each select="content/paragraph">
              <p>
                <xsl:value-of select="."/>
              </p>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
