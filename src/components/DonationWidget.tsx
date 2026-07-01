"use client";

import Link from "next/link";

export default function DonationWidget() {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl shadow-2xl hover:shadow-primary-500/20 hover:border-zinc-700 transition-all duration-300">
      
      {/* Library Button */}
      <Link 
        href="/library" 
        className="flex items-center gap-2 bg-zinc-800/80 hover:bg-primary-600 text-zinc-100 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border border-zinc-700/50 shadow-lg"
      >
        <span>📚</span>
        <span className="hidden sm:inline">Library</span>
      </Link>

      {/* Donate Button */}
      <Link 
        href="https://saweria.co/Zyxel" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 bg-gradient-to-r from-[#FFB020] to-[#FF9000] text-black px-4 py-2.5 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,176,32,0.4)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600 animate-pulse">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
        Support Me
      </Link>
    </div>
  );
}
