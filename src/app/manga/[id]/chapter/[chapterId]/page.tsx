import Link from "next/link";
import { getChapterImages, getMangaDetail, getChapterDetail } from "@/utils/mangadex";
import ReadTracker from "@/components/ReadTracker";

export default async function ChapterReaderPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  
  const [{ manga, coverUrl }, images, chapterData] = await Promise.all([
    getMangaDetail(id),
    getChapterImages(chapterId),
    getChapterDetail(chapterId)
  ]);

  const title = manga?.attributes.title.en || manga?.attributes.title["ja-ro"] || Object.values(manga?.attributes.title || {})[0] || "Manga";
  const status = manga?.attributes.status || "Unknown";
  const finalCoverUrl = coverUrl || "https://placehold.co/300x400/18181b/ffffff?text=No+Cover";
  const externalUrl = chapterData?.attributes?.externalUrl;

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white flex flex-col">
      <ReadTracker 
        chapterId={chapterId} 
        mangaId={id} 
        title={title} 
        coverUrl={finalCoverUrl}
        status={status}
      />
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg leading-tight line-clamp-1">{title}</h1>
          <div className="text-xs text-zinc-400 flex items-center gap-2 mt-1">
            <span>Reading Chapter {chapterData?.attributes?.chapter || ""}</span>
            {chapterData?.relationships?.find((rel: any) => rel.type === 'scanlation_group')?.attributes?.name && (
              <>
                <span>•</span>
                <span className="text-primary-400 font-medium">
                  {chapterData.relationships.find((rel: any) => rel.type === 'scanlation_group')?.attributes?.name}
                </span>
              </>
            )}
          </div>
        </div>
        <Link 
          href={`/manga/${id}`}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Close
        </Link>
      </div>

      {/* Reader Container */}
      <div className="max-w-3xl mx-auto flex flex-col items-center flex-grow w-full">
        {images.length > 0 ? (
          images.map((imgUrl, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              key={index}
              src={imgUrl}
              alt={`Page ${index + 1}`}
              className="w-full h-auto block select-none bg-zinc-900"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ))
        ) : externalUrl ? (
          <div className="py-32 px-4 text-center flex flex-col items-center justify-center h-full w-full">
            <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 p-8 rounded-3xl max-w-lg shadow-2xl backdrop-blur-sm">
              <span className="text-6xl mb-6 block">🚀</span>
              <h2 className="text-2xl font-bold text-white mb-3">Official Release</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                This chapter is officially licensed and can be read directly from the publisher's official platform (like MangaPlus).
              </p>
              <a 
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Read Official Chapter</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="py-32 text-zinc-500 text-center flex-grow flex flex-col justify-center">
            <span className="text-5xl mb-4 block opacity-50">💔</span>
            <p className="text-xl mb-2 font-semibold">Failed to load chapter images.</p>
            <p className="text-sm">This chapter might have been removed due to licensing restrictions.</p>
          </div>
        )}
      </div>

    </main>
  );
}
