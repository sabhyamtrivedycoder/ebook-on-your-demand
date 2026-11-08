import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  Type,
  FileText,
  Printer,
  Check,
  Bookmark
} from 'lucide-react';
import { exportToPdf, exportToEpub, exportToMarkdown } from '../services/exportService';

export default function BookReaderModal({ isOpen, onClose, book }) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [theme, setTheme] = useState('dark'); // 'light', 'sepia', 'dark', 'emerald'
  const [fontSize, setFontSize] = useState('text-base'); // 'text-sm', 'text-base', 'text-lg', 'text-xl'
  const [fontFamily, setFontFamily] = useState('font-serif');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  if (!isOpen || !book) return null;

  const chapters = book.chapters || [];
  const currentChapter = chapters[currentChapterIndex] || {
    title: 'Introduction',
    content: 'No content available.'
  };

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportNotice(`Preparing ${format.toUpperCase()}...`);
    try {
      if (format === 'pdf') {
        await exportToPdf(book);
      } else if (format === 'epub') {
        await exportToEpub(book);
      } else if (format === 'markdown') {
        exportToMarkdown(book);
      }
      setExportNotice(`${format.toUpperCase()} Downloaded!`);
    } catch (e) {
      console.error(e);
      setExportNotice('Export error');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportNotice('');
      }, 2000);
    }
  };

  const themeClasses = {
    light: 'bg-white text-slate-800 border-slate-200',
    sepia: 'bg-[#faf3e0] text-[#3e2723] border-[#ebd9b8]',
    dark: 'bg-slate-900 text-slate-100 border-slate-800',
    emerald: 'bg-[#06201b] text-emerald-100 border-emerald-900/60'
  }[theme];

  const sidebarThemeClasses = {
    light: 'bg-slate-100 text-slate-800 border-r border-slate-200',
    sepia: 'bg-[#f4ebd0] text-[#4a3525] border-r border-[#e0cfad]',
    dark: 'bg-slate-950 text-slate-300 border-r border-slate-800',
    emerald: 'bg-[#031512] text-emerald-200 border-r border-emerald-950'
  }[theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className={`relative w-full max-w-6xl h-[92vh] rounded-2xl flex flex-col overflow-hidden border shadow-2xl transition-colors duration-200 ${themeClasses}`}>
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-inherit bg-black/10 backdrop-blur-sm z-10 flex-wrap gap-2">
          {/* Left: Book Meta & TOC Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-black/10 transition text-inherit flex items-center gap-1.5 text-xs font-semibold"
              title="Toggle Table of Contents"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Contents</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-500/30 hidden sm:block" />
            <div>
              <h2 className="text-sm font-bold truncate max-w-xs sm:max-w-md">{book.title}</h2>
              <p className="text-[11px] opacity-70 truncate">By {book.author || 'Guddi Trivedy'}</p>
            </div>
          </div>

          {/* Center / Right: Theme & Font Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Themes */}
            <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/5">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition ${theme === 'light' ? 'bg-white text-slate-900 shadow' : 'opacity-60 hover:opacity-100'}`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded-md transition ${theme === 'sepia' ? 'bg-[#ebd9b8] text-amber-900 shadow' : 'opacity-60 hover:opacity-100'}`}
                title="Sepia Paper Theme"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md transition ${theme === 'dark' ? 'bg-slate-800 text-white shadow' : 'opacity-60 hover:opacity-100'}`}
                title="Midnight Dark"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('emerald')}
                className={`p-1.5 rounded-md transition ${theme === 'emerald' ? 'bg-emerald-900 text-emerald-200 shadow' : 'opacity-60 hover:opacity-100'}`}
                title="Emerald Sanctuary"
              >
                <span className="text-xs px-1 font-bold">🌿</span>
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/5 text-xs font-semibold">
              <button
                onClick={() => setFontSize('text-sm')}
                className={`px-2 py-1 rounded transition ${fontSize === 'text-sm' ? 'bg-white/20' : 'opacity-60 hover:opacity-100'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('text-base')}
                className={`px-2 py-1 rounded transition ${fontSize === 'text-base' ? 'bg-white/20' : 'opacity-60 hover:opacity-100'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('text-lg')}
                className={`px-2 py-1 rounded transition ${fontSize === 'text-lg' ? 'bg-white/20' : 'opacity-60 hover:opacity-100'}`}
              >
                A+
              </button>
            </div>

            {/* Font Family */}
            <button
              onClick={() => setFontFamily(fontFamily === 'font-serif' ? 'font-sans' : 'font-serif')}
              className="px-2 py-1 rounded-lg bg-black/20 hover:bg-black/30 border border-white/5 text-xs font-medium flex items-center gap-1 opacity-80 hover:opacity-100 transition"
              title="Toggle Serif / Sans Font"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{fontFamily === 'font-serif' ? 'Serif' : 'Sans'}</span>
            </button>

            {/* Export Dropdown / Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExport('epub')}
                disabled={isExporting}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EPUB</span>
              </button>
              <button
                onClick={() => handleExport('markdown')}
                disabled={isExporting}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium hidden md:flex items-center gap-1 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>MD</span>
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/20 transition opacity-70 hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Toast */}
        {exportNotice && (
          <div className="bg-indigo-600 text-white text-xs py-1 px-3 text-center font-medium animate-fadeIn">
            {exportNotice}
          </div>
        )}

        {/* Main Reading Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible Sidebar (TOC) */}
          {sidebarOpen && (
            <div className={`w-64 sm:w-72 flex-shrink-0 flex flex-col overflow-y-auto ${sidebarThemeClasses}`}>
              <div className="p-4 border-b border-inherit">
                <div className="text-xs font-bold uppercase tracking-wider opacity-60">Table of Contents</div>
                <div className="text-xs opacity-75 mt-0.5">{chapters.length} Chapters Complete</div>
              </div>

              <div className="divide-y divide-inherit">
                {chapters.map((ch, idx) => {
                  const isActive = idx === currentChapterIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentChapterIndex(idx)}
                      className={`w-full p-3.5 text-left text-xs transition flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-indigo-600/15 font-bold text-indigo-400 border-l-4 border-indigo-500'
                          : 'opacity-80 hover:opacity-100 hover:bg-black/5'
                      }`}
                    >
                      <span className="font-mono text-[11px] opacity-60 mt-0.5">#{ch.number || idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{ch.title}</div>
                        {ch.summary && (
                          <div className="text-[10px] opacity-60 line-clamp-1 mt-0.5 font-normal">
                            {ch.summary}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reader Body Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 md:p-16 flex flex-col items-center">
            <article className={`max-w-2xl w-full leading-relaxed ${fontFamily} ${fontSize}`}>
              {/* Chapter Header */}
              <div className="mb-8 border-b border-inherit pb-6 text-center">
                <span className="text-xs font-bold tracking-widest uppercase opacity-60">
                  Chapter {currentChapter.number || currentChapterIndex + 1}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 font-serif">
                  {currentChapter.title}
                </h1>
                {currentChapter.summary && (
                  <p className="text-xs italic opacity-75 mt-2 max-w-lg mx-auto">
                    {currentChapter.summary}
                  </p>
                )}
              </div>

              {/* Rendered Chapter Text */}
              <div className="space-y-5">
                {(currentChapter.content || '')
                  .split('\n\n')
                  .filter(p => p.trim())
                  .map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={pIdx} className="text-lg sm:text-xl font-bold mt-6 mb-2 text-inherit">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={pIdx} className="text-xl sm:text-2xl font-bold mt-8 mb-3 text-inherit">
                          {paragraph.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith('>')) {
                      return (
                        <blockquote
                          key={pIdx}
                          className="border-l-4 border-indigo-500 pl-4 py-2 italic opacity-90 my-4 bg-black/5 rounded-r"
                        >
                          {paragraph.replace(/^>\s*/gm, '')}
                        </blockquote>
                      );
                    }
                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={pIdx} className="list-disc pl-5 space-y-1.5 opacity-90">
                          {items.map((it, itIdx) => (
                            <li key={itIdx}>{it.replace(/^[-*]\s*/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (paragraph.startsWith('```')) {
                      return (
                        <pre
                          key={pIdx}
                          className="bg-black/30 p-3.5 rounded-lg font-mono text-xs overflow-x-auto border border-white/10"
                        >
                          {paragraph.replace(/```/g, '')}
                        </pre>
                      );
                    }
                    return (
                      <p key={pIdx} className="text-justify leading-relaxed opacity-95">
                        {paragraph}
                      </p>
                    );
                  })}
              </div>
            </article>
          </div>
        </div>

        {/* Bottom Navigation Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-inherit bg-black/10 backdrop-blur-sm z-10">
          <button
            onClick={handlePrev}
            disabled={currentChapterIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-inherit hover:bg-black/10 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <div className="text-xs opacity-75 font-mono">
            {currentChapterIndex + 1} / {chapters.length}
          </div>

          <button
            onClick={handleNext}
            disabled={currentChapterIndex === chapters.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
