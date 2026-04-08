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
      <header className="border-b border-zinc-800 px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            &larr; All Modules
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {mod.meta.title}
          </h1>
          <p className="mt-1 text-zinc-400">{mod.meta.description}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <ol className="space-y-3">
          {mod.lessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={`/module/${moduleSlug}/${lesson.slug}`}
                className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-300">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium text-zinc-100">
                    {lesson.title}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {lesson.description}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
