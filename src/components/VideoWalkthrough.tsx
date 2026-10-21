'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TOUR_VIDEO } from '../data/propertyData';
import { Play, Pause, Volume2, VolumeX, Film, Box } from 'lucide-react';

interface VideoWalkthroughProps {
  onLaunch3D?: () => void;
}

const { chapters } = TOUR_VIDEO;

const chapterAt = (time: number) => {
  let index = 0;
  chapters.forEach((chapter, i) => {
    if (time >= chapter.start) index = i;
  });
  return index;
};

const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const VideoWalkthrough: React.FC<VideoWalkthroughProps> = ({ onLaunch3D }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLInputElement>(null);
  // A visitor who pauses on purpose should not be overridden by scroll-based autoplay
  const userPausedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentChapter = chapters[activeChapterIndex];

  // Autoplay (muted) while the player is on screen; pause when scrolled away or when reduced motion is preferred
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Metadata may have loaded before hydration attached onLoadedMetadata
    if (video.readyState >= 1) setDuration(video.duration);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!prefersReducedMotion && !userPausedRef.current) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Drive the progress bar from the video clock without re-rendering every frame
  useEffect(() => {
    if (!isPlaying) return;
    let frame = 0;
    const tick = () => {
      const video = videoRef.current;
      if (video && video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
        if (scrubberRef.current) scrubberRef.current.value = String(video.currentTime);
        setActiveChapterIndex(chapterAt(video.currentTime));
        setElapsedSeconds(Math.floor(video.currentTime));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    if (progressBarRef.current && video.duration) progressBarRef.current.style.width = `${(time / video.duration) * 100}%`;
    setActiveChapterIndex(chapterAt(time));
    setElapsedSeconds(Math.floor(time));
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted && video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
    }
  };

  const playChapter = (index: number) => {
    seekTo(chapters[index].start);
    userPausedRef.current = false;
    videoRef.current?.play().catch(() => {});
  };

  return (
    <section id="video-tour" className="py-24 bg-[#141d17] text-white relative overflow-hidden">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c88242]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2e6f40]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-[#d4a373] flex items-center gap-1.5 mb-2">
              <Film className="w-3.5 h-3.5" /> Video Tur Rumah
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#f5f1e8]">
              Dari Taman <br />
              <span className="italic font-normal text-[#d4a373]">Sampai Kamar Tidur</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {onLaunch3D && (
              <button
                onClick={onLaunch3D}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-semibold tracking-wide transition-all shadow-lg"
              >
                <Box className="w-4 h-4" /> Buka Model 3D Interaktif
              </button>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl relative">
          <video
            ref={videoRef}
            src={TOUR_VIDEO.src}
            poster={TOUR_VIDEO.poster}
            muted
            loop
            playsInline
            preload="metadata"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            className="w-full aspect-video max-h-[640px] object-cover block cursor-pointer"
            aria-label="Video tur rumah Hyarta Ecovillage"
          />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/10 text-[11px] sm:text-xs min-w-0">
              <span className="text-white/70 shrink-0">Video ilustrasi</span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="text-[#d4a373] truncate hidden sm:inline">{currentChapter.title}</span>
            </div>

            <button
              onClick={toggleSound}
              className="pointer-events-auto shrink-0 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 text-xs text-white hover:bg-black/80 transition-colors"
              aria-pressed={!isMuted}
              aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-[#d4a373]" />}
              <span className="hidden sm:inline">{isMuted ? 'Nyalakan suara' : 'Suara aktif'}</span>
            </button>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-3 pt-8 sm:p-6 sm:pt-12 space-y-2 sm:space-y-3">
            {/* Scrubber: visible bar with chapter ticks, native range input on top for drag + keyboard */}
            <div className="relative h-4 flex items-center">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden relative">
                <div ref={progressBarRef} className="bg-[#d4a373] h-full rounded-full" style={{ width: '0%' }} />
              </div>
              {duration > 0 &&
                chapters.slice(1).map((chapter) => (
                  <span
                    key={chapter.id}
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2.5 bg-white/50 rounded-full pointer-events-none"
                    style={{ left: `${(chapter.start / duration) * 100}%` }}
                  />
                ))}
              <input
                ref={scrubberRef}
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                defaultValue={0}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                aria-label="Posisi video"
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-xs text-white/80">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
                  className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#d4a373] text-[#131a15] flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-xs sm:text-sm truncate">{currentChapter.title}</h4>
                  <p className="text-[11px] text-white/60 truncate hidden sm:block">{currentChapter.description}</p>
                </div>
              </div>

              <span className="font-mono text-white/60 shrink-0 tabular-nums">
                {formatTime(elapsedSeconds)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Chapters: jump to that part of the tour */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {chapters.map((chapter, idx) => {
            const isSelected = activeChapterIndex === idx;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => playChapter(idx)}
                aria-current={isSelected ? 'step' : undefined}
                className={`text-left rounded-2xl overflow-hidden transition-colors duration-200 border ${
                  isSelected ? 'bg-[#223126] border-[#d4a373]' : 'bg-[#18231c]/70 hover:bg-[#1f2d23] border-white/5'
                }`}
              >
                <span className="block relative aspect-video bg-black">
                  <Image src={chapter.thumbnail} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
                </span>
                <span className="block p-3">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#d4a373]">Bab {idx + 1}</span>
                    <span className="text-[10px] font-mono text-white/40">{formatTime(chapter.start)}</span>
                  </span>
                  <span className="block font-semibold text-xs text-white mt-1">{chapter.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
