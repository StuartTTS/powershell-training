const STORAGE_KEY = "ps-training-progress";
const SCHEMA_VERSION = 1;

interface ExerciseProgress {
  completed: boolean;
  attempts: number;
}

interface ProgressData {
  version: number;
  exercises: Record<string, ExerciseProgress>;
}

function isLocalStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function loadProgress(): ProgressData {
  if (!isLocalStorageAvailable()) {
    return { version: SCHEMA_VERSION, exercises: {} };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: SCHEMA_VERSION, exercises: {} };

    const data = JSON.parse(raw) as ProgressData;
    if (data.version !== SCHEMA_VERSION) {
      // Future: migrate data between schema versions
      return { version: SCHEMA_VERSION, exercises: {} };
    }
    return data;
  } catch {
    return { version: SCHEMA_VERSION, exercises: {} };
  }
}

function saveProgress(data: ProgressData): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getExerciseProgress(
  exerciseId: string
): ExerciseProgress | null {
  const data = loadProgress();
  return data.exercises[exerciseId] || null;
}

export function markExerciseAttempt(exerciseId: string): void {
  const data = loadProgress();
  const existing = data.exercises[exerciseId] || {
    completed: false,
    attempts: 0,
  };
  existing.attempts += 1;
  data.exercises[exerciseId] = existing;
  saveProgress(data);
}

export function markExerciseCompleted(exerciseId: string): void {
  const data = loadProgress();
  const existing = data.exercises[exerciseId] || {
    completed: false,
    attempts: 0,
  };
  existing.completed = true;
  data.exercises[exerciseId] = existing;
  saveProgress(data);
}

export function getModuleProgress(
  exerciseIds: string[]
): { completed: number; total: number } {
  const data = loadProgress();
  const completed = exerciseIds.filter(
    (id) => data.exercises[id]?.completed
  ).length;
  return { completed, total: exerciseIds.length };
}

export function isStorageAvailable(): boolean {
  return isLocalStorageAvailable();
}
