// Helper to resolve public assets correctly in both local dev and production (e.g. GitHub Pages subpaths)
export const asset = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};
