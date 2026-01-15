<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/article">
    <rss version="2.0">
      <channel>
        <title>
          <xsl:value-of select="metadata/title"/>
        </title>

        <description>
          News article feed
        </description>

        <link>
          http://localhost:5173
        </link>

        <item>
          <title>
            <xsl:value-of select="metadata/title"/>
          </title>

          <author>
            <xsl:value-of select="metadata/author"/>
          </author>

          <pubDate>
            <xsl:value-of select="metadata/date"/>
          </pubDate>

          <description>
            <xsl:for-each select="content/paragraph">
              <xsl:value-of select="."/>
              <xsl:text> </xsl:text>
            </xsl:for-each>
          </description>
        </item>
      </channel>
    </rss>
  </xsl:template>

</xsl:stylesheet>
