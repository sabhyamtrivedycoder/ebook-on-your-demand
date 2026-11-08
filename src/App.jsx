import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EbookStudio from './components/EbookStudio';
import PricingSection from './components/PricingSection';
import BookLibrary from './components/BookLibrary';
import PaymentModal from './components/PaymentModal';
import UniversalAuthModal from './components/UniversalAuthModal';
import BookReaderModal from './components/BookReaderModal';
import Footer from './components/Footer';

import { getCurrentUser, setCurrentUser } from './services/firebase';
import { getUserCredits, PRICING_PLANS } from './services/paymentService';
import { SAMPLE_BOOKS } from './data/sampleBooks';

export default function App() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [credits, setCredits] = useState(() => getUserCredits());

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PRICING_PLANS[1]);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [activeBook, setActiveBook] = useState(null);

  // Bookshelf
  const [books, setBooks] = useState(() => {
    try {
      const stored = localStorage.getItem('eoyd_books');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_BOOKS;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    const handleCreditsChange = () => {
      setCredits(getUserCredits());
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    window.addEventListener('credits_updated', handleCreditsChange);

    return () => {
      window.removeEventListener('auth_state_changed', handleAuthChange);
      window.removeEventListener('credits_updated', handleCreditsChange);
    };
  }, []);

  const handleOpenPayment = (plan) => {
    setSelectedPlan(plan || PRICING_PLANS[1]);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setCredits(getUserCredits());
  };

  const handleOpenReader = (book) => {
    setActiveBook(book);
    setIsReaderOpen(true);
  };

  const handleSaveBook = (newBook) => {
    const updated = [newBook, ...books.filter(b => b.id !== newBook.id)];
    setBooks(updated);
    try {
      localStorage.setItem('eoyd_books', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const handleScrollToStudio = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        user={user}
        credits={credits}
        onOpenUniversalAuth={() => setIsAuthOpen(true)}
        onOpenPayment={() => handleOpenPayment(PRICING_PLANS[1])}
        onSignOut={handleSignOut}
        onStartNew={handleScrollToStudio}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* On-Demand AI eBook Studio */}
        <EbookStudio
          user={user}
          onOpenPayment={() => handleOpenPayment(PRICING_PLANS[1])}
          onOpenReader={handleOpenReader}
          onSaveBook={handleSaveBook}
        />

        {/* Pricing & Whop Section */}
        <PricingSection onSelectPlan={handleOpenPayment} />

        {/* Showcase Bookshelf */}
        <BookLibrary
          books={books}
          onOpenReader={handleOpenReader}
          onStartNew={handleScrollToStudio}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        selectedPlan={selectedPlan}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <UniversalAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      <BookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        book={activeBook}
      />
    </div>
  );
}
