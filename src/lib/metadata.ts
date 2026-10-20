/**
 * 站点基础 URL，用于 metadata、sitemap 与 robots。
 *
 * 优先级：
 *   1. NEXT_PUBLIC_SITE_URL —— 自定义域名（推荐在 Netlify 环境变量里设置）
 *   2. URL / DEPLOY_PRIME_URL —— Netlify 在构建时自动注入的站点地址
 *   3. VERCEL_PROJECT_PRODUCTION_URL —— 兼容原有 Vercel 部署
 *   4. 本地开发地址
 */
function normalize(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

const detectedUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

const baseUrl = detectedUrl
  ? normalize(detectedUrl).replace(/\/$/, "")
  : process.env.NODE_ENV === "production"
    ? "https://javaistic.netlify.app"
    : "http://localhost:3000";

export { baseUrl };
