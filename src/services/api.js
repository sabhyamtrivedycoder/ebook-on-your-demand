// Frontend API Bridge for Ebook On Your Demand Backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to call backend with timeout & error handling
 */
async function request(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('eoyd_auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(id);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Backend endpoint ${endpoint} offline or unavailable, continuing in local mode.`, err.message);
  }
  return null;
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  register: (name, email, password) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  sendOtp: (phone) => request('/auth/phone/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),
  verifyOtp: (phone, code) => request('/auth/phone/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code })
  }),
  googleLogin: (profile) => request('/auth/google', {
    method: 'POST',
    body: JSON.stringify(profile)
  }),
  getMe: () => request('/auth/me'),

  // AI Generation
  generateOutline: (params) => request('/ai/outline', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  generateChapter: (params) => request('/ai/chapter', {
    method: 'POST',
    body: JSON.stringify(params)
  }),

  // Payments
  verifyUpi: (orderData) => request('/payments/verify-upi', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),

  // Books
  getBooks: (userId) => request(`/books${userId ? `?userId=${userId}` : ''}`),
  saveBook: (book) => request('/books', {
    method: 'POST',
    body: JSON.stringify(book)
  })
};
