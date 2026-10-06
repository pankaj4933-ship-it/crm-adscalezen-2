import fs from "node:fs";
import path from "node:path";

const currentDir = "/Users/macbookpro/.gemini/antigravity-ide/brain/3b5f18e9-8418-4d83-8716-80b84430a69f/.user_uploaded";
const legacyDir = "/Users/macbookpro/.gemini/antigravity-ide/brain/caad7fb6-fdba-47db-be7d-16c3ba209647/.user_uploaded";

const faviconSrc = path.join(currentDir, "media_1791310635558.jpg");
const logoSrc = fs.existsSync(faviconSrc) ? faviconSrc : path.join(legacyDir, "media_1790666156598.jpg");
const founderSrc = path.join(legacyDir, "media_1790666171980.jpg");

const publicDir = path.join(process.cwd(), "public");
const appDir = path.join(process.cwd(), "src", "app");
const libDir = path.join(process.cwd(), "src", "lib");

if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, path.join(publicDir, "favicon.png"));
  fs.copyFileSync(faviconSrc, path.join(publicDir, "favicon.ico"));
  fs.copyFileSync(faviconSrc, path.join(publicDir, "apple-touch-icon.png"));
  fs.copyFileSync(faviconSrc, path.join(publicDir, "adscalezen-favicon.png"));
  fs.copyFileSync(faviconSrc, path.join(publicDir, "adscalezen-logo.png"));
  fs.copyFileSync(faviconSrc, path.join(publicDir, "adscalezen-logo.jpg"));
  fs.copyFileSync(faviconSrc, path.join(appDir, "icon.png"));
  fs.copyFileSync(faviconSrc, path.join(appDir, "apple-icon.png"));
  fs.copyFileSync(faviconSrc, path.join(appDir, "favicon.ico"));
  console.log("Copied ASZ logo/favicon to public/ and src/app/ folders.");
}

if (fs.existsSync(founderSrc)) {
  fs.copyFileSync(founderSrc, path.join(publicDir, "pankaj-swami.jpg"));
  console.log("Copied founder to public/pankaj-swami.jpg");
}

if (fs.existsSync(logoSrc)) {
  const logoB64 = fs.readFileSync(logoSrc).toString("base64");
  const founderB64 = fs.existsSync(founderSrc) ? fs.readFileSync(founderSrc).toString("base64") : "";

  const tsContent = `// Auto-generated fallback data URIs for AdScale Zen brand assets
export const ADSCALEZEN_LOGO_B64 = "data:image/png;base64,${logoB64}";
export const ADSCALEZEN_FAVICON_B64 = "data:image/png;base64,${logoB64}";
export const FOUNDER_PHOTO_B64 = "data:image/jpeg;base64,${founderB64}";
`;

  fs.writeFileSync(path.join(libDir, "brand-assets.ts"), tsContent);
  console.log("Generated src/lib/brand-assets.ts successfully!");
}
