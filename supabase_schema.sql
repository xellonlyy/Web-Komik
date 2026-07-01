-- Supabase Schema for Anime Streaming Platform

-- 1. Create Anime table
CREATE TABLE public.anime (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mal_id BIGINT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    synopsis TEXT,
    poster_url TEXT,
    rating TEXT,
    status TEXT,
    episodes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Episodes table
CREATE TABLE public.episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    anime_id UUID REFERENCES public.anime(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(anime_id, episode_number)
);

-- 3. Set up Row Level Security (RLS)
-- Enable RLS
ALTER TABLE public.anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (so public website users can see the anime and episodes)
CREATE POLICY "Allow public read access on anime" 
    ON public.anime FOR SELECT USING (true);

CREATE POLICY "Allow public read access on episodes" 
    ON public.episodes FOR SELECT USING (true);

-- Allow authenticated users (Admin) to insert/update/delete
CREATE POLICY "Allow authenticated full access on anime" 
    ON public.anime FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access on episodes" 
    ON public.episodes FOR ALL USING (auth.role() = 'authenticated');
