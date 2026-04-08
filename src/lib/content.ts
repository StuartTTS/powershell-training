import contentData from "./content-data.json";

export interface ModuleMeta {
  title: string;
  description: string;
  slug: string;
  order: number;
}

export interface LessonMeta {
  title: string;
  description: string;
  slug: string;
  order: number;
  prerequisites: string[];
}

export interface ValidationRule {
  rule: "contains" | "regex" | "structure" | "order" | "forbidden";
  value?: string;
  pattern?: string;
  check?: string;
  sequence?: string[];
  hintOnFail?: string;
}

export interface Exercise {
  id: string;
  type: "syntax-check" | "execution-required";
  prompt: string;
  hints: string[];
  validation: ValidationRule[];
  solution: string;
  explanation: string;
}

export interface Lesson {
  meta: LessonMeta;
  content: string;
  exercises: Exercise[];
  moduleSlug: string;
}

export interface Module {
  meta: ModuleMeta;
  lessons: LessonMeta[];
}

interface ContentModule {
  meta: ModuleMeta;
  lessons: {
    meta: LessonMeta;
    content: string;
    exercises: Exercise[];
  }[];
}

const modules: ContentModule[] = contentData as ContentModule[];

export function getModules(): Module[] {
  return modules.map((m) => ({
    meta: m.meta,
    lessons: m.lessons.map((l) => l.meta),
  }));
}

export function getModuleBySlug(slug: string): Module | undefined {
  const mod = modules.find((m) => m.meta.slug === slug);
  if (!mod) return undefined;
  return {
    meta: mod.meta,
    lessons: mod.lessons.map((l) => l.meta),
  };
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string
): Lesson | undefined {
  const mod = modules.find((m) => m.meta.slug === moduleSlug);
  if (!mod) return undefined;

  const lesson = mod.lessons.find((l) => l.meta.slug === lessonSlug);
  if (!lesson) return undefined;

  return {
    meta: lesson.meta,
    content: lesson.content,
    exercises: lesson.exercises as Exercise[],
    moduleSlug,
  };
}

export function getAllLessonPaths(): {
  moduleSlug: string;
  lessonSlug: string;
}[] {
  const paths: { moduleSlug: string; lessonSlug: string }[] = [];

  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      paths.push({
        moduleSlug: mod.meta.slug,
        lessonSlug: lesson.meta.slug,
      });
    }
  }

  return paths;
}
