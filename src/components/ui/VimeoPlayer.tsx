"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type VimeoPlayerType from "@vimeo/player";

type Props = {
  videoId: number;
  poster?: string;
  /** % of player that must be visible before it auto-plays. */
  playThreshold?: number;
};

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VimeoPlayer({
  videoId,
  poster,
  playThreshold = 0.55,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VimeoPlayerType | null>(null);

  // Defer SDK/iframe creation until the player is near the viewport (perf).
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);

  // Tracks an explicit user pause so scroll-into-view doesn't override intent
  // while the player stays on screen. Reset whenever it leaves the viewport.
  const userPausedRef = useRef(false);
  const lastVolumeRef = useRef(1);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Lazy mount: load the player when it gets within 600px of the viewport ── */
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  /* ── Create the Vimeo player once we should load ── */
  useEffect(() => {
    if (!shouldLoad || !mountRef.current) return;
    let disposed = false;

    (async () => {
      const Player = (await import("@vimeo/player")).default;
      if (disposed || !mountRef.current) return;

      const player = new Player(mountRef.current, {
        id: videoId,
        controls: false,
        muted: true,
        autoplay: false,
        loop: true,
        title: false,
        byline: false,
        portrait: false,
        responsive: true,
        dnt: true,
      });
      playerRef.current = player;

      player.on("loaded", () => {
        player.getDuration().then((d) => !disposed && setDuration(d)).catch(() => {});
        setReady(true);
      });
      player.on("play", () => setIsPlaying(true));
      player.on("pause", () => setIsPlaying(false));
      player.on("ended", () => setIsPlaying(false));
      player.on("timeupdate", ({ seconds, duration: d }) => {
        if (scrubbingRef.current) return;
        setCurrent(seconds);
        if (d) setDuration(d);
      });
      player.on("progress", ({ percent }) => setBuffered(percent));
      player.on("volumechange", ({ volume: v }) => {
        setVolume(v);
        setMuted(v === 0);
        if (v > 0) lastVolumeRef.current = v;
      });
    })();

    return () => {
      disposed = true;
      playerRef.current?.destroy().catch(() => {});
      playerRef.current = null;
    };
  }, [shouldLoad, videoId]);

  // Keep a ref of scrubbing for the timeupdate handler closure
  const scrubbingRef = useRef(false);
  useEffect(() => {
    scrubbingRef.current = scrubbing;
  }, [scrubbing]);

  /* ── Scroll-triggered play / pause ── */
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !ready) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const player = playerRef.current;
        if (!player) return;
        if (entry.isIntersecting && entry.intersectionRatio >= playThreshold) {
          if (!userPausedRef.current) player.play().catch(() => {});
        } else {
          // Out of view → pause and clear manual-pause memory so returning replays.
          player.pause().catch(() => {});
          userPausedRef.current = false;
        }
      },
      { threshold: [0, playThreshold, 1] }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ready, playThreshold]);

  /* ── Pause when the tab is hidden ── */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) playerRef.current?.pause().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* ── Fullscreen state sync ── */
  useEffect(() => {
    const onFs = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* ── Auto-hide controls while playing ── */
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying && !scrubbingRef.current) setControlsVisible(false);
    }, 2800);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) setControlsVisible(true);
    else showControls();
  }, [isPlaying, showControls]);

  /* ── Control handlers ── */
  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      userPausedRef.current = true;
      player.pause().catch(() => {});
    } else {
      userPausedRef.current = false;
      player.play().catch(() => {});
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      const v = lastVolumeRef.current || 1;
      player.setVolume(v).catch(() => {});
    } else {
      player.setVolume(0).catch(() => {});
    }
  }, [muted]);

  const onVolumeInput = useCallback((v: number) => {
    playerRef.current?.setVolume(v).catch(() => {});
  }, []);

  const seekToClientX = useCallback(
    (clientX: number, track: HTMLDivElement) => {
      const rect = track.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const t = pct * duration;
      setCurrent(t);
      playerRef.current?.setCurrentTime(t).catch(() => {});
      return t;
    },
    [duration]
  );

  const toggleFullscreen = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      node.requestFullscreen().catch(() => {});
    }
  }, []);

  const progressPct = duration ? (current / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group/player relative aspect-video w-full overflow-hidden rounded-[1.25rem] bg-black border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
      onMouseMove={showControls}
      onMouseEnter={showControls}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
    >
      {/* Poster shown until the SDK reports ready */}
      {poster && !ready && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt="hackX Grand Finals"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}

      {/* Vimeo mounts its iframe here */}
      <div ref={mountRef} className="absolute inset-0 h-full w-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full" />

      {/* Loading shimmer before ready */}
      {shouldLoad && !ready && (
        <div className="absolute inset-0 grid place-items-center bg-black/40">
          <div className="size-10 animate-spin rounded-full border-2 border-white/15 border-t-[#72E5F8]" />
        </div>
      )}

      {/* Click surface to toggle play/pause */}
      <button
        type="button"
        aria-label={isPlaying ? "Pause video" : "Play video"}
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer"
        tabIndex={-1}
      />

      {/* Center play badge when paused */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 grid place-items-center transition-opacity duration-300 ${
          ready && !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="flex size-[72px] items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg shadow-black/40">
          <svg viewBox="0 0 24 24" className="size-7 fill-current translate-x-[1px]">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </span>
      </div>

      {/* Unmute nudge — only while muted & playing */}
      {ready && isPlaying && muted && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/15 transition-colors hover:bg-[#72E5F8]/25 hover:border-[#72E5F8]/40"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
          Tap to unmute
        </button>
      )}

      {/* ── Control bar ── */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 px-3 pb-3 pt-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${
          controlsVisible || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Seek bar */}
        <div
          className="group/seek relative mb-2.5 h-3 cursor-pointer"
          onMouseDown={(e) => {
            setScrubbing(true);
            seekToClientX(e.clientX, e.currentTarget);
            const track = e.currentTarget;
            const move = (ev: MouseEvent) => seekToClientX(ev.clientX, track);
            const up = () => {
              setScrubbing(false);
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
        >
          <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded-full bg-white/20">
            {/* buffered */}
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${buffered * 100}%` }} />
            {/* played */}
            <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#18A0C0] to-[#72E5F8]" style={{ width: `${progressPct}%` }} />
          </div>
          {/* scrubber handle */}
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow opacity-0 transition-opacity group-hover/seek:opacity-100"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3 text-white">
          <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="shrink-0 transition-transform hover:scale-110">
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="size-5 fill-current"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-5 fill-current"><polygon points="6 4 20 12 6 20 6 4" /></svg>
            )}
          </button>

          {/* Volume */}
          <div className="group/vol flex items-center gap-1.5">
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="shrink-0 transition-transform hover:scale-110">
              {muted || volume === 0 ? (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => onVolumeInput(parseFloat(e.target.value))}
              aria-label="Volume"
              className="vimeo-volume w-0 opacity-0 transition-all duration-300 group-hover/vol:w-16 group-hover/vol:opacity-100"
            />
          </div>

          {/* Time */}
          <span className="ml-0.5 text-xs font-medium tabular-nums text-white/80">
            {formatTime(current)} <span className="text-white/40">/ {formatTime(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-3">
            <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} className="shrink-0 transition-transform hover:scale-110">
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
