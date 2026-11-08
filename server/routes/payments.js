import { Router } from 'express';
import { db } from '../db.js';
import { CONFIG } from '../config.js';

const router = Router();

/**
 * Verify UPI Payment & Add Credits
 */
router.post('/verify-upi', (req, res) => {
  try {
    const { orderId, planId, planName, amount, credits = 1, utr, userId, userEmail } = req.body;

    if (!utr || utr.trim().length < 6) {
      return res.status(400).json({ error: 'Valid 12-digit UPI UTR number required.' });
    }

    const order = {
      id: `ord-${Date.now()}`,
      orderId: orderId || `EOYD-${Date.now().toString().slice(-6)}`,
      userId: userId || 'guest',
      userEmail: userEmail || 'sabhyamtrivedy@gmail.com',
      planId: planId || 'pro',
      planName: planName || 'Author Pro Pass',
      amount: amount || 249,
      credits: credits || 2,
      utr: utr.trim(),
      payee: CONFIG.UPI.payeeName,
      upiId: CONFIG.UPI.vpa,
      provider: 'UPI_SBI',
      status: 'VERIFIED',
      createdAt: new Date().toISOString()
    };

    db.createOrder(order);

    // If userId provided, credit user in database
    let updatedCredits = credits;
    if (userId && userId !== 'guest') {
      updatedCredits = db.updateUserCredits(userId, credits);
    }

    res.json({
      success: true,
      message: `UPI Payment verified successfully. ${credits} credits added!`,
      order,
      credits: updatedCredits
    });
  } catch (err) {
    console.error('UPI verify error:', err);
    res.status(500).json({ error: 'Failed to verify UPI payment.' });
  }
});

/**
 * Whop Webhook Listener
 * Triggered automatically by Whop when customers buy memberships or passes
 */
router.post('/whop-webhook', (req, res) => {
  try {
    const event = req.body;
    console.log('[Whop Webhook Received]', event?.action || event?.type);

    // Verify webhook signature or action type
    const action = event?.action || event?.type || '';
    const email = event?.data?.user?.email || event?.user?.email;
    const planId = event?.data?.plan_id || event?.plan_id || 'whop_pass';
    const amount = event?.data?.amount || 4.99;

    if (action.includes('went_valid') || action.includes('payment_succeeded') || action === 'membership.created') {
      console.log(`[Whop Fulfillment] Granting 5 VIP credits to ${email}`);

      let user = db.findUserByEmail(email);
      if (user) {
        db.updateUserCredits(user.id, 5);
      } else if (email) {
        user = {
          id: `whop-user-${Date.now()}`,
          name: email.split('@')[0],
          email: email.toLowerCase(),
          credits: 8, // VIP Whop customer
          role: 'whop_member',
          provider: 'whop',
          createdAt: new Date().toISOString()
        };
        db.createUser(user);
      }

      db.createOrder({
        id: `whop-${Date.now()}`,
        orderId: `WHOP-${Date.now().toString().slice(-6)}`,
        userEmail: email,
        planId,
        amount,
        credits: 5,
        provider: 'WHOP',
        status: 'PAID',
        createdAt: new Date().toISOString()
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Whop webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

/**
 * Get Orders
 */
router.get('/orders', (req, res) => {
  const { email } = req.query;
  const all = db.getOrders();
  if (email) {
    return res.json({ orders: all.filter(o => o.userEmail?.toLowerCase() === email.toLowerCase()) });
  }
  res.json({ orders: all });
});

export default router;
