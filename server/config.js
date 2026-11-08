import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'eoyd_super_secret_jwt_key_2026_sabhyam',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  WHOP_WEBHOOK_SECRET: process.env.WHOP_WEBHOOK_SECRET || 'whop_secret_eoyd_test',
  UPI: {
    vpa: 'gudditrivedy@oksbi',
    payeeName: 'Guddi Trivedi',
    supportEmail: 'sabhyamtrivedy@gmail.com'
  }
};
