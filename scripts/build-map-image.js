import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const SRC = 'unrendered-images/subway-map-boro-outline-black-routes.png';
const OUT_DIR = 'src/images';
const HALF_H = 144;
const TARGET_W = 250;
const TARGET_H = HALF_H * 2;

const src = PNG.sync.read(fs.readFileSync(SRC));

// Nearest-neighbor scale full source down to TARGET_W x TARGET_H so the
// whole map fits the two stacked containers, instead of cropping a corner.
function resize(target) {
	const out = new PNG({ width: TARGET_W, height: TARGET_H });
	for (let y = 0; y < TARGET_H; y++) {
		const srcY = Math.min(src.height - 1, Math.floor(y * src.height / TARGET_H));
		for (let x = 0; x < TARGET_W; x++) {
			const srcX = Math.min(src.width - 1, Math.floor(x * src.width / TARGET_W));
			const srcIndex = (srcY * src.width + srcX) << 2;
			const destIndex = (y * TARGET_W + x) << 2;

			out.data[destIndex] = src.data[srcIndex]
			out.data[destIndex + 1] = src.data[srcIndex + 1]
			out.data[destIndex + 2] = src.data[srcIndex + 2]
			out.data[destIndex + 3] = src.data[srcIndex + 3]
		}
	}
	return out;
}

function cropAndEncode(resized, yOffset, height) {
	const out = new PNG({
		width: TARGET_W,
		height
	})

	for (let x=0; x < height; x++) {
		for (let y=0; y < TARGET_W; y++) {
			const srcIndex = ((yOffset + x) * TARGET_W + y) << 2;
			const  destIndex = (x * TARGET_W + y) << 2;

			out.data[destIndex] = resized.data[srcIndex]
      		out.data[destIndex + 1] = resized.data[srcIndex + 1]
      		out.data[destIndex + 2] = resized.data[srcIndex + 2]
      		out.data[destIndex + 3] = resized.data[srcIndex + 3]
		}
	}

	return PNG.sync.write(out);
}

function writeMod(name, buff, width, height) {
	const bytes = Array.from(buff);
	const content = 
	    `export const ${name}Width = ${width}\n` +
    	`export const ${name}Height = ${height}\n` +
    	`export const ${name}Bytes: number[] = [${bytes.join(',')}]\n`;
    fs.writeFileSync(path.join(OUT_DIR, `${name}.ts`), content);
}

const resized = resize();
const topBuff = cropAndEncode(resized, 0, HALF_H);
const bottomBuff = cropAndEncode(resized, HALF_H, HALF_H);

writeMod('mapPrimeTop', topBuff, TARGET_W, HALF_H);
writeMod('mapPrimeBottom', bottomBuff, TARGET_W, HALF_H);

