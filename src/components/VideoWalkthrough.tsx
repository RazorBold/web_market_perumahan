'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CINEMATIC_CHAPTERS } from '../data/propertyData';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  Film,
  Sparkles,
  Maximize2,
  ChevronRight,
  RotateCcw,
  Box,
} from 'lucide-react';

interface VideoWalkthroughProps {
  onLaunch3D?: () => void;
}

export const VideoWalkthrough: React.FC<VideoWalkthroughProps> = ({ onLaunch3D }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Per-frame values live in refs so the animation loop never triggers React re-renders
  const cameraAngleRef = useRef(0);
  const progressRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientOscillatorRef = useRef<OscillatorNode | null>(null);

  const currentChapter = CINEMATIC_CHAPTERS[activeChapterIndex];

  // No autoplay for visitors who asked for reduced motion (window is only available after hydration)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setIsPlaying(false);
  }, []);

  // Procedural Cinematic Canvas Rendering for the Virtual Walkthrough Video
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;

    const renderFrame = () => {
      animId = 0;
      const w = canvas.width;
      const h = canvas.height;

      // Advance simulated drone pan if playing
      if (isPlaying) {
        cameraAngleRef.current += 0.004;
        progressRef.current = progressRef.current >= 100 ? 0 : progressRef.current + 0.1;
        if (progressBarRef.current) progressBarRef.current.style.width = `${progressRef.current}%`;
      }
      const localAngle = cameraAngleRef.current;

      // Draw background cinematic architectural scene
      ctx.clearRect(0, 0, w, h);

      // Sky gradient (warm sunset / golden hour luxury)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      skyGrad.addColorStop(0, '#1d2720');
      skyGrad.addColorStop(0.5, '#403028');
      skyGrad.addColorStop(1, '#9e673a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.7);

      // Distant mountain silhouette (Gunung Merapi Yogyakarta)
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.lineTo(w * 0.35, h * 0.28 + Math.sin(localAngle * 0.5) * 5);
      ctx.lineTo(w * 0.45, h * 0.34);
      ctx.lineTo(w * 0.6, h * 0.22 + Math.cos(localAngle * 0.5) * 4);
      ctx.lineTo(w, h * 0.6);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fillStyle = '#1c2820';
      ctx.fill();

      // Lush forest canopy layer
      for (let i = 0; i < 24; i++) {
        const tx = ((i * 80 + localAngle * 80) % (w + 100)) - 50;
        const ty = h * 0.52 + Math.sin(i * 1.5) * 15;
        const radius = 45 + (i % 3) * 15;
        ctx.beginPath();
        ctx.arc(tx, ty, radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#1b3b24' : '#275233';
        ctx.fill();
      }

      // Modern Villa Joglo Architecture Silhouette & Warm Lighting
      const houseX = w * 0.5 + Math.sin(localAngle) * 30;
      const houseY = h * 0.65;

      // Ground lawn
      const lawnGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
      lawnGrad.addColorStop(0, '#243b24');
      lawnGrad.addColorStop(1, '#111d14');
      ctx.fillStyle = lawnGrad;
      ctx.fillRect(0, h * 0.65, w, h * 0.35);

      // Stone driveway & reflecting pool
      ctx.fillStyle = '#3a443e';
      ctx.fillRect(houseX - 160, houseY + 40, 320, 80);

      // Water reflection
      ctx.fillStyle = '#29535c';
      ctx.fillRect(houseX + 70, houseY + 45, 100, 50);

      // Villa Body
      ctx.fillStyle = '#e8ded0';
      ctx.fillRect(houseX - 120, houseY - 90, 240, 120);

      // 2nd floor balcony & dark wood louvers
      ctx.fillStyle = '#222824';
      ctx.fillRect(houseX - 130, houseY - 100, 260, 20);

      // Warm interior glowing windows
      ctx.fillStyle = '#ffb247';
      ctx.fillRect(houseX - 90, houseY - 70, 70, 45);
      ctx.fillRect(houseX + 20, houseY - 70, 80, 45);

      // Traditional Javanese modern pitched roof
      ctx.beginPath();
      ctx.moveTo(houseX - 150, houseY - 100);
      ctx.lineTo(houseX, houseY - 165);
      ctx.lineTo(houseX + 150, houseY - 100);
      ctx.closePath();
      ctx.fillStyle = '#3f3732';
      ctx.fill();

      // Ridge highlight
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#c88242';
      ctx.beginPath();
      ctx.moveTo(houseX - 60, houseY - 165);
      ctx.lineTo(houseX + 60, houseY - 165);
      ctx.stroke();

      // Golden hour sunlight glow
      const sunGlow = ctx.createRadialGradient(w * 0.8, h * 0.25, 20, w * 0.8, h * 0.25, 240);
      sunGlow.addColorStop(0, 'rgba(255, 210, 150, 0.45)');
      sunGlow.addColorStop(0.5, 'rgba(212, 130, 66, 0.15)');
      sunGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, w, h);

      // Drone flight HUD overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, w - 80, h - 80);

      // Target reticle
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 28, 0, Math.PI * 2);
      ctx.stroke();

      // Paused: one static frame is enough. Offscreen: stop until it scrolls back into view.
      if (isPlaying && isVisible) animId = requestAnimationFrame(renderFrame);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && isPlaying && !animId) animId = requestAnimationFrame(renderFrame);
    });
    observer.observe(canvas);

    animId = requestAnimationFrame(renderFrame);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  const resetProgress = () => {
    progressRef.current = 0;
    if (progressBarRef.current) progressBarRef.current.style.width = '0%';
  };

  // Release the audio context when the section unmounts
  useEffect(() => {
    return () => {
      ambientOscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  // Audio synthesizer for tropical birds / breeze ambiance
  const toggleAudio = () => {
    if (isMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Ambient gentle soothing wind tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        ambientOscillatorRef.current = osc;
        setIsMuted(false);
      } catch (e) {
        console.warn('Audio not supported', e);
      }
    } else {
      if (ambientOscillatorRef.current) {
        ambientOscillatorRef.current.stop();
        ambientOscillatorRef.current.disconnect();
        ambientOscillatorRef.current = null;
      }
      setIsMuted(true);
    }
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
              <Film className="w-3.5 h-3.5" /> Virtual Video Tour & Drone Flythrough
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#f5f1e8]">
              Sinematik Kawasan <br />
              <span className="italic font-normal text-[#d4a373]">Hyarta Ecovillage</span>
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

        {/* Video Player Display Container */}
        <div className="rounded-3xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl relative">
          {/* Simulated Cinematic Canvas */}
          <canvas
            ref={canvasRef}
            width={1280}
            height={680}
            className="w-full h-[360px] sm:h-[480px] md:h-[560px] object-cover block"
          />

          {/* Top HUD Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono tracking-wider text-white/90">4K UHD ARCHITECTURAL DRONE TOUR</span>
              <span className="text-white/40">•</span>
              <span className="text-[#d4a373]">{currentChapter.title}</span>
            </div>

            <button
              onClick={toggleAudio}
              className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white hover:bg-black/80 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-[#d4a373]" />}
              <span>{isMuted ? 'Breeze Ambiance Off' : 'Ambiance On'}</span>
            </button>
          </div>

          {/* Bottom Player Controller Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 sm:p-6 space-y-3">
            {/* Scrubber Progress Bar */}
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
              <div ref={progressBarRef} className="bg-[#d4a373] h-full rounded-full" style={{ width: '0%' }} />
            </div>

            <div className="flex items-center justify-between text-xs text-white/80">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Jeda tur' : 'Putar tur'}
                  className="w-9 h-9 rounded-full bg-[#d4a373] text-[#131a15] flex items-center justify-center hover:scale-105 transition-all shadow-md font-bold"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div>
                  <h4 className="font-semibold text-white text-sm">{currentChapter.title}</h4>
                  <p className="text-[11px] text-white/60">{currentChapter.description}</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="font-mono text-white/50">{currentChapter.duration}</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-[#d4a373]">
                  60 FPS FLIGHT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {CINEMATIC_CHAPTERS.map((chap, idx) => {
            const isSelected = activeChapterIndex === idx;
            return (
              <div
                key={chap.id}
                onClick={() => {
                  setActiveChapterIndex(idx);
                  resetProgress();
                  setIsPlaying(true);
                }}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#223126] border-[#d4a373] shadow-lg shadow-[#d4a373]/10 scale-[1.02]'
                    : 'bg-[#18231c]/70 hover:bg-[#1f2d23] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#d4a373] uppercase tracking-wider">
                    Bab {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">{chap.duration}</span>
                </div>
                <h5 className="font-semibold text-xs text-white line-clamp-1">{chap.title}</h5>
                <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed">
                  {chap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
