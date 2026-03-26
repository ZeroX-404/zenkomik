export type CloudSyncType = "bookmarks" | "history";

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/+$/, ""), anonKey };
}

async function getSupabaseUserId(config: SupabaseConfig, accessToken: string) {
  const res = await fetch(`${config.url}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: any = await res.json().catch(() => null);
  const id = json?.id;
  return typeof id === "string" && id ? id : null;
}

export async function syncToCloud(opts: {
  accessToken: string;
  type: CloudSyncType;
  content: unknown;
  userId?: string;
}) {
  const config = getSupabaseConfig();
  if (!config) return { ok: false as const, error: "Supabase env not configured" };

  const token = String(opts.accessToken || "").trim();
  if (!token) return { ok: false as const, error: "Missing access token" };

  const userId = String(opts.userId || "").trim() || (await getSupabaseUserId(config, token));
  if (!userId) return { ok: false as const, error: "Missing user id" };

  const payload = [
    {
      user_id: userId,
      data_type: opts.type,
      content: opts.content,
      updated_at: new Date().toISOString(),
    },
  ];

  const res = await fetch(`${config.url}/rest/v1/user_data?on_conflict=user_id,data_type`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, error: text || `HTTP ${res.status}` };
  }

  return { ok: true as const, userId };
}

export async function fetchFromCloud(opts: {
  accessToken: string;
  type: CloudSyncType;
  userId?: string;
}) {
  const config = getSupabaseConfig();
  if (!config) return { ok: false as const, error: "Supabase env not configured" };

  const token = String(opts.accessToken || "").trim();
  if (!token) return { ok: false as const, error: "Missing access token" };

  const userId = String(opts.userId || "").trim() || (await getSupabaseUserId(config, token));
  if (!userId) return { ok: false as const, error: "Missing user id" };

  const qs = new URLSearchParams();
  qs.set("select", "content,updated_at");
  qs.set("user_id", `eq.${userId}`);
  qs.set("data_type", `eq.${opts.type}`);
  qs.set("limit", "1");

  const res = await fetch(`${config.url}/rest/v1/user_data?${qs.toString()}`, {
    headers: {
      apikey: config.anonKey,
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, error: text || `HTTP ${res.status}` };
  }

  const json: any = await res.json().catch(() => null);
  const row = Array.isArray(json) ? json[0] : null;
  return { ok: true as const, userId, content: row?.content ?? null, updatedAt: row?.updated_at };
}

