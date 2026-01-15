import express from "express";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.text({ type: "*/*" }));

app.post("/generate-pdf", (req, res) => {
  const xmlPath = "./temp.xml";
  const foPath = "./template.fo";
  const pdfPath = "./article.pdf";
  const fopPath = '/opt/fop/fop/fop';

  fs.writeFileSync(xmlPath, req.body);
  fs.copyFileSync(
    "../frontend/public/xslfo/article-to-pdf.xsl",
    foPath
  );

  exec(
    `${fopPath} -xml ${xmlPath} -xsl ${foPath} -pdf ${pdfPath}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error("FOP STDERR:\n", stderr);
        res.status(500).send(stderr);
        return;
      }
  
      res.download(pdfPath, "article.pdf");
    }
  );  
});

app.listen(3001, () =>
  console.log("PDF server running on port 3001")
);
