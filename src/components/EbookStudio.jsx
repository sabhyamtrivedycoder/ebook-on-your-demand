import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Wand2,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight,
  Edit3,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Eye,
  Shield,
  Zap,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AI_WRITER_MODELS,
  GENRES,
  TONES,
  LANGUAGES,
  generateBookOutline,
  generateChapterContent
} from '../services/aiGenerator';
import { getUserCredits, updateUserCredits } from '../services/paymentService';
import BookCover3D from './BookCover3D';

export default function EbookStudio({ onOpenPayment, onOpenReader, onSaveBook, user }) {
  const [step, setStep] = useState('brief');

  // Selected AI Writer Model
  const [selectedModelId, setSelectedModelId] = useState('antigravity');

  // Brief Form State
  const [topic, setTopic] = useState('How to Build a High-Ticket AI Automation Agency in 2026');
  const [title, setTitle] = useState('The Autonomous Agency');
  const [genre, setGenre] = useState(GENRES[0]);
  const [audience, setAudience] = useState('Solopreneurs, Freelancers & Modern Tech Builders');
  const [tone, setTone] = useState(TONES[0].label);
  const [chapterCount, setChapterCount] = useState(5);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [authorName, setAuthorName] = useState(user?.name || 'Sabhyam Trivedy');

  // Book State
  const [currentBook, setCurrentBook] = useState(null);
  const [isOutlineLoading, setIsOutlineLoading] = useState(false);
  const [genProgress, setGenProgress] = useState({ currentChapter: 0, total: 5, statusText: '' });
  const [selectedCoverPreset, setSelectedCoverPreset] = useState('royal-indigo');

  const activeModel = AI_WRITER_MODELS.find(m => m.id === selectedModelId) || AI_WRITER_MODELS[0];

  // Handle Generate Outline
  const handleGenerateOutline = async (e) => {
    e.preventDefault();
    setIsOutlineLoading(true);

    try {
      const outlineData = await generateBookOutline({
        title,
        topic,
        genre,
        audience,
        tone,
        chapterCount,
        language,
        author: authorName,
        modelId: selectedModelId
      });

      const initializedBook = {
        id: `eoyd-book-${Date.now()}`,
        title: outlineData.title || title || 'The Definitive Guide',
        subtitle: outlineData.subtitle || `A masterclass for ${audience}`,
        synopsis: outlineData.synopsis,
        genre,
        audience,
        tone,
        language,
        author: authorName || 'Sabhyam Trivedy',
        chapters: outlineData.chapters || [],
        coverPreset: selectedCoverPreset,
        modelUsed: activeModel.name,
        createdDate: new Date().toISOString()
      };

      setCurrentBook(initializedBook);
      setStep('outline');
    } catch (err) {
      console.error(err);
      alert('Error generating outline. Please try again.');
    } finally {
      setIsOutlineLoading(false);
    }
  };

  // Chapter editing
  const handleUpdateChapter = (index, field, value) => {
    const updated = [...currentBook.chapters];
    updated[index][field] = value;
    setCurrentBook({ ...currentBook, chapters: updated });
  };

  const handleAddChapter = () => {
    const newNum = currentBook.chapters.length + 1;
    const updated = [
      ...currentBook.chapters,
      {
        number: newNum,
        title: `Chapter ${newNum}: Advanced Protocols & Execution`,
        summary: `Empirical blueprints and execution systems tailored for ${audience}.`
      }
    ];
    setCurrentBook({ ...currentBook, chapters: updated });
  };

  const handleRemoveChapter = (index) => {
    if (currentBook.chapters.length <= 1) return;
    const filtered = currentBook.chapters.filter((_, i) => i !== index);
    const renumbered = filtered.map((ch, idx) => ({ ...ch, number: idx + 1 }));
    setCurrentBook({ ...currentBook, chapters: renumbered });
  };

  // Writing full book
  const handleStartWriting = async () => {
    const credits = getUserCredits();
    if (credits < activeModel.credits) {
      alert(`This AI Model (${activeModel.name}) requires ${activeModel.credits} credits. You currently have ${credits} credits. Please top up to proceed!`);
      onOpenPayment();
      return;
    }

    setStep('generating');
    const totalChapters = currentBook.chapters.length;
    const fullChapters = [];

    for (let i = 0; i < totalChapters; i++) {
      const ch = currentBook.chapters[i];
      setGenProgress({
        currentChapter: i + 1,
        total: totalChapters,
        statusText: `[${activeModel.name}] Writing Chapter ${i + 1} of ${totalChapters}: "${ch.title}"...`
      });

      const content = await generateChapterContent({
        bookTitle: currentBook.title,
        chapterNumber: i + 1,
        chapterTitle: ch.title,
        chapterSummary: ch.summary,
        genre: currentBook.genre,
        tone: currentBook.tone,
        audience: currentBook.audience,
        author: currentBook.author,
        language: currentBook.language,
        modelId: selectedModelId
      });

      fullChapters.push({
        ...ch,
        content
      });
    }

    const finishedBook = {
      ...currentBook,
      chapters: fullChapters,
      status: 'COMPLETED'
    };

    updateUserCredits(-activeModel.credits);
    setCurrentBook(finishedBook);
    if (onSaveBook) onSaveBook(finishedBook);
    setStep('completed');

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.55 }
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Integrated with Antigravity, Claude 3.5 Sonnet &amp; Codex</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Ebook On Your <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">Demand</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          Choose your AI author engine, input your idea, and get a complete best-selling book with 3D cover, Kindle EPUB, and PDF in seconds.
        </p>

        {/* Wizard Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 text-xs font-medium">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
            step === 'brief' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'border-slate-800 text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">1</span>
            <span>Choose AI Model &amp; Brief</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
            step === 'outline' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'border-slate-800 text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">2</span>
            <span>Review Outline</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
            step === 'generating' ? 'bg-amber-600/20 border-amber-500 text-amber-300 animate-pulse' : 'border-slate-800 text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">3</span>
            <span>Writing Engine</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
            step === 'completed' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'border-slate-800 text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">4</span>
            <span>Export &amp; Read</span>
          </div>
        </div>
      </div>

      {/* STEP 1: MODEL SELECTION & BRIEF */}
      {step === 'brief' && (
        <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-7">
          {/* AI Writer Engine Selector Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Select Your AI Ebook Writer Engine</span>
              </label>
              <span className="text-xs text-indigo-400 font-semibold">
                Cost: ₹{activeModel.costInr} (${activeModel.costUsd}) • {activeModel.credits} Credit{activeModel.credits > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {AI_WRITER_MODELS.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModelId(model.id)}
                    className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? `bg-slate-900 border-2 ${model.borderColor} shadow-lg shadow-indigo-500/10`
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl">{model.icon}</span>
                        <span className="text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                          {model.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs leading-snug">{model.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {model.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400">₹{model.costInr}</span>
                      <span className="text-slate-400 font-mono">{model.credits} Pass</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Book Parameters Form */}
          <form onSubmit={handleGenerateOutline} className="space-y-6 pt-3 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  What should this eBook be about? *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. A comprehensive guide to building recurring revenue with AI automation..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Suggested Book Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The 7-Figure Automation Engine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 mb-3"
                />
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Author Pen Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sabhyam Trivedy"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Genre / Category
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solopreneurs, Creators..."
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {TONES.map((t) => (
                    <option key={t.id} value={t.label}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Chapter Count: <span className="text-indigo-400 font-bold">{chapterCount}</span>
                  </label>
                  <span className="text-xs text-slate-500 font-mono">3 to 10 Chapters</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={1}
                  value={chapterCount}
                  onChange={(e) => setChapterCount(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Output Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Powered by {activeModel.name}. Includes 3D Cover, Kindle EPUB &amp; PDF.</span>
              </div>

              <button
                type="submit"
                disabled={isOutlineLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 via-rose-600 to-indigo-600 hover:from-orange-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {isOutlineLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Structure with {activeModel.name}...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-300" />
                    <span>Generate Outline &amp; Chapters</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: OUTLINE REVIEW */}
      {step === 'outline' && currentBook && (
        <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-bold text-orange-400 tracking-wider uppercase flex items-center gap-1.5">
                <span>{activeModel.name}</span>
                <span>• Outline Preview</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">{currentBook.title}</h2>
              <p className="text-xs text-slate-400">{currentBook.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep('brief')}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                &larr; Change Model / Brief
              </button>
              <button
                onClick={handleAddChapter}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 flex items-center gap-1 border border-indigo-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Chapter</span>
              </button>
            </div>
          </div>

          {currentBook.synopsis && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
              <span className="font-bold text-indigo-400 not-italic block mb-1">Book Synopsis:</span>
              {currentBook.synopsis}
            </div>
          )}

          {/* Chapters List */}
          <div className="space-y-3.5">
            {currentBook.chapters.map((ch, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-start gap-3 group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  #{ch.number || idx + 1}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={ch.title}
                    onChange={(e) => handleUpdateChapter(idx, 'title', e.target.value)}
                    className="w-full bg-transparent font-bold text-sm text-white focus:outline-none focus:border-b border-indigo-500"
                  />
                  <textarea
                    rows={2}
                    value={ch.summary}
                    onChange={(e) => handleUpdateChapter(idx, 'summary', e.target.value)}
                    className="w-full bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800 text-xs text-slate-400 focus:outline-none focus:border-slate-700 resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveChapter(idx)}
                  className="opacity-40 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-1.5 rounded hover:bg-rose-500/10 transition"
                  title="Remove Chapter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                Total: {currentBook.chapters.length} Chapters (~{currentBook.chapters.length * 1200} words)
              </span>
            </div>

            <button
              onClick={handleStartWriting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Write Full Book with {activeModel.name} ({activeModel.credits} Credit{activeModel.credits > 1 ? 's' : ''})</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: WRITING GENERATION */}
      {step === 'generating' && (
        <div className="glass-panel-glow rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 animate-bounce">
            <BookOpen className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Synthesizing On Demand</h3>
            <p className="text-sm text-slate-400 mt-1">{genProgress.statusText}</p>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${(genProgress.currentChapter / (genProgress.total || 1)) * 100}%`
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>Chapter {genProgress.currentChapter} of {genProgress.total}</span>
            <span>{Math.round((genProgress.currentChapter / (genProgress.total || 1)) * 100)}% Complete</span>
          </div>
        </div>
      )}

      {/* STEP 4: COMPLETED & 3D COVER PREVIEW */}
      {step === 'completed' && currentBook && (
        <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-8 animate-scaleUp">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Full Book Generated by {currentBook.modelUsed || activeModel.name}</span>
            </div>
            <h2 className="text-3xl font-black text-white">{currentBook.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{currentBook.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-center">
              <BookCover3D
                title={currentBook.title}
                subtitle={currentBook.subtitle}
                author={currentBook.author}
                genre={currentBook.genre}
                presetId={selectedCoverPreset}
                size="large"
                showDownload={true}
              />
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select 3D Cover Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'royal-indigo', name: 'Royal Indigo' },
                    { id: 'cosmic-gold', name: 'Cosmic Gold' },
                    { id: 'emerald-mind', name: 'Emerald Mind' },
                    { id: 'crimson-noir', name: 'Crimson Noir' },
                    { id: 'cyber-future', name: 'Cyber Blue' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedCoverPreset(preset.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                        selectedCoverPreset === preset.id
                          ? 'border-indigo-500 bg-indigo-600/20 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Author:</span>
                  <span className="font-bold text-white">{currentBook.author}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>AI Engine:</span>
                  <span className="text-orange-400 font-semibold">{currentBook.modelUsed}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Formats Ready:</span>
                  <span className="text-emerald-400 font-bold">PDF, EPUB (Kindle), Markdown</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => onOpenReader(currentBook)}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-sm transition cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-white" />
                  <span>Open Interactive Reader Mode</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenReader(currentBook)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export PDF &amp; EPUB</span>
                  </button>
                  <button
                    onClick={() => {
                      setStep('brief');
                      setCurrentBook(null);
                    }}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
                  >
                    Create Another Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
