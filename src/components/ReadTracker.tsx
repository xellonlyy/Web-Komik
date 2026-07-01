"use client";

import { useEffect } from "react";

interface LibraryItem {
  id: string;
  title: string;
  coverUrl: string;
  status?: string;
  lastReadAt: number;
}

export default function ReadTracker({ 
  chapterId, 
  mangaId,
  title,
  coverUrl,
  status
}: { 
  chapterId: string;
  mangaId: string;
  title: string;
  coverUrl: string;
  status?: string;
}) {
  useEffect(() => {
    try {
      // 1. Save chapter for purple highlight
      const storedChapters = localStorage.getItem("readChapters");
      const readChapters = storedChapters ? JSON.parse(storedChapters) : [];
      if (!readChapters.includes(chapterId)) {
        readChapters.push(chapterId);
        localStorage.setItem("readChapters", JSON.stringify(readChapters));
      }

      // 2. Save manga for Library
      const storedLibrary = localStorage.getItem("readLibrary");
      let readLibrary: LibraryItem[] = storedLibrary ? JSON.parse(storedLibrary) : [];
      
      // Remove if already exists so we can push it to the top (latest read)
      readLibrary = readLibrary.filter(item => item.id !== mangaId);
      
      // Add to front of array
      readLibrary.unshift({
        id: mangaId,
        title,
        coverUrl,
        status,
        lastReadAt: Date.now()
      });

      localStorage.setItem("readLibrary", JSON.stringify(readLibrary));
    } catch (e) {
      console.error("Failed to save read history", e);
    }
  }, [chapterId, mangaId, title, coverUrl, status]);

  return null; // Invisible component
}
