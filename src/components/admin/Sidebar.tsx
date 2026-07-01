import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 px-4 py-6 flex flex-col min-h-screen sticky top-0">
      <div className="mb-8 px-2">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight">Admin <span className="text-primary-500">Panel</span></span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        <Link 
          href="/admin" 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          Dashboard
        </Link>
        <Link 
          href="/admin/catalog" 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          Catalog
        </Link>
        <Link 
          href="#" 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 8 6 4-6 4Z"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
          Episodes
        </Link>
        <Link 
          href="#" 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
        </Link>
      </nav>
      
      <div className="mt-auto px-2">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Back to Main Site
        </Link>
      </div>
    </aside>
  );
}
