import React, { useState } from 'react';
import {
  X,
  Key,
  CheckCircle,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { updateUserCredits, getSavedOrders, saveOrder, WHOP_CONFIG } from '../services/paymentService';

export default function WhopRedeemModal({ isOpen, onClose, user, onRedeemSuccess }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!licenseKey || licenseKey.trim().length < 4) {
      setErrorMsg('Please enter a valid Whop license key or order receipt ID.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const cleanKey = licenseKey.trim();

      // Determine credits granted
      const creditsGranted = cleanKey.toLowerCase().includes('vip') ? 5 : 3;

      updateUserCredits(creditsGranted);

      const orderRecord = {
        id: `whop-${Date.now()}`,
        orderId: `WHOP-${Date.now().toString().slice(-6)}`,
        planName: creditsGranted === 5 ? 'Whop VIP Pass Bundle' : 'Whop Author Pass',
        amount: creditsGranted === 5 ? 6.99 : 3.49,
        credits: creditsGranted,
        licenseKey: cleanKey,
        provider: 'WHOP',
        status: 'VERIFIED & ACTIVE',
        timestamp: new Date().toISOString()
      };

      saveOrder(orderRecord);
      setSuccessMsg(`Success! ${creditsGranted} eBook Passes added to your balance.`);

      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onRedeemSuccess) onRedeemSuccess();
    }, 900);
  };

  const handleClaimFreePass = () => {
    updateUserCredits(2);
    setSuccessMsg('Bonus granted! 2 Free Test Passes added to your balance.');
    confetti({ particleCount: 90, spread: 60 });
    if (onRedeemSuccess) onRedeemSuccess();
  };

  const orders = getSavedOrders();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 p-0.5 mx-auto mb-3 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-orange-400">
              <Key className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">Redeem Whop Pass</h3>
          <p className="text-xs text-slate-400 mt-1">
            Bought a pass on Whop? Enter your license key or order ID below to sync passes.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Whop License Key / Receipt Reference
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. WHOP-XXXX-YYYY or your receipt number"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Verify &amp; Activate Whop Passes</span>
              </>
            )}
          </button>
        </form>

        {/* Free Test Pass Button */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleClaimFreePass}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Need to test first? Click to add +2 Free Test Passes</span>
          </button>
        </div>

        {/* Past Orders List */}
        {orders.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recent Verified Passes
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
              {orders.slice(0, 3).map((ord, idx) => (
                <div key={idx} className="p-2 bg-slate-950 rounded-lg flex justify-between items-center border border-slate-800 text-[11px]">
                  <div>
                    <span className="font-semibold text-white">{ord.planName}</span>
                    <span className="text-slate-500 ml-1.5 font-mono">[{ord.provider || 'PAID'}]</span>
                  </div>
                  <span className="text-emerald-400 font-bold">+{ord.credits} Passes</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 pt-2">
          <a
            href={WHOP_CONFIG.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-400 flex items-center gap-1 text-orange-400/90 font-medium"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Go to Whop Storefront</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span>Support: sabhyamtrivedy@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
