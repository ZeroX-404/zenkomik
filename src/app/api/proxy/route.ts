import { isIP } from "node:net";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

function getAllowedHosts() {
  const raw = process.env.KOMIK_PROXY_ALLOWED_HOSTS || "";
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedHostname(hostname: string) {
  const allowList = getAllowedHosts();
  if (!allowList.length) return true;

  const host = hostname.toLowerCase();
  return allowList.some((pattern) => {
    if (!pattern) return false;
    if (pattern.startsWith("*.")) {
      const base = pattern.slice(2);
      return host === base || host.endsWith(`.${base}`);
    }
    if (pattern.startsWith(".")) {
      const base = pattern.slice(1);
      return host === base || host.endsWith(`.${base}`);
    }
    return host === pattern;
  });
}

function getRefererHosts() {
  const raw = process.env.KOMIK_PROXY_REFERER_HOSTS || "";
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

function shouldApplyRefererFor(hostname: string) {
  const hosts = getRefererHosts();
  if (!hosts.length) return true;

  const host = hostname.toLowerCase();
  return hosts.some((pattern) => {
    if (!pattern) return false;
    if (pattern.startsWith("*.")) {
      const base = pattern.slice(2);
      return host === base || host.endsWith(`.${base}`);
    }
    if (pattern.startsWith(".")) {
      const base = pattern.slice(1);
      return host === base || host.endsWith(`.${base}`);
    }
    return host === pattern;
  });
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map((p) => Number.parseInt(p, 10));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return false;

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  return false;
}

function isPrivateIpv6(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "::1" || host === "::") return true;
  if (host.startsWith("fe80:")) return true; // link-local
  if (host.startsWith("fc") || host.startsWith("fd")) return true; // ULA
  return false;
}

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".local")) return true;

  const ipVersion = isIP(host);
  if (ipVersion === 4) return isPrivateIpv4(host);
  if (ipVersion === 6) return isPrivateIpv6(host);
  return false;
}

function fallbackRefererFor(url: URL) {
  const host = url.hostname.toLowerCase();
  if (host.endsWith("westmanga.blog")) return "https://westmanga.blog/";
  if (host.endsWith("westmanga.tv")) return "https://westmanga.tv/";
  return `${url.origin}/`;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return new Response("No URL", { status: 400 });

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return new Response("Invalid protocol", { status: 400 });
  }

  if (!url.hostname || isBlockedHostname(url.hostname)) {
    return new Response("Blocked host", { status: 403 });
  }

  if (!isAllowedHostname(url.hostname)) {
    return new Response("Host not allowed", { status: 403 });
  }

  const userAgent = String(process.env.KOMIK_PROXY_USER_AGENT || DEFAULT_UA).trim() || DEFAULT_UA;
  const configuredReferer = String(process.env.KOMIK_PROXY_REFERER || "").trim();
  const referer =
    configuredReferer && shouldApplyRefererFor(url.hostname)
      ? configuredReferer
      : fallbackRefererFor(url);
  const origin = (() => {
    try {
      return new URL(referer).origin;
    } catch {
      return url.origin;
    }
  })();

  const upstream = await fetch(url.toString(), {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      "User-Agent": userAgent,
      Referer: referer,
      Origin: origin,
    },
  });

  if (!upstream.ok) {
    return new Response("Upstream error", { status: upstream.status });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");

  return new Response(upstream.body, { status: 200, headers });
}
