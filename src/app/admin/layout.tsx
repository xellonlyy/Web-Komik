import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your streaming platform.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        {/* Simple top bar for admin */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">
          <h2 className="text-lg font-medium text-zinc-200">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white">
              AD
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
