import { useState } from "preact/hooks";
import {
  NetworkPayload,
  NightOrders,
  ParsedScript,
  ScriptOptions,
} from "botc-character-sheet";
import { PDFDocument } from "pdf-lib";
import { downloadBlob } from "../utils/downloadFile";
import JSZip from "jszip";

export function usePdfGeneration() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [scriptHtmlUrl, setScriptHtmlUrl] = useState<string | null>(null)
  const [zippedBlob, setZippedBlob] = useState<Blob | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const generatePDF = async (
    script: ParsedScript,
    options: ScriptOptions,
    nightOrders: NightOrders,
  ) => {
    // Show modal and reset state
    setShowPdfModal(true);
    setPdfLoading(true);
    setScriptHtmlUrl(null);
    setZippedBlob(null);
    setPdfError(null);

    const payload: NetworkPayload = {
      script,
      options,
      nightOrders,
      filename: `${script.metadata?.name || "script"}.pdf`,
    };

    try {
      const apiUrl = import.meta.env.VITE_PDF_API_URL || "";
      const response = await fetch(`${apiUrl}/api/generate-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }
      const blob = await response.blob();
      const zippedFiles = await unzipAll(blob);
      const newZip = new JSZip();

      for (const [filename, blob] of Object.entries(zippedFiles)) {
        if (filename.toLocaleLowerCase().endsWith(".html")) {
          newZip.file(filename, blob);
          const blobWithType = new Blob([blob], {
            type: "text/html",
          });
          const url = URL.createObjectURL(blobWithType);
          setScriptHtmlUrl(url);
        } else if (filename.toLocaleLowerCase().endsWith(".pdf")) {
          const addedPageBlob = await possiblyAddExtraPages(blob, options);
          newZip.file(filename, addedPageBlob);
        }
      }

      const zippedFile = await newZip.generateAsync({ type: "blob" });
      setZippedBlob(zippedFile);
      setPdfLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfError(
        "Failed to generate PDF. Please try the browser print option instead.",
      );
      setPdfLoading(false);
    }
  };

  const downloadPDF = (scriptName?: string) => {
    if (!zippedBlob) return;
    downloadBlob(zippedBlob, `${scriptName || "script"}.zip`);
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setZippedBlob(null);
    setPdfError(null);

    // Clean up the blob URL
    if (scriptHtmlUrl) {
      URL.revokeObjectURL(scriptHtmlUrl);
      setScriptHtmlUrl(null);
    }
  };

  return {
    showPdfModal,
    pdfLoading,
    scriptHtmlUrl,
    pdfError,
    generatePDF,
    downloadPDF,
    closePdfModal,
  };
}

async function possiblyAddExtraPages(
  blob: Blob,
  options: ScriptOptions,
): Promise<Blob> {
  if (options.teensy || options.numberOfCharacterSheets <= 1) {
    return blob;
  }

  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  if (options.overleaf === "none") {
    const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [1]);
    for (let i = 1; i < options.numberOfCharacterSheets; i++) {
      pdfDoc.insertPage(1, copiedPage);
    }
  } else {
    const [sheet, back] = await pdfDoc.copyPages(pdfDoc, [0, 1]);
    for (let i = 1; i < options.numberOfCharacterSheets; i++) {
      pdfDoc.insertPage(2, back);
      pdfDoc.insertPage(2, sheet);
    }
  }

  const modifiedBytes = await pdfDoc.save();
  const buffer = new ArrayBuffer(modifiedBytes.byteLength);
  new Uint8Array(buffer).set(modifiedBytes);
  return new Blob([buffer], { type: "application/pdf" });
}

async function unzipAll(blob: Blob): Promise<Record<string, Blob>> {
  const zip = await JSZip.loadAsync(blob);
  const files: Record<string, Blob> = {};

  await Promise.all(
    Object.values(zip.files).map(async (file) => {
      if (file.dir) return;

      files[file.name] = await file.async("blob");
    }),
  );

  return files;
}
