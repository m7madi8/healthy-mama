/** على الاستضافة (Vercel وغيرها) redirect أوثق من popup مع Google. */
export function preferRedirectSignIn(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return false;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return false;
  return true;
}
