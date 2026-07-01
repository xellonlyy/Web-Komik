"use client";

import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
  type?: "video/mp4" | "application/x-mpegURL";
}

export default function VideoPlayer({ videoUrl, poster, type = "video/mp4" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Plyr
    playerRef.current = new Plyr(videoRef.current, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["quality", "speed", "loop"],
      quality: {
        default: 1080,
        options: [1080, 720, 480, 360],
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full aspect-video overflow-hidden rounded-xl bg-black shadow-2xl shadow-primary-500/20 border border-zinc-800/50">
      {/* We use global CSS overrides in globals.css to theme Plyr to our dark aesthetic */}
      <video
        ref={videoRef}
        className="plyr-react plyr"
        controls
        crossOrigin="anonymous"
        playsInline
        data-poster={poster}
      >
        <source src={videoUrl} type={type} />
      </video>
    </div>
  );
}
