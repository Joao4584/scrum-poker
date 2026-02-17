export function normalizeApiImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (!url.startsWith("/")) return `/backend/${url}`;
  return `/backend${url}`;
}
