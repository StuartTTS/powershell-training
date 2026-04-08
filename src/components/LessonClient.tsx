"use client";

import { useState } from "react";
import type { Lesson, Exercise } from "@/lib/content";
import { validateAnswer } from "@/lib/validation";
import {
  markExerciseAttempt,
  markExerciseCompleted,
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
  const storageAvailable = isStorageAvailable();

  const exercise: Exercise | undefined =
    lesson.exercises[currentExerciseIndex];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {!storageAvailable && (
        <div className="mb-4 rounded-md border border-yellow-800 bg-yellow-900/30 px-4 py-2 text-sm text-yellow-300">
          Progress tracking unavailable in this browser mode.
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        <MarkdownRenderer content={lesson.content} />
      </div>

      {lesson.exercises.length > 0 && (
        <div className="mt-10 border-t border-zinc-800 pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Exercises</h2>
            <span className="text-sm text-zinc-400">
              {currentExerciseIndex + 1} / {lesson.exercises.length}
            </span>
          </div>

          <div className="mb-4 flex gap-2">
            {lesson.exercises.map((ex, i) => {
              const progress = getExerciseProgress(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => setCurrentExerciseIndex(i)}
                  className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                    i === currentExerciseIndex
                      ? "bg-blue-600 text-white"
                      : progress?.completed
                        ? "bg-green-800 text-green-200"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {exercise && (
            <ExercisePanel
              key={exercise.id}
              exercise={exercise}
              onComplete={() => {
                if (
                  currentExerciseIndex <
                  lesson.exercises.length - 1
                ) {
                  setCurrentExerciseIndex(currentExerciseIndex + 1);
                }
              }}
            />
          )}
        </div>
      )}
    </main>
  );
}
