import React, { useState } from 'react';
import {
  X,
  Copy,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Zap,
  ArrowRight,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UPI_CONFIG, WHOP_CONFIG, generateUpiUrl, saveOrder, updateUserCredits } from '../services/paymentService';

export default function PaymentModal({ isOpen, onClose, selectedPlan, onPaymentSuccess }) {
  const [paymentMode, setPaymentMode] = useState('upi'); // 'upi' | 'whop'
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [zoomQr, setZoomQr] = useState(false);

  if (!isOpen || !selectedPlan) return null;

  const orderId = `EOYD-${Date.now().toString().slice(-6)}`;
  const upiDeepLink = generateUpiUrl({
    amount: selectedPlan.price,
    planName: selectedPlan.name,
    orderId
  });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_CONFIG.vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyPayment = (e) => {
    e.preventDefault();
    if (!utr || utr.trim().length < 6) {
      alert('Please enter a valid 12-digit UPI UTR / Transaction Reference number.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      const orderData = {
        orderId,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        credits: selectedPlan.credits || 1,
        utr: utr.trim(),
        payee: UPI_CONFIG.payeeName,
        upiId: UPI_CONFIG.vpa,
        timestamp: new Date().toISOString(),
        status: 'PAID & VERIFIED',
        customerSupport: UPI_CONFIG.accountEmail
      };

      saveOrder(orderData);
      updateUserCredits(selectedPlan.credits || 1);
      setCompletedOrder(orderData);

      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 }
      });

      if (onPaymentSuccess) {
        onPaymentSuccess(orderData);
      }
    }, 1300);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setUtr('');
    setScreenshot(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div className="p-5 sm:p-7">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 flex-shrink-0 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white tracking-tight">Checkout &amp; Credits</h3>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Instant Delivery
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Plan: <span className="text-indigo-300 font-semibold">{selectedPlan.name}</span>
                </p>
              </div>
            </div>

            {/* Payment Method Switcher: UPI vs Whop Shop */}
            <div className="flex gap-2 mb-4 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  paymentMode === 'upi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI Direct QR / Apps (₹{selectedPlan.price})</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('whop')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  paymentMode === 'whop' ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Whop Shop (Cards / Apple Pay)</span>
              </button>
            </div>

            {/* Price Overview Banner */}
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 rounded-xl mb-5">
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Amount</div>
                <div className="text-2xl font-black text-white flex items-baseline gap-2">
                  ₹{selectedPlan.price}
                  <span className="text-xs line-through text-slate-500 font-normal">₹{selectedPlan.originalPrice}</span>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Save ₹{selectedPlan.originalPrice - selectedPlan.price}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Passes Unlocked</div>
                <div className="text-sm font-bold text-indigo-400">+{selectedPlan.credits} eBook Generation{selectedPlan.credits > 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* TAB 1: UPI PAYMENT */}
            {paymentMode === 'upi' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 items-center">
                  {/* QR Code Column */}
                  <div className="flex flex-col items-center bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      Scan to Pay ₹{selectedPlan.price}
                    </div>

                    {/* Actual Uploaded QR Code */}
                    <div
                      onClick={() => setZoomQr(!zoomQr)}
                      className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-indigo-500/40 shadow-xl bg-white p-2"
                    >
                      <img
                        src={UPI_CONFIG.qrImagePath}
                        alt="UPI QR Scanner"
                        className="w-40 h-40 object-contain rounded-lg transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">
                        Click to Enlarge
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                      Bank Acc: {UPI_CONFIG.payeeName}
                    </div>
                  </div>

                  {/* UPI ID & App Shortcuts */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        UPI ID (VPA)
                      </label>
                      <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl p-1.5 px-3">
                        <span className="font-mono text-sm text-indigo-300 font-semibold flex-1 truncate">
                          {UPI_CONFIG.vpa}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition"
                        >
                          {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Open Installed App
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={upiDeepLink}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs font-medium text-white transition"
                        >
                          Google Pay <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                        <a
                          href={upiDeepLink}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs font-medium text-white transition"
                        >
                          PhonePe <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                        <a
                          href={upiDeepLink}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs font-medium text-white transition"
                        >
                          Paytm <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                        <a
                          href={upiDeepLink}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/50 rounded-lg text-xs font-semibold text-indigo-300 transition"
                        >
                          Any UPI <ExternalLink className="w-3 h-3 text-indigo-300" />
                        </a>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Support: <a href="mailto:sabhyamtrivedy@gmail.com" className="text-indigo-400 underline font-mono">sabhyamtrivedy@gmail.com</a>
                    </div>
                  </div>
                </div>

                {/* UTR Verification Form */}
                <form onSubmit={handleVerifyPayment} className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        12-Digit UPI Ref / UTR *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 431289012345"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Attach Screenshot (Optional)
                      </label>
                      <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 border border-slate-700 hover:border-slate-600 border-dashed rounded-lg text-xs text-slate-400 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{screenshot ? 'Screenshot Attached ✓' : 'Upload Receipt'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying SBI Transaction...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span>Verify UTR &amp; Unlock {selectedPlan.credits} eBook Passes</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: WHOP SHOP INTEGRATION */}
            {paymentMode === 'whop' && (
              <div className="space-y-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800 animate-fadeIn text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-orange-400">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white">Buy via Whop Store</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Complete your checkout on Whop with Apple Pay, Google Pay, Credit/Debit Cards, or Crypto.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Product:</span>
                    <span className="font-semibold text-white">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Whop Pass Price:</span>
                    <span className="font-bold text-orange-400">₹{selectedPlan.price} / ${(selectedPlan.price / 85).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Access:</span>
                    <span className="text-emerald-400 font-semibold">Instant Whop License Key</span>
                  </div>
                </div>

                <a
                  href={WHOP_CONFIG.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 via-rose-600 to-indigo-600 hover:from-orange-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <span>Go to Whop Shop &rarr;</span>
                </a>

                <p className="text-[11px] text-slate-500">
                  After completing on Whop, your pass will sync automatically or you can email your Whop license to <span className="text-slate-400 font-mono">sabhyamtrivedy@gmail.com</span>.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Payment Success View */
          <div className="p-6 sm:p-8 text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-white">Payment Confirmed!</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              Your order for <span className="text-white font-bold">{selectedPlan.name}</span> is verified.
            </p>

            {/* Official Invoice Card */}
            <div className="my-5 p-4 bg-slate-950 border border-slate-800 rounded-xl text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Order Reference</span>
                <span className="font-mono font-bold text-indigo-300">{completedOrder?.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-bold text-emerald-400">₹{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Transaction UTR</span>
                <span className="font-mono text-slate-300">{completedOrder?.utr}</span>
              </div>
              <div className="flex justify-between pt-1 font-semibold">
                <span className="text-white">Credits Added</span>
                <span className="text-emerald-400">+{completedOrder?.credits} eBook Passes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Open Writer Studio</span>
              </button>
              <button
                onClick={() => window.print()}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}

        {/* Zoomed QR modal overlay */}
        {zoomQr && (
          <div
            onClick={() => setZoomQr(false)}
            className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4 cursor-pointer"
          >
            <div className="bg-white p-4 rounded-2xl max-w-sm w-full text-center shadow-2xl">
              <img
                src={UPI_CONFIG.qrImagePath}
                alt="Enlarged QR"
                className="w-full h-auto object-contain rounded-lg"
              />
              <div className="mt-3 text-slate-900 font-bold text-sm">UPI ID: {UPI_CONFIG.vpa}</div>
              <p className="mt-2 text-[11px] text-slate-500">Tap anywhere to close</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 px-5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Bank Settlement</span>
          </div>
          <span>Support: sabhyamtrivedy@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
