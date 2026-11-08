// Payment & Whop Service for Ebook On Your Demand

export const WHOP_CONFIG = {
  storeUrl: localStorage.getItem('eoyd_whop_url') || 'https://whop.com/ebook-on-your-demand',
  checkoutUrl: 'https://whop.com/checkout/plan_eoyd_author_pro',
  enabled: true
};

export const UPI_CONFIG = {
  vpa: 'gudditrivedy@oksbi',
  payeeName: 'Guddi Trivedi',
  accountEmail: 'sabhyamtrivedy@gmail.com',
  qrImagePath: '/assets/upi-qr-scanner.jpg',
  defaultCurrency: 'USD'
};

// Clean USD Pricing with original prices for "Save X%" badges
export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Antigravity Fast Pass',
    model: 'Antigravity Neural Writer',
    tagline: 'Ideal for fast playbooks, mini-books & concise guides',
    priceUsd: 1.99,
    originalPriceUsd: 4.99,
    priceInr: 149,
    credits: 1,
    chapters: 'Up to 5 Chapters',
    badge: 'Save 60%',
    features: [
      '1 On-Demand eBook via Antigravity AI',
      'Instant Full Chapter Generation',
      'Downloadable PDF & Markdown',
      'Standard 3D Cover Generator',
      'Full Commercial & Resell Rights'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Claude 3.5 Sonnet Masterclass',
    model: 'Claude 3.5 Sonnet Engine',
    tagline: 'Deep intellectual nuance, elite vocabulary & structured prose',
    priceUsd: 3.49,
    originalPriceUsd: 8.99,
    priceInr: 249,
    credits: 2,
    chapters: 'Up to 8 In-Depth Chapters',
    badge: 'Save 61% • Most Popular',
    features: [
      '2 On-Demand eBooks via Claude 3.5 Sonnet',
      'In-Depth Frameworks & Case Studies',
      'Interactive 3D Hardcover Cover Studio',
      'Instant PDF + EPUB (Kindle & Apple Books)',
      'Source Code & Markdown Exports',
      'Whop Shop Pass Compatible',
      'Amazon KDP Formatting Ready'
    ],
    popular: true
  },
  {
    id: 'codex',
    name: 'OpenAI Codex Technical Pro',
    model: 'OpenAI Codex / GPT-4o Pro',
    tagline: 'For technical architecture, codebooks & financial systems',
    priceUsd: 4.99,
    originalPriceUsd: 12.99,
    priceInr: 349,
    credits: 3,
    chapters: 'Up to 10 Technical Chapters',
    badge: 'Save 62%',
    features: [
      '3 Technical eBooks via OpenAI Codex',
      'Executable Code Blocks & System Schemas',
      'Empirical Analysis & Technical Checklists',
      'High-Definition PDF, EPUB & Markdown',
      'Priority AI Synthesis Queue',
      'Lifetime Access to Source Downloads'
    ],
    popular: false
  },
  {
    id: 'ensemble',
    name: 'Multi-Agent Trio (Antigravity + Claude + Codex)',
    model: 'Multi-Agent Ensemble',
    tagline: '3-Engine collaborative definitive bestseller package',
    priceUsd: 6.99,
    originalPriceUsd: 19.99,
    priceInr: 499,
    credits: 5,
    chapters: 'Up to 12 Exhaustive Chapters',
    badge: 'Save 65% • VIP Value',
    features: [
      '5 Complete On-Demand eBooks',
      'All 3 AI Models Working Collaboratively',
      '3D Hardcover Mockups + PNG Downloads',
      'Amazon KDP & Apple Books Formatting',
      'Whop Store VIP Membership Unlock',
      'Direct Support via sabhyamtrivedy@gmail.com'
    ],
    popular: false
  }
];

export function getUserCredits() {
  try {
    const credits = localStorage.getItem('eoyd_user_credits');
    if (credits === null) {
      // Give 5 free passes to every new visitor so they can generate books immediately!
      localStorage.setItem('eoyd_user_credits', '5');
      return 5;
    }
    return parseInt(credits, 10) || 0;
  } catch (e) {
    return 5;
  }
}

export function updateUserCredits(amount) {
  try {
    const current = getUserCredits();
    const next = Math.max(0, current + amount);
    localStorage.setItem('eoyd_user_credits', next.toString());
    window.dispatchEvent(new Event('credits_updated'));
    return next;
  } catch (e) {
    return 0;
  }
}

export function saveOrder(order) {
  try {
    const existing = JSON.parse(localStorage.getItem('eoyd_orders') || '[]');
    const updated = [order, ...existing];
    localStorage.setItem('eoyd_orders', JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function getSavedOrders() {
  try {
    return JSON.parse(localStorage.getItem('eoyd_orders') || '[]');
  } catch (e) {
    return [];
  }
}

export function generateUpiUrl({ amountInr, planName, orderId }) {
  const note = `EOYD ${planName || 'EBook'} [${orderId || 'ORD'}]`;
  const encodedName = encodeURIComponent(UPI_CONFIG.payeeName);
  const encodedNote = encodeURIComponent(note);
  return `upi://pay?pa=${UPI_CONFIG.vpa}&pn=${encodedName}&am=${amountInr}&cu=INR&tn=${encodedNote}`;
}
