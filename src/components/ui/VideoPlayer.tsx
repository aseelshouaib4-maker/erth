"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaRef, VideoSource } from "@/lib/placeholder";
import { MediaFrame } from "./Placeholders";

type Props = {
  media: MediaRef;
  /** width / height; omit when `fill` */
  ratio?: number;
  /** stretch to the parent (parent must be relative) */
  fill?: boolean;
  tone?: "blue" | "night" | "dark" | "mist" | "paper";
  unitSize?: "sm" | "md" | "lg";
  sizes?: string;
  className?: string;
};

const sourceKey = (video: VideoSource) => (video.type === "file" ? video.src : video.embedUrl);

/** Embeds start playing when opened: the visitor already pressed play on the poster. */
function autoplayUrl(video: Extract<VideoSource, { type: "embed" }>) {
  const url = new URL(video.embedUrl);
  url.searchParams.set("autoplay", video.provider === "facebook" ? "true" : "1");
  return url.toString();
}

/**
 * A video frame that plays in place. Shows the poster (or the placeholder)
 * until pressed, then the uploaded file in a native player or the linked
 * video in its provider's player. Without a source it is just the frame.
 */
export function VideoPlayer({ media, ratio, fill, tone = "dark", unitSize = "lg", sizes, className }: Props) {
  const [playing, setPlaying] = useState<string | null>(null);
  const video = media.video;

  if (!video) {
    return <MediaFrame media={media} ratio={ratio} fill={fill} tone={tone} unitSize={unitSize} sizes={sizes} className={className} />;
  }

  const key = sourceKey(video);
  const box = cn(fill ? "absolute inset-0" : "relative w-full", "overflow-hidden bg-night", className);
  const aspect = fill ? undefined : { aspectRatio: `${ratio ?? media.ratio ?? 16 / 9}` };

  if (playing === key) {
    return (
      <div className={box} style={aspect}>
        {video.type === "file" ? (
          <video
            key={key}
            src={video.src}
            poster={media.image?.src}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <iframe
            key={key}
            src={autoplayUrl(video)}
            title={media.label}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(key)}
      aria-label={`تشغيل: ${media.label}`}
      className={cn("group block w-full text-start", fill && "absolute inset-0")}
    >
      <MediaFrame media={media} ratio={ratio} fill={fill} tone={tone} unitSize={unitSize} sizes={sizes} interactive className={className} />
    </button>
  );
}
