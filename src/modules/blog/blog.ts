import { getCollection, type CollectionEntry } from "astro:content";

export type Locale = App.Locale;

export type Post = CollectionEntry<"blogs">;

export const slugOf = (post: Post): string =>
  post.id.split("/").slice(1).join("/");

export async function getPosts(locale: Locale): Promise<Post[]> {
  const prefix = `${locale}/`;
  const posts = await getCollection(
    "blogs",
    ({ id, data }) =>
      id.startsWith(prefix) && (import.meta.env.PROD ? !data.draft : true),
  );
  return posts.sort(
    (a, b) => b.data.created.getTime() - a.data.created.getTime(),
  );
}

export function readingTime(body: string = ""): number {
  const WORDS_PER_MINUTE = 200;
  const text = body
    .replace(/^import\s.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~[\]()!-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
