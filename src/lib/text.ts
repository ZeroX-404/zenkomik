export type ParsedSynopsis = {
  synopsis: string;
  credit?: string;
};

function decodeHtmlEntities(text: string) {
  const named: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };

  let out = text;

  // Hex entities: &#x20;
  out = out.replace(/&#x([0-9a-fA-F]+);?/g, (_m, hex: string) => {
    const codePoint = Number.parseInt(hex, 16);
    if (!Number.isFinite(codePoint)) return _m;
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return _m;
    }
  });

  // Decimal entities: &#32;
  out = out.replace(/&#(\d+);?/g, (_m, dec: string) => {
    const codePoint = Number.parseInt(dec, 10);
    if (!Number.isFinite(codePoint)) return _m;
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return _m;
    }
  });

  // Named entities (common)
  out = out.replace(/&(nbsp|amp|lt|gt|quot|apos);?/g, (_m, name: string) => named[name] ?? _m);

  return out;
}

function unescapeMarkdown(text: string) {
  // Unescape common markdown escapes: \* \_ \< \> \[ \]
  return text.replace(/\\([\\`*_~<>\[\](){}#+\-.!])/g, "$1");
}

function stripMarkdownArtifacts(text: string) {
  let out = text;

  // Remove emphasis markers that commonly leak as raw text.
  out = out.replace(/\*\*\*/g, "");
  out = out.replace(/\*\*/g, "");
  out = out.replace(/___/g, "");
  out = out.replace(/__/g, "");
  out = out.replace(/~~/g, "");
  out = out.replace(/```/g, "");

  // Remove single * / _ when used as emphasis wrappers (best-effort).
  out = out.replace(/(^|[\s(])\*([^*\n]+?)\*(?=[\s).,!?:;]|$)/g, "$1$2");
  out = out.replace(/(^|[\s(])_([^_\n]+?)_(?=[\s).,!?:;]|$)/g, "$1$2");

  return out;
}

function normalizeRawText(text: string) {
  let out = text.replace(/\r\n/g, "\n").replace(/\u00a0/g, " ");
  out = decodeHtmlEntities(out);
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = unescapeMarkdown(out);
  out = stripMarkdownArtifacts(out);
  return out;
}

function cleanupLines(text: string) {
  const normalized = normalizeRawText(text);
  return normalized
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parseSynopsis(raw: unknown): ParsedSynopsis {
  const text = typeof raw === "string" ? raw : "";
  let out = normalizeRawText(text);

  // Some providers prepend a credit line like:
  // [Oleh Author yang mengerjakan <...>]
  // or: Oleh Author ...
  // We extract it (if it appears at the very beginning), then clean the rest.
  let credit: string | undefined;

  const bracketMatch = out.match(/^\s*\[([^\]]*(?:oleh|author)[^\]]*)\]\s*(?:\n+|$)/i);
  if (bracketMatch) {
    credit = cleanupLines(bracketMatch[1]);
    out = out.slice(bracketMatch[0].length);
  } else {
    const plainMatch = out.match(/^\s*((?:oleh|author)\b[^\n]*)\s*(?:\n+|$)/i);
    if (plainMatch) {
      credit = cleanupLines(plainMatch[1]);
      out = out.slice(plainMatch[0].length);
    }
  }

  const synopsis = cleanupLines(out);
  return credit ? { synopsis, credit } : { synopsis };
}

export function normalizeSynopsis(raw: unknown): string {
  return parseSynopsis(raw).synopsis;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
