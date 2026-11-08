import React from 'react';
import { Check, Sparkles, Zap, QrCode, ShoppingBag, ExternalLink } from 'lucide-react';
import { PRICING_PLANS, UPI_CONFIG, WHOP_CONFIG } from '../services/paymentService';

export default function PricingSection({ onSelectPlan }) {
  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Whop Shop Highlight Card */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-indigo-950/60 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Selling on Whop? Join Our Whop Store</h3>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                  Global Store
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Prefer paying in USD, Apple Pay, or Credit Card? Get your automated membership pass on our official Whop shop.
              </p>
            </div>
          </div>

          <a
            href={WHOP_CONFIG.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition self-stretch sm:self-auto justify-center"
          >
            <span>Visit Whop Shop</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Pricing Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant UPI &amp; Whop Checkout</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Transparent Per-Ebook Pricing
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Choose your AI Author model. Pay instantly with UPI to{' '}
            <span className="text-white font-mono font-semibold">{UPI_CONFIG.vpa}</span> or via Whop.
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
                {/* Popular Pill */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap ${
                    isPopular
                      ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-indigo-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mt-1">{plan.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                  {/* Price */}
                  <div className="my-4 pb-4 border-b border-slate-800">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">₹{plan.price}</span>
                      <span className="text-xs line-through text-slate-500">₹{plan.originalPrice}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                      </span>
                    </div>
                    <div className="text-xs text-indigo-400 font-medium mt-1">
                      {plan.credits} eBook Generation Pass{plan.credits > 1 ? 'es' : ''}
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

                {/* CTA */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                      isPopular
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white shadow-indigo-500/30'
                        : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Pay ₹{plan.price} (UPI / Whop)</span>
                  </button>
                  <div className="text-center mt-2 text-[10px] text-slate-500 font-mono">
                    Instant Pass Unlocked
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
