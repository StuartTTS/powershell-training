import Link from "next/link";
import { getModules } from "@/lib/content";

const MODULE_ICONS = [
  // Module 1: Fundamentals - terminal icon
  <svg key="1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>,
  // Module 2: Intermediate - code bracket icon
  <svg key="2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>,
  // Module 3: SharePoint - cloud icon
  <svg key="3" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
  </svg>,
];

const MODULE_GRADIENTS = [
  "from-blue-500/10 to-cyan-500/5",
  "from-violet-500/10 to-purple-500/5",
  "from-emerald-500/10 to-teal-500/5",
];

const MODULE_ACCENTS = [
  "text-blue-400",
  "text-violet-400",
  "text-emerald-400",
];

const MODULE_BORDERS = [
  "hover:border-blue-500/30",
  "hover:border-violet-500/30",
  "hover:border-emerald-500/30",
];

export default function Home() {
  const modules = getModules();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero header */}
      <header className="relative overflow-hidden border-b border-zinc-800/60">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="flex items-center gap-2.5 text-sm font-medium text-blue-400/80">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Interactive Learning
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
            PowerShell Training
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
            From zero to SharePoint admin. Learn PowerShell through hands-on
            exercises with instant feedback — no setup required.
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              3 modules
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
              23 lessons
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              70+ exercises
            </span>
          </div>
        </div>
      </header>

      {/* Module cards */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, idx) => (
            <Link
              key={mod.meta.slug}
              href={`/module/${mod.meta.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br ${MODULE_GRADIENTS[idx] || ""} p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${MODULE_BORDERS[idx] || ""} hover:-translate-y-0.5`}
            >
              {/* Module number badge */}
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/60 ${MODULE_ACCENTS[idx] || "text-blue-400"} transition-colors group-hover:bg-zinc-800`}>
                {MODULE_ICONS[idx]}
              </div>

              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Module {mod.meta.order}
              </div>
              <h2 className="text-lg font-semibold text-zinc-100 transition-colors group-hover:text-white">
                {mod.meta.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {mod.meta.description}
              </p>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {mod.lessons.length} lessons
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${MODULE_ACCENTS[idx] || "text-blue-400"} opacity-0 transition-opacity group-hover:opacity-100`}>
                  Start learning
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
