"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Captions, Gauge, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/format";

const SPEEDS = [1, 1.25, 1.5, 2] as const;
const SAVE_INTERVAL_SECONDS = 5;

export function VideoPlayer({
  lessonId,
  title,
  poster,
  hasCaptions,
  initialPositionSeconds,
  onEnded,
  onPositionSave,
}: {
  lessonId: string;
  title: string;
  poster?: string | null;
  hasCaptions: boolean;
  initialPositionSeconds: number;
  onEnded?: () => void;
  onPositionSave?: (positionSeconds: number, watchedPercent: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedRef = useRef(0);
  const restoredRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [speed, setSpeed] = useState(1);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadata = () => {
      setStatus("ready");
      setDuration(video.duration);
      if (
        !restoredRef.current &&
        initialPositionSeconds > 1 &&
        initialPositionSeconds < video.duration - 3
      ) {
        video.currentTime = initialPositionSeconds;
      }
      restoredRef.current = true;
    };

    const handleError = () => {
      setStatus("error");
    };

    const handleWaiting = () => setStatus("loading");
    const handlePlaying = () => setStatus("ready");
    const handleDurationChange = () => setDuration(video.duration);

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("error", handleError);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("error", handleError);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [initialPositionSeconds]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (!onPositionSave) return;

    if (Math.abs(video.currentTime - lastSavedRef.current) >= SAVE_INTERVAL_SECONDS) {
      lastSavedRef.current = video.currentTime;
      const percent = video.duration > 0 ? (video.currentTime / video.duration) * 100 : 0;
      onPositionSave(video.currentTime, percent);
    }
  }, [onPositionSave]);

  const changeSpeed = (value: number) => {
    setSpeed(value);
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const toggleCaptions = () => {
    const next = !captionsOn;
    setCaptionsOn(next);
    const tracks = videoRef.current?.textTracks;
    if (tracks && tracks.length > 0) {
      tracks[0].mode = next ? "showing" : "hidden";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas-secondary">
      <div className="relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          className="h-full w-full"
          controls
          playsInline
          preload="metadata"
          poster={poster ?? undefined}
          aria-label={title}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => onEnded?.()}
        >
          <source src={`/api/media/${lessonId}`} type="video/mp4" />
          {hasCaptions ? (
            <track
              kind="captions"
              src={`/api/media/${lessonId}/captions`}
              srcLang="en"
              label="English"
            />
          ) : null}
          Your browser does not support embedded video. Open this lesson in a modern
          browser to continue.
        </video>

        {status === "loading" ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-canvas/45">
            <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface/90 px-3.5 py-2 text-[0.8125rem] text-ink-secondary">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading lesson video
            </span>
          </div>
        ) : null}

        {status === "error" ? (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-canvas/92 px-6 text-center"
          >
            <AlertTriangle className="h-7 w-7 text-warning" aria-hidden="true" />
            <p className="text-[0.9375rem] font-medium text-ink">Playback error</p>
            <p className="max-w-md text-[0.875rem] leading-relaxed text-ink-secondary">
              This lesson video could not be played. The media file may be unavailable
              or the connection was interrupted.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
            Speed
          </span>
          <div className="flex items-center gap-1" role="group" aria-label="Playback speed">
            {SPEEDS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => changeSpeed(value)}
                aria-pressed={speed === value}
                className={cn(
                  "rounded-sm px-2 py-1 font-mono text-[0.75rem] transition-colors",
                  speed === value
                    ? "bg-acid/15 text-acid"
                    : "text-ink-muted hover:bg-canvas-secondary hover:text-ink"
                )}
              >
                {value}x
              </button>
            ))}
          </div>

          {hasCaptions ? (
            <button
              type="button"
              onClick={toggleCaptions}
              aria-pressed={captionsOn}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[0.75rem] transition-colors",
                captionsOn
                  ? "border-acid/40 bg-acid/10 text-acid"
                  : "border-line text-ink-muted hover:text-ink"
              )}
            >
              <Captions className="h-3.5 w-3.5" aria-hidden="true" />
              Captions
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-4 text-[0.75rem] text-ink-muted">
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            {duration > 0 ? `${formatClock(currentTime)} / ${formatClock(duration)}` : "--:--"}
          </span>
          <span className="hidden sm:inline">
            Speed and captions are also available in the player controls.
          </span>
        </div>
      </div>
    </div>
  );
}
