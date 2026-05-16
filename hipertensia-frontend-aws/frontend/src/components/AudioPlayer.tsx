import { useEffect, useMemo, useRef, useState } from 'react';
import type { AudioTrack } from '../data/tracks';

type Props = {
  track: AudioTrack;
  variant?: 'hot' | 'cool' | 'compact';
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '00:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function createFallbackPeaks(size: number, seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: size }, (_, index) => {
    hash = (1664525 * hash + 1013904223) >>> 0;
    const wave = 0.45 + 0.45 * Math.sin(index * 0.36) + 0.1 * Math.sin(index * 1.7);
    return Math.max(0.08, Math.min(1, wave * (0.6 + (hash % 100) / 250)));
  });
}

export function AudioPlayer({ track, variant = 'cool' }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [peaks, setPeaks] = useState<number[]>(() => createFallbackPeaks(96, track.id));
  const gradientClass = variant === 'hot' ? 'audio-player--hot' : variant === 'compact' ? 'audio-player--compact' : 'audio-player--cool';

  const progress = useMemo(() => (duration ? current / duration : 0), [current, duration]);

  useEffect(() => {
    let cancelled = false;
    async function loadPeaks() {
      try {
        const response = await fetch(track.srcMp3);
        const buffer = await response.arrayBuffer();
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioContext = new AudioContextClass();
        const decoded = await audioContext.decodeAudioData(buffer.slice(0));
        const channel = decoded.getChannelData(0);
        const bars = 112;
        const blockSize = Math.floor(channel.length / bars);
        const normalized = Array.from({ length: bars }, (_, index) => {
          const start = index * blockSize;
          let sum = 0;
          for (let j = 0; j < blockSize; j += 1) {
            const sample = channel[start + j] ?? 0;
            sum += sample * sample;
          }
          return Math.sqrt(sum / Math.max(1, blockSize));
        });
        const max = Math.max(...normalized, 0.001);
        if (!cancelled) setPeaks(normalized.map((value) => Math.max(0.05, value / max)));
        await audioContext.close();
      } catch {
        if (!cancelled) setPeaks(createFallbackPeaks(112, track.id));
      }
    }
    loadPeaks();
    return () => {
      cancelled = true;
    };
  }, [track.id, track.srcMp3]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const barGap = 3;
    const barWidth = Math.max(2, rect.width / peaks.length - barGap);
    const center = rect.height / 2;
    const radius = 999;
    const activeIndex = Math.floor(peaks.length * progress);

    const activeGradient = ctx.createLinearGradient(0, 0, rect.width, 0);
    if (variant === 'hot') {
      activeGradient.addColorStop(0, '#ff4d7d');
      activeGradient.addColorStop(1, '#ffd33d');
    } else {
      activeGradient.addColorStop(0, '#13f0d8');
      activeGradient.addColorStop(0.55, '#7c3cff');
      activeGradient.addColorStop(1, '#23d3ff');
    }

    peaks.forEach((peak, index) => {
      const height = Math.max(6, peak * rect.height * 0.86);
      const x = index * (barWidth + barGap);
      const y = center - height / 2;
      ctx.fillStyle = index <= activeIndex ? activeGradient : 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, height, radius);
      ctx.fill();
    });
  }, [peaks, progress, variant]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  }

  return (
    <div className={`audio-player ${gradientClass}`}>
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={track.srcMp3} type="audio/mpeg" />
        <source src={track.srcOgg} type="audio/ogg" />
      </audio>
      <div className="audio-player__topline">
        <div>
          {track.badge ? <span className="audio-player__badge">{track.badge}</span> : null}
          <h3>{track.label}</h3>
        </div>
        <span className="audio-player__time">{formatTime(current)} / {formatTime(duration)}</span>
      </div>
      <div className="audio-player__body">
        <button type="button" onClick={toggle} aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}>
          {isPlaying ? 'Ⅱ' : '▶'}
        </button>
        <canvas ref={canvasRef} className="audio-player__waveform" />
      </div>
      <p>{track.note}</p>
    </div>
  );
}
