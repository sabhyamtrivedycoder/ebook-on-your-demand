import React, { useRef } from 'react';
import { BookOpen, Sparkles, Download, Layers } from 'lucide-react';

export const COVER_PRESETS = [
  { id: 'royal-indigo', name: 'Royal Indigo', gradient: 'from-indigo-900 via-slate-900 to-indigo-950', accent: 'text-indigo-400', border: 'border-indigo-500/30' },
  { id: 'cosmic-gold', name: 'Cosmic Gold', gradient: 'from-amber-900 via-slate-950 to-purple-950', accent: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'emerald-mind', name: 'Emerald Mind', gradient: 'from-emerald-950 via-teal-950 to-slate-950', accent: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'crimson-noir', name: 'Crimson Noir', gradient: 'from-rose-950 via-red-950 to-slate-950', accent: 'text-rose-400', border: 'border-rose-500/30' },
  { id: 'cyber-future', name: 'Cyber Blue', gradient: 'from-cyan-950 via-blue-950 to-slate-950', accent: 'text-cyan-400', border: 'border-cyan-500/30' }
];

export default function BookCover3D({
  title,
  subtitle,
  author,
  genre,
  badge = 'ORIGINAL EDITION',
  presetId = 'royal-indigo',
  size = 'medium',
  showDownload = false
}) {
  const coverRef = useRef(null);
  const selectedPreset = COVER_PRESETS.find(p => p.id === presetId) || COVER_PRESETS[0];

  const sizeClasses = {
    small: 'w-36 h-52 text-[10px]',
    medium: 'w-56 h-80 text-xs',
    large: 'w-72 h-[410px] text-sm'
  }[size] || 'w-56 h-80 text-xs';

  const handleDownloadCover = () => {
    // Generate high resolution canvas representation
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 880;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 880);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 880);

    // Spine border
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, 0, 35, 880);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 0, 0, 880);

    // Inner frame
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.strokeRect(55, 30, 510, 820);

    // Badge
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((genre || badge).toUpperCase(), 310, 100);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px serif';
    const words = (title || 'Untitled eBook').split(' ');
    let line = '';
    let y = 220;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 440 && n > 0) {
        ctx.fillText(line.trim(), 310, y);
        line = words[n] + ' ';
        y += 45;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 310, y);

    // Subtitle
    if (subtitle) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'italic 18px sans-serif';
      ctx.fillText(subtitle.slice(0, 65), 310, y + 55);
    }

    // Author
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('WRITTEN BY', 310, 720);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(author || 'Guddi Trivedy', 310, 755);

    // Trigger download
    const link = document.createElement('a');
    link.download = `${(title || 'book_cover').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="book-card-3d relative">
        <div
          ref={coverRef}
          className={`book-cover-inner ${sizeClasses} relative rounded-r-xl rounded-l-sm bg-gradient-to-br ${selectedPreset.gradient} p-4 sm:p-5 flex flex-col justify-between border-y border-r ${selectedPreset.border} shadow-2xl overflow-hidden select-none`}
        >
          {/* Spine crease shadow simulation */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-white/10 pointer-events-none z-10" />

          {/* Gloss overlay */}
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-white/0 via-white/5 to-white/0 rotate-45 pointer-events-none" />

          {/* Top metadata */}
          <div className="relative z-1 pl-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${selectedPreset.accent}`}>
                {genre || 'EXCLUSIVE'}
              </span>
              <span className="text-[9px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded backdrop-blur-sm font-mono">
                {badge}
              </span>
            </div>
          </div>

          {/* Center Book Title & Subtitle */}
          <div className="relative z-1 my-auto text-center pl-2">
            <h4 className="font-serif font-black text-white text-base sm:text-lg leading-tight tracking-tight drop-shadow-md line-clamp-3">
              {title || 'Untitled Masterpiece'}
            </h4>
            {subtitle && (
              <p className="font-sans text-[11px] text-slate-300 mt-2 line-clamp-2 italic drop-shadow">
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom Author Tag */}
          <div className="relative z-1 pt-2 border-t border-white/10 text-center pl-2">
            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Author</div>
            <div className="text-xs font-bold text-white tracking-wide truncate">
              {author || 'Guddi Trivedy'}
            </div>
          </div>
        </div>
      </div>

      {showDownload && (
        <button
          type="button"
          onClick={handleDownloadCover}
          className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          Download 3D Cover (PNG)
        </button>
      )}
    </div>
  );
}
