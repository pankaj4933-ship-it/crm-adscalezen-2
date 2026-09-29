import fs from "node:fs";
import path from "node:path";

const dir = "/Users/macbookpro/.gemini/antigravity-ide/brain/caad7fb6-fdba-47db-be7d-16c3ba209647/.user_uploaded";
const logoSrc = path.join(dir, "media_1790666156598.jpg");
const founderSrc = path.join(dir, "media_1790666171980.jpg");

const publicDir = path.join(process.cwd(), "public");

if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, path.join(publicDir, "adscalezen-logo.png"));
  fs.copyFileSync(logoSrc, path.join(publicDir, "adscalezen-logo.jpg"));
  console.log("Copied logo to public/adscalezen-logo.png and public/adscalezen-logo.jpg");
} else {
  console.error("Logo source not found:", logoSrc);
}

if (fs.existsSync(founderSrc)) {
  fs.copyFileSync(founderSrc, path.join(publicDir, "pankaj-swami.jpg"));
  console.log("Copied founder to public/pankaj-swami.jpg");
} else {
  console.error("Founder source not found:", founderSrc);
}

// Also generate base64 data URIs so the website NEVER fails to display them
if (fs.existsSync(logoSrc) && fs.existsSync(founderSrc)) {
  const logoB64 = fs.readFileSync(logoSrc).toString("base64");
  const founderB64 = fs.readFileSync(founderSrc).toString("base64");

  const tsContent = `// Auto-generated fallback data URIs for AdScale Zen brand assets
export const ADSCALEZEN_LOGO_B64 = "data:image/jpeg;base64,${logoB64}";
export const FOUNDER_PHOTO_B64 = "data:image/jpeg;base64,${founderB64}";
`;

  fs.writeFileSync(path.join(process.cwd(), "src", "lib", "brand-assets.ts"), tsContent);
  console.log("Generated src/lib/brand-assets.ts successfully!");
}
