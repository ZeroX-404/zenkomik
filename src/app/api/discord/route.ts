import { NextResponse } from "next/server";
import { notifyDiscord } from "@/lib/discord";

export async function POST(req: Request) {
  const secret = (process.env.DISCORD_WEBHOOK_SECRET || "").trim();
  if (secret) {
    const provided = (req.headers.get("x-zenkomik-secret") || "").trim();
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const { comicTitle, chapterNum, slug, image, url, type, genres, mention } = body as any;
  await notifyDiscord({ comicTitle, chapterNum, slug, image, url, type, genres, mention });

  return NextResponse.json({ ok: true });
}
