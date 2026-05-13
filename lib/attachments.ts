import mammoth from "mammoth";
import * as XLSX from "xlsx";
import type Anthropic from "@anthropic-ai/sdk";
import { IdeaAttachment } from "./db";
import { downloadAttachmentBytes } from "./storage";

const MAX_TEXT_CHARS_PER_FILE = 40_000;

export function isPdfMime(mime: string) {
  return mime === "application/pdf";
}
export function isDocxMime(mime: string) {
  return mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
}
export function isXlsxMime(mime: string) {
  return mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}
export function isImageMime(mime: string) {
  return mime === "image/png" || mime === "image/jpeg";
}

async function docxToText(buf: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer: buf });
  return value;
}

function xlsxToText(buf: Buffer): string {
  const wb = XLSX.read(buf, { type: "buffer" });
  const parts: string[] = [];
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
    if (csv.trim()) {
      parts.push(`### Hárok: ${sheetName}\n${csv}`);
    }
  }
  return parts.join("\n\n");
}

function truncate(text: string, max = MAX_TEXT_CHARS_PER_FILE): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + `\n\n[…obsah skrátený, originál mal ${text.length} znakov]`;
}

/**
 * Build Anthropic content blocks for a list of attachments.
 * PDFs and images are sent as native document/image blocks; docx/xlsx are
 * parsed to text and inlined as text blocks.
 */
export async function attachmentsToContentBlocks(
  attachments: IdeaAttachment[]
): Promise<Anthropic.ContentBlockParam[]> {
  const blocks: Anthropic.ContentBlockParam[] = [];

  for (const att of attachments) {
    const bytes = await downloadAttachmentBytes(att.storage_path);

    if (isPdfMime(att.mime)) {
      blocks.push({
        type: "text",
        text: `### Príloha: ${att.filename} (PDF)`,
      });
      blocks.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: bytes.toString("base64"),
        },
      });
    } else if (isImageMime(att.mime)) {
      blocks.push({
        type: "text",
        text: `### Príloha: ${att.filename} (obrázok)`,
      });
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: att.mime as "image/png" | "image/jpeg",
          data: bytes.toString("base64"),
        },
      });
    } else if (isDocxMime(att.mime)) {
      const text = truncate(await docxToText(bytes));
      blocks.push({
        type: "text",
        text: `### Príloha: ${att.filename} (Word)\n\n${text}`,
      });
    } else if (isXlsxMime(att.mime)) {
      const text = truncate(xlsxToText(bytes));
      blocks.push({
        type: "text",
        text: `### Príloha: ${att.filename} (Excel, CSV reprezentácia)\n\n${text}`,
      });
    } else {
      blocks.push({
        type: "text",
        text: `### Príloha: ${att.filename} (nepodporovaný typ ${att.mime}, ignorované)`,
      });
    }
  }

  return blocks;
}
