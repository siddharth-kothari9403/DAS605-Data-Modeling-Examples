export async function transformXML(xmlString, xslPath) {
    const parser = new DOMParser();
  
    const xml = parser.parseFromString(xmlString, "text/xml");
  
    const xslText = await fetch(xslPath).then(res => res.text());
    const xsl = parser.parseFromString(xslText, "text/xml");
  
    const processor = new XSLTProcessor();
    processor.importStylesheet(xsl);
  
    return processor.transformToFragment(xml, document);
  }
  