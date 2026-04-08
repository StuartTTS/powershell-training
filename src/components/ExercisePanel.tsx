"use client";

import { useState, useEffect } from "react";
import type { Exercise } from "@/lib/content";
import { validateAnswer } from "@/lib/validation";
import { markExerciseAttempt, markExerciseCompleted } from "@/lib/progress";
import { PowerShellEditor } from "./PowerShellEditor";

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
  const [shakeKey, setShakeKey] = useState(0);

  // Reset state when exercise changes
  useEffect(() => {
    setAnswer("");
    setFeedback(null);
    setHintIndex(-1);
    setShowSolution(false);
    setCompleted(false);
  }, [exercise.id]);

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
      setShakeKey((k) => k + 1);
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
    <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900 to-zinc-900/80 shadow-2xl shadow-black/20">
      {/* Exercise header */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/50 px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <p className="text-[15px] leading-relaxed text-zinc-200">
            {exercise.prompt}
          </p>
        </div>
      </div>

      {/* Execution-required banner */}
      {exercise.type === "execution-required" && (
        <div className="mx-6 mt-4 flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-[13px] text-amber-300/90">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          This exercise works best against a real M365 tenant. Try it in your local terminal too.
        </div>
      )}

      {/* Editor area */}
      <div className="px-6 pt-4 pb-2">
        <PowerShellEditor
          value={answer}
          onChange={setAnswer}
          readOnly={completed}
          height="140px"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2.5 px-6 py-3">
        <button
          onClick={handleCheck}
          disabled={completed || !answer.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none disabled:hover:bg-blue-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
          Check Answer
        </button>

        {!completed && (
          <button
            onClick={handleShowHint}
            disabled={hintIndex >= exercise.hints.length - 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-3.5 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-zinc-200 disabled:opacity-30"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            Hint
          </button>
        )}

        {!completed && hintIndex >= exercise.hints.length - 1 && !showSolution && (
          <button
            onClick={() => setShowSolution(true)}
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Show Solution
          </button>
        )}

        {completed && (
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-[0.98]"
          >
            Next Exercise
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        )}
      </div>

      {/* Hints */}
      {hintIndex >= 0 && !completed && (
        <div className="mx-6 mb-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <span>{exercise.hints[hintIndex]}</span>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="mx-6 mb-3" key={feedback.passed ? "pass" : shakeKey}>
          <div
            className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${
              feedback.passed
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-200/90"
                : "animate-[shake_0.3s_ease-in-out] border-red-500/20 bg-red-500/5 text-red-200/90"
            }`}
          >
            {feedback.passed ? (
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span>
              {feedback.passed && <strong className="text-emerald-300">Correct! </strong>}
              {feedback.message}
            </span>
          </div>
        </div>
      )}

      {/* Solution reveal */}
      {showSolution && !completed && (
        <div className="mx-6 mb-4">
          <div className="overflow-hidden rounded-lg border border-zinc-700/40">
            <div className="flex items-center gap-2 border-b border-zinc-700/40 bg-zinc-800/60 px-4 py-2">
              <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium text-zinc-400">Solution</span>
            </div>
            <div className="bg-[#0c0c0f] px-4 py-3">
              <pre className="font-mono text-sm leading-relaxed text-zinc-200">
                {exercise.solution}
              </pre>
            </div>
            <div className="border-t border-zinc-700/40 bg-zinc-800/30 px-4 py-2.5">
              <p className="text-[13px] leading-relaxed text-zinc-400">
                {exercise.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-2" />
    </div>
  );
}
