import { renderCharacterSheet } from "../backend/src/renderer";
import { gzipSync } from "node:zlib";
import JSZip from "jszip";
import {
  getBrowser,
  corsHeaders,
  handleApiRequest,
} from "../backend/src/api-utils";
import {
  ParsedScript,
  ScriptOptions,
} from "../packages/botc-character-sheet/dist/types";

export default {
  async fetch(request: Request): Promise<Response> {
    return handleApiRequest(request, async (body, origin) => {
      const { script, options, filename, nightOrders } = body;

      // Generate HTML with the character sheet
      const html = renderCharacterSheet(
        script,
        options,
        nightOrders || { first: [], other: [] },
        origin || undefined,
      );

      const htmlFilename = filename
        ? filename.replace(/\.pdf$/i, ".html")
        : "script.html";

      const pdf = await generatePdf(html, options, script);
      const myZip = new JSZip();
      myZip.file(htmlFilename, html);
      myZip.file(htmlFilename.replace(/\.html$/i, ".pdf"), pdf);
      const zippedFile = await myZip.generateAsync({ type: "arraybuffer" });
      const zipName = htmlFilename.replace(/\.html$/i, ".zip");

      return new Response(zippedFile, {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${zipName}"`,
          "Content-Length": zippedFile.byteLength.toString(),
          ...corsHeaders(origin),
        },
      });
    });
  },
};

async function generatePdf(
  html: string,
  options: ScriptOptions,
  script: ParsedScript,
) {
  // Launch Puppeteer
  const browser = await getBrowser();

  const page = await browser.newPage();

  page.on("request", (req) => {
    console.log("request:", req.url());
  });

  page.on("response", (response) => {
    console.log("response:", response.url(), response.status());
  });

  page.on("requestfailed", (req) => {
    console.log(req.url() + " " + req.failure()?.errorText);
  });

  // Set content and wait for fonts/images to load
  await page.setContent(html, {
    waitUntil: ["networkidle0", "load"],
  });

  const format =
    options.dimensions.height === 297 && options.dimensions.width === 210
      ? "A4"
      : "Letter";

  // Generate PDF
  let startTime = Date.now();
  const pdf = await page.pdf({
    format,
    printBackground: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    landscape: options.teensy ? true : false,
    preferCSSPageSize: true,
    waitForFonts: true,
    timeout: 60_000,
  });
  let endTime = Date.now();
  console.log(
    `PDF generated in ${endTime - startTime} ms (${options.numberOfCharacterSheets} character sheets, ${script.characters.length} characters)`,
  );

  browser.close();

  return pdf;
}
