"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchMangaAction } from "@/app/actions";
import Link from "next/link";

interface LiveSearchResult {
  id: string;
  title: string;
  cover: string | null;
  year: number | null;
  status: string;
}

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<LiveSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const liveResults = await searchMangaAction(query.trim());
          setResults(liveResults);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}&page=1`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto mb-12 relative z-50">
      <form onSubmit={handleSearch}>
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim().length >= 2) setShowDropdown(true); }}
            placeholder="Search for manga, manhwa, or comics..."
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-6 py-4 pl-12 text-zinc-100 placeholder-zinc-500 backdrop-blur-xl transition-all focus:border-primary-500 focus:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-xl"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-primary-400 transition-colors"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Search
          </button>
        </div>
      </form>

      {/* Live Search Dropdown */}
      {showDropdown && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {isSearching ? (
            <div className="p-4 text-center text-zinc-400 text-sm flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col max-h-[400px] overflow-y-auto divide-y divide-zinc-800">
              {results.map((manga) => (
                <Link 
                  key={manga.id} 
                  href={`/manga/${manga.id}`}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="w-12 h-16 flex-shrink-0 bg-zinc-800 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={manga.cover || "https://placehold.co/100x150/18181b/ffffff?text=X"} alt={manga.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <h4 className="text-zinc-100 font-semibold text-sm line-clamp-1">{manga.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {manga.status && <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{manga.status}</span>}
                      {manga.year && <span className="text-[10px] bg-zinc-800 px-1.5 rounded text-zinc-400">{manga.year}</span>}
                    </div>
                  </div>
                </Link>
              ))}
              <button 
                onClick={handleSearch}
                className="p-3 text-center text-primary-400 text-sm font-medium hover:bg-primary-500/10 transition-colors w-full"
              >
                View all results for &quot;{query}&quot; &rarr;
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-zinc-500 text-sm">
              No results found. Try pressing Enter for a full search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
