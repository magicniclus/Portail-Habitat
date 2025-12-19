"use client";

import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  src: string;
  className?: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
};

export default function VideoPlayer({
  src,
  className,
  poster,
  controls = false,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
}: VideoPlayerProps) {
  return (
    <video
      className={cn(
        "absolute inset-0 block h-full w-full bg-black object-cover pointer-events-none",
        className
      )}
      src={src}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload noplaybackrate noremoteplayback"
      preload="metadata"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
