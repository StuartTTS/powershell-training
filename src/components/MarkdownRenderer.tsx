"use client";

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  // Simple markdown renderer for lesson content
  // Handles: headings, code blocks, blockquotes (key concepts), paragraphs, inline code
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
        <pre
          key={key++}
          className="my-4 overflow-x-auto rounded-lg bg-zinc-800 p-4"
        >
          <code className="text-sm text-zinc-200">
            {codeLines.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="mb-4 mt-8 text-2xl font-bold">
          {line.slice(2)}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mb-3 mt-6 text-xl font-semibold">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mb-2 mt-4 text-lg font-semibold">
          {line.slice(4)}
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
      elements.push(
        <blockquote
          key={key++}
          className="my-4 border-l-4 border-blue-500 bg-blue-900/20 py-2 pl-4 pr-4 text-sm text-blue-200"
        >
          <InlineMarkdown text={quoteLines.join(" ")} />
        </blockquote>
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
      <p key={key++} className="mb-3 leading-relaxed text-zinc-300">
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function InlineMarkdown({ text }: { text: string }) {
  // Handle **bold**, `code`, and plain text
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code
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
          className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-blue-300"
        >
          {codeMatch![1]}
        </code>
      );
      remaining = remaining.slice(codeIndex + codeMatch![0].length);
    }
  }

  return <>{parts}</>;
}
