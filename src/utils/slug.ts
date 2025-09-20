import slugify from "slugify";

// Returns a URL-safe slug

export function createSlug(name: string, id: number): string {
  const safeSlug = slugify(name, {
    remove: undefined,
    replacement: "-",
    lower: true,
    strict: true,
    trim: true,
  });
  return `${safeSlug}-${id}`;
}
