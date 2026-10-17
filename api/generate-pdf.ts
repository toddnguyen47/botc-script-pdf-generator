import { renderCharacterSheet } from "../backend/src/renderer";
import { gzipSync } from "node:zlib";
import {
  getBrowser,
  corsHeaders,
  handleApiRequest,
} from "../backend/src/api-utils";

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

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${htmlFilename}"`,
          ...corsHeaders(origin),
        },
      });
    });
  },
};
