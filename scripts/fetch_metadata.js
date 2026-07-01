require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration
const PAGES_TO_FETCH = 3; // Fetch 3 pages (25 items each) = 75 anime

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to generate a slug from a title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Helper to delay execution (rate limiting)
const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchAnimeMetadata() {
  console.log(`Fetching ${PAGES_TO_FETCH} pages of top anime metadata from Jikan API...`);
  
  try {
    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
      console.log(`Fetching page ${page}...`);
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the raw API response to match our database schema
      const formattedData = data.data.map(anime => ({
        mal_id: anime.mal_id,
        title: anime.title_english || anime.title,
        slug: generateSlug(anime.title_english || anime.title),
        synopsis: anime.synopsis,
        poster_url: anime.images.webp.large_image_url || anime.images.jpg.large_image_url,
        rating: anime.score ? anime.score.toString() : "N/A",
        status: anime.status,
        episodes_count: anime.episodes || 0,
      }));

      // Insert or Update the data in Supabase (Upsert based on mal_id which we should ensure is unique)
      // Since mal_id is UNIQUE in our schema, we can upsert.
      const { error } = await supabase
        .from('anime')
        .upsert(formattedData, { onConflict: 'mal_id' });

      if (error) {
        console.error(`Error inserting page ${page} to Supabase:`, error);
      } else {
        console.log(`Successfully saved ${formattedData.length} records from page ${page} to Supabase.`);
      }
      
      // Respect Jikan API rate limit
      if (page < PAGES_TO_FETCH) {
        await delay(1000);
      }
    }

    console.log(`Finished fetching and saving anime data to Supabase!`);
    
  } catch (error) {
    console.error('Failed to fetch anime metadata:', error);
  }
}

fetchAnimeMetadata();
