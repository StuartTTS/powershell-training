"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

// Dynamically import Monaco to avoid SSR issues (window is not defined)
const Editor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[160px] bg-[#0c0c0f] text-zinc-500 text-sm rounded-lg border border-zinc-700/50">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-500" />
        Loading editor...
      </div>
    </div>
  ),
});

let monacoConfigured = false;

function configureMonaco() {
  if (monacoConfigured) return;
  monacoConfigured = true;

  import("@monaco-editor/react").then(({ loader }) => {
    loader.init().then((monaco) => {
      if (!monaco.languages.getLanguages().some((l: { id: string }) => l.id === "powershell")) {
        monaco.languages.register({ id: "powershell" });

        monaco.languages.setMonarchTokensProvider("powershell", {
          defaultToken: "",
          ignoreCase: true,

          keywords: [
            "begin", "break", "catch", "class", "continue", "data", "define",
            "do", "dynamicparam", "else", "elseif", "end", "enum", "exit",
            "filter", "finally", "for", "foreach", "from", "function", "if",
            "in", "param", "process", "return", "switch", "throw", "trap",
            "try", "until", "using", "var", "while", "workflow", "parallel",
            "sequence", "inlinescript", "configuration",
          ],

          tokenizer: {
            root: [
              // Comments
              [/#.*$/, "comment"],
              [/<#/, "comment", "@comment"],

              // Strings
              [/"/, "string", "@doubleString"],
              [/'/, "string", "@singleString"],

              // Here-strings
              [/@"$/, "string", "@hereDoubleString"],
              [/@'$/, "string", "@hereSingleString"],

              // Variables
              [/\$(?:true|false|null|_)\b/, "variable.predefined"],
              [/\$[A-Za-z_]\w*/, "variable"],
              [/\$\{[^}]+\}/, "variable"],

              // Type literals
              [/\[[A-Za-z_][\w.]*\]/, "type"],

              // Cmdlets (Verb-Noun pattern)
              [/[A-Z][a-zA-Z]*-[A-Z][a-zA-Z]*/, "keyword.cmdlet"],

              // Parameters
              [/-[A-Za-z]\w*/, "attribute"],

              // Numbers
              [/\b\d+(\.\d+)?\b/, "number"],
              [/0x[0-9A-Fa-f]+/, "number.hex"],

              // Operators
              [
                /-(?:eq|ne|gt|ge|lt|le|like|notlike|match|notmatch|contains|notcontains|in|notin|replace|split|join|and|or|not|xor|band|bor|bnot|bxor|is|isnot|as|f)\b/,
                "operator",
              ],

              // Pipeline
              [/\|/, "delimiter.pipe"],

              // Keywords
              [
                /\b[a-zA-Z_]\w*\b/,
                {
                  cases: {
                    "@keywords": "keyword",
                    "@default": "identifier",
                  },
                },
              ],

              // Brackets
              [/[{}()\[\]]/, "delimiter.bracket"],
              [/[;,.]/, "delimiter"],

              // Assignment and other operators
              [/[=+\-*/%!~<>&^|?@]/, "operator"],
            ],

            comment: [
              [/[^#]+/, "comment"],
              [/#>/, "comment", "@pop"],
              [/#/, "comment"],
            ],

            doubleString: [
              [/\$[A-Za-z_]\w*/, "variable"],
              [/\$\([^)]*\)/, "variable"],
              [/`["`nrtba0efv]/, "string.escape"],
              [/[^"$`]+/, "string"],
              [/"/, "string", "@pop"],
            ],

            singleString: [
              [/[^']+/, "string"],
              [/''/, "string.escape"],
              [/'/, "string", "@pop"],
            ],

            hereDoubleString: [
              [/\$[A-Za-z_]\w*/, "variable"],
              [/^"@/, "string", "@pop"],
              [/./, "string"],
            ],

            hereSingleString: [
              [/^'@/, "string", "@pop"],
              [/./, "string"],
            ],
          },
        } as Parameters<typeof monaco.languages.setMonarchTokensProvider>[1]);
      }

      // Define custom dark theme
      monaco.editor.defineTheme("ps-training-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "string", foreground: "CE9178" },
          { token: "string.escape", foreground: "D7BA7D" },
          { token: "variable", foreground: "9CDCFE" },
          { token: "variable.predefined", foreground: "4EC9B0" },
          { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
          { token: "keyword.cmdlet", foreground: "DCDCAA" },
          { token: "operator", foreground: "D4D4D4" },
          { token: "number", foreground: "B5CEA8" },
          { token: "number.hex", foreground: "B5CEA8" },
          { token: "type", foreground: "4EC9B0" },
          { token: "attribute", foreground: "9CDCFE" },
          { token: "delimiter.pipe", foreground: "FFD700", fontStyle: "bold" },
          { token: "delimiter.bracket", foreground: "DA70D6" },
          { token: "delimiter", foreground: "D4D4D4" },
          { token: "identifier", foreground: "D4D4D4" },
        ],
        colors: {
          "editor.background": "#0c0c0f",
          "editor.foreground": "#D4D4D4",
          "editorCursor.foreground": "#60a5fa",
          "editor.lineHighlightBackground": "#18181b",
          "editor.selectionBackground": "#264f78",
          "editorLineNumber.foreground": "#3f3f46",
          "editorLineNumber.activeForeground": "#71717a",
          "editorWidget.background": "#18181b",
          "editorWidget.border": "#27272a",
          "editorSuggestWidget.background": "#18181b",
          "editorSuggestWidget.border": "#27272a",
          "editorSuggestWidget.selectedBackground": "#27272a",
          "input.background": "#18181b",
          "input.border": "#27272a",
          "focusBorder": "#3b82f6",
          "editor.selectionHighlightBackground": "#264f7830",
        },
      });
    });
  });
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function PowerShellEditor({
  value,
  onChange,
  readOnly = false,
  height = "160px",
}: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    configureMonaco();
  }, []);

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  // Fallback to textarea on mobile
  if (isMobile) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder="Type your PowerShell here..."
        className="w-full rounded-lg border border-zinc-700/50 bg-[#0c0c0f] px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
        rows={6}
        spellCheck={false}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700/50 bg-[#0c0c0f]">
      <Editor
        height={height}
        defaultLanguage="powershell"
        theme="ps-training-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineHeight: 22,
          fontFamily: "var(--font-geist-mono), 'Cascadia Code', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "gutter",
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            vertical: "hidden",
            horizontal: "auto",
            useShadows: false,
          },
          wordWrap: "on",
          tabSize: 4,
          insertSpaces: true,
          autoIndent: "full",
          formatOnPaste: false,
          formatOnType: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off",
          quickSuggestions: false,
          parameterHints: { enabled: false },
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          contextmenu: false,
          renderWhitespace: "selection",
        }}
        onMount={handleMount}
      />
    </div>
  );
}
