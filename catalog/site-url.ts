/**
 * Base URL for absolute links. SITE_URL wins; otherwise Vercel's automatic
 * URLs apply, so a deployment works with no configuration.
 */
export function getSiteUrl(): string {
  const { SITE_URL, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL } = process.env;
  const vercelHost = VERCEL_PROJECT_PRODUCTION_URL || VERCEL_URL;
  const url =
    SITE_URL || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

  return url.replace(/\/+$/, "");
}

/** Turns a site-relative path into an absolute URL. Absolute URLs pass through. */
export function toAbsoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${getSiteUrl()}${path}`;
}

/**
 * Strips this site's origin so pages load their own assets relative to the
 * current host. URLs on other hosts pass through.
 */
export function toSitePath(url: string): string {
  const siteUrl = getSiteUrl();
  return url.startsWith(`${siteUrl}/`) ? url.slice(siteUrl.length) : url;
}
