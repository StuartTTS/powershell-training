import Link from "next/link";
import { getModules } from "@/lib/content";

export default function Home() {
  const modules = getModules();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight">
            PowerShell Training
          </h1>
          <p className="mt-2 text-zinc-400">
            From zero to SharePoint admin — learn PowerShell interactively.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.meta.slug}
              href={`/module/${mod.meta.slug}`}
              className="group rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50"
            >
              <div className="mb-3 text-sm font-medium text-blue-400">
                Module {mod.meta.order}
              </div>
              <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white">
                {mod.meta.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {mod.meta.description}
              </p>
              <div className="mt-4 text-xs text-zinc-500">
                {mod.lessons.length} lessons
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
