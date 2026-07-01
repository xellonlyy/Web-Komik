import MangaCard from "@/components/MangaCard";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MangaSlider from "@/components/MangaSlider";
import { getPopularManga, getTags, getLatestUpdates, getPopularNew, getRecommended } from "@/utils/mangadex";
import Link from "next/link";

export const revalidate = 0; // Disable cache for instant real-time

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; genre?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const genre = params.genre || "";
  const sort = params.sort || "";
  const page = parseInt(params.page || "1");
  const limit = 30;
  const offset = (page - 1) * limit;

  const isSearching = !!query || !!genre || !!sort || page > 1;

  // Fetch search/grid results
  const gridResult = isSearching ? await getPopularManga(limit, offset, query, genre, sort) : null;
  
  // Fetch slider sections if not searching
  const [latestData, popularNewData, recommendedData, tagsData] = await Promise.all([
    !isSearching ? getLatestUpdates(15) : Promise.resolve(null),
    !isSearching ? getPopularNew(15) : Promise.resolve(null),
    !isSearching ? getRecommended(15) : Promise.resolve(null),
    getTags()
  ]);

  const { manga, covers, total } = gridResult || { manga: [], covers: {}, total: 0 };
  const totalPages = Math.ceil(total / limit);

  // Fetch tags to display genre name if filtering
  let genreName = "";
  if (genre) {
    const activeTag = tagsData.find(t => t.id === genre);
    if (activeTag) genreName = activeTag.name;
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0c] px-4 py-12 md:px-8 overflow-hidden">
      {/* Animated Background GIF/WebP */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
        style={{ 
          backgroundImage: `url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTIyZzd6bGx4Z24weGlwY2k5cnk5M3RhOGViYTdtbHB6NmJ4czB2byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SozIvLLm1YdqCVlPzJ/giphy.gif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Gradient overlay so content stays readable */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0c]/80 via-[#0a0a0c]/90 to-[#0a0a0c] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero / Header Section */}
        <header className="mb-10 flex flex-col items-center text-center">
          <h1 
            className="mb-4 relative flex items-center justify-center font-black"
            style={{
              fontFamily: "'Trebuchet MS', 'Impact', sans-serif", // Fallback to powerful system fonts if google fonts fails
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
              lineHeight: '1',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              textShadow: '0 10px 40px rgba(89, 150, 255, 0.4)',
              transform: 'skewX(-5deg)'
            }}
          >
            <span style={{ color: '#ffffff', textShadow: '3px 3px 0px rgba(10,10,12,0.9), 6px 6px 0px rgba(89,150,255,0.2)' }}>OCTA</span>
            <span style={{ color: '#5996FF', textShadow: '3px 3px 0px rgba(10,10,12,0.9), 6px 6px 0px rgba(255,255,255,0.1)' }}>KOMIK</span>
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400 font-medium tracking-wide">
            No ads. Pure aesthetics. Enjoy your favorite comics with an elegant, immersive experience.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
            <SearchBar />
        </div>
        
        {/* All Manga Button */}
        <div className="flex justify-center mb-8">
          <Link 
            href="/?sort=az" 
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-600/20 text-primary-300 font-bold border border-primary-500/30 hover:bg-primary-600 hover:text-white transition-all shadow-lg hover:shadow-primary-500/25 backdrop-blur-md"
          >
            📚 View All Manga (A-Z)
          </Link>
        </div>
        
        {/* Genre Filter List */}
        <GenreFilter />

        {isSearching ? (
          <section className="mx-auto max-w-7xl mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {query 
                  ? `Search Results for "${query}"` 
                  : sort === "az"
                    ? "All Titles (A-Z)"
                    : genreName 
                      ? <><span className="text-zinc-400 font-medium text-lg">Genre:</span> <span className="text-primary-400">{genreName}</span></> 
                      : "Filtered Titles"}
              </h2>
              <span className="text-sm text-zinc-500">{total} titles found</span>
            </div>

            {manga.length > 0 ? (
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                  gap: '1.5rem',
                  paddingBottom: '2rem'
                }}
              >
                {manga.map((item) => (
                  <MangaCard
                    key={item.id}
                    id={item.id}
                    title={item.attributes.title.en || item.attributes.title["ja-ro"] || Object.values(item.attributes.title || {})[0] || "Unknown"}
                    imageUrl={covers[item.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-zinc-500">
                <span className="text-5xl mb-4 block">🔍</span>
                <p className="text-xl">No manga found.</p>
                <p className="text-sm">Try searching for a different title.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 mb-8 flex items-center justify-center gap-6">
                {page > 1 ? (
                  <Link 
                    href={`/?${query ? `q=${encodeURIComponent(query)}&` : ''}${genre ? `genre=${genre}&` : ''}${sort ? `sort=${sort}&` : ''}page=${page - 1}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-400 font-bold uppercase tracking-wider hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(89,150,255,0.4)] hover:-translate-x-1 backdrop-blur-md"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    Prev
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/40 border border-zinc-800/50 text-zinc-600 font-bold uppercase tracking-wider cursor-not-allowed backdrop-blur-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    Prev
                  </div>
                )}
                
                <div className="flex flex-col items-center justify-center">
                  <span className="text-zinc-300 font-bold text-lg">
                    {page}
                  </span>
                  <span className="text-zinc-600 text-xs font-semibold uppercase tracking-widest mt-0.5">
                    of {totalPages > 333 ? '333+' : totalPages}
                  </span>
                </div>

                {page < totalPages ? (
                  <Link 
                    href={`/?${query ? `q=${encodeURIComponent(query)}&` : ''}${genre ? `genre=${genre}&` : ''}${sort ? `sort=${sort}&` : ''}page=${page + 1}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-400 font-bold uppercase tracking-wider hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(89,150,255,0.4)] hover:translate-x-1 backdrop-blur-md"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/40 border border-zinc-800/50 text-zinc-600 font-bold uppercase tracking-wider cursor-not-allowed backdrop-blur-md">
                    Next
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <div className="flex flex-col gap-6 mt-12">
            {latestData && (
              <MangaSlider 
                title="Latest Updates" 
                subtitle="Fresh chapters just dropped" 
                icon="🔥" 
                mangas={latestData.manga} 
                covers={latestData.covers} 
              />
            )}
            {popularNewData && (
              <MangaSlider 
                title="Popular New Titles" 
                subtitle="Rising stars this year" 
                icon="✨" 
                mangas={popularNewData.manga} 
                covers={popularNewData.covers} 
              />
            )}
            {recommendedData && (
              <MangaSlider 
                title="Recommended For You" 
                subtitle="Highest rated masterpieces" 
                icon="⭐" 
                mangas={recommendedData.manga} 
                covers={recommendedData.covers} 
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
