import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { createGzip } from "node:zlib";

const root = resolve("out");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

try {
  await stat(resolve(root, "index.html"));
} catch {
  console.error("Run npm run build before starting the preview.");
  process.exit(1);
}

createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, "http://127.0.0.1");
    let path = resolve(root, "." + decodeURIComponent(pathname));
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
    const info = await stat(path);
    const extension = extname(path);
    const compressible = [".html", ".js", ".css", ".txt", ".json"].includes(extension);
    const gzip = compressible && /\bgzip\b/i.test(req.headers["accept-encoding"] || "");
    const headers = {
      "Content-Type": types[extension] || "application/octet-stream",
      "Cache-Control": pathname.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "no-cache",
    };
    if (compressible) headers.Vary = "Accept-Encoding";
    if (gzip) headers["Content-Encoding"] = "gzip";
    else headers["Content-Length"] = info.size;
    res.writeHead(200, headers);
    if (req.method === "HEAD") res.end();
    else if (gzip) createReadStream(path).pipe(createGzip()).pipe(res);
    else createReadStream(path).pipe(res);
  } catch {
    res.writeHead(404).end("Page not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`ASTRA preview at http://127.0.0.1:${port}`));
