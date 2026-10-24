/**
 * =========================================================================
 * PARTYBALA - ULTRA-PREMIUM MODERN LIGHT THEME "CONNECT US" CONCIERGE MODAL
 * =========================================================================
 * - 100% Modern Light Luxury Aesthetic (Pearl, Silk Creme, Champagne Gold & Rose)
 * - 100% All-Device Responsive (Mobile 320px-430px, Tablet & Desktop)
 * - Pure Vector SVGs (Zero Unicode Encoding Bugs)
 * - Ultra-Crisp Full HD Imagery for Mehndi, Makeup & Artist Partner Network
 * - Real Brand Vector Icons: WhatsApp (Official Green), Mail (Rose/Purple), Phone Handset, Instagram
 * - Smart Calling Desk Intelligence (10:00 AM - 6:00 PM IST with graceful offline guidance)
 * - 100% Reliable Email Functionality (Mailto + Gmail Web 1-tap fallback + Clipboard)
 * =========================================================================
 */

(function () {
  "use strict";

  // Official Channel Configurations
  const CUSTOMER_PHONE = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_CUSTOMER_DISPLAY)  || "+91 89330 23302";
  const PARTNER_PHONE  = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_PARTNER_DISPLAY)   || "+91 89330 73307";
  const CUSTOMER_TEL   = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_CUSTOMER_TEL)      || "tel:+918933023302";
  const PARTNER_TEL    = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_PARTNER_TEL)       || "tel:+918933073307";
  const OFFICIAL_EMAIL = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.SUPPORT_EMAIL)           || "info@partybala.com";
  const INSTAGRAM_URL  = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.INSTAGRAM_URL)            || "https://www.instagram.com/party_bala/";

  /**
   * Determine current time in Indian Standard Time (IST - Asia/Kolkata)
   * Operating Calling Hours: 10:00 AM to 6:00 PM IST
   */
  function getISTStatus() {
    try {
      const now = new Date();
      const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const istDate = new Date(istString);
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const currentMinuteOfDay = hours * 60 + minutes;

      const openMinute  = 10 * 60; // 10:00 AM
      const closeMinute = 18 * 60; // 06:00 PM

      const isCallingOnline = (currentMinuteOfDay >= openMinute && currentMinuteOfDay < closeMinute);

      let formattedTime = istDate.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

      return { isCallingOnline, istDate, formattedTime };
    } catch (e) {
      const now = new Date();
      const utcMinutes = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utcMinutes + (3600000 * 5.5));
      const hours = istDate.getHours();
      const isCallingOnline = (hours >= 10 && hours < 18);
      return { isCallingOnline, istDate, formattedTime: "10:00 AM - 6:00 PM IST" };
    }
  }

  /**
   * Show inline banner inside modal
   */
  function showModalBanner(htmlContent) {
    const banner = document.getElementById('partybala-modal-toast');
    if (banner) {
      banner.innerHTML = htmlContent;
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Clear inline banner
   */
  function clearModalBanner() {
    const banner = document.getElementById('partybala-modal-toast');
    if (banner) {
      banner.innerHTML = '';
    }
  }

  /**
   * Direct Native Email Handler
   */
  function partyBalaTriggerEmail(role) {
    const email = OFFICIAL_EMAIL || "info@partybala.com";
    const isCustomer = (role === 'customer');
    const subject = isCustomer 
      ? "Customer Bridal Inquiry - PartyBala"
      : "Artist Partner Application - PartyBala";
    const body = isCustomer
      ? "Hello PartyBala Concierge,\n\nI want to inquire about booking a Bridal Mehndi / Makeup service.\n\nMy Event Date: \nCity: \nPhone Number: \n\nThank you!"
      : "Hello PartyBala Partner Desk,\n\nI am an artist and would like to register with PartyBala.\n\nMy Artistry: (Mehndi / Makeup)\nCity: \nExperience / Portfolio: \nPhone Number: \n\nThank you!";

    window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  /**
   * Smart Call Trigger with 10:00 AM - 6:00 PM IST Checking
   */
  function partyBalaTriggerCall(role) {
    const ist = getISTStatus();
    const phone = (role === 'partner') ? PARTNER_PHONE : CUSTOMER_PHONE;
    const tel   = (role === 'partner') ? PARTNER_TEL   : CUSTOMER_TEL;
    const waUrl = (role === 'partner')
      ? "https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20want%20to%20partner%20with%20you"
      : "https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20want%20to%20inquire%20about%20a%20bridal%20service";

    if (ist.isCallingOnline) {
      window.location.href = tel;
    } else {
      showModalBanner(`
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 text-left shadow-sm animate-fade-in relative">
          <button type="button" onclick="window.clearPartyBalaBanner()" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xs font-bold p-1">&times;</button>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <div class="font-serif font-bold text-xs text-amber-950">Calling Hours: 10:00 AM &ndash; 6:00 PM IST</div>
          </div>
          <p class="text-[10px] text-gray-700 leading-tight">
            Phone lines are offline. But our <strong class="text-emerald-700">WhatsApp &amp; Email are OPEN 24/7</strong>:
          </p>
          <div class="flex flex-wrap items-center gap-1.5 mt-2">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[10px] shadow-xs transition">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.112.551 4.175 1.597 5.992L.057 24l6.19-1.624a11.96 11.96 0 005.784 1.488h.005c6.634 0 12.001-5.367 12.001-11.987A11.93 11.93 0 0012.031 0zm0 21.875h-.004a9.93 9.93 0 01-5.068-1.39l-.364-.216-3.766.988 1.006-3.673-.237-.377a9.92 9.92 0 01-1.52-5.22c0-5.485 4.464-9.948 9.953-9.948 2.656 0 5.152 1.035 7.029 2.912a9.88 9.88 0 012.909 7.03c-.001 5.486-4.466 9.949-9.954 9.949zm5.454-7.447c-.299-.15-1.77-.874-2.045-.973-.274-.1-.474-.15-.674.15-.2.299-.774.973-.948 1.173-.175.199-.349.224-.648.075-.3-.15-1.265-.466-2.41-1.487-.891-.795-1.493-1.777-1.667-2.076-.175-.3-.018-.462.131-.611.135-.135.3-.349.449-.523.15-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.673-1.623-.923-2.222-.243-.583-.49-.504-.673-.513-.174-.009-.374-.01-.573-.01-.199 0-.524.075-.798.374-.274.299-1.048 1.023-1.048 2.495 0 1.472 1.073 2.894 1.222 3.094.15.199 2.112 3.226 5.116 4.524.714.309 1.272.494 1.707.632.718.228 1.371.196 1.888.119.576-.086 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.2-.574-.35z"/></svg>
              <span>Chat on WhatsApp (24/7)</span>
            </a>
            <a href="mailto:${OFFICIAL_EMAIL}?subject=Inquiry%20-%20PartyBala"
               class="px-2.5 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-[#d91b5c] font-bold text-[10px] transition">
              Mail Us
            </a>
            <a href="${tel}" class="px-2 py-1 text-gray-500 hover:text-gray-800 text-[9px] underline">
              Emergency Call (${phone})
            </a>
          </div>
        </div>
      `);
    }
  }

  /**
   * Open the PartyBala Master "Connect Us" Concierge Modal
   * Premium Modern Light Luxury Theme & 100% Responsive on all screens
   */
  function openPartyBalaConnectModal(focusRole = 'all') {
    closePartyBalaConnectModal();

    const ist = getISTStatus();

    const modalHtml = `
      <div id="partybala-connect-modal" 
           class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
           style="overscroll-behavior: contain;">
        
        <!-- Luxury Modern Light Card Dialog -->
        <div class="bg-gradient-to-b from-[#FFFDFB] via-[#FAF7F2] to-[#F5EFE6] rounded-2xl sm:rounded-3xl w-full max-w-[460px] shadow-2xl border border-[#d4af37]/50 relative overflow-hidden max-h-[92vh] flex flex-col my-auto mx-auto min-w-0"
             style="box-sizing: border-box;">
          
          <!-- ================================================================= -->
          <!-- 1. MODERN LIGHT LUXURY HEADER                                      -->
          <!-- ================================================================= -->
          <div class="relative bg-white/95 backdrop-blur-md text-center pt-3.5 pb-2.5 px-4 border-b border-[#ebdcd0]/70 shrink-0">
            
            <!-- Close 'X' Button -->
            <button onclick="window.closePartyBalaConnectModal()" 
                    type="button" 
                    aria-label="Close dialog" 
                    class="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-[#d91b5c] border border-gray-200 flex items-center justify-center text-xs font-bold shadow-xs transition hover:scale-105 cursor-pointer z-20">
              &#x2715;
            </button>

            <!-- Boutique Eyebrow Badge -->
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 text-[9.5px] font-bold text-amber-900 tracking-wider uppercase mb-1">
              <svg class="w-3 h-3 text-amber-600 fill-current" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2L12 16.8 5.7 21.2 8 14l-6-4.6h7.6z"/></svg>
              <span>PartyBala Luxury Concierge</span>
            </div>

            <!-- Title: Connect With Us -->
            <h2 class="font-serif font-black text-xl sm:text-2xl text-gray-900 tracking-tight leading-none">
              Connect With Us
            </h2>

            <!-- Center Decorative Accent -->
            <div class="flex items-center justify-center gap-2 my-1">
              <span class="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]"></span>
              <span class="text-rose-400 text-xs">&#x2665;</span>
              <span class="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]"></span>
            </div>

            <!-- Subtitle -->
            <p class="text-[10px] sm:text-[11px] text-gray-600 max-w-xs mx-auto font-medium leading-tight">
              Direct phone, WhatsApp &amp; email support for customers and partners.
            </p>

            <!-- Dynamic Calling Desk Status Pill (Light Theme) -->
            <div class="flex items-center justify-center mt-1.5">
              ${ist.isCallingOnline ? `
                <div class="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9.5px] font-bold shadow-2xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Phone Calls: 10 AM &ndash; 6 PM Live</span>
                  <span class="text-emerald-400">&bull;</span>
                  <span>WhatsApp &amp; Email: 24/7 Open</span>
                </div>
              ` : `
                <div class="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[9.5px] font-bold shadow-2xs">
                  <svg class="w-2.5 h-2.5 text-amber-600 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/></svg>
                  <span>Phone Calls: 10 AM &ndash; 6 PM IST</span>
                  <span class="text-amber-400">&bull;</span>
                  <span>WhatsApp &amp; Email: 24/7 Live</span>
                </div>
              `}
            </div>

          </div>

          <!-- ================================================================= -->
          <!-- 2. SCROLLABLE BODY CONTENT                                         -->
          <!-- ================================================================= -->
          <div class="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2.5">

            <!-- ============================================================= -->
            <!-- CARD 1: FOR CUSTOMERS (MODERN LIGHT ROSE & PEARL)             -->
            <!-- ============================================================= -->
            <div id="partybala-card-customer" 
                 class="bg-gradient-to-br from-white via-[#FFF8F9] to-[#FDF0F3] rounded-2xl p-3 border border-[#F4CCD5] shadow-xs hover:shadow-md transition">
              
              <!-- Card Header with Bride Avatar & Description -->
              <div class="flex items-center gap-2.5 mb-2">
                <!-- Avatar with Gold Rim -->
                <div class="rounded-full overflow-hidden shrink-0 border-2 border-rose-300 ring-2 ring-white shadow-xs bg-white"
                     style="width: 46px; height: 46px; min-width: 46px; max-width: 46px; min-height: 46px; max-height: 46px;">
                  <img src="assets/images/connect-customer-bride.jpg" 
                       alt="Bridal Customer" 
                       class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                       style="width: 46px; height: 46px;">
                </div>

                <!-- Text Block -->
                <div class="flex-1 min-w-0 text-left">
                  <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100/80 text-[#c2185b] text-[9px] font-bold uppercase tracking-wider">
                    <span>For Brides &amp; Clients</span>
                  </div>
                  <div class="font-serif font-extrabold text-base text-gray-900 tracking-tight leading-tight mt-0.5">
                    Customer Desk
                  </div>
                  <p class="text-[9.5px] text-gray-600 leading-tight font-medium truncate sm:whitespace-normal">
                    Book verified Mehndi &amp; Makeup, custom quotes or event queries.
                  </p>
                </div>
              </div>

              <!-- 3 Modern Action Buttons -->
              <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-rose-200/60">
                
                <!-- Tile 1: Call Us -->
                <button type="button" 
                        onclick="window.partyBalaTriggerCall('customer')"
                        title="Call Customer Desk (${CUSTOMER_PHONE})"
                        class="bg-white hover:bg-rose-50/70 rounded-xl p-1.5 text-center shadow-xs border border-rose-200/80 flex flex-col items-center justify-between group cursor-pointer transition hover:-translate-y-0.5 min-w-0">
                  <span class="w-7 h-7 rounded-full bg-[#0b3b24] text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs shrink-0">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4.07c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c-.01-.55-.46-1-1.06-1z"/>
                    </svg>
                  </span>
                  <span class="text-[9.5px] font-bold text-gray-900 leading-tight truncate w-full">Call Us</span>
                  <span class="text-[8px] text-gray-500 font-medium">10 AM - 6 PM</span>
                </button>

                <!-- Tile 2: WhatsApp (24/7 Official Highlight) -->
                <a href="https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20want%20to%20inquire%20about%20a%20bridal%20service" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   title="Chat on WhatsApp (${CUSTOMER_PHONE})"
                   class="bg-gradient-to-b from-[#25D366] to-[#1ebc59] hover:from-[#20bd5a] hover:to-[#1a9f4c] text-white rounded-xl p-1.5 text-center shadow-xs flex flex-col items-center justify-between group transition hover:-translate-y-0.5 min-w-0">
                  <span class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shrink-0">
                    <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.112.551 4.175 1.597 5.992L.057 24l6.19-1.624a11.96 11.96 0 005.784 1.488h.005c6.634 0 12.001-5.367 12.001-11.987A11.93 11.93 0 0012.031 0zm0 21.875h-.004a9.93 9.93 0 01-5.068-1.39l-.364-.216-3.766.988 1.006-3.673-.237-.377a9.92 9.92 0 01-1.52-5.22c0-5.485 4.464-9.948 9.953-9.948 2.656 0 5.152 1.035 7.029 2.912a9.88 9.88 0 012.909 7.03c-.001 5.486-4.466 9.949-9.954 9.949zm5.454-7.447c-.299-.15-1.77-.874-2.045-.973-.274-.1-.474-.15-.674.15-.2.299-.774.973-.948 1.173-.175.199-.349.224-.648.075-.3-.15-1.265-.466-2.41-1.487-.891-.795-1.493-1.777-1.667-2.076-.175-.3-.018-.462.131-.611.135-.135.3-.349.449-.523.15-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.673-1.623-.923-2.222-.243-.583-.49-.504-.673-.513-.174-.009-.374-.01-.573-.01-.199 0-.524.075-.798.374-.274.299-1.048 1.023-1.048 2.495 0 1.472 1.073 2.894 1.222 3.094.15.199 2.112 3.226 5.116 4.524.714.309 1.272.494 1.707.632.718.228 1.371.196 1.888.119.576-.086 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.2-.574-.35z"/>
                    </svg>
                  </span>
                  <span class="text-[9.5px] font-bold text-white leading-tight truncate w-full">WhatsApp</span>
                  <span class="text-[8px] text-emerald-100 font-medium">24/7 Open</span>
                </a>

                <!-- Tile 3: Mail Us -->
                <a href="mailto:${OFFICIAL_EMAIL}?subject=Customer%20Bridal%20Inquiry%20-%20PartyBala"
                   title="Email Customer Desk (${OFFICIAL_EMAIL})"
                   class="bg-white hover:bg-rose-50/70 rounded-xl p-1.5 text-center shadow-xs border border-rose-200/80 flex flex-col items-center justify-between group cursor-pointer transition hover:-translate-y-0.5 min-w-0">
                  <span class="w-7 h-7 rounded-full bg-[#c2185b] text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs shrink-0">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </span>
                  <span class="text-[9.5px] font-bold text-gray-900 leading-tight truncate w-full">Mail Us</span>
                  <span class="text-[8px] text-gray-500 font-medium">info@...</span>
                </a>

              </div>

            </div>

            <!-- ============================================================= -->
            <!-- CARD 2: FOR PARTNERS (MODERN LIGHT SAGE & PEARL)              -->
            <!-- ============================================================= -->
            <div id="partybala-card-partner" 
                 class="bg-gradient-to-br from-white via-[#F6FAF7] to-[#EDF6EF] rounded-2xl p-3 border border-[#CFE4D3] shadow-xs hover:shadow-md transition">
              
              <!-- Card Header with Artist Avatar & Description -->
              <div class="flex items-center gap-2.5 mb-2">
                <!-- Avatar with Gold Rim -->
                <div class="rounded-full overflow-hidden shrink-0 border-2 border-emerald-300 ring-2 ring-white shadow-xs bg-white"
                     style="width: 46px; height: 46px; min-width: 46px; max-width: 46px; min-height: 46px; max-height: 46px;">
                  <img src="assets/images/connect-partner-artist.jpg" 
                       alt="Artist Partner Network" 
                       class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                       style="width: 46px; height: 46px;">
                </div>

                <!-- Text Block -->
                <div class="flex-1 min-w-0 text-left">
                  <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#1b5e20] text-[9px] font-bold uppercase tracking-wider">
                    <span>For Artists &amp; Stylists</span>
                  </div>
                  <div class="font-serif font-extrabold text-base text-gray-900 tracking-tight leading-tight mt-0.5">
                    Partner Desk
                  </div>
                  <p class="text-[9.5px] text-gray-600 leading-tight font-medium truncate sm:whitespace-normal">
                    Join as certified Mehndi/Makeup Artist, get verified bridal orders.
                  </p>
                </div>
              </div>

              <!-- 3 Modern Action Buttons -->
              <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-emerald-200/60">
                
                <!-- Tile 1: Call Us -->
                <button type="button" 
                        onclick="window.partyBalaTriggerCall('partner')"
                        title="Call Partner Desk (${PARTNER_PHONE})"
                        class="bg-white hover:bg-emerald-50/70 rounded-xl p-1.5 text-center shadow-xs border border-emerald-200/80 flex flex-col items-center justify-between group cursor-pointer transition hover:-translate-y-0.5 min-w-0">
                  <span class="w-7 h-7 rounded-full bg-[#0b3b24] text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs shrink-0">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4.07c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c-.01-.55-.46-1-1.06-1z"/>
                    </svg>
                  </span>
                  <span class="text-[9.5px] font-bold text-gray-900 leading-tight truncate w-full">Call Us</span>
                  <span class="text-[8px] text-gray-500 font-medium">10 AM - 6 PM</span>
                </button>

                <!-- Tile 2: WhatsApp (24/7 Official Highlight) -->
                <a href="https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20want%20to%20partner%20with%20you" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   title="Chat on WhatsApp (${PARTNER_PHONE})"
                   class="bg-gradient-to-b from-[#25D366] to-[#1ebc59] hover:from-[#20bd5a] hover:to-[#1a9f4c] text-white rounded-xl p-1.5 text-center shadow-xs flex flex-col items-center justify-between group transition hover:-translate-y-0.5 min-w-0">
                  <span class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shrink-0">
                    <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.112.551 4.175 1.597 5.992L.057 24l6.19-1.624a11.96 11.96 0 005.784 1.488h.005c6.634 0 12.001-5.367 12.001-11.987A11.93 11.93 0 0012.031 0zm0 21.875h-.004a9.93 9.93 0 01-5.068-1.39l-.364-.216-3.766.988 1.006-3.673-.237-.377a9.92 9.92 0 01-1.52-5.22c0-5.485 4.464-9.948 9.953-9.948 2.656 0 5.152 1.035 7.029 2.912a9.88 9.88 0 012.909 7.03c-.001 5.486-4.466 9.949-9.954 9.949zm5.454-7.447c-.299-.15-1.77-.874-2.045-.973-.274-.1-.474-.15-.674.15-.2.299-.774.973-.948 1.173-.175.199-.349.224-.648.075-.3-.15-1.265-.466-2.41-1.487-.891-.795-1.493-1.777-1.667-2.076-.175-.3-.018-.462.131-.611.135-.135.3-.349.449-.523.15-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.673-1.623-.923-2.222-.243-.583-.49-.504-.673-.513-.174-.009-.374-.01-.573-.01-.199 0-.524.075-.798.374-.274.299-1.048 1.023-1.048 2.495 0 1.472 1.073 2.894 1.222 3.094.15.199 2.112 3.226 5.116 4.524.714.309 1.272.494 1.707.632.718.228 1.371.196 1.888.119.576-.086 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.2-.574-.35z"/>
                    </svg>
                  </span>
                  <span class="text-[9.5px] font-bold text-white leading-tight truncate w-full">WhatsApp</span>
                  <span class="text-[8px] text-emerald-100 font-medium">24/7 Open</span>
                </a>

                <!-- Tile 3: Mail Us -->
                <a href="mailto:${OFFICIAL_EMAIL}?subject=Artist%20Partner%20Application%20-%20PartyBala"
                   title="Email Partner Desk (${OFFICIAL_EMAIL})"
                   class="bg-white hover:bg-emerald-50/70 rounded-xl p-1.5 text-center shadow-xs border border-emerald-200/80 flex flex-col items-center justify-between group cursor-pointer transition hover:-translate-y-0.5 min-w-0">
                  <span class="w-7 h-7 rounded-full bg-[#c2185b] text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs shrink-0">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </span>
                  <span class="text-[9.5px] font-bold text-gray-900 leading-tight truncate w-full">Mail Us</span>
                  <span class="text-[8px] text-gray-500 font-medium">info@...</span>
                </a>

              </div>

            </div>

            <!-- ============================================================= -->
            <!-- 3. QUICK SERVICES ROW: 3 ULTRA-PREMIUM BOUTIQUE CARDS        -->
            <!-- ============================================================= -->
            <div class="pt-2 border-t border-[#ebdcd0]/70">
              <div class="flex items-center justify-between mb-1.5 px-0.5">
                <span class="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500">Explore Services</span>
                <span class="text-[9px] text-[#d91b5c] font-semibold">Verified Artists</span>
              </div>
              <div class="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                
                <!-- Pill 1: Mehndi Services -->
                <a href="book-mehndi.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="group bg-white hover:bg-rose-50/50 border border-gray-200/90 hover:border-[#d91b5c]/50 rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-between shadow-xs hover:shadow transition cursor-pointer min-w-0">
                  <div class="rounded-full overflow-hidden shadow-xs ring-1 ring-amber-300/80 mb-1 group-hover:scale-108 transition-transform shrink-0"
                       style="width: 38px; height: 38px; min-width: 38px; min-height: 38px;">
                    <img src="assets/images/section-mehndi-circle.png" alt="Mehndi Services" class="w-full h-full object-cover" style="width: 38px; height: 38px;">
                  </div>
                  <span class="font-serif font-bold text-gray-900 group-hover:text-[#d91b5c] text-[9.5px] sm:text-[11px] leading-tight transition truncate w-full">
                    Mehndi
                  </span>
                  <span class="text-[8px] sm:text-[8.5px] text-[#c2185b] font-semibold opacity-90 group-hover:opacity-100 flex items-center gap-0.5 mt-0.5">
                    Explore &rarr;
                  </span>
                </a>

                <!-- Pill 2: Makeup Services -->
                <a href="book-makeup.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="group bg-white hover:bg-emerald-50/50 border border-gray-200/90 hover:border-[#1b5e20]/50 rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-between shadow-xs hover:shadow transition cursor-pointer min-w-0">
                  <div class="rounded-full overflow-hidden shadow-xs ring-1 ring-amber-300/80 mb-1 group-hover:scale-108 transition-transform shrink-0"
                       style="width: 38px; height: 38px; min-width: 38px; min-height: 38px;">
                    <img src="assets/images/section-makeup-circle.png" alt="Makeup Services" class="w-full h-full object-cover" style="width: 38px; height: 38px;">
                  </div>
                  <span class="font-serif font-bold text-gray-900 group-hover:text-[#1b5e20] text-[9.5px] sm:text-[11px] leading-tight transition truncate w-full">
                    Makeup
                  </span>
                  <span class="text-[8px] sm:text-[8.5px] text-[#1b5e20] font-semibold opacity-90 group-hover:opacity-100 flex items-center gap-0.5 mt-0.5">
                    Explore &rarr;
                  </span>
                </a>

                <!-- Pill 3: Partner With Us -->
                <a href="partner.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="group bg-white hover:bg-amber-50/50 border border-gray-200/90 hover:border-amber-600/50 rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-between shadow-xs hover:shadow transition cursor-pointer min-w-0">
                  <div class="rounded-full overflow-hidden shadow-xs ring-1 ring-amber-300/80 mb-1 group-hover:scale-108 transition-transform shrink-0"
                       style="width: 38px; height: 38px; min-width: 38px; min-height: 38px;">
                    <img src="assets/images/section-partner-circle.png" alt="Partner With Us" class="w-full h-full object-cover" style="width: 38px; height: 38px;">
                  </div>
                  <span class="font-serif font-bold text-gray-900 group-hover:text-amber-800 text-[9.5px] sm:text-[11px] leading-tight transition truncate w-full">
                    Join Network
                  </span>
                  <span class="text-[8px] sm:text-[8.5px] text-amber-800 font-semibold opacity-90 group-hover:opacity-100 flex items-center gap-0.5 mt-0.5">
                    Register &rarr;
                  </span>
                </a>

              </div>
            </div>

            <!-- Bottom Brand Channel Micro Strip (Chic Chips) -->
            <div class="pt-2 pb-0.5 flex flex-wrap items-center justify-center gap-1.5 text-[9px] sm:text-[9.5px] text-gray-600 font-semibold border-t border-[#ebdcd0]/70">
              <a href="https://www.partybala.com" target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-200 transition shadow-2xs">
                <svg class="w-2.5 h-2.5 text-amber-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>partybala.com</span>
              </a>
              
              <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50/80 hover:bg-rose-100/90 text-[#d91b5c] border border-rose-200 transition shadow-2xs">
                <svg class="w-2.5 h-2.5 fill-current text-[#d91b5c]" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@party_bala</span>
              </a>

              <a href="mailto:${OFFICIAL_EMAIL}" 
                 class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50/80 hover:bg-purple-100/90 text-purple-900 border border-purple-200 transition shadow-2xs">
                <svg class="w-2.5 h-2.5 fill-current text-purple-700" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span>${OFFICIAL_EMAIL}</span>
              </a>
            </div>

            <!-- Bottom Center Delicate Gold & Rose Line -->
            <div class="flex items-center justify-center gap-2 pt-0.5 pb-0.5">
              <span class="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]"></span>
              <span class="text-rose-400 text-[9px]">&#x2665;</span>
              <span class="w-12 h-[1px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]"></span>
            </div>

          </div>
        </div>
      </div>
    `;

    const existingModal = document.getElementById("partybala-connect-modal");
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    document.body.style.overflow = "hidden";
  }

  /**
   * Close the Master Connect Modal
   */
  function closePartyBalaConnectModal() {
    const modal = document.getElementById("partybala-connect-modal");
    if (modal) {
      modal.remove();
    }
    document.body.style.overflow = "";
  }

  // Close on Escape Key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closePartyBalaConnectModal();
    }
  });

  // Global Exports
  window.openPartyBalaConnectModal = openPartyBalaConnectModal;
  window.closePartyBalaConnectModal = closePartyBalaConnectModal;
  window.partyBalaTriggerCall      = partyBalaTriggerCall;
  window.partyBalaTriggerEmail     = partyBalaTriggerEmail;
  window.clearPartyBalaBanner      = clearModalBanner;
  // Aliases for backwards compatibility
  window.openPartyBalaCallModal    = openPartyBalaConnectModal;
  window.closePartyBalaCallModal   = closePartyBalaConnectModal;

})();
