import React from 'react';
import { ShieldCheck, Heart, Mail, ShoppingBag } from 'lucide-react';
import { UPI_CONFIG, WHOP_CONFIG } from '../services/paymentService';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-indigo-500/40 bg-slate-900 p-0.5">
              <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-white text-base">Ebook On Your Demand</span>
          </div>
          <p className="max-w-md text-slate-400 leading-relaxed text-xs">
            The premier on-demand AI eBook authoring, 3D cover design, and instant publishing platform powered by Antigravity, Claude 3.5 Sonnet, and OpenAI Codex.
          </p>
          <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-mono">
            <div>
              <span>Official Support: </span>
              <a href="mailto:sabhyamtrivedy@gmail.com" className="text-indigo-400 font-semibold underline">
                sabhyamtrivedy@gmail.com
              </a>
            </div>
            <div>
              <span>Verified UPI VPA: </span>
              <span className="text-emerald-400 font-semibold">{UPI_CONFIG.vpa}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Explore</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">AI Writer Studio</a></li>
            <li><a href="#pricing" className="hover:text-white transition">Pricing &amp; Plans</a></li>
            <li><a href={WHOP_CONFIG.storeUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 transition">Whop Shop</a></li>
            <li><a href="#library" className="hover:text-white transition">Showcase eBooks</a></li>
          </ul>
        </div>

        {/* Security & Auth */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Integrations</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Firebase Multi-Auth Enabled</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Login with Google, Email/Password, or Phone SMS OTP. Integrated with SBI UPI &amp; Whop Global Payments.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} Ebook On Your Demand. All rights reserved. Managed by Sabhyam Trivedy.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for creators, thinkers, and builders worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
