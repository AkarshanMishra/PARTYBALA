# 📋 PartyBala - Google Sheets Integration Setup Guide

### 🎯 Your Target Google Sheet:
👉 **[Open Your PartyBala Google Sheet](https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit)**  
*(Spreadsheet ID: `1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM`)*

### 📞 Configured Contact Channels:
* **Customer WhatsApp (Bookings):** `+91 89330 23302`
* **Partner WhatsApp (Artists):** `+91 89330 73307`
* **Official Sender & Admin Email:** `info@partybala.com`

---

## 💌 Automated Email & Google Sheet Features

When a customer or artist submits a form:
1. **Google Sheet Entry:** Saved into dedicated tabs with color-coded status badges:
   * 🌿 **`Mehndi_Bookings`** - Customer Mehndi bookings
   * 💄 **`Makeup_Bookings`** - Customer Makeup bookings
   * 🤝 **`Partner_Registrations`** - Unified Mehndi & Makeup partner applications
   * ⭐ **`Customer_Reviews`** - Direct website customer reviews & ratings
   * 🎨 **`Mehndi_Partners`** & 👑 **`Makeup_Partners`** - Legacy artist tabs
2. **Automated Thank You Note:** An email is automatically dispatched from `info@partybala.com` to the customer or partner with a custom Thank You note, inquiry summary, and WhatsApp link!
3. **Instant Admin Alert:** An email notification is sent to `info@partybala.com` with complete lead data.

---

## ⚡ 3-Minute Quick Setup

### Step 1: Open Apps Script in Your Sheet
1. Click to open your Google Sheet: [https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit](https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit)
2. In the top Google Sheets menu, click **Extensions** ➡️ **Apps Script**.
3. If there is any default code, select and delete it.

---

### Step 2: Paste the PartyBala Script
1. Open the file [Code.gs](file:///c:/Users/pc/OneDrive/Desktop/PARTY%20BALA%20FORMS/google-apps-script/Code.gs).
2. Copy the entire code.
3. Paste it into the Apps Script code editor.
4. Press `Ctrl + S` (or click the 💾 Save icon).

---

### Step 3: Deploy as Web App
1. In the top-right corner, click the blue **Deploy** button ➡️ select **New deployment**.
2. Click the gear icon (**⚙️**) next to "Select type" and choose **Web app**.
3. Set the fields:
   * **Description**: `PartyBala Form Collector & Auto-Responder`
   * **Execute as**: `Me (your Google email)`
   * **Who has access**: `Anyone` *(⚠️ Crucial: This allows form visitors to submit leads without having to sign into Google).*
4. Click **Deploy**.
5. When prompted:
   * Click **Authorize access** ➡️ Select your Google account.
   * If Google displays a warning *"Google hasn't verified this app"*, click **Advanced** (bottom left) ➡️ then click **Go to PartyBala (unsafe)**.
   * Click **Allow**.
6. Google will provide your **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`). Click **Copy**.

---

### Step 4: Paste Web App URL in config.js
1. Open [config.js](file:///c:/Users/pc/OneDrive/Desktop/PARTY%20BALA%20FORMS/assets/js/config.js).
2. Paste your copied URL into line 16:
   ```javascript
   GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_COPIED_URL_HERE/exec",
   ```
3. Save the file.

---

## 🚀 You're Done!
Open [index.html](file:///c:/Users/pc/OneDrive/Desktop/PARTY%20BALA%20FORMS/index.html) or [book-mehndi.html](file:///c:/Users/pc/OneDrive/Desktop/PARTY%20BALA%20FORMS/book-mehndi.html), submit a test booking with your email, and check your inbox for the instant Thank You receipt from `info@partybala.com` and your Google Sheet for the newly logged row!
