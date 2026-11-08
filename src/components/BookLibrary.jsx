import React from 'react';
import { BookOpen, Download, Eye, Sparkles, Plus, Calendar, User } from 'lucide-react';
import BookCover3D from './BookCover3D';

export default function BookLibrary({ books, onOpenReader, onStartNew }) {
  return (
    <section id="library" className="py-14 sm:py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              Your Digital Bookshelf &amp; Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Published On-Demand eBooks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Read online in interactive reader mode or download as professional PDF &amp; EPUB.
            </p>
          </div>

          <button
            onClick={onStartNew}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-500/20 self-start sm:self-auto"
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
              className="glass-panel border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                {/* 3D Cover Display */}
                <div className="py-4 flex justify-center bg-slate-950/40 rounded-xl mb-4 border border-slate-800/60">
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
                    <span className="text-indigo-400 font-semibold">{book.genre || 'Original Book'}</span>
                    <span>{book.chapters?.length || 0} Chapters</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {book.synopsis || book.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onOpenReader(book)}
                  className="flex-1 py-2 px-3 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Read Book</span>
                </button>
                <button
                  onClick={() => onOpenReader(book)}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition"
                  title="Download Formats"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
