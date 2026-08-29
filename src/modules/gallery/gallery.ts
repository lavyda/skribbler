import { getCollection, type CollectionEntry } from "astro:content";

export type Locale = App.Locale;

export type Gallery = CollectionEntry<"galleries">;
export type Photo = Gallery["data"]["photos"][number];

export const slugOf = (gallery: Gallery): string =>
  gallery.id.split("/").slice(1).join("/");

export async function getListedGalleries(locale: Locale): Promise<Gallery[]> {
  const prefix = `${locale}/`;
  const galleries = await getCollection(
    "galleries",
    ({ id, data }) =>
      id.startsWith(prefix) &&
      data.listed &&
      (import.meta.env.PROD ? !data.draft : true),
  );
  return galleries.sort(
    (a, b) => b.data.created.getTime() - a.data.created.getTime(),
  );
}
