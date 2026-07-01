const BASE_URL = "https://api.mangadex.org";
const UPLOADS_URL = "https://uploads.mangadex.org";

export interface MangaDexManga {
  id: string;
  type: string;
  attributes: {
    title: { [key: string]: string };
    description: { [key: string]: string };
    status: string;
    year: number;
    tags: any[];
  };
  relationships: any[];
}

export interface MangaDexChapter {
  id: string;
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    publishAt: string;
  };
}

// 1. Fetch Popular Manga (with optional search, pagination, and genre filtering)
export async function getPopularManga(
  limit = 30, 
  offset = 0, 
  title = "",
  genre = "", // Tag ID
  sort = "" // 'az' or ''
): Promise<{ manga: MangaDexManga[], covers: Record<string, string>, total: number }> {
  try {
    let url = `${BASE_URL}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&hasAvailableChapters=true&availableTranslatedLanguage[]=en&availableTranslatedLanguage[]=id&contentRating[]=safe&contentRating[]=suggestive&originalLanguage[]=ja&originalLanguage[]=ko&originalLanguage[]=zh&originalLanguage[]=zh-hk&excludedTags[]=891cf039-b895-47f0-9229-bef4c96eccd4&excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&excludedTags[]=7b2ce280-79ef-4c09-9b58-12b7c23a9b78&excludedTags[]=a3c67850-4684-404e-9b7f-c69850ee5da6&excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30&excludedTags[]=aafb99c1-7f60-43fa-b75f-fc9502ce29c7&excludedTags[]=0234a31e-a729-4e28-9d6a-3f87c4966b9e`;
    
    if (title) {
      const bannedKeywords = ["doujinshi", "18+", "smut", "hentai", "porn", "sex"];
      const isBanned = bannedKeywords.some(kw => title.toLowerCase().includes(kw));
      if (isBanned) return { manga: [], covers: {}, total: 0 };
      
      url += `&title=${encodeURIComponent(title)}&order[relevance]=desc`;
    } else if (genre) {
      url += `&includedTags[]=${genre}&order[followedCount]=desc`;
    } else if (sort === "az") {
      url += `&order[title]=asc`;
    } else {
      url += `&order[followedCount]=desc`; // Default to popular
    }

    const res = await fetch(url, { next: { revalidate: 3600 , signal: AbortSignal.timeout(8000) } });
    const data = await res.json();
    
    if (!data.data) return { manga: [], covers: {}, total: 0 };

    // Smart Filter: Only allow 'suggestive' rating if it's an Action/Fantasy/Thriller manga
    const allowedSuggestiveTags = ["Action", "Adventure", "Martial Arts", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Delinquents", "Mystery", "Supernatural"];
    data.data = data.data.filter((m: MangaDexManga) => {
      if (m.attributes.contentRating === "suggestive") {
        return m.attributes.tags.some(tag => 
          tag.attributes.name && tag.attributes.name.en && allowedSuggestiveTags.includes(tag.attributes.name.en)
        );
      }
      return true;
    });
    
    const covers: Record<string, string> = {};
    data.data.forEach((m: MangaDexManga) => {
      const coverRel = m.relationships.find((rel) => rel.type === "cover_art");
      if (coverRel?.attributes?.fileName) {
        covers[m.id] = `https://uploads.mangadex.org/covers/${m.id}/${coverRel.attributes.fileName}.256.jpg`;
      }
    });

    return { manga: data.data, covers, total: data.total };
  } catch (error) {
    console.error("Failed to fetch manga:", error);
    return { manga: [], covers: {}, total: 0 };
  }
}

// Get Latest Updates
export async function getLatestUpdates(limit = 15): Promise<{ manga: MangaDexManga[], covers: Record<string, string> }> {
  try {
    const url = `${BASE_URL}/manga?limit=${limit}&includes[]=cover_art&hasAvailableChapters=true&availableTranslatedLanguage[]=en&availableTranslatedLanguage[]=id&contentRating[]=safe&contentRating[]=suggestive&originalLanguage[]=ja&originalLanguage[]=ko&originalLanguage[]=zh&originalLanguage[]=zh-hk&excludedTags[]=891cf039-b895-47f0-9229-bef4c96eccd4&excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&excludedTags[]=7b2ce280-79ef-4c09-9b58-12b7c23a9b78&excludedTags[]=a3c67850-4684-404e-9b7f-c69850ee5da6&excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30&excludedTags[]=aafb99c1-7f60-43fa-b75f-fc9502ce29c7&excludedTags[]=0234a31e-a729-4e28-9d6a-3f87c4966b9e&order[latestUploadedChapter]=desc`;
    const res = await fetch(url, { next: { revalidate: 1800 , signal: AbortSignal.timeout(8000) } });
    const data = await res.json();
    if (!data.data) return { manga: [], covers: {} };
    
    // Smart Filter
    const allowedSuggestiveTags = ["Action", "Adventure", "Martial Arts", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Delinquents", "Mystery", "Supernatural"];
    data.data = data.data.filter((m: MangaDexManga) => {
      if (m.attributes.contentRating === "suggestive") {
        return m.attributes.tags.some(tag => 
          tag.attributes.name && tag.attributes.name.en && allowedSuggestiveTags.includes(tag.attributes.name.en)
        );
      }
      return true;
    });

    const covers: Record<string, string> = {};
    data.data.forEach((m: MangaDexManga) => {
      const coverRel = m.relationships.find((rel) => rel.type === "cover_art");
      if (coverRel?.attributes?.fileName) {
        covers[m.id] = `https://uploads.mangadex.org/covers/${m.id}/${coverRel.attributes.fileName}.256.jpg`;
      }
    });
    return { manga: data.data, covers };
  } catch (error) {
    console.error("Failed to fetch latest:", error);
    return { manga: [], covers: {} };
  }
}

// Get Popular New
export async function getPopularNew(limit = 15): Promise<{ manga: MangaDexManga[], covers: Record<string, string> }> {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const yearStr = oneYearAgo.toISOString().split('T')[0] + 'T00:00:00';
    
    const url = `${BASE_URL}/manga?limit=${limit}&includes[]=cover_art&hasAvailableChapters=true&availableTranslatedLanguage[]=en&availableTranslatedLanguage[]=id&contentRating[]=safe&contentRating[]=suggestive&originalLanguage[]=ja&originalLanguage[]=ko&originalLanguage[]=zh&originalLanguage[]=zh-hk&excludedTags[]=891cf039-b895-47f0-9229-bef4c96eccd4&excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&excludedTags[]=7b2ce280-79ef-4c09-9b58-12b7c23a9b78&excludedTags[]=a3c67850-4684-404e-9b7f-c69850ee5da6&excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30&excludedTags[]=aafb99c1-7f60-43fa-b75f-fc9502ce29c7&excludedTags[]=0234a31e-a729-4e28-9d6a-3f87c4966b9e&createdAtSince=${yearStr}&order[followedCount]=desc`;
    const res = await fetch(url, { next: { revalidate: 86400 , signal: AbortSignal.timeout(8000) } });
    const data = await res.json();
    if (!data.data) return { manga: [], covers: {} };
    
    // Smart Filter
    const allowedSuggestiveTags = ["Action", "Adventure", "Martial Arts", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Delinquents", "Mystery", "Supernatural"];
    data.data = data.data.filter((m: MangaDexManga) => {
      if (m.attributes.contentRating === "suggestive") {
        return m.attributes.tags.some(tag => 
          tag.attributes.name && tag.attributes.name.en && allowedSuggestiveTags.includes(tag.attributes.name.en)
        );
      }
      return true;
    });

    const covers: Record<string, string> = {};
    data.data.forEach((m: MangaDexManga) => {
      const coverRel = m.relationships.find((rel) => rel.type === "cover_art");
      if (coverRel?.attributes?.fileName) {
        covers[m.id] = `https://uploads.mangadex.org/covers/${m.id}/${coverRel.attributes.fileName}.256.jpg`;
      }
    });
    return { manga: data.data, covers };
  } catch (error) {
    console.error("Failed to fetch popular new:", error);
    return { manga: [], covers: {} };
  }
}

// Get Recommended (Top Rated)
export async function getRecommended(limit = 15): Promise<{ manga: MangaDexManga[], covers: Record<string, string> }> {
  try {
    const url = `${BASE_URL}/manga?limit=${limit}&includes[]=cover_art&hasAvailableChapters=true&availableTranslatedLanguage[]=en&availableTranslatedLanguage[]=id&contentRating[]=safe&contentRating[]=suggestive&originalLanguage[]=ja&originalLanguage[]=ko&originalLanguage[]=zh&originalLanguage[]=zh-hk&excludedTags[]=891cf039-b895-47f0-9229-bef4c96eccd4&excludedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&excludedTags[]=7b2ce280-79ef-4c09-9b58-12b7c23a9b78&excludedTags[]=a3c67850-4684-404e-9b7f-c69850ee5da6&excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30&excludedTags[]=aafb99c1-7f60-43fa-b75f-fc9502ce29c7&excludedTags[]=0234a31e-a729-4e28-9d6a-3f87c4966b9e&order[rating]=desc`;
    const res = await fetch(url, { next: { revalidate: 86400 , signal: AbortSignal.timeout(8000) } });
    const data = await res.json();
    if (!data.data) return { manga: [], covers: {} };
    
    // Smart Filter
    const allowedSuggestiveTags = ["Action", "Adventure", "Martial Arts", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Delinquents", "Mystery", "Supernatural"];
    data.data = data.data.filter((m: MangaDexManga) => {
      if (m.attributes.contentRating === "suggestive") {
        return m.attributes.tags.some(tag => 
          tag.attributes.name && tag.attributes.name.en && allowedSuggestiveTags.includes(tag.attributes.name.en)
        );
      }
      return true;
    });

    const covers: Record<string, string> = {};
    data.data.forEach((m: MangaDexManga) => {
      const coverRel = m.relationships.find((rel) => rel.type === "cover_art");
      if (coverRel?.attributes?.fileName) {
        covers[m.id] = `https://uploads.mangadex.org/covers/${m.id}/${coverRel.attributes.fileName}.256.jpg`;
      }
    });
    return { manga: data.data, covers };
  } catch (error) {
    console.error("Failed to fetch recommended:", error);
    return { manga: [], covers: {} };
  }
}

// 2. Fetch Manga Detail
export async function getMangaDetail(id: string): Promise<{ manga: MangaDexManga | null, coverUrl: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/manga/${id}?includes[]=cover_art`, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    const manga = data.data;

    if (!manga) return { manga: null, coverUrl: null };

    const coverRel = manga.relationships.find((rel: any) => rel.type === "cover_art");
    let coverUrl = null;
    if (coverRel && coverRel.attributes?.fileName) {
      coverUrl = `${UPLOADS_URL}/covers/${manga.id}/${coverRel.attributes.fileName}`;
    }

    return { manga, coverUrl };
  } catch (error) {
    console.error("Failed to fetch manga detail:", error);
    return { manga: null, coverUrl: null };
  }
}

// 3. Fetch Chapters for a Manga (Indonesian and English)
export async function getMangaChapters(mangaId: string): Promise<MangaDexChapter[]> {
  try {
    // Fetch both English and Indonesian chapters so it doesn't return empty if ID is missing
    const res = await fetch(
      `${BASE_URL}/manga/${mangaId}/feed?limit=500&translatedLanguage[]=id&translatedLanguage[]=en&order[chapter]=desc&includes[]=scanlation_group`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return [];
  }
}

// Fetch single chapter details (for externalUrl checks and scanlation group)
export async function getChapterDetail(chapterId: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/chapter/${chapterId}?includes[]=scanlation_group`, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch chapter detail:", error);
    return null;
  }
}

// 4. Fetch Chapter Images (At-Home API)
export async function getChapterImages(chapterId: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/at-home/server/${chapterId}`, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    
    if (!data.baseUrl || !data.chapter) return [];

    const baseUrl = data.baseUrl;
    const hash = data.chapter.hash;
    const files = data.chapter.data; // High quality images

    return files.map((file: string) => `${baseUrl}/data/${hash}/${file}`);
  } catch (error) {
    console.error("Failed to fetch chapter images:", error);
    return [];
  }
}

// 4. Fetch All Tags (Genres)
export async function getTags(): Promise<{ id: string, name: string, group: string }[]> {
  try {
    const res = await fetch(`${BASE_URL}/manga/tag`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) }); // Cache tags for 24h since they rarely change
    const data = await res.json();
    if (!data.data) return [];
    
    return data.data
      .filter((tag: any) => {
        const name = tag.attributes.name.en || Object.values(tag.attributes.name)[0];
        // Hapus tag sensitif dari daftar genre filter
        return !["Doujinshi", "Erotica", "Smut", "Suggestive", "Boys' Love", "Girls' Love", "Harem", "Self-Published", "Fan Colored"].includes(name);
      })
      .map((tag: any) => ({
        id: tag.id,
        name: tag.attributes.name.en || Object.values(tag.attributes.name)[0],
        group: tag.attributes.group
      }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}
