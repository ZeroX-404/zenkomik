import "server-only";

import { slugify } from "@/lib/text";

type NotifyDiscordParams = {
  comicTitle: string;
  chapterNum: string | number;
  slug?: string;
  image?: string;
  url?: string;
  type?: string;
  genres?: string[] | string;
  mention?: string;
};

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

function toAbsoluteUrl(value: unknown, baseUrl: string) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  try {
    return new URL(raw).toString();
  } catch {
    // ignore
  }

  try {
    return new URL(raw, baseUrl).toString();
  } catch {
    return null;
  }
}

function buildAllowedMentions(mention: string | undefined) {
  const raw = String(mention ?? "").trim();
  const allowed: { parse: string[]; roles?: string[] } = { parse: [] };
  if (!raw) return allowed;

  if (raw.includes("@everyone")) allowed.parse.push("everyone");
  if (raw.includes("@here")) allowed.parse.push("here");

  const roleIds = Array.from(raw.matchAll(/<@&(\d{5,})>/g))
    .map((m) => m[1])
    .filter(Boolean);
  if (roleIds.length) allowed.roles = roleIds.slice(0, 10);

  return allowed;
}

function toGenresText(input: string[] | string | undefined) {
  if (!input) return null;
  if (Array.isArray(input)) {
    const list = input.map((g) => String(g).trim()).filter(Boolean);
    if (!list.length) return null;
    return list.slice(0, 8).join(", ");
  }
  const s = String(input).trim();
  return s ? s : null;
}

export async function notifyDiscord(params: NotifyDiscordParams) {
  const webhookUrl = (process.env.DISCORD_WEBHOOK_URL || "").trim();
  if (!webhookUrl) return;

  const title = String(params.comicTitle || "").trim();
  const chapterText = String(params.chapterNum ?? "").trim();
  if (!title || !chapterText) return;

  const safeSlug = params.slug ? String(params.slug) : slugify(title);
  const site = getSiteUrl().replace(/\/+$/, "");
  const fallbackUrl = `${site}/series/${encodeURIComponent(safeSlug)}/chapter-${encodeURIComponent(
    chapterText
  )}`;
  const targetUrl = String(params.url || "").trim() || fallbackUrl;
  const logoUrl = `${site}/icon-192x192.png`;

  const mention = String(params.mention ?? "").trim();
  const allowed_mentions = buildAllowedMentions(mention);
  const content = mention ? `📢 **NEW RELEASE DI ZENKOMIK!** ${mention}` : undefined;

  const coverUrl = toAbsoluteUrl(params.image, site);
  const typeValue = String(params.type || "").trim() || "Komik";
  const typeLower = typeValue.toLowerCase();
  const color =
    typeLower === "manhua"
      ? 0xef4444
      : typeLower === "manga"
        ? 0xf97316
        : typeLower === "manhwa"
          ? 0x3b82f6
          : 0x3b82f6;
  const genresText = toGenresText(params.genres) || "—";

  const payload = {
    username: "ZENKOMIK UPDATER",
    avatar_url: logoUrl,
    content,
    allowed_mentions,
    embeds: [
      {
        title: `🚀 ${title} — Chapter ${chapterText}`,
        description: `Chapter terbaru **${title}** sudah tersedia. Baca sekarang dengan kualitas HD tanpa iklan hanya di ZENKOMIK!`,
        url: targetUrl,
        color,
        thumbnail: { url: logoUrl },
        fields: [
          { name: "🏷️ Type", value: typeValue, inline: true },
          { name: "🎭 Genre", value: genresText, inline: true },
        ],
        image: coverUrl ? { url: coverUrl } : undefined,
        footer: { text: "ZENKOMIK • Experience the art of reading", icon_url: logoUrl },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}
