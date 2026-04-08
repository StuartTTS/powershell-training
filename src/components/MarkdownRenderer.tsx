"use client";

import { useState } from "react";

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <CodeBlock key={key++} code={codeLines.join("\n")} language={lang} />
      );
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={key++}
          className="mb-4 mt-10 text-[28px] font-bold tracking-tight text-zinc-50 first:mt-0"
        >
          <InlineMarkdown text={line.slice(2)} />
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="mb-3 mt-8 text-xl font-semibold tracking-tight text-zinc-100"
        >
          <InlineMarkdown text={line.slice(3)} />
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="mb-2 mt-6 text-lg font-semibold text-zinc-200"
        >
          <InlineMarkdown text={line.slice(4)} />
        </h3>
      );
      i++;
      continue;
    }

    // Blockquotes (key concepts)
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      const text = quoteLines.join(" ");
      const isKeyConcept = text.startsWith("**Key Concept:**");

      elements.push(
        <div
          key={key++}
          className={`my-5 flex gap-3 rounded-xl border px-5 py-4 ${
            isKeyConcept
              ? "border-blue-500/15 bg-blue-500/5"
              : "border-zinc-700/30 bg-zinc-800/30"
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {isKeyConcept ? (
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            )}
          </div>
          <p className={`text-[15px] leading-relaxed ${isKeyConcept ? "text-blue-100/90" : "text-zinc-300"}`}>
            <InlineMarkdown text={text} />
          </p>
        </div>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraphs
    elements.push(
      <p key={key++} className="mb-4 text-[15px] leading-[1.7] text-zinc-300/90">
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group my-5 overflow-hidden rounded-xl border border-zinc-700/30 bg-[#0c0c0f]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/40 px-4 py-2">
        <span className="text-xs font-medium text-zinc-500">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-500 opacity-0 transition-all hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto px-5 py-4">
        <code className="text-[13px] leading-[1.7] text-zinc-200">{code}</code>
      </pre>
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);

    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const codeIndex = codeMatch ? remaining.indexOf(codeMatch[0]) : Infinity;

    if (boldIndex === Infinity && codeIndex === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIndex < codeIndex) {
      if (boldIndex > 0) {
        parts.push(remaining.slice(0, boldIndex));
      }
      parts.push(
        <strong key={key++} className="font-semibold text-zinc-100">
          {boldMatch![1]}
        </strong>
      );
      remaining = remaining.slice(boldIndex + boldMatch![0].length);
    } else {
      if (codeIndex > 0) {
        parts.push(remaining.slice(0, codeIndex));
      }
      parts.push(
        <code
          key={key++}
          className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[13px] font-medium text-blue-300/90"
        >
          {codeMatch![1]}
        </code>
      );
      remaining = remaining.slice(codeIndex + codeMatch![0].length);
    }
  }

  return <>{parts}</>;
}
