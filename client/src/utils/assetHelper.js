// Resolves public assets to either Google Cloud Storage (or custom CDN) or local assets folder.
// Controlled via VITE_IMAGE_BASE_URL (e.g. "https://storage.googleapis.com/my-bucket")

const RAW_BASE = import.meta.env.VITE_IMAGE_BASE_URL || "https://storage.googleapis.com/sonicprints-assets";
export const IMAGE_BASE_URL = RAW_BASE.trim().replace(/\/+$/, "");

/**
 * Returns the fully qualified URL for an asset path.
 * If path is already an absolute URL (http, https, data:), returns it unchanged.
 * If VITE_IMAGE_BASE_URL is configured, prepends it.
 * Otherwise returns the local relative path.
 *
 * @param {string} path - E.g. "/assets/img/mini.jpg" or "assets/img/mini.jpg"
 * @returns {string}
 */
export function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return IMAGE_BASE_URL ? `${IMAGE_BASE_URL}${cleanPath}` : cleanPath;
}
