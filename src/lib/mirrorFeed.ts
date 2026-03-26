import "server-only";

import type { ComicCardData } from "@/lib/api";
import { mapMirrorFallbackRows } from "@/lib/mirrorFallback";

function getMirrorContentsEndpoint(): string | null {
  const raw =
    process.env.MIRROR_CONTENTS_ENDPOINT ||
    process.env.NEXT_PUBLIC_MIRROR_CONTENTS_ENDPOINT ||
    "";
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    // eslint-disable-next-line no-new
    new URL(trimmed);
    return trimmed;
  } catch {
    return null;
  }
}

export async function fetchMirrorContentsFeed(source?: string): Promise<ComicCardData[]> {
  const endpoint = getMirrorContentsEndpoint();
  if (!endpoint) return [];
  let url = endpoint;

  const safeSource = typeof source === "string" ? source.trim() : "";
  if (safeSource) {
    try {
      const u = new URL(endpoint);
      u.searchParams.set("source", safeSource);
      url = u.toString();
    } catch {
      const sep = endpoint.includes("?") ? "&" : "?";
      url = `${endpoint}${sep}source=${encodeURIComponent(safeSource)}`;
    }
  }

  let timeout: ReturnType<typeof setTimeout> | null = null;
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) return [];
    const json: unknown = await res.json();
    return mapMirrorFallbackRows(json);
  } catch {
    return [];
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function fetchMirrorFeed(source?: string): Promise<ComicCardData[]> {
  return fetchMirrorContentsFeed(source);
}
