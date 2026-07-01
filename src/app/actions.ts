"use server";

import { getPopularManga } from "@/utils/mangadex";

export async function searchMangaAction(query: string) {
  if (!query) return [];
  // Fetch top 5 results for live search
  const { manga, covers } = await getPopularManga(5, 0, query);
  
  return manga.map((item) => ({
    id: item.id,
    title: item.attributes.title.en || item.attributes.title["ja-ro"] || Object.values(item.attributes.title)[0] || "Unknown",
    cover: covers[item.id] || null,
    year: item.attributes.year,
    status: item.attributes.status,
  }));
}
