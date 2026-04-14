function extractGoogleDriveFileId(url: string): string | null {
  // https://drive.google.com/file/d/<id>/view?...
  const fileMatch = url.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\/?/i);
  if (fileMatch?.[1]) return fileMatch[1];

  // https://drive.google.com/open?id=<id>
  const openMatch = url.match(/https?:\/\/drive\.google\.com\/open\?id=([^&]+)/i);
  if (openMatch?.[1]) return openMatch[1];

  // Any Drive URL containing ?id=<id>
  const idParamMatch = url.match(/[?&]id=([^&]+)/i);
  if (idParamMatch?.[1]) return idParamMatch[1];

  return null;
}

/**
 * Converts a Google Drive sharing URL into a URL that tends to work reliably in <img>.
 *
 * Why thumbnail?
 * - The `uc?export=view` variant sometimes returns HTML or redirects in ways that break image rendering.
 * - The thumbnail endpoint consistently returns an actual image response when the file is public.
 */
export function toGoogleDriveDirectImageUrl(rawUrl: string): string {
  const url = rawUrl.trim();
  if (!url) return "";

  const id = extractGoogleDriveFileId(url);
  if (id) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`;
  }

  return url;
}

