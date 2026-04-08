/**
 * Pre-compiles all content from the /content directory into a single
 * JSON file that can be imported at build time without filesystem access.
 *
 * Run: npx tsx scripts/build-content.ts
 */

import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_FILE = path.join(process.cwd(), "src", "lib", "content-data.json");

interface ModuleMeta {
  title: string;
  description: string;
  slug: string;
  order: number;
}

interface LessonMeta {
  title: string;
  description: string;
  slug: string;
  order: number;
  prerequisites: string[];
}

interface Exercise {
  id: string;
  type: string;
  prompt: string;
  hints: string[];
  validation: Array<{
    rule: string;
    value?: string;
    pattern?: string;
    check?: string;
    sequence?: string[];
    hintOnFail?: string;
  }>;
  solution: string;
  explanation: string;
}

interface LessonData {
  meta: LessonMeta;
  content: string;
  exercises: Exercise[];
}

interface ModuleData {
  meta: ModuleMeta;
  lessons: LessonData[];
}

function buildContent(): ModuleData[] {
  const moduleDirs = fs
    .readdirSync(CONTENT_DIR)
    .filter((dir) => fs.statSync(path.join(CONTENT_DIR, dir)).isDirectory());

  const modules: ModuleData[] = moduleDirs.map((dirName) => {
    const modulePath = path.join(CONTENT_DIR, dirName, "module.json");
    const meta: ModuleMeta = JSON.parse(fs.readFileSync(modulePath, "utf-8"));

    const lessonDirs = fs
      .readdirSync(path.join(CONTENT_DIR, dirName))
      .filter((ld) =>
        fs.statSync(path.join(CONTENT_DIR, dirName, ld)).isDirectory()
      );

    const lessons: LessonData[] = lessonDirs
      .map((ld) => {
        const lessonPath = path.join(CONTENT_DIR, dirName, ld);
        const lessonMeta: LessonMeta = JSON.parse(
          fs.readFileSync(path.join(lessonPath, "meta.json"), "utf-8")
        );
        const content = fs.readFileSync(
          path.join(lessonPath, "lesson.md"),
          "utf-8"
        );
        const exercises: Exercise[] = JSON.parse(
          fs.readFileSync(path.join(lessonPath, "exercises.json"), "utf-8")
        );

        return { meta: lessonMeta, content, exercises };
      })
      .sort((a, b) => a.meta.order - b.meta.order);

    return { meta, lessons };
  });

  return modules.sort((a, b) => a.meta.order - b.meta.order);
}

const data = buildContent();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

const totalLessons = data.reduce((sum, m) => sum + m.lessons.length, 0);
const totalExercises = data.reduce(
  (sum, m) => sum + m.lessons.reduce((ls, l) => ls + l.exercises.length, 0),
  0
);

console.log(
  `Built content-data.json: ${data.length} modules, ${totalLessons} lessons, ${totalExercises} exercises`
);
