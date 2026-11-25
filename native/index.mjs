import { readFile, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import pngjs from "./vendor/pngjs/lib/png.js";

const { PNG } = pngjs;
const zoomLevels = new Map([["1×", 1], ["2×", 2], ["5×", 5]]);
const bytesPerPixel = 4;

function copyPixelBlocks(image, zoom) {
  const preview = new PNG({ width: image.width * zoom, height: image.height * zoom });
  const sourceRowBytes = image.width * bytesPerPixel;
  const previewRowBytes = preview.width * bytesPerPixel;
  const blockRowBytes = zoom * bytesPerPixel;

  for (let y = 0; y < image.height; y++) {
    const sourceRow = y * sourceRowBytes;
    const firstPreviewRow = y * zoom * previewRowBytes;

    for (let x = 0; x < image.width; x++) {
      const sourcePixel = sourceRow + x * bytesPerPixel;
      const previewPixel = firstPreviewRow + x * blockRowBytes;
      preview.data.fill(
        image.data.subarray(sourcePixel, sourcePixel + bytesPerPixel),
        previewPixel,
        previewPixel + blockRowBytes,
      );
    }

    for (let row = 1; row < zoom; row++) {
      preview.data.copy(
        preview.data,
        firstPreviewRow + row * previewRowBytes,
        firstPreviewRow,
        firstPreviewRow + previewRowBytes,
      );
    }
  }

  return preview;
}

export function activate(context) {
  context.registerCommand("previewPixels", async ({ params, inputs, output }, { signal }) => {
    const source = inputs.image?.[0];
    if (source?.contentType !== "image/png") {
      throw new Error("请连接一张 PNG 像素图。");
    }

    const zoom = zoomLevels.get(params.zoom);
    if (zoom === undefined) {
      throw new Error("请选择 1×、2× 或 5×。");
    }

    const original = await readFile(source.path, { signal });
    const image = PNG.sync.read(original);
    const preview = zoom === 1 ? original : PNG.sync.write(copyPixelBlocks(image, zoom));
    const file = `${parse(source.path).name}-preview-${zoom}x.png`;

    await writeFile(join(output, file), preview, { signal });
    return { file };
  });
}
