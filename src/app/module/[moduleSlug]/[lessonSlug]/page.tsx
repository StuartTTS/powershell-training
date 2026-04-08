import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, getAllLessonPaths } from "@/lib/content";
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

  if (!lesson) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/module/${moduleSlug}`}
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            &larr; Back to module
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {lesson.meta.title}
          </h1>
        </div>
      </header>

      <LessonClient lesson={lesson} />
    </div>
  );
}
