/**
 * Get the base path for public assets
 * In GitHub Pages, basePath is "/heap-of-foods-recipe-book"
 * Locally, basePath is empty
 */
export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
