import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLesson,
  getAllLessonPaths,
  getModuleBySlug,
} from "@/lib/content";
import { LessonClient } from "@/components/LessonClient";

export function generateStaticParams() {
  return getAllLessonPaths();
}

interface Props {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = getLesson(moduleSlug, lessonSlug);
  const mod = getModuleBySlug(moduleSlug);

  if (!lesson || !mod) notFound();

  // Find current lesson index and next/prev
  const currentIndex = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? mod.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < mod.lessons.length - 1
      ? mod.lessons[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <Link
            href={`/module/${moduleSlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {mod.meta.title}
          </Link>

          {/* Lesson nav */}
          <div className="flex items-center gap-2">
            {prevLesson ? (
              <Link
                href={`/module/${moduleSlug}/${prevLesson.slug}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                title={prevLesson.title}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Link>
            ) : (
              <div className="h-8 w-8" />
            )}
            <span className="text-xs tabular-nums text-zinc-500">
              {currentIndex + 1} / {mod.lessons.length}
            </span>
            {nextLesson ? (
              <Link
                href={`/module/${moduleSlug}/${nextLesson.slug}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                title={nextLesson.title}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>
        </div>

        {/* Lesson title bar */}
        <div className="mx-auto max-w-4xl px-6 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {lesson.meta.title}
          </h1>
        </div>
      </header>

      <LessonClient lesson={lesson} />

      {/* Bottom navigation */}
      <footer className="border-t border-zinc-800/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
          {prevLesson ? (
            <Link
              href={`/module/${moduleSlug}/${prevLesson.slug}`}
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/module/${moduleSlug}/${nextLesson.slug}`}
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              {nextLesson.title}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </footer>
    </div>
  );
}
