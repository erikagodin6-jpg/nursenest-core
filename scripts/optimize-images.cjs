const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS = [
  'screenshot2_1773379293573',
  'screenshot3_1773379293573',
  'screenshot5_1773379293573',
  'screenshot6_1773379293573',
  'screenshot9_1773379293573',
  'screenshot10_1773379293573',
  'screenshot11_1773379293573',
  'screenshottest_1773379293573',
];

const SIZES = [480, 768, 1200];
const THUMB_SIZES = [160, 240];
const QUALITY = 75;

const inputDir = path.resolve(__dirname, '..', 'attached_assets');
const outputDir = path.resolve(__dirname, '..', 'client', 'public', 'screenshots');

fs.mkdirSync(outputDir, { recursive: true });

async function processImage(name) {
  const inputPath = path.join(inputDir, `${name}.jpg`);
  const img = sharp(inputPath);
  const metadata = await img.metadata();

  for (const width of SIZES) {
    if (width > metadata.width) continue;
    const outputPath = path.join(outputDir, `${name}-${width}w.webp`);
    await sharp(inputPath)
      .resize(width)
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    const stat = fs.statSync(outputPath);
    console.log(`  ${path.basename(outputPath)}: ${(stat.size / 1024).toFixed(1)}KB`);
  }

  const fullPath = path.join(outputDir, `${name}-full.webp`);
  await sharp(inputPath)
    .webp({ quality: QUALITY })
    .toFile(fullPath);
  const stat = fs.statSync(fullPath);
  console.log(`  ${path.basename(fullPath)}: ${(stat.size / 1024).toFixed(1)}KB`);

  for (const thumbWidth of THUMB_SIZES) {
    const thumbPath = path.join(outputDir, `${name}-thumb-${thumbWidth}w.webp`);
    await sharp(inputPath)
      .resize(thumbWidth)
      .webp({ quality: 65 })
      .toFile(thumbPath);
    const thumbStat = fs.statSync(thumbPath);
    console.log(`  ${path.basename(thumbPath)}: ${(thumbStat.size / 1024).toFixed(1)}KB`);
  }
}

async function main() {
  console.log('Optimizing homepage screenshots...');
  for (const name of SCREENSHOTS) {
    console.log(`Processing ${name}...`);
    await processImage(name);
  }
  console.log('Done!');
}

main().catch(console.error);
