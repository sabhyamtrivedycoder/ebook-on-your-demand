# PageCraft Studio — On-Demand AI eBook Writer & Publishing Platform

An on-demand AI eBook authoring platform with instant UPI payment integration (`gudditrivedy@oksbi`), QR code scanner, Google Login authentication, 3D cover designer, interactive eReader, and PDF/EPUB export suite.

## 🌟 Key Features

1. **On-Demand AI eBook Generator:**
   - Input custom topic, genre, target audience, tone, chapter count (3-10 chapters), language, and pen name.
   - Step 1: Generates Table of Contents & chapter outlines.
   - Step 2: Full interactive outline review (edit titles, rewrite summaries, add/remove chapters).
   - Step 3: Progressive chapter generation engine with intro hooks, frameworks, case studies, quote blocks, and actionable exercises.
   - Built-in AI synthesizer with zero external dependencies, plus direct OpenAI/Gemini API key support.

2. **3D Book Cover Studio:**
   - Dynamic 3D hardcover book preview with realistic lighting, spine crease, and hover perspective tilt.
   - 5 Design presets: Royal Indigo, Cosmic Gold, Emerald Mind, Crimson Noir, Cyber Blue.
   - 1-Click high-resolution PNG cover download.

3. **Complete UPI Payment Integration:**
   - **UPI ID:** `gudditrivedy@oksbi`
   - **Payee Name:** Guddi Trivedy
   - **QR Scanner:** Embedded real Google Pay UPI QR code image with click-to-zoom.
   - **Instant App Triggers:** 1-click deep links for Google Pay, PhonePe, Paytm, and BHIM (`upi://pay?pa=gudditrivedy@oksbi...`).
   - **1-Click Copy:** Fast copy button for UPI ID.
   - **Transaction Verification:** 12-digit UPI UTR reference input + payment screenshot uploader.
   - **Confetti & Official Invoice:** Automatic credit activation, fireworks, and printable invoice.

4. **Google Login Authentication:**
   - Official Google Identity Services (GIS) SDK integration.
   - Quick 1-click Google Sign-In with persistent session storage.
   - Google Cloud Console OAuth 2.0 Client ID configuration modal with step-by-step setup guide.

5. **Interactive eReader & Multi-Format Exporter:**
   - 4 Reading themes: Light, Sepia Paper, Dark Midnight, Emerald Sanctuary.
   - Font size adjuster and Serif/Sans toggle.
   - 1-Click **PDF Export** with cover page, TOC, and pagination using `jsPDF`.
   - 1-Click **EPUB Export** for Kindle and Apple Books using `JSZip`.
   - Markdown (`.md`) and plain text export.

6. **VIP Bespoke Ghostwriter Hire Section:**
   - Dedicated on-demand custom writing request form to hire Guddi Trivedy directly for 50+ page custom books with WhatsApp integration.

---

## 🚀 Running the Project

The server is running at:
**[http://localhost:5173/](http://localhost:5173/)**

To run manually:
```bash
cd "C:\Users\PC\.gemini\antigravity\scratch\ebook-writer-ondemand"
npm run dev
```

To build for production:
```bash
npm run build
```
