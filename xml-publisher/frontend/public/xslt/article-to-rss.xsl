<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" encoding="UTF-8"/>

  <xsl:template match="/article">
    <rss version="2.0">
      <channel>

        <title>
          <xsl:value-of select="metadata/title"/>
        </title>

        <description>News article feed</description>

        <link>http://localhost:5173</link>

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

          <!-- RSS description as embedded HTML -->
          <description>
            <xsl:text disable-output-escaping="yes"><![CDATA[
]]></xsl:text>

            <xsl:for-each select="content/block">

              <!-- Headings -->
              <xsl:if test="@type='heading'">
                <xsl:text disable-output-escaping="yes"><![CDATA[
<p><strong>]]></xsl:text>

                <xsl:value-of select="."/>

                <xsl:text disable-output-escaping="yes"><![CDATA[
</strong></p>
]]></xsl:text>
              </xsl:if>

              <!-- Paragraphs -->
              <xsl:if test="@type='paragraph'">
                <xsl:text disable-output-escaping="yes"><![CDATA[
<p>]]></xsl:text>

                <xsl:value-of select="."/>

                <xsl:text disable-output-escaping="yes"><![CDATA[
</p>
]]></xsl:text>
              </xsl:if>

              <!-- Images -->
              <xsl:if test="@type='image'">
                <xsl:text disable-output-escaping="yes"><![CDATA[
<img src="]]></xsl:text>

                <xsl:value-of select="@src"/>

                <xsl:if test="@alt">
                  <xsl:text disable-output-escaping="yes"><![CDATA[" alt="]]></xsl:text>
                  <xsl:value-of select="@alt"/>
                </xsl:if>

                <xsl:text disable-output-escaping="yes"><![CDATA[" />
]]></xsl:text>
              </xsl:if>

            </xsl:for-each>

            <xsl:text disable-output-escaping="yes"><![CDATA[
]]></xsl:text>
          </description>

        </item>
      </channel>
    </rss>
  </xsl:template>

</xsl:stylesheet>
