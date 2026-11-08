import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Key
} from 'lucide-react';
import { WHOP_CONFIG } from '../services/paymentService';

export default function Navbar({
  user,
  credits,
  onOpenUniversalAuth,
  onOpenPayment,
  onOpenWhopRedeem,
  onSignOut,
  onStartNew
}) {
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onStartNew}>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-500/40 shadow-lg shadow-indigo-500/20 bg-slate-950 p-1 flex-shrink-0">
            <img src="/assets/logo.png" alt="Ebook On Your Demand Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg text-white tracking-tight">
                Ebook On Your Demand
              </span>
              <span className="text-[9px] bg-gradient-to-r from-orange-500 to-rose-500 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                AI PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Antigravity &bull; Claude 3.5 Sonnet &bull; Codex AI
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#studio-section" onClick={onStartNew} className="hover:text-white transition">
            AI Writer Studio
          </a>
          <a href="#pricing" className="hover:text-white transition flex items-center gap-1">
            <span>Passes &amp; Pricing</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-mono">$1.99+</span>
          </a>
          <a
            href={WHOP_CONFIG.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-400 transition flex items-center gap-1 text-orange-400/90"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Whop Shop</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <button
            type="button"
            onClick={onOpenWhopRedeem}
            className="hover:text-amber-300 transition flex items-center gap-1 text-slate-300 cursor-pointer"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>Redeem Whop Pass</span>
          </button>
          <a href="#library" className="hover:text-white transition">
            Showcase Books
          </a>
        </nav>

        {/* Right Actions: Credits & Universal Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Credit balance badge */}
          <button
            onClick={onOpenPayment}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500/60 text-xs transition cursor-pointer shadow-sm group"
            title="Click to recharge credits via Whop or UPI"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
            <span className="font-bold text-white font-mono">{credits}</span>
            <span className="text-slate-400 hidden sm:inline">Pass{credits !== 1 ? 'es' : ''}</span>
            <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.2 rounded font-semibold ml-0.5">
              + Add
            </span>
          </button>

          {/* User Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-full transition cursor-pointer"
              >
                <img
                  src={user.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=User'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400"
                />
                <span className="text-xs font-semibold text-white max-w-[100px] truncate hidden sm:inline">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 text-xs space-y-2 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-2">
                    <div className="font-bold text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email || user.phone}</div>
                  </div>

                  <div className="text-slate-300 space-y-1">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Passes Remaining</span>
                      <span className="font-bold text-emerald-400">{credits}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Login Method</span>
                      <span className="text-indigo-400 font-medium capitalize">{user.provider || 'Universal'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdown(false);
                        onOpenWhopRedeem();
                      }}
                      className="w-full py-1 text-left text-orange-400 hover:text-orange-300 flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Redeem Whop License</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdown(false);
                        onSignOut();
                      }}
                      className="w-full py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenUniversalAuth}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 hover:from-orange-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
