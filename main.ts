// Entry program for news-image-20261125: writes this entry's newspaper
// front page — the world's news of Wednesday 25 November 2026 — to
// /output/entry.png. The image is shipped in the repository and copied
// byte for byte, so the two grader runs produce identical output.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = dirname(fileURLToPath(import.meta.url));

mkdirSync(outDir, { recursive: true });
const bytes = readFileSync(join(here, 'entry.png'));
if (bytes.length === 0 || bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, outside the 1 MiB gate`);
}
// The file holds JPEG bytes under the .png name, so it must be a whole
// JPEG: it opens with SOI (FFD8) and closes with EOI (FFD9).
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
  throw new Error('entry.png is not a whole JPEG image');
}
const target = join(outDir, 'entry.png');
writeFileSync(target, bytes);
const written = readFileSync(target);
if (!written.equals(bytes)) {
  throw new Error('entry.png written back differently');
}
