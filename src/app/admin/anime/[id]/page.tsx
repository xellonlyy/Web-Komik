import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { addEpisode, deleteEpisode } from "./actions";

export default async function AdminAnimeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Anime details
  const { data: anime, error: animeError } = await supabase
    .from("anime")
    .select("*")
    .eq("id", id)
    .single();

  if (animeError || !anime) {
    notFound();
  }

  // Fetch Episodes
  const { data: episodes } = await supabase
    .from("episodes")
    .select("*")
    .eq("anime_id", id)
    .order("episode_number", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/admin/catalog"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          &larr; Back to Catalog
        </Link>
        <h1 className="text-2xl font-bold text-white">Manage Episodes: {anime.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Add Episode Form */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold text-white mb-4">Add New Episode</h2>
          <form action={addEpisode.bind(null, id)} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Episode Number</label>
              <input 
                type="number" 
                name="episode_number" 
                required 
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 1"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Episode Title (Optional)</label>
              <input 
                type="text" 
                name="title" 
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. The Beginning"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Raw Video URL</label>
              <input 
                type="url" 
                name="video_url" 
                required 
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://yourserver.com/video.mp4"
              />
              <p className="mt-1 text-xs text-zinc-500">Supports .mp4 or .m3u8 URLs</p>
            </div>
            <button 
              type="submit"
              className="mt-2 w-full rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-500"
            >
              Add Episode
            </button>
          </form>
        </div>

        {/* Episode List */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
            <h2 className="text-lg font-bold text-white">Uploaded Episodes</h2>
          </div>
          
          {episodes && episodes.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {episodes.map((ep) => (
                <div key={ep.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/50 transition-colors">
                  <div>
                    <div className="font-medium text-white">Episode {ep.episode_number}</div>
                    <div className="text-sm text-zinc-400 max-w-md truncate">{ep.video_url}</div>
                  </div>
                  <form action={deleteEpisode.bind(null, ep.id, id)}>
                    <button type="submit" className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-950 transition-colors">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500">
              No episodes uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
