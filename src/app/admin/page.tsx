export default function AdminDashboard() {
  const stats = [
    { label: "Total Anime", value: "128", trend: "+12 this week", color: "text-primary-500" },
    { label: "Total Episodes", value: "3,402", trend: "+45 this week", color: "text-primary-500" },
    { label: "Active Scrapers", value: "4", trend: "All healthy", color: "text-emerald-500" },
    { label: "Server Load", value: "24%", trend: "Stable", color: "text-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-zinc-400 text-sm font-medium mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.color}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* System Status / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Scraper Status</h2>
          <div className="space-y-4">
            {["Jikan API Sync", "MyAnimeList Fallback", "Video Source #1", "Video Source #2"].map((job, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <span className="text-zinc-300 text-sm">{job}</span>
                <span className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Running
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Updates</h2>
          <div className="space-y-4">
            {[
              "Added Episode 12 for Solo Leveling",
              "Synced new metadata for 5 series",
              "Database backup completed successfully",
              "Admin 'AD' logged in"
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
                <div className="h-2 w-2 rounded-full bg-zinc-600"></div>
                <span className="text-zinc-400 text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
