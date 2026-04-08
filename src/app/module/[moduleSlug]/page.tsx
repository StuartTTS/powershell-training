import Link from "next/link";
import { notFound } from "next/navigation";
import { getModules, getModuleBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getModules().map((m) => ({ moduleSlug: m.meta.slug }));
}

interface Props {
  params: Promise<{ moduleSlug: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { moduleSlug } = await params;
  const mod = getModuleBySlug(moduleSlug);

  if (!mod) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="relative border-b border-zinc-800/60">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            All Modules
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {mod.meta.title}
              </h1>
              <p className="mt-0.5 text-sm text-zinc-400">
                {mod.meta.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Lesson list */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <ol className="space-y-3">
          {mod.lessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={`/module/${moduleSlug}/${lesson.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-5 py-4 transition-all duration-200 hover:border-zinc-700/60 hover:bg-zinc-800/40 hover:shadow-lg hover:shadow-black/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 text-sm font-semibold text-zinc-400 transition-colors group-hover:bg-blue-500/15 group-hover:text-blue-300">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-zinc-200 transition-colors group-hover:text-white">
                    {lesson.title}
                  </div>
                  <div className="mt-0.5 text-sm text-zinc-500">
                    {lesson.description}
                  </div>
                </div>
                <svg className="h-5 w-5 text-zinc-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
