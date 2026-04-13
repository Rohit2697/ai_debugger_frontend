import { useState } from "react";
export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    async function doCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    }
    return (
        <button
            onClick={doCopy}
            className="inline-flex items-center rounded px-2 py-1 text-xs bg-slate-700/60 hover:bg-slate-700/80"
            aria-label="Copy code"
        >
            {copied ? "Copied" : "Copy"}
        </button>
    );
}