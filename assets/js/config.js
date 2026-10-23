/**
 * =========================================================================
 * PARTYBALA - CENTRAL CONFIGURATION
 * =========================================================================
 * Target Google Sheet:
 * https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit
 * =========================================================================
 */

const PARTYBALA_CONFIG = {
  // 1. YOUR TARGET GOOGLE SHEET LINK:
  GOOGLE_SHEET_URL: "https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit",
  GOOGLE_SHEET_ID: "1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM",

  // 2. PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE AFTER DEPLOYMENT:
  // Example: "https://script.google.com/macros/s/AKfycbx.../exec"
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwqfaC5Mig0El3NTYRSerf7Xjm3cFb6QpDAQNvQ8DfVyBspfLjOq7LhmHzgMKrer_E/exec", 

  // 3. WHATSAPP HELPLINE NUMBERS (Country code 91 + 10 digits, no spaces)
  WHATSAPP_CUSTOMER: "918933023302", // 8933023302 for Customers (Bookings)
  WHATSAPP_PARTNER: "918933073307",  // 8933073307 for Partners (Artists)
  
  // Display formats
  PHONE_CUSTOMER_DISPLAY: "+91 89330 23302",
  PHONE_PARTNER_DISPLAY: "+91 89330 73307",

  // 4. BRAND, SOCIAL, WEBSITE & EMAIL DETAILS
  BRAND_NAME: "PartyBala",
  DEFAULT_CITY: "Kanpur",
  LOGO_PATH: "assets/images/partybala-logo.png",
  TAGLINE: "Your Plans, Our Duty",
  OFFICIAL_WEBSITE: "www.partybala.com",
  OFFICIAL_WEBSITE_URL: "https://www.partybala.com",
  SUPPORT_EMAIL: "info@partybala.com",
  ADMIN_EMAIL: "info@partybala.com",
  INSTAGRAM_HANDLE: "@party_bala",
  INSTAGRAM_URL: "https://www.instagram.com/party_bala/",

  // 5. BEHAVIOR
  ENABLE_WHATSAPP_HANDOFF: true,
  ALLOW_DEMO_MODE: true,

  // 6. HIGH-SCALE ENTERPRISE ARCHITECTURE (READY FOR 1 CR+ USERS)
  // Supports direct dual-broadcast to High-Throughput Serverless Endpoints (AWS Lambda / Cloudflare Worker / Supabase)
  ENTERPRISE_WEBHOOK_URL: ""
};
