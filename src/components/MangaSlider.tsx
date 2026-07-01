"use client";

import { useRef } from "react";
import MangaCard from "./MangaCard";
import { MangaDexManga } from "@/utils/mangadex";

interface MangaSliderProps {
  title: string;
  subtitle?: string;
  mangas: MangaDexManga[];
  covers: Record<string, string>;
  icon?: string;
}

export default function MangaSlider({ title, subtitle, mangas, covers, icon }: MangaSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (mangas.length === 0) return null;

  return (
    <div className="mb-12 relative group">
      <div className="flex items-end justify-between mb-4 px-2">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
      
      <div 
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mangas.map((manga) => (
          <div key={manga.id} className="snap-start shrink-0 w-[160px] sm:w-[200px]">
            <MangaCard 
              id={manga.id}
              title={manga.attributes.title.en || manga.attributes.title["ja-ro"] || Object.values(manga.attributes.title || {})[0] || "Unknown Title"}
              imageUrl={covers[manga.id] || "https://placehold.co/400x600/18181b/ffffff?text=No+Cover"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
