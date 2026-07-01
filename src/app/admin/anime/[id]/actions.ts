"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addEpisode(animeId: string, formData: FormData) {
  const supabase = await createClient();
  
  const episodeNumber = parseInt(formData.get("episode_number") as string);
  const videoUrl = formData.get("video_url") as string;
  const title = formData.get("title") as string;

  if (isNaN(episodeNumber) || !videoUrl) {
    return { error: "Episode number and Video URL are required." };
  }

  const { error } = await supabase
    .from("episodes")
    .insert({
      anime_id: animeId,
      episode_number: episodeNumber,
      video_url: videoUrl,
      title: title || `Episode ${episodeNumber}`
    });

  if (error) {
    console.error("Add Episode Error:", error);
    return { error: error.message };
  }

  // Update the anime's episodes_count
  const { data: currentAnime } = await supabase
    .from("anime")
    .select("episodes_count")
    .eq("id", animeId)
    .single();
    
  if (currentAnime && episodeNumber > currentAnime.episodes_count) {
    await supabase
      .from("anime")
      .update({ episodes_count: episodeNumber })
      .eq("id", animeId);
  }

  revalidatePath(`/admin/anime/${animeId}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteEpisode(episodeId: string, animeId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("episodes")
    .delete()
    .eq("id", episodeId);

  if (error) {
    console.error("Delete Episode Error:", error);
    return { error: error.message };
  }

  revalidatePath(`/admin/anime/${animeId}`);
  revalidatePath("/");
  return { success: true };
}
