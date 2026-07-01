import Link from "next/link";
import { notFound } from "next/navigation";
import { getMangaDetail, getMangaChapters } from "@/utils/mangadex";
import ChapterList from "@/components/ChapterList";

export const revalidate = 0; // Instant real-time

export default async function MangaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [{ manga, coverUrl }, chapters] = await Promise.all([
    getMangaDetail(id),
    getMangaChapters(id),
  ]);

  if (!manga) {
    notFound();
  }

  const title = manga.attributes.title.en || manga.attributes.title["ja-ro"] || Object.values(manga.attributes.title)[0] || "Unknown Title";
  const description = manga.attributes.description.en || Object.values(manga.attributes.description)[0] || "No description available.";

  return (
    <main className="min-h-screen bg-[#0a0a0c]">
      {/* Blurred Hero Background Banner */}
      <div style={{ position: 'relative', height: '45vh', width: '100%', overflow: 'hidden' }}>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-3xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${coverUrl || "https://placehold.co/300x400/18181b/ffffff?text=No+Cover"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem', marginTop: '-12rem', paddingBottom: '3rem' }}>
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-400 drop-shadow-md">
          <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-100 font-medium line-clamp-1">{title}</span>
        </nav>

        {/* Hero Content Panel */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '3rem', 
            flexWrap: 'wrap', 
            alignItems: 'flex-start',
            marginBottom: '4rem'
          }}
        >
          {/* Cover Image */}
          <div 
            style={{ 
              position: 'relative',
              zIndex: 20,
              flexShrink: 0,
              width: '260px',
              margin: '0 auto'
            }}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] ring-1 ring-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={coverUrl || "https://placehold.co/300x400/18181b/ffffff?text=No+Cover"} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div 
            style={{ 
              flexGrow: 1,
              flexBasis: '400px', 
              display: 'flex', 
              flexDirection: 'column',
              textAlign: 'left',
              paddingTop: '2rem'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              {manga.attributes.status && (
                <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-wider border border-primary-500/30 backdrop-blur-md">
                  {manga.attributes.status}
                </span>
              )}
              {manga.attributes.year && (
                <span className="px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-300 text-xs font-bold backdrop-blur-md">
                  {manga.attributes.year}
                </span>
              )}
            </div>
            
            <h1 className="font-black text-white drop-shadow-lg leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>{title}</h1>
            
            {/* Genre Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {manga.attributes.tags
                .filter((tag: any) => tag.attributes.group === "genre" || tag.attributes.group === "theme")
                .slice(0, 5) // Limit to 5 tags for UI cleanliness
                .map((tag: any) => (
                  <Link 
                    key={tag.id} 
                    href={`/?genre=${tag.id}`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-primary-600/20 text-zinc-300 hover:text-primary-300 text-xs font-bold border border-zinc-700/50 hover:border-primary-500/50 transition-colors"
                  >
                    {tag.attributes.name.en || Object.values(tag.attributes.name)[0]}
                  </Link>
                ))}
            </div>

            <div style={{ color: '#d4d4d8', fontSize: '1.05rem', lineHeight: '1.8', maxWidth: '100%' }}>
              {description.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                // Basic markdown bold parsing
                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: white;">$1</strong>');
                return (
                  <p key={i} style={{ marginBottom: '0.75rem' }} dangerouslySetInnerHTML={{ __html: formattedLine }} />
                );
              })}
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <ChapterList chapters={chapters} mangaId={id} mangaTitle={title} />
      </div>
    </main>
  );
}
