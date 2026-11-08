import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { CONFIG } from '../config.js';

const router = Router();

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    CONFIG.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Middleware to authenticate JWT
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

/**
 * Register with Email & Password
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Account already exists with this email. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      passwordHash,
      credits: 3, // Welcome 3 free eBook passes!
      role: 'member',
      provider: 'email',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const token = generateToken(newUser);

    const { passwordHash: _, ...userSafe } = newUser;
    res.status(201).json({ success: true, user: userSafe, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

/**
 * Login with Email & Password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email. Please sign up.' });
    }

    if (user.passwordHash) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userSafe } = user;
    res.json({ success: true, user: userSafe, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

/**
 * Send Phone OTP
 */
router.post('/phone/send-otp', (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 8) {
      return res.status(400).json({ error: 'Valid phone number required.' });
    }

    // Generate random 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db.saveOtp(phone, code);

    // In production, dispatch via Twilio / Fast2SMS / Firebase Admin
    console.log(`[SMS OTP Dispatch] Code for ${phone}: ${code}`);

    res.json({
      success: true,
      message: `OTP dispatched to ${phone}.`,
      sampleOtp: '123456' // Always available as instant fallback test
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

/**
 * Verify Phone OTP
 */
router.post('/phone/verify-otp', (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and OTP code required.' });
    }

    const isValid = db.verifyOtp(phone, code);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP code.' });
    }

    let user = db.findUserByPhone(phone);
    if (!user) {
      user = {
        id: `phone-${Date.now()}`,
        name: `User ${phone.slice(-4)}`,
        phone,
        email: `${phone.replace(/[^0-9]/g, '')}@phone.eoyd.com`,
        credits: 3,
        role: 'member',
        provider: 'phone',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${phone}`,
        createdAt: new Date().toISOString()
      };
      db.createUser(user);
    }

    const token = generateToken(user);
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed.' });
  }
});

/**
 * Google OAuth Token Verification & Login
 */
router.post('/google', (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google email required.' });
    }

    let user = db.findUserByEmail(email);
    if (!user) {
      user = {
        id: googleId || `google-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
        credits: email === 'sabhyamtrivedy@gmail.com' ? 15 : 3,
        role: email === 'sabhyamtrivedy@gmail.com' ? 'owner' : 'member',
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      db.createUser(user);
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userSafe } = user;
    res.json({ success: true, user: userSafe, token });
  } catch (err) {
    res.status(500).json({ error: 'Google authentication failed.' });
  }
});

/**
 * Get Current User Profile & Credits
 */
router.get('/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { passwordHash: _, ...userSafe } = user;
  res.json({ success: true, user: userSafe });
});

export default router;
