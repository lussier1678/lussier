import fs from "fs";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const port = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.static(publicDir));

app.get("*", (req, res) => {
  const requestPath = String(req.path || "/").replace(/^\/+/, "");
  const safePath = requestPath.replace(/\\/g, "/");
  const directFile = path.join(publicDir, safePath);
  const htmlFile = safePath.endsWith(".html") ? directFile : path.join(publicDir, safePath + ".html");
  const folderIndex = path.join(publicDir, safePath, "index.html");

  if (safePath && fs.existsSync(directFile) && fs.statSync(directFile).isFile()) {
    return res.sendFile(directFile);
  }
  if (safePath && fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
    return res.sendFile(htmlFile);
  }
  if (safePath && fs.existsSync(folderIndex) && fs.statSync(folderIndex).isFile()) {
    return res.sendFile(folderIndex);
  }
  return res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`lussier static host running on port ${port}`);
});
