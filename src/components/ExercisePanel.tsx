"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/content";
import { validateAnswer } from "@/lib/validation";
import { markExerciseAttempt, markExerciseCompleted } from "@/lib/progress";

interface Props {
  exercise: Exercise;
  onComplete: () => void;
}

export function ExercisePanel({ exercise, onComplete }: Props) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);
  const [hintIndex, setHintIndex] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);

  function handleCheck() {
    if (!answer.trim()) return;

    markExerciseAttempt(exercise.id);
    const result = validateAnswer(answer, exercise.validation);

    if (result.passed) {
      markExerciseCompleted(exercise.id);
      setCompleted(true);
      setFeedback({
        passed: true,
        message: exercise.explanation,
      });
    } else {
      setFeedback({
        passed: false,
        message: result.hint || "Not quite — check your answer and try again.",
      });
    }
  }

  function handleShowHint() {
    if (hintIndex < exercise.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <p className="mb-4 text-zinc-200">{exercise.prompt}</p>

      {exercise.type === "execution-required" && (
        <div className="mb-4 rounded-md border border-blue-800 bg-blue-900/30 px-4 py-2 text-sm text-blue-300">
          This exercise works best when run against a real M365 tenant. Copy
          your answer to your local terminal and try it there.
        </div>
      )}

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your PowerShell here..."
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={4}
        spellCheck={false}
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleCheck}
          disabled={completed}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
        >
          Check Answer
        </button>

        {!completed && (
          <button
            onClick={handleShowHint}
            disabled={hintIndex >= exercise.hints.length - 1}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-50"
          >
            Show Hint
          </button>
        )}

        {!completed && hintIndex >= exercise.hints.length - 1 && (
          <button
            onClick={() => setShowSolution(true)}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            Show Solution
          </button>
        )}

        {completed && (
          <button
            onClick={onComplete}
            className="rounded-md border border-green-700 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-900/30"
          >
            Next Exercise &rarr;
          </button>
        )}
      </div>

      {hintIndex >= 0 && !completed && (
        <div className="mt-4 rounded-md border border-yellow-800 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
          <strong>Hint:</strong> {exercise.hints[hintIndex]}
        </div>
      )}

      {feedback && (
        <div
          className={`mt-4 rounded-md border px-4 py-3 text-sm ${
            feedback.passed
              ? "border-green-800 bg-green-900/20 text-green-300"
              : "border-red-800 bg-red-900/20 text-red-300"
          }`}
        >
          {feedback.passed ? (
            <>
              <strong>Correct!</strong> {feedback.message}
            </>
          ) : (
            feedback.message
          )}
        </div>
      )}

      {showSolution && !completed && (
        <div className="mt-4 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3">
          <div className="mb-1 text-xs font-medium text-zinc-400">
            Solution
          </div>
          <pre className="font-mono text-sm text-zinc-200">
            {exercise.solution}
          </pre>
          <p className="mt-2 text-sm text-zinc-400">
            {exercise.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
