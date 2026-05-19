import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = join(__dirname, '..', 'public', 'photos');
const DIST_DIR = join(__dirname, '..', 'dist', 'photos');

const MAX_WIDTH = 800;
const THUMB_WIDTH = 400;
const WEBP_QUALITY = 65;

async function optimizePhoto(filePath, name) {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  // Main optimized version
  const main = sharp(filePath)
    .resize({ width: Math.min(metadata.width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY });

  // Thumbnail for blur-up placeholder
  const thumb = sharp(filePath)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 50 });

  const mainOutput = join(PHOTOS_DIR, `${name}.webp`);
  const thumbOutput = join(PHOTOS_DIR, `${name}-thumb.webp`);

  await Promise.all([
    main.toFile(mainOutput),
    thumb.toFile(thumbOutput),
  ]);

  const mainStat = await stat(mainOutput);
  const thumbStat = await stat(thumbOutput);
  const origStat = await stat(filePath);

  console.log(`${name}:`);
  console.log(`  Original:  ${(origStat.size / 1024 / 1024).toFixed(1)}MB (${metadata.width}x${metadata.height})`);
  console.log(`  Main:      ${(mainStat.size / 1024).toFixed(0)}KB (${Math.min(metadata.width, MAX_WIDTH)}px wide, webp q${WEBP_QUALITY})`);
  console.log(`  Thumbnail: ${(thumbStat.size / 1024).toFixed(0)}KB (${THUMB_WIDTH}px wide)`);
}

async function main() {
  const files = await readdir(PHOTOS_DIR);
  const jpgs = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

  console.log(`Found ${jpgs.length} JPEG(s) to optimize\n`);

  for (const file of jpgs) {
    const name = file.replace(/\.(jpe?g|png)$/i, '');
    await optimizePhoto(join(PHOTOS_DIR, file), name);
  }

  console.log('\nDone. Optimized images saved to public/photos/');
}

main().catch(console.error);
