"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTags } from "@/utils/mangadex";

interface Tag {
  id: string;
  name: string;
  group: string;
}

export default function GenreFilter() {
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const allTags = await getTags();
        // Filter out format tags or keep only genre/theme
        const genreTags = allTags.filter(t => t.group === "genre" || t.group === "theme");
        // Sort alphabetically
        genreTags.sort((a, b) => a.name.localeCompare(b.name));
        setTags(genreTags);
      } catch (e) {
        console.error(e);
      }
    }
    fetchTags();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleGenreClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeGenre === id) {
      params.delete("genre"); // Toggle off
    } else {
      params.set("genre", id);
      params.set("page", "1"); // Reset pagination
    }
    router.push(`/?${params.toString()}`);
  };

  if (tags.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto mb-10 relative group">
      {/* Scroll Left Button */}
      <button 
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#0a0a0c]/80 backdrop-blur-md rounded-full text-zinc-400 hover:text-white border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Genres List */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-12 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tags.map((tag) => {
          const isActive = activeGenre === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => handleGenreClick(tag.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-primary-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-primary-400" 
                  : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button 
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#0a0a0c]/80 backdrop-blur-md rounded-full text-zinc-400 hover:text-white border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
