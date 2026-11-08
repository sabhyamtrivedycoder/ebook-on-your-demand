// Payment Service with UPI Integration & Whop Shop Support
export const UPI_CONFIG = {
  vpa: 'gudditrivedy@oksbi',
  payeeName: 'Guddi Trivedi', // Required for bank transfer clearance
  accountEmail: 'sabhyamtrivedy@gmail.com',
  qrImagePath: '/assets/upi-qr-scanner.jpg',
  defaultCurrency: 'INR'
};

export const WHOP_CONFIG = {
  storeUrl: localStorage.getItem('eoyd_whop_url') || 'https://whop.com/ebook-on-your-demand',
  membershipTier: 'https://whop.com/checkout/plan_eoyd_author_pro',
  enabled: true
};

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Antigravity Fast Pass',
    model: 'Antigravity Neural Writer',
    tagline: 'Ideal for fast playbooks & concise guides',
    price: 149,
    originalPrice: 399,
    credits: 1,
    chapters: 'Up to 5 Chapters',
    features: [
      '1 On-Demand eBook via Antigravity AI',
      'Full Chapter Content & TOC',
      'Instant High-Res PDF Export',
      'Standard Cover Art Generator',
      'Commercial Resell Rights'
    ],
    popular: false,
    badge: 'Fastest • ₹149'
  },
  {
    id: 'pro',
    name: 'Claude 3.5 Sonnet Masterclass',
    model: 'Claude 3.5 Sonnet Engine',
    tagline: 'Most popular for authors, course creators & founders',
    price: 249,
    originalPrice: 699,
    credits: 2,
    chapters: 'Up to 8 In-Depth Chapters',
    features: [
      '2 On-Demand eBooks via Claude 3.5 Sonnet',
      'Deep Nuance, Elite Prose & Case Studies',
      'Interactive 3D Hardcover Cover Designer',
      'Instant PDF + EPUB (Kindle & Apple Books)',
      'Markdown & TXT Source Code',
      'Full Commercial & KDP Publishing Rights',
      'Whop Shop Pass Compatible'
    ],
    popular: true,
    badge: 'Most Popular • ₹249'
  },
  {
    id: 'codex-bundle',
    name: 'OpenAI Codex / Technical Tome',
    model: 'OpenAI Codex / GPT-4o Pro',
    tagline: 'For technical architecture, codebooks & financial systems',
    price: 349,
    originalPrice: 899,
    credits: 3,
    chapters: 'Up to 10 Technical Chapters',
    features: [
      '3 Technical eBooks via OpenAI Codex',
      'Executable Code Blocks & Data Frameworks',
      'Mathematical Notation & System Diagrams',
      'High-Definition PDF, EPUB & Markdown',
      'Priority AI Synthesis Queue',
      'Lifetime Updates & Source Exports'
    ],
    popular: false,
    badge: 'Technical Pro • ₹349'
  },
  {
    id: 'vip-bundle',
    name: 'Multi-Agent Trio (Antigravity + Claude + Codex)',
    model: 'Multi-Agent Ensemble',
    tagline: 'Collaborative 3-engine definitive bestseller package',
    price: 499,
    originalPrice: 1299,
    credits: 5,
    chapters: 'Up to 12 Exhaustive Chapters',
    features: [
      '5 Complete On-Demand eBooks',
      'All 3 AI Models Working Simultaneously',
      '3D Hardcover Mockups + PNG Downloads',
      'Amazon KDP & Apple Books Formatting',
      'Whop Store VIP Membership Unlock',
      'Direct Support via sabhyamtrivedy@gmail.com'
    ],
    popular: false,
    badge: 'Best Value • 65% OFF'
  }
];

/**
 * Generate UPI Deep Link URL for mobile apps
 */
export function generateUpiUrl({ amount, planName, orderId }) {
  const note = `EOYD ${planName || 'EBook'} [${orderId || 'ORD'}]`;
  const encodedName = encodeURIComponent(UPI_CONFIG.payeeName);
  const encodedNote = encodeURIComponent(note);
  
  return `upi://pay?pa=${UPI_CONFIG.vpa}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`;
}

export function saveOrder(order) {
  try {
    const existing = JSON.parse(localStorage.getItem('eoyd_orders') || '[]');
    const updated = [order, ...existing];
    localStorage.setItem('eoyd_orders', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save order', e);
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

export function getUserCredits() {
  try {
    const credits = localStorage.getItem('eoyd_user_credits');
    if (credits === null) {
      // 2 free trial credits on initial launch
      localStorage.setItem('eoyd_user_credits', '2');
      return 2;
    }
    return parseInt(credits, 10) || 0;
  } catch (e) {
    return 2;
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
