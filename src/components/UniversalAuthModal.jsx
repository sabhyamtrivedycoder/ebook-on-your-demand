import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Settings,
  Key
} from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  sendPhoneOtp,
  verifyPhoneOtp,
  getFirebaseConfig,
  saveFirebaseConfig
} from '../services/firebase';

export default function UniversalAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'phone' | 'google' | 'firebase'
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone form state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Firebase config state
  const [customFirebase, setCustomFirebase] = useState(() => JSON.stringify(getFirebaseConfig(), null, 2));

  if (!isOpen) return null;

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await loginWithGoogle();
      if (result && result.user) {
        if (onLoginSuccess) onLoginSuccess(result.user);
        onClose();
      }
    } catch (e) {
      setErrorMsg(e.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Auth
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      let result;
      if (isSignUp) {
        result = await registerWithEmail(name, email, password);
      } else {
        result = await loginWithEmail(email, password);
      }

      if (result && result.user) {
        if (onLoginSuccess) onLoginSuccess(result.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Phone Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      setErrorMsg('Please enter a valid phone number with country code (e.g. +91 9876543210).');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      await sendPhoneOtp(phone);
      setOtpSent(true);
      setSuccessMsg('OTP Code sent! (Use test code: 123456 or SMS code)');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Phone Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await verifyPhoneOtp(phone, otp);
      if (result && result.user) {
        if (onLoginSuccess) onLoginSuccess(result.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Login for Sabhyam Trivedy
  const handleSabhyamLogin = () => {
    const user = {
      id: 'sabhyam-founder',
      name: 'Sabhyam Trivedy',
      email: 'sabhyamtrivedy@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'google',
      role: 'Platform Owner',
      credits: 10,
      joinedAt: new Date().toISOString()
    };
    if (onLoginSuccess) onLoginSuccess(user);
    onClose();
  };

  const handleSaveFirebaseConfig = () => {
    try {
      const parsed = JSON.parse(customFirebase);
      saveFirebaseConfig(parsed);
      setSuccessMsg('Firebase credentials updated successfully!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (e) {
      setErrorMsg('Invalid JSON format for Firebase config.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl overflow-hidden border border-indigo-500/40 shadow-lg shadow-indigo-500/20 bg-slate-950 p-1">
            <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">Ebook On Your Demand</h3>
          <p className="text-xs text-slate-400 mt-1">Universal login: Google, Email, or Phone Number</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('email'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'email' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            onClick={() => { setActiveTab('phone'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'phone' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            onClick={() => { setActiveTab('google'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'google' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Status Alerts */}
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

        {/* TAB 1: EMAIL AUTH */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>{isSignUp ? 'Create Free Account' : 'Sign In with Email'}</span>
              )}
            </button>

            <div className="text-center text-xs text-slate-400 pt-1">
              <span>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-400 font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up Free'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PHONE AUTH */}
        {activeTab === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Include country code (+91 for India, +1 for US, etc.)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Send Verification Code (SMS)</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-fadeIn">
                <div className="text-xs text-slate-400">
                  Code sent to <span className="text-white font-mono font-semibold">{phone}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-base font-mono tracking-widest focus:outline-none focus:border-indigo-500"
                  />
                  <div className="text-[10px] text-slate-500 text-center mt-1">
                    Tip: Test OTP code is <span className="font-mono text-indigo-400 font-bold">123456</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs"
                  >
                    Change Phone
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Verify &amp; Sign In'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: GOOGLE AUTH & 1-CLICK DEMO */}
        {activeTab === 'google' && (
          <div className="space-y-3.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500"><span className="bg-slate-900 px-2">Instant Quick Login</span></div>
            </div>

            <button
              type="button"
              onClick={handleSabhyamLogin}
              className="w-full p-2.5 bg-slate-950 hover:bg-slate-850 border border-indigo-500/40 rounded-xl text-left flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Sabhyam"
                  className="w-8 h-8 rounded-full object-cover border border-indigo-400"
                />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition flex items-center gap-1.5">
                    Sabhyam Trivedy
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1 py-0.2 rounded font-mono">Founder</span>
                  </div>
                  <div className="text-[10px] text-slate-400">sabhyamtrivedy@gmail.com</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        )}

        {/* Footer info & Firebase Config Drawer */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firebase &amp; 256-Bit SSL Secured</span>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'firebase' ? 'email' : 'firebase')}
            className="hover:text-indigo-400 transition flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>{activeTab === 'firebase' ? 'Close Config' : 'Firebase Keys'}</span>
          </button>
        </div>

        {/* Firebase Config Editor */}
        {activeTab === 'firebase' && (
          <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom Firebase Project Config</span>
            </div>
            <textarea
              rows={4}
              value={customFirebase}
              onChange={(e) => setCustomFirebase(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 font-mono text-[10px] text-indigo-200 focus:outline-none"
            />
            <button
              onClick={handleSaveFirebaseConfig}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-xs"
            >
              Save Firebase Config
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
