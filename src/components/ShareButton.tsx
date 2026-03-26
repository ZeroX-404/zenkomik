"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title,
      text: `Baca komik "${title}" di ZENKOMIK.`,
      url,
    };

    try {
      const nav: any = navigator;

      if (typeof nav?.share === "function") {
        await nav.share(shareData);
        return;
      }

      if (typeof nav?.clipboard?.writeText === "function") {
        await nav.clipboard.writeText(url);
      } else {
        const el = document.createElement("textarea");
        el.value = url;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.top = "0";
        el.style.left = "0";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore share/copy errors
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 bg-[#151515] border border-gray-800 rounded-xl hover:border-blue-500 transition group text-sm font-bold"
    >
      {copied ? (
        <Check className="text-green-500" size={18} />
      ) : (
        <Share2 className="group-hover:text-blue-500" size={18} />
      )}
      <span>{copied ? "Link Disalin!" : "Share"}</span>
    </button>
  );
}
