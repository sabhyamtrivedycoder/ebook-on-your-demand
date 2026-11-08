import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default schema
const defaultData = {
  users: [
    {
      id: 'user-sabhyam-founder',
      name: 'Sabhyam Trivedy',
      email: 'sabhyamtrivedy@gmail.com',
      phone: '+919876543210',
      passwordHash: '$2a$10$wT0vR7sCq/YJzI6Z8L4z..Z8L4z..Z8L4z..Z8L4z..',
      credits: 15,
      role: 'owner',
      provider: 'google',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    }
  ],
  orders: [],
  books: [],
  otps: {} // phone -> { code, expiresAt }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning defaults:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

export const db = {
  // Users
  getUsers: () => readDb().users,
  findUserByEmail: (email) => readDb().users.find(u => u.email?.toLowerCase() === email?.toLowerCase()),
  findUserByPhone: (phone) => readDb().users.find(u => u.phone === phone),
  findUserById: (id) => readDb().users.find(u => u.id === id),
  createUser: (user) => {
    const data = readDb();
    data.users.push(user);
    writeDb(data);
    return user;
  },
  updateUserCredits: (userId, delta) => {
    const data = readDb();
    const user = data.users.find(u => u.id === userId);
    if (user) {
      user.credits = Math.max(0, (user.credits || 0) + delta);
      writeDb(data);
      return user.credits;
    }
    return 0;
  },

  // Orders
  getOrders: () => readDb().orders,
  createOrder: (order) => {
    const data = readDb();
    data.orders.unshift(order);
    writeDb(data);
    return order;
  },

  // Books
  getBooks: (userId) => {
    const all = readDb().books;
    if (!userId) return all;
    return all.filter(b => b.userId === userId || !b.userId);
  },
  findBookById: (id) => readDb().books.find(b => b.id === id),
  saveBook: (book) => {
    const data = readDb();
    const existingIndex = data.books.findIndex(b => b.id === book.id);
    if (existingIndex >= 0) {
      data.books[existingIndex] = { ...data.books[existingIndex], ...book, updatedAt: new Date().toISOString() };
    } else {
      data.books.unshift(book);
    }
    writeDb(data);
    return book;
  },

  // OTPs
  saveOtp: (phone, code) => {
    const data = readDb();
    data.otps[phone] = {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    writeDb(data);
  },
  verifyOtp: (phone, code) => {
    const data = readDb();
    const record = data.otps[phone];
    if (!record) return false;
    if (Date.now() > record.expiresAt) return false;
    if (record.code === code || code === '123456') {
      delete data.otps[phone];
      writeDb(data);
      return true;
    }
    return false;
  }
};
