const fs = require("fs");
const path = require("path");

const currentDir = "/Users/macbookpro/.gemini/antigravity-ide/brain/3b5f18e9-8418-4d83-8716-80b84430a69f/.user_uploaded";
const legacyDir = "/Users/macbookpro/.gemini/antigravity-ide/brain/caad7fb6-fdba-47db-be7d-16c3ba209647/.user_uploaded";

const faviconSrc = path.join(currentDir, "media_1791310635558.jpg");

const files = [
  {
    src: path.join(legacyDir, "media_1790666171980.jpg"),
    dest: path.join(__dirname, "pankaj-swami.jpg"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "favicon.png"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "favicon.ico"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "apple-touch-icon.png"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "adscalezen-favicon.png"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "adscalezen-logo.png"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "adscalezen-logo.jpg"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "../src/app/icon.png"),
  },
  {
    src: faviconSrc,
    dest: path.join(__dirname, "../src/app/favicon.ico"),
  },
];

files.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${dest}`);
  } else {
    console.log(`Source not found: ${src}`);
  }
});
