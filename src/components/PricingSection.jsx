import React from 'react';
import { Check, Sparkles, Zap, ShoppingBag, ExternalLink, QrCode } from 'lucide-react';
import { PRICING_PLANS, WHOP_CONFIG } from '../services/paymentService';

export default function PricingSection({ onSelectPlan }) {
  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Whop Store Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-indigo-950/60 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Official Whop Storefront</h3>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                  Global Passes
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant delivery via Whop. Pay with Apple Pay, Google Pay, Credit/Debit Cards, or Crypto.
              </p>
            </div>
          </div>

          <a
            href={WHOP_CONFIG.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition self-stretch sm:self-auto justify-center"
          >
            <span>Open Whop Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Pricing Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Digital Access &bull; USD Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Transparent Per-Ebook Pricing
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Choose your AI author engine pass. Unlock instant book creation and multi-format exports.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'glass-panel-glow border-2 border-indigo-500/60 shadow-2xl shadow-indigo-500/20 scale-100 lg:-translate-y-2'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                } p-5 sm:p-6`}
              >
                {/* Popular / Discount Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap ${
                    isPopular
                      ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-indigo-500/30'
                      : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mt-1">{plan.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                  {/* Clean USD Price with Crossed-out original */}
                  <div className="my-4 pb-4 border-b border-slate-800">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">${plan.priceUsd}</span>
                      <span className="text-xs line-through text-slate-500 font-normal">${plan.originalPriceUsd}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        Save {Math.round(((plan.originalPriceUsd - plan.priceUsd) / plan.originalPriceUsd) * 100)}%
                      </span>
                    </div>
                    <div className="text-xs text-orange-400 font-medium mt-1">
                      {plan.credits} Full eBook Generation Pass{plan.credits > 1 ? 'es' : ''}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                      isPopular
                        ? 'bg-gradient-to-r from-orange-500 via-rose-600 to-indigo-600 hover:from-orange-400 hover:to-indigo-500 text-white shadow-orange-500/30'
                        : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Get Pass (${plan.priceUsd})</span>
                  </button>

                  <div className="text-center text-[10px] text-slate-500 font-mono">
                    Instant Whop &bull; UPI Option Available
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
