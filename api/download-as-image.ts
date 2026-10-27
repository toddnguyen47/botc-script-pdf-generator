import { renderCharacterSheet } from "../backend/src/renderer";
import {
  getBrowser,
  corsHeaders,
  handleApiRequest,
} from "../backend/src/api-utils";

export default {
  async fetch(request: Request): Promise<Response> {
    return handleApiRequest(request, async (body, origin) => {
      const { script, options, nightOrders, characterReplacement } = body;

      // Force options to render both character sheet and info sheet
      const renderOptions = {
        ...options,
        numberOfCharacterSheets: 1,
        overleaf: "infoSheet" as const,
        showNightSheet: false,
      };

      // Generate HTML with the character sheet
      const html = renderCharacterSheet(
        script,
        renderOptions,
        nightOrders || { first: [], other: [] },
        characterReplacement,
        origin || undefined,
      );

      // Launch Puppeteer
      const browser = await getBrowser();
      const page = await browser.newPage();

      page.on("requestfailed", (req) => {
        console.log(req.url() + " " + req.failure()?.errorText);
      });

      // Set content and wait for fonts/images to load
      // 1. Injected HTML is parsed immediately
      await page.setContent(html, { waitUntil: "load" });

      // 2. Explicitly wait for any external images/CSS/fonts to settle
      await page.waitForNetworkIdle({ idleTime: 500, concurrency: 0 });

      // Calculate dimensions in pixels (assuming 96 DPI)
      const widthMm = options.dimensions.width;
      const heightMm = options.dimensions.height;
      const widthPx = Math.round((widthMm / 25.4) * 96 * 2); // 2x for higher resolution
      const heightPx = Math.round((heightMm / 25.4) * 96 * 2);

      await page.setViewport({
        width: widthPx,
        height: heightPx,
        deviceScaleFactor: 2,
      });

      // Take screenshot of character sheet (first printable page)
      const characterSheetElement = await page.$(".printable-page");
      let characterSheetImage: Buffer | null = null;

      if (characterSheetElement) {
        const image = await characterSheetElement.screenshot({
          type: "png",
          omitBackground: false,
        });
        characterSheetImage = Buffer.from(image);
      }

      // Take screenshot of info sheet (second printable page)
      const printablePages = await page.$$(".printable-page");
      let infoSheetImage: Buffer | null = null;

      if (printablePages.length > 1) {
        const image = await printablePages[1].screenshot({
          type: "png",
          omitBackground: false,
        });
        infoSheetImage = Buffer.from(image);
      }

      await browser.close();

      // Return both images as JSON with base64 encoded data
      const response = {
        characterSheet: characterSheetImage
          ? characterSheetImage.toString("base64")
          : null,
        infoSheet: infoSheetImage ? infoSheetImage.toString("base64") : null,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(origin),
        },
      });
    });
  },
};
