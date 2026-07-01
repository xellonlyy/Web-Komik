import Link from "next/link";

interface MangaCardProps {
  id: string;
  title: string;
  imageUrl: string;
  status?: string;
}

export default function MangaCard({
  id,
  title,
  imageUrl,
  status,
}: MangaCardProps) {
  return (
    <Link
      href={`/manga/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(89,150,255,0.4)] border-2 border-zinc-700/50 hover:border-primary-400"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl ? `/api/image?url=${encodeURIComponent(imageUrl)}` : "https://placehold.co/300x400/09090b/ffffff?text=No+Cover"}
          alt={`Cover for ${title}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Top badges */}
        {status && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md uppercase tracking-wider border border-white/10 shadow-xl">
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'ongoing' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : status === 'completed' ? 'bg-primary-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-zinc-400'}`} />
            {status}
          </div>
        )}

        {/* Bottom Text Content */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform transition-transform duration-300 group-hover:-translate-y-1">
          <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight drop-shadow-md" title={title}>
            {title}
          </h3>
          <div className="mt-2 h-1 w-8 rounded-full bg-primary-500 opacity-0 transition-all duration-300 group-hover:w-12 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}
