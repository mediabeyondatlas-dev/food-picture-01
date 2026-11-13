// food-picture-01 entry (Node 22, standard library only): the picture is the
// entry.png beside this file — a photorealistic steaming ramen bowl generated
// fresh for this entry — and the program copies it to /output/entry.png.
// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024 pixels,
// and the judge sees exactly the bytes copied.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const outPath = join(outDir, 'entry.png');
copyFileSync(new URL('./entry.png', import.meta.url), outPath);

// Validate what was written: the gate takes a whole PNG or JPEG of at most
// 1 MiB and at most 1024 by 1024 pixels, so fail loudly instead of shipping
// a file the gate would refuse.
const buf = readFileSync(outPath);
if (buf.length > 1048576) throw new Error(`entry.png too large: ${buf.length} bytes`);
const dims = dimensions(buf);
if (dims.width > 1024 || dims.height > 1024) throw new Error(`entry.png too big: ${dims.width}x${dims.height}`);
console.log(`wrote entry.png: ${buf.length} bytes, ${dims.width}x${dims.height}`);

// Read width/height from a PNG IHDR chunk or a JPEG start-of-frame segment.
// Standard library only; throws on data that is neither.
function dimensions(b) {
  if (b.length >= 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) throw new Error('bad JPEG marker');
      const marker = b[i + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  throw new Error('entry.png is neither PNG nor JPEG');
}
