"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MangaDexChapter } from "@/utils/mangadex";

export default function ChapterList({ chapters, mangaId, mangaTitle }: { chapters: MangaDexChapter[], mangaId: string, mangaTitle: string }) {
  const [filter, setFilter] = useState<"all" | "id" | "en">("all");
  const [readChapters, setReadChapters] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("readChapters");
      if (stored) {
        setReadChapters(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filteredChapters = chapters.filter((ch) => {
    if (filter === "all") return true;
    return ch.attributes.translatedLanguage === filter;
  });

  return (
    <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Chapters <span className="text-sm font-normal text-zinc-500 ml-2">{filteredChapters.length} available</span></h2>
        
        {/* Language Filter */}
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800/80 w-fit">
          <button 
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "all" ? "bg-primary-600 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            All Languages
          </button>
          <button 
            onClick={() => setFilter("id")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "id" ? "bg-primary-600 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            Indonesian 🇮🇩
          </button>
          <button 
            onClick={() => setFilter("en")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "en" ? "bg-primary-600 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            English 🇬🇧
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-zinc-800/50 max-h-[600px] overflow-y-auto">
        {filteredChapters.length > 0 ? (
          filteredChapters.map((chapter) => {
            const isRead = readChapters.includes(chapter.id);
            return (
              <Link 
                key={chapter.id}
                href={`/manga/${mangaId}/chapter/${chapter.id}`}
                className={`flex items-center justify-between px-6 py-4 transition-colors group ${isRead ? 'bg-zinc-900/10 hover:bg-zinc-900/20' : 'hover:bg-zinc-800/30'}`}
              >
                <div>
                  <div className={`font-medium transition-colors ${isRead ? 'text-accent-400 group-hover:text-accent-300' : 'text-zinc-200 group-hover:text-primary-400'}`}>
                    Chapter {chapter.attributes.chapter || "Oneshot"}
                    {chapter.attributes.title ? ` - ${chapter.attributes.title}` : ""}
                    {isRead && <span className="ml-2 text-xs bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full border border-accent-500/30">Read</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className={`text-xs uppercase tracking-wider font-semibold ${chapter.attributes.translatedLanguage === 'id' ? 'text-emerald-400' : 'text-primary-400'} ${isRead ? 'opacity-70' : ''}`}>
                      {chapter.attributes.translatedLanguage === 'id' ? '🇮🇩 Indonesian' : '🇬🇧 English'}
                    </div>
                    {chapter.relationships?.find(rel => rel.type === 'scanlation_group')?.attributes?.name && (
                      <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <span>•</span>
                        <span>{chapter.relationships.find(rel => rel.type === 'scanlation_group')?.attributes?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-sm px-4 py-2 rounded-lg border transition-all ${isRead ? 'bg-zinc-900/30 border-zinc-800/50 text-accent-300 group-hover:bg-zinc-800 group-hover:text-white' : 'text-zinc-300 bg-zinc-800/50 border-zinc-700/50 group-hover:bg-primary-600 group-hover:border-primary-500 group-hover:text-white'}`}>
                  {isRead ? 'Read Again \u2192' : 'Read \u2192'}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-zinc-400 text-lg">No chapters found for this language.</p>
            <p className="text-zinc-600 text-sm mt-1">Try selecting a different language or check back later.</p>
          </div>
        )}
      </div>

      {/* Alternative Sources Fallback */}
      <div className="p-6 bg-zinc-950/50 border-t border-zinc-800/50">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl mb-2">🔍</span>
          <h3 className="text-zinc-200 font-medium mb-1">Chapters Missing or Incomplete?</h3>
          <p className="text-zinc-500 text-sm mb-4 max-w-md">
            MangaDex might not have the full chapters due to official licensing (DMCA) removals. Try searching on external sites:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href={`https://bato.to/search?word=${encodeURIComponent(mangaTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors border border-orange-500"
            >
              Search on Bato.to ↗
            </a>
            <a 
              href={`https://mangakakalot.com/search/story/${encodeURIComponent(mangaTitle.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').toLowerCase())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors border border-emerald-500"
            >
              Search on Mangakakalot ↗
            </a>
            <a 
              href={`https://komiku.org/?post_type=manga&s=${encodeURIComponent(mangaTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors border border-primary-500"
            >
              Search on Komiku ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
