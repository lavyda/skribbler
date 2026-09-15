import { getCollection, type CollectionEntry } from "astro:content";
import { getGalleries, type Gallery } from "@/modules/gallery/gallery";

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

export interface RelatedPostGroups {
  parent?: Post;
  children: Post[];
}

export async function getRelatedPosts(post: Post): Promise<RelatedPostGroups> {
  const locale = post.id.split("/")[0] as Locale;
  const posts = await getPosts(locale);
  const byId = new Map(posts.map((p) => [p.id, p]));

  const children = post.data.relatedPosts
    .map((ref) => byId.get(ref.id))
    .filter((p): p is Post => p !== undefined && p.id !== post.id);
  const childIds = new Set(children.map((p) => p.id));

  // A post is expected to have at most one parent; if several list it as a
  // child, the first one found (most recently created) wins.
  const parent = posts.find(
    (p) =>
      p.id !== post.id &&
      !childIds.has(p.id) &&
      p.data.relatedPosts.some((ref) => ref.id === post.id),
  );

  return { parent, children };
}

export async function getRelatedGalleries(post: Post): Promise<Gallery[]> {
  const locale = post.id.split("/")[0] as Locale;
  const galleries = await getGalleries(locale);
  const byId = new Map(galleries.map((g) => [g.id, g]));

  return (post.data.galleries ?? [])
    .map((ref) => byId.get(ref.id))
    .filter((g): g is Gallery => g !== undefined);
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
