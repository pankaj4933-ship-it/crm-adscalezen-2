const fs = require("fs");
const path = require("path");

const files = [
  {
    src: "/Users/macbookpro/.gemini/antigravity-ide/brain/caad7fb6-fdba-47db-be7d-16c3ba209647/.user_uploaded/media_1790662037029.jpg",
    dest: path.join(__dirname, "pankaj-swami.jpg"),
  },
  {
    src: "/Users/macbookpro/.gemini/antigravity-ide/brain/caad7fb6-fdba-47db-be7d-16c3ba209647/.user_uploaded/media_1790662037621.jpg",
    dest: path.join(__dirname, "adscalezen-logo.jpg"),
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
