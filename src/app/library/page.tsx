"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MangaCard from "@/components/MangaCard";

interface LibraryItem {
  id: string;
  title: string;
  coverUrl: string;
  status?: string;
  lastReadAt: number;
}

export default function LibraryPage() {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("readLibrary");
      if (stored) {
        setLibrary(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse library", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLibrary = () => {
    if (confirm("Are you sure you want to clear your reading history?")) {
      localStorage.removeItem("readLibrary");
      localStorage.removeItem("readChapters");
      setLibrary([]);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0c] px-4 py-12 md:px-8 overflow-hidden">
      {/* Premium Background Mesh */}
      <div className="absolute inset-0 z-0 flex justify-center pointer-events-none opacity-30">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[500px] rounded-[100%] bg-primary-600/20 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col items-center sm:flex-row sm:justify-between sm:items-end gap-6 border-b border-zinc-800/50 pb-6">
          <div>
            <nav className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
              <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-zinc-100 font-medium">My Library</span>
            </nav>
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
              My <span className="text-primary-400">Library</span>
            </h1>
            <p className="mt-2 text-zinc-400 text-sm">Comics you have read recently.</p>
          </div>

          {library.length > 0 && (
            <button 
              onClick={clearLibrary}
              className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-semibold transition-colors"
            >
              Clear History
            </button>
          )}
        </header>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : library.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-6">
            {library.map((item) => (
              <MangaCard
                key={item.id}
                id={item.id}
                title={item.title}
                imageUrl={item.coverUrl}
                status={item.status}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center">
            <span className="text-6xl mb-6 block opacity-50">📚</span>
            <h2 className="text-2xl font-bold text-zinc-300 mb-2">Your library is empty</h2>
            <p className="text-zinc-500 mb-8 max-w-md">You haven&apos;t read any comics yet. Start exploring the homepage to find something interesting!</p>
            <Link 
              href="/"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all"
            >
              Explore Comics
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
