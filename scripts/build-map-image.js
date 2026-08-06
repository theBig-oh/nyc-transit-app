import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const SRC = 'unrendered-images/subway-map-blacked-out-land.png';
const ROUTE_SRC_DIR = 'unrendered-images/colored-routes';
const ROUTE_SRC_PREFIX = 'subway-map-outline-'; // -1.png ... -10.png, 1-indexed
const OUT_DIR = 'src/images';
const HALF_H = 144;
const TARGET_W = 250;
const TARGET_H = HALF_H * 2;

// Nearest-neighbor scale full source down to TARGET_W x TARGET_H so the
// whole map fits the two stacked containers, instead of cropping a corner.
function resize(src) {
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

function buildFromFile(srcPath, topName, bottomName) {
	const src = PNG.sync.read(fs.readFileSync(srcPath));
	const resized = resize(src);
	const topBuff = cropAndEncode(resized, 0, HALF_H);
	const bottomBuff = cropAndEncode(resized, HALF_H, HALF_H);
	writeMod(topName, topBuff, TARGET_W, HALF_H);
	writeMod(bottomName, bottomBuff, TARGET_W, HALF_H);
}

// base map (no route selected)
buildFromFile(SRC, 'mapPrimeTop', 'mapPrimeBottom');

// route-highlight variants — file suffix is 1-indexed, trainRoutesByColor
// (and therefore currentSelectItemIndex) is 0-indexed, so routeIndex = fileNum - 1
const routeIndices = [];
for (const file of fs.readdirSync(ROUTE_SRC_DIR)) {
	const m = file.match(new RegExp(`^${ROUTE_SRC_PREFIX}(\\d+)\\.png$`));
	if (!m) continue;
	const fileNum = Number(m[1]);
	const routeIndex = fileNum - 1;
	buildFromFile(
		path.join(ROUTE_SRC_DIR, file),
		`mapPrimeTopRoute${routeIndex}`,
		`mapPrimeBottomRoute${routeIndex}`
	);
	routeIndices.push(routeIndex);
}
routeIndices.sort((a, b) => a - b);

// manifest so map.ts doesn't need N hardcoded imports
const manifest =
	routeIndices.map(i =>
		`import { mapPrimeTopRoute${i}Width as t${i}W, mapPrimeTopRoute${i}Height as t${i}H, mapPrimeTopRoute${i}Bytes as t${i}B } from './mapPrimeTopRoute${i}';\n` +
		`import { mapPrimeBottomRoute${i}Width as b${i}W, mapPrimeBottomRoute${i}Height as b${i}H, mapPrimeBottomRoute${i}Bytes as b${i}B } from './mapPrimeBottomRoute${i}';`
	).join('\n') +
	`\n\nexport const routeMapImages: Record<number, { top: { width: number; height: number; bytes: number[] }; bottom: { width: number; height: number; bytes: number[] } }> = {\n` +
	routeIndices.map(i =>
		`  ${i}: { top: { width: t${i}W, height: t${i}H, bytes: t${i}B }, bottom: { width: b${i}W, height: b${i}H, bytes: b${i}B } },`
	).join('\n') +
	`\n};\n`;

fs.writeFileSync(path.join(OUT_DIR, 'routeMapsIndex.ts'), manifest);
