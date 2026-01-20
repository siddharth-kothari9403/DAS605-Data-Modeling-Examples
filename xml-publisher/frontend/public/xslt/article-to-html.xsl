<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

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
          h1, h2, h3, h4, h5, h6 {
            margin-top: 20px;
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
          hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 20px 0;
          }
          .toc {
            background: #fafafa;
            padding: 15px;
            border: 1px solid #ddd;
            margin-bottom: 25px;
          }
          .toc h3 {
            margin-top: 0;
          }
          .toc ul {
            padding-left: 20px;
          }
          .toc li {
            margin-bottom: 6px;
          }
          .content img {
            max-width: 100%;
            margin: 15px 0;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <!-- Article title -->
          <h1>
            <xsl:value-of select="metadata/title"/>
          </h1>

          <!-- Metadata -->
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

          <hr/>

          <!-- Table of Contents -->
          <div class="toc">
            <h3>Contents</h3>
            <ul>
              <xsl:for-each select="content/block[@type='heading']">
                <li>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:text>#h</xsl:text>
                      <xsl:number count="content/block[@type='heading']" level="any"/>
                    </xsl:attribute>
                    <xsl:value-of select="." disable-output-escaping="yes"/>
                  </a>
                </li>
              </xsl:for-each>
            </ul>
          </div>

          <!-- Article Content -->
          <div class="content">
            <xsl:for-each select="content/block">
              <xsl:choose>
          
                <!-- Heading with dynamic level -->
                <xsl:when test="@type='heading'">
                  <xsl:variable name="level" select="@level"/>
                  <xsl:element name="h{$level}">
                    <xsl:attribute name="id">
                      <xsl:text>h</xsl:text>
                      <xsl:number count="content/block[@type='heading']" level="any"/>
                    </xsl:attribute>
                    <xsl:value-of select="." disable-output-escaping="yes"/>
                  </xsl:element>
                </xsl:when>
          
                <!-- Paragraph -->
                <xsl:when test="@type='paragraph'">
                  <xsl:value-of select="." disable-output-escaping="yes"/>
                </xsl:when>
          
                <!-- Image -->
                <xsl:when test="@type='image'">
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="@src"/>
                    </xsl:attribute>
                    <xsl:attribute name="alt">
                      <xsl:value-of select="@alt"/>
                    </xsl:attribute>
                  </img>
                </xsl:when>
          
              </xsl:choose>
            </xsl:for-each>
          </div>

        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
