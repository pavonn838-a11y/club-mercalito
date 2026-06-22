"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download } from "lucide-react";

export function BranchTools({ url, slug }: { url: string; slug: string }) {
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 900,
      margin: 2,
      color: {
        dark: "#2b2118",
        light: "#fff4df"
      }
    }).then(setQr);
  }, [url]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 text-sm font-black text-merca-ink"
      >
        <Copy className="h-4 w-4 text-merca-green" />
        {copied ? "Copiado" : "Copiar link"}
      </button>
      {qr ? (
        <a
          href={qr}
          download={`qr-club-mercalito-${slug}.png`}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-merca-orange px-3 text-sm font-black text-white"
        >
          <Download className="h-4 w-4" />
          QR PNG
        </a>
      ) : null}
    </div>
  );
}
