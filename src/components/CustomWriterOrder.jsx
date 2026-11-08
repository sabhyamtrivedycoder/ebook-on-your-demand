import React, { useState } from 'react';
import {
  PenTool,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Send,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { PRICING_PLANS } from '../services/paymentService';

export default function CustomWriterOrder({ onOpenPayment }) {
  const [bookTitle, setBookTitle] = useState('');
  const [topicDetails, setTopicDetails] = useState('');
  const [targetLength, setTargetLength] = useState('50-80 Pages (Complete Comprehensive Book)');
  const [timeline, setTimeline] = useState('48-72 Hours Fast Turnaround');
  const [clientEmail, setClientEmail] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const bespokePlan = PRICING_PLANS.find(p => p.id === 'bespoke') || PRICING_PLANS[2];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Open payment modal for ₹1499 bespoke tier
    onOpenPayment(bespokePlan);
  };

  const handleOpenWhatsapp = () => {
    const text = encodeURIComponent(
      `Hello Guddi! I am interested in ordering a custom on-demand eBook: "${bookTitle || 'Custom Book'}" (${targetLength}). Let's discuss requirements.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <section id="custom-writer" className="py-12 sm:py-20 px-4 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>VIP Bespoke Ghostwriting</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Need a 100% Handcrafted Book? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
              Hire Guddi Trivedy On Demand
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            From Amazon KDP bestsellers to company playbooks, get custom research, editorial refinement, ISBN formatting, and bespoke cover design delivered directly to your inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Service Guarantee Card */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-7 space-y-5 border border-slate-700/80">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                alt="Guddi Trivedy"
                className="w-14 h-14 rounded-full object-cover border-2 border-rose-500/50 shadow-lg"
              />
              <div>
                <h4 className="font-bold text-white text-base">Guddi Trivedy</h4>
                <div className="text-xs text-rose-400 font-medium">Lead Author &amp; Publishing Architect</div>
                <div className="text-[11px] text-slate-400">gudditrivedy@oksbi</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              &ldquo;I work directly with founders, educators, and storytellers to transform complex thoughts into cohesive, highly engaging books that establish authority and generate passive royalties.&rdquo;
            </p>

            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Full Copyright &amp; Royalty Transfer (100% yours to monetize).</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Custom Amazon KDP, Apple Books &amp; PDF Formatting.</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>14 Days of Unlimited Editorial Revisions Included.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsapp}
                className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Guddi on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right: Custom Request Submission Form */}
          <div className="lg:col-span-7 glass-panel-glow rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Proposed Book Title or Concept *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algorithmic Trading Systems for Beginners"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Outline, Outline Goals &amp; Specifics *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe target chapters, key stories, data sources, or specific themes you want included..."
                  value={topicDetails}
                  onChange={(e) => setTopicDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Depth
                  </label>
                  <select
                    value={targetLength}
                    onChange={(e) => setTargetLength(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                  >
                    <option>30-50 Pages (Focused Playbook)</option>
                    <option>50-80 Pages (Complete Comprehensive Book)</option>
                    <option>100+ Pages (In-Depth Authoritative Tome)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Delivery Turnaround
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                  >
                    <option>48-72 Hours Fast Turnaround</option>
                    <option>5-7 Days Standard Delivery</option>
                    <option>2 Weeks Extended Deep Research</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    WhatsApp Number (for instant updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 text-sm transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Order &amp; Pay ₹1,499 via UPI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
