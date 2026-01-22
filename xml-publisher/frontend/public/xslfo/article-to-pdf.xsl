<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:fo="http://www.w3.org/1999/XSL/Format">

  <xsl:template match="/article">

    <fo:root>
      <fo:layout-master-set>
        <fo:simple-page-master
          master-name="A4"
          page-height="29.7cm"
          page-width="21cm"
          margin-top="2cm"
          margin-bottom="2cm"
          margin-left="2cm"
          margin-right="2cm">

          <fo:region-body margin-top="1cm" margin-bottom="1cm"/>
        </fo:simple-page-master>
      </fo:layout-master-set>

      <fo:page-sequence master-reference="A4">
        <fo:flow flow-name="xsl-region-body">

          <fo:block
            background-color="#ffffff"
            padding="30pt"
            border="0.5pt solid #e0e0e0">

            <!-- Title -->
            <fo:block
              font-family="Helvetica, Arial, sans-serif"
              font-size="24pt"
              font-weight="bold"
              color="#333333"
              space-after="15pt">
              <xsl:value-of select="metadata/title"/>
            </fo:block>

            <!-- Metadata -->
            <fo:block
              font-family="Helvetica, Arial, sans-serif"
              font-size="10pt"
              color="#666666"
              space-after="20pt">
              <fo:inline font-weight="bold">Author:</fo:inline>
              <xsl:text> </xsl:text>
              <xsl:value-of select="metadata/author"/>
              <fo:inline padding-left="15pt"/>
              <fo:inline font-weight="bold">  Date:</fo:inline>
              <xsl:text> </xsl:text>
              <xsl:value-of select="metadata/date"/>
            </fo:block>

            <!-- Table of Contents -->
            <fo:block
            font-family="Helvetica, Arial, sans-serif"
            font-size="18pt"
            font-weight="bold"
            space-after="15pt">
            Contents
            </fo:block>

            <fo:table
            width="100%"
            table-layout="fixed"
            font-family="Helvetica, Arial, sans-serif"
            font-size="11pt">

            <fo:table-column column-width="85%"/>
            <fo:table-column column-width="15%"/>

            <fo:table-body>

              <xsl:for-each select="content/block[@type='heading']">
                <fo:table-row>

                  <!-- Heading text -->
                  <fo:table-cell>
                    <fo:block>
                      <xsl:value-of select="@text"/>
                      <fo:leader leader-pattern="dots"/>
                    </fo:block>
                  </fo:table-cell>

                  <!-- Page number -->
                  <fo:table-cell>
                    <fo:block text-align="right">
                      <fo:page-number-citation ref-id="h{position()}"/>
                    </fo:block>
                  </fo:table-cell>

                </fo:table-row>
              </xsl:for-each>

            </fo:table-body>
            </fo:table>

            <fo:block border-top="1pt solid #dddddd" space-after="20pt"/>


            <!-- Content -->
            <xsl:for-each select="content/block">
              <xsl:choose>

                <!-- Headings -->
                <xsl:when test="@type='heading'">
                  <fo:block
                    id="h{count(preceding-sibling::block[@type='heading']) + 1}"
                    font-family="Helvetica, Arial, sans-serif"
                    font-weight="bold"
                    space-before="20pt"
                    space-after="10pt">

                    <xsl:attribute name="font-size">
                      <xsl:choose>
                        <xsl:when test="@level='1'">18pt</xsl:when>
                        <xsl:when test="@level='2'">16pt</xsl:when>
                        <xsl:when test="@level='3'">14pt</xsl:when>
                        <xsl:otherwise>14pt</xsl:otherwise>
                      </xsl:choose>
                    </xsl:attribute>

                    <xsl:value-of select="@text"/>
                  </fo:block>
                </xsl:when>

                <!-- Paragraphs (strip <p>...</p>) -->
                <xsl:when test="@type='paragraph'">
                  <fo:block
                    font-family="Helvetica, Arial, sans-serif"
                    font-size="11pt"
                    line-height="1.6"
                    color="#444444"
                    space-after="15pt"
                    text-align="justify">

                    <xsl:value-of
                      select="substring-before(substring-after(., '&lt;p&gt;'), '&lt;/p&gt;')"/>

                  </fo:block>
                </xsl:when>

                <!-- Images -->
                <xsl:when test="@type='image'">
                  <fo:block
                    space-before="15pt"
                    space-after="15pt"
                    text-align="center">
                    <fo:external-graphic
                      src="{@src}"
                      content-width="scale-to-fit"
                      width="100%"
                      scaling="uniform"/>
                  </fo:block>
                </xsl:when>

              </xsl:choose>
            </xsl:for-each>

          </fo:block>

        </fo:flow>
      </fo:page-sequence>
    </fo:root>

  </xsl:template>
</xsl:stylesheet>
