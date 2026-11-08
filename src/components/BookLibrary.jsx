import React, { useState } from 'react';
import { BookOpen, Download, Eye, Sparkles, Plus, Check } from 'lucide-react';
import BookCover3D from './BookCover3D';
import { exportToPdf, exportToEpub } from '../services/exportService';

export default function BookLibrary({ books, onOpenReader, onStartNew }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleQuickExport = async (e, book, format) => {
    e.stopPropagation();
    setDownloadingId(`${book.id}-${format}`);
    try {
      if (format === 'pdf') {
        await exportToPdf(book);
      } else if (format === 'epub') {
        await exportToEpub(book);
      }
    } catch (err) {
      console.error(err);
      alert('Error exporting book. Please try reading it first.');
    } finally {
      setTimeout(() => setDownloadingId(null), 1800);
    }
  };

  return (
    <section id="library" className="py-14 sm:py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              Your Digital Bookshelf &amp; Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Published On-Demand eBooks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Click any book to read in interactive reader mode or download as professional PDF &amp; EPUB.
            </p>
          </div>

          <button
            onClick={onStartNew}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-orange-500/20 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New eBook</span>
          </button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="glass-panel border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div>
                {/* 3D Cover Display */}
                <div
                  onClick={() => onOpenReader(book)}
                  className="py-4 flex justify-center bg-slate-950/40 rounded-xl mb-4 border border-slate-800/60 cursor-pointer"
                  title="Click to Read Book"
                >
                  <BookCover3D
                    title={book.title}
                    subtitle={book.subtitle}
                    author={book.author}
                    genre={book.genre}
                    presetId={book.coverPreset || 'royal-indigo'}
                    size="medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-orange-400 font-semibold">{book.genre || 'Original Book'}</span>
                    <span className="font-mono text-emerald-400">{book.chapters?.length || 0} Chapters</span>
                  </div>

                  <h3
                    onClick={() => onOpenReader(book)}
                    className="text-lg font-bold text-white group-hover:text-orange-300 transition line-clamp-1 cursor-pointer"
                  >
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {book.synopsis || book.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Read & Direct Exports */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenReader(book)}
                  className="w-full py-2.5 px-3 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Read Book in eReader</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleQuickExport(e, book, 'pdf')}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-rose-400" />
                    <span>{downloadingId === `${book.id}-pdf` ? 'Generating...' : 'PDF'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleQuickExport(e, book, 'epub')}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>{downloadingId === `${book.id}-epub` ? 'Generating...' : 'EPUB'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
