import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
export default async function AdminCatalog() {
  const supabase = await createClient();
  const { data: LATEST_EPISODES } = await supabase
    .from("anime")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Anime Catalog</h1>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500">
          + Add Anime
        </button>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-zinc-800 bg-zinc-950/50 text-xs uppercase text-zinc-300">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">MAL ID</th>
                <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold">Episodes</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {LATEST_EPISODES?.map((anime) => (
                <tr key={anime.mal_id} className="transition-colors hover:bg-zinc-800/50">
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-zinc-500">
                    {anime.mal_id}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {anime.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                      {anime.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {anime.episodes_count}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/anime/${anime.id}`} className="text-primary-400 hover:text-primary-300 mr-3">Manage</Link>
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
