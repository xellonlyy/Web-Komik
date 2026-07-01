import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DonationWidget from "@/components/DonationWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "OctaKomik | Premium Manga Reader",
  description: "Read your favorite manga and manhwa with a beautiful, ad-free experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0c] text-zinc-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
        <DonationWidget />
        <div className="flex-grow">
          {children}
        </div>
        
        {/* MangaDex Attribution Footer */}
        <footer className="w-full bg-[#050505] border-t border-zinc-900 py-6 text-center mt-auto">
          <p className="text-zinc-500 text-sm">
            Powered by <a href="https://mangadex.org" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">MangaDex API</a>. 
            All manga and images belong to their respective publishers and scanlation groups.
          </p>
        </footer>
      </body>
    </html>
  );
}
