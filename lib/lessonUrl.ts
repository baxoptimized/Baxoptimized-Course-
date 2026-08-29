/** Convert a full DB lesson slug ("moduleSlug--lessonPart") to a URL-safe part. */
export function lessonUrlPart(lessonSlug: string, moduleSlug: string): string {
  const prefix = moduleSlug + "--";
  return lessonSlug.startsWith(prefix) ? lessonSlug.slice(prefix.length) : lessonSlug;
}
