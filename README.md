# 👑 PartyBala - Luxury Mehndi & Makeup Artist Booking & Partner Network

A high-converting, ultra-premium web platform created for **PartyBala** — *"Your Plans, Our Duty"*. Built with modern Indian luxury wedding aesthetics, interactive form wizards, instant WhatsApp lead handoff, and direct **Google Sheets** database integration.

---

## 🌟 Pages Overview

| Page | URL / File | Purpose | Target Audience |
| :--- | :--- | :--- | :--- |
| **Main Portal Hub** | [`index.html`](./index.html) | Full HD hero showcase, slideshow, client reviews & service portals | Brides, clients, festival hosts |
| **Book Mehndi** | [`book-mehndi.html`](./book-mehndi.html) | Book bridal, family & guest henna artists | Brides, wedding planners, festive clients |
| **Book Makeup** | [`book-makeup.html`](./book-makeup.html) | Book bridal HD/Airbrush makeup artists with hair styling & draping | Brides, bridesmaids, party attendees |
| **Partner Registration** | [`partner.html`](./partner.html) | Single unified onboarding portal for Mehndi, Makeup, or Both artists | Professional bridal artists & stylists |

---

## ✨ Key Features

1. **Direct Google Sheets Database Integration:**
   - Every lead, inquiry, review, and partner application is automatically saved into dedicated tabs in your Google Sheet (`Mehndi_Bookings`, `Makeup_Bookings`, `Partner_Registrations`, `Customer_Reviews`).
   - Connected Google Sheet: `https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit`

2. **Instant WhatsApp Lead Handoff:**
   - Customer Helpline: `+91 89330 23302` (`https://wa.me/918933023302`)
   - Artist Partnership Desk: `+91 89330 73307` (`https://wa.me/918933073307`)
   - Official Correspondence: `info@partybala.com`

3. **Luxury Design System & All-Device Responsiveness:**
   - Warm pearl ivory backdrop, emerald green & royal rose accents, zero wireframe icons.
   - 100% responsive across mobile phones (320px–430px), tablets, and high-DPI desktop screens.
   - iOS Safari touch zoom prevention and tap highlight optimization.

4. **Zero Server Maintenance:**
   - 100% static client-side codebase. No backend or database hosting required.
   - Ready for GitHub Pages, Netlify, Vercel, or shared web hosting.

---

## 📂 Project Directory Structure

```text
PARTY BALA FORMS/
│
├── index.html                 # PartyBala Central Hub / Homepage
├── book-mehndi.html           # Customer Mehndi Artist Booking Form
├── book-makeup.html           # Customer Makeup Artist Booking Form
├── partner.html               # Single Unified Partner Registration Form
├── partner-mehndi.html        # Seamless redirect to partner.html?profession=mehndi
├── partner-makeup.html        # Seamless redirect to partner.html?profession=makeup
│
├── assets/
│   ├── css/
│   │   └── style.css          # Luxury design system, all-device responsive utilities
│   │
│   ├── js/
│   │   ├── config.js          # Central configuration (WhatsApp numbers, Sheet URL, Brand)
│   │   └── form-handler.js    # Form validation, Google Apps Script POST & WhatsApp modal
│   │
│   └── images/                # Full HD photography, hero visuals, official logo
│
├── google-apps-script/
│   └── Code.gs                # Google Apps Script for Google Sheets auto-routing & email alerts
│
├── GOOGLE_SHEETS_SETUP.md     # Step-by-step Google Sheets setup guide
├── .gitignore                 # Standard clean ignore file
└── README.md                  # Project documentation
```

---

© 2026 PartyBala. All rights reserved. *Your Plans, Our Duty.*
