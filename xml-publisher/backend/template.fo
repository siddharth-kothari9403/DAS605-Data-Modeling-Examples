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
          <fo:region-body 
            margin-top="1cm"
            margin-bottom="1cm"
            background-color="#f5f5f5"/>
        </fo:simple-page-master>
      </fo:layout-master-set>

      <fo:page-sequence master-reference="A4">
        <fo:flow flow-name="xsl-region-body">

          <fo:block 
            background-color="#ffffff"
            padding="30pt"
            margin="0pt"
            border="0.5pt solid #e0e0e0">

            <fo:block 
              font-family="Helvetica, Arial, sans-serif"
              font-size="24pt" 
              font-weight="bold" 
              color="#333333"
              space-after="15pt"
              line-height="1.3">
              <xsl:value-of select="metadata/title"/>
            </fo:block>

            <fo:block 
              font-family="Helvetica, Arial, sans-serif"
              font-size="10pt" 
              color="#666666"
              space-after="20pt">
              <fo:inline font-weight="bold">Author: </fo:inline>
              <xsl:value-of select="metadata/author"/>
              <fo:inline padding-left="15pt" padding-right="15pt">  </fo:inline>
              <fo:inline font-weight="bold">  Date: </fo:inline>
              <xsl:value-of select="metadata/date"/>
            </fo:block>

            <fo:block 
              space-after="20pt"
              border-top="1pt solid #dddddd"
              padding-top="0pt">
            </fo:block>

            <xsl:for-each select="content/paragraph">
              <fo:block 
                font-family="Helvetica, Arial, sans-serif"
                font-size="11pt" 
                line-height="1.6" 
                color="#444444"
                space-after="15pt"
                text-align="justify">
                <xsl:value-of select="."/>
              </fo:block>
            </xsl:for-each>

          </fo:block>

        </fo:flow>
      </fo:page-sequence>
    </fo:root>

  </xsl:template>
</xsl:stylesheet>