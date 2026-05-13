import { supabaseAdmin } from "./db";

export const ATTACHMENTS_BUCKET = "idea-attachments";

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "image/png",
  "image/jpeg",
]);

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".png", ".jpg", ".jpeg"];

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_FILES_PER_IDEA = 10;

export function fileExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

export function isAllowedExtension(filename: string): boolean {
  return ALLOWED_EXTENSIONS.includes(fileExtension(filename));
}

export function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME_TYPES.has(mime);
}

export function buildStoragePath(ideaId: string, filename: string): string {
  const ext = fileExtension(filename);
  const safeBase = filename
    .slice(0, filename.length - ext.length)
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .slice(0, 80);
  return `${ideaId}/${Date.now()}-${crypto.randomUUID()}-${safeBase}${ext}`;
}

export async function uploadAttachment(opts: {
  path: string;
  body: ArrayBuffer | Buffer;
  contentType: string;
}): Promise<void> {
  const { error } = await supabaseAdmin()
    .storage.from(ATTACHMENTS_BUCKET)
    .upload(opts.path, opts.body, {
      contentType: opts.contentType,
      upsert: false,
    });
  if (error) throw error;
}

export async function createSignedDownloadUrl(
  path: string,
  expiresInSec = 60 * 60
): Promise<string> {
  const { data, error } = await supabaseAdmin()
    .storage.from(ATTACHMENTS_BUCKET)
    .createSignedUrl(path, expiresInSec);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteAttachment(path: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .storage.from(ATTACHMENTS_BUCKET)
    .remove([path]);
  if (error) throw error;
}

export async function downloadAttachmentBytes(path: string): Promise<Buffer> {
  const { data, error } = await supabaseAdmin()
    .storage.from(ATTACHMENTS_BUCKET)
    .download(path);
  if (error) throw error;
  return Buffer.from(await data.arrayBuffer());
}
