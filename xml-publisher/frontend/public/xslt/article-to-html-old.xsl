<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/article">
    <html>
      <head>
        <title>
          <xsl:value-of select="metadata/title"/>
        </title>
      </head>
      <body>
        <h1><xsl:value-of select="metadata/title"/></h1>
        <p>
          <strong>Author:</strong>
          <xsl:value-of select="metadata/author"/>
        </p>
        <p>
          <strong>Date:</strong>
          <xsl:value-of select="metadata/date"/>
        </p>

        <hr />

        <xsl:for-each select="content/paragraph">
          <p>
            <xsl:value-of select="."/>
          </p>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
