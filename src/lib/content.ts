import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

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
  dirName: string;
}

export function getModules(): Module[] {
  const moduleDirs = fs
    .readdirSync(CONTENT_DIR)
    .filter((dir) =>
      fs.statSync(path.join(CONTENT_DIR, dir)).isDirectory()
    );

  return moduleDirs
    .map((dirName) => {
      const modulePath = path.join(CONTENT_DIR, dirName, "module.json");
      const meta: ModuleMeta = JSON.parse(
        fs.readFileSync(modulePath, "utf-8")
      );

      const lessonDirs = fs
        .readdirSync(path.join(CONTENT_DIR, dirName))
        .filter(
          (ld) =>
            fs
              .statSync(path.join(CONTENT_DIR, dirName, ld))
              .isDirectory()
        );

      const lessons = lessonDirs
        .map((ld) => {
          const metaPath = path.join(
            CONTENT_DIR,
            dirName,
            ld,
            "meta.json"
          );
          return JSON.parse(
            fs.readFileSync(metaPath, "utf-8")
          ) as LessonMeta;
        })
        .sort((a, b) => a.order - b.order);

      return { meta, lessons, dirName };
    })
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function getModuleBySlug(slug: string): Module | undefined {
  return getModules().find((m) => m.meta.slug === slug);
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string
): Lesson | undefined {
  const modules = getModules();
  const mod = modules.find((m) => m.meta.slug === moduleSlug);
  if (!mod) return undefined;

  const lessonMeta = mod.lessons.find((l) => l.slug === lessonSlug);
  if (!lessonMeta) return undefined;

  // Find the lesson directory by matching slug
  const lessonDirs = fs
    .readdirSync(path.join(CONTENT_DIR, mod.dirName))
    .filter((ld) =>
      fs
        .statSync(path.join(CONTENT_DIR, mod.dirName, ld))
        .isDirectory()
    );

  const lessonDir = lessonDirs.find((ld) => {
    const meta: LessonMeta = JSON.parse(
      fs.readFileSync(
        path.join(CONTENT_DIR, mod.dirName, ld, "meta.json"),
        "utf-8"
      )
    );
    return meta.slug === lessonSlug;
  });

  if (!lessonDir) return undefined;

  const lessonPath = path.join(CONTENT_DIR, mod.dirName, lessonDir);
  const content = fs.readFileSync(
    path.join(lessonPath, "lesson.md"),
    "utf-8"
  );
  const exercises: Exercise[] = JSON.parse(
    fs.readFileSync(path.join(lessonPath, "exercises.json"), "utf-8")
  );

  return {
    meta: lessonMeta,
    content,
    exercises,
    moduleSlug,
  };
}

export function getAllLessonPaths(): {
  moduleSlug: string;
  lessonSlug: string;
}[] {
  const modules = getModules();
  const paths: { moduleSlug: string; lessonSlug: string }[] = [];

  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      paths.push({
        moduleSlug: mod.meta.slug,
        lessonSlug: lesson.slug,
      });
    }
  }

  return paths;
}
