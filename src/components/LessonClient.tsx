"use client";

import { useState, useCallback } from "react";
import type { Lesson, Exercise } from "@/lib/content";
import {
  getExerciseProgress,
  isStorageAvailable,
} from "@/lib/progress";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ExercisePanel } from "./ExercisePanel";

interface Props {
  lesson: Lesson;
}

export function LessonClient({ lesson }: Props) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [, forceUpdate] = useState(0);
  const storageAvailable = isStorageAvailable();

  const exercise: Exercise | undefined =
    lesson.exercises[currentExerciseIndex];

  const handleComplete = useCallback(() => {
    // Force a re-render to update progress indicators
    forceUpdate((n) => n + 1);
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  }, [currentExerciseIndex, lesson.exercises.length]);

  const completedCount = lesson.exercises.filter(
    (ex) => getExerciseProgress(ex.id)?.completed
  ).length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {!storageAvailable && (
        <div className="mb-6 flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-300/90">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          Progress tracking unavailable in this browser mode.
        </div>
      )}

      {/* Lesson content */}
      <div className="max-w-none">
        <MarkdownRenderer content={lesson.content} />
      </div>

      {/* Exercises section */}
      {lesson.exercises.length > 0 && (
        <div className="mt-12 border-t border-zinc-800/60 pt-10">
          {/* Section header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight">Exercises</h2>
              <div className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                {completedCount}/{lesson.exercises.length} completed
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
                style={{
                  width: `${(completedCount / lesson.exercises.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Exercise navigation pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            {lesson.exercises.map((ex, i) => {
              const progress = getExerciseProgress(ex.id);
              const isCurrent = i === currentExerciseIndex;
              const isCompleted = progress?.completed;

              return (
                <button
                  key={ex.id}
                  onClick={() => setCurrentExerciseIndex(i)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30 ring-offset-1 ring-offset-zinc-950"
                      : isCompleted
                        ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                        : "bg-zinc-800/60 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </button>
              );
            })}
          </div>

          {/* Active exercise */}
          {exercise && (
            <ExercisePanel
              key={exercise.id}
              exercise={exercise}
              onComplete={handleComplete}
            />
          )}
        </div>
      )}

      {/* Empty state for lessons without exercises */}
      {lesson.exercises.length === 0 && (
        <div className="mt-12 border-t border-zinc-800/60 pt-10">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-12 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80">
              <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-3.08a1.124 1.124 0 010-1.92l5.1-3.08a1.125 1.125 0 011.29 0l5.1 3.08a1.124 1.124 0 010 1.92l-5.1 3.08a1.125 1.125 0 01-1.29 0z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">Exercises coming soon for this lesson.</p>
          </div>
        </div>
      )}
    </main>
  );
}
