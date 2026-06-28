import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface LessonMeta {
  slug: string;
  title: string;
  description?: string;
  order?: number;
  [key: string]: unknown;
}

export function getLessonSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getLessonSource(slug: string): { content: string; meta: LessonMeta } {
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  return {
    content,
    meta: { slug, title: data.title ?? slug, ...data } as LessonMeta,
  };
}

export function getAllLessons(): LessonMeta[] {
  return getLessonSlugs()
    .map((slug) => getLessonSource(slug).meta)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
