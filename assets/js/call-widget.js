/**
 * =========================================================================
 * PARTYBALA - COMPACT, CUTE & ULTRA-RESPONSIVE "CONNECT US" MODAL
 * =========================================================================
 * - Small, cute, luxury boutique proportions (max-width 560px)
 * - 100% Visual Replica of PartyBala "Connect Us" Master Brand Art
 * - Authentic Real Vector Icons: WhatsApp, Instagram, Sealed Mail, Phone
 * - 100% Reliable Email Function: Mailto + Gmail Web direct 1-tap + Clipboard
 * - Smart Calling Hours: 10:00 AM to 6:00 PM IST with graceful offline support
 * - 100% Device Responsive: Mobile (320px-639px with cute tab switch), Tablet & Desktop (side-by-side)
 * =========================================================================
 */

(function () {
  'use strict';

  const CUSTOMER_PHONE = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_CUSTOMER_DISPLAY) || "+91 89330 23302";
  const PARTNER_PHONE  = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_PARTNER_DISPLAY)  || "+91 89330 73307";
  const CUSTOMER_TEL   = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_CUSTOMER_TEL)      || "tel:+918933023302";
  const PARTNER_TEL    = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_PARTNER_TEL)       || "tel:+918933073307";
  const OFFICIAL_EMAIL = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.SUPPORT_EMAIL)           || "info@partybala.com";
  const INSTAGRAM_URL  = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.INSTAGRAM_URL)            || "https://www.instagram.com/party_bala/";

  /**
   * Determine current time in Indian Standard Time (IST - Asia/Kolkata)
   * Calling hours: 10:00 AM to 6:00 PM (10:00 - 18:00) IST
   */
  function getISTStatus() {
    try {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: 'numeric', minute: 'numeric' };
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.formatToParts(now);
      const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
      const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);

      // Calling hours: 10:00 AM (10) to 6:00 PM (18:00) IST
      const isCallingOnline = (hour >= 10 && hour < 18);

      const displayHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const paddedMinute = minute < 10 ? '0' + minute : minute;
      const timeString = `${displayHour}:${paddedMinute} ${ampm} IST`;

      return { hour, minute, isCallingOnline, timeString };
    } catch (e) {
      const now = new Date();
      const hour = now.getHours();
      const isCallingOnline = (hour >= 10 && hour < 18);
      return { hour, minute: now.getMinutes(), isCallingOnline, timeString: "IST" };
    }
  }

  /**
   * Show cute inline banner inside modal
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
   * Mobile tab switcher for small screens (< 640px)
   */
  function partyBalaSetMobileTab(tab) {
    const custCard = document.getElementById('partybala-card-customer');
    const partCard = document.getElementById('partybala-card-partner');
    const custBtn  = document.getElementById('toggle-tab-customer');
    const partBtn  = document.getElementById('toggle-tab-partner');

    if (!custCard || !partCard) return;

    if (tab === 'partner') {
      custCard.classList.add('hidden', 'sm:flex');
      custCard.classList.remove('flex');
      partCard.classList.remove('hidden');
      partCard.classList.add('flex');

      if (custBtn && partBtn) {
        custBtn.className = "flex-1 py-1 px-2.5 rounded-full text-[11px] font-bold text-gray-600 transition";
        partBtn.className = "flex-1 py-1 px-2.5 rounded-full text-[11px] font-bold bg-[#edf5ed] text-[#1b5e20] shadow-2xs transition";
      }
    } else {
      partCard.classList.add('hidden', 'sm:flex');
      partCard.classList.remove('flex');
      custCard.classList.remove('hidden');
      custCard.classList.add('flex');

      if (custBtn && partBtn) {
        custBtn.className = "flex-1 py-1 px-2.5 rounded-full text-[11px] font-bold bg-[#fcecee] text-[#c2185b] shadow-2xs transition";
        partBtn.className = "flex-1 py-1 px-2.5 rounded-full text-[11px] font-bold text-gray-600 transition";
      }
    }
  }

  /**
   * Reliable 100% Working Email Function for all devices (Mobile & Desktop)
   * Automatically copies address, launches default app, and provides 1-tap Gmail Web fallback
   * @param {string} role - 'customer' | 'partner'
   * @param {Event} [event]
   */
  function partyBalaTriggerEmail(role, event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const email = OFFICIAL_EMAIL || "info@partybala.com";
    const isCustomer = (role === 'customer');
    const subject = isCustomer 
      ? "Customer Bridal Inquiry - PartyBala"
      : "Artist Partner Application - PartyBala";
    const body = isCustomer
      ? "Hello PartyBala Team,\n\nI want to inquire about booking bridal mehndi / makeup services.\n\nName:\nPhone:\nEvent Date:\nCity:\n\nThank you!"
      : "Hello PartyBala Artist Desk,\n\nI want to join PartyBala as a verified artist partner.\n\nName:\nProfession (Mehndi/Makeup):\nPhone:\nCity:\nInstagram / Portfolio:\n\nThank you!";

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;

    // 1. Copy email address to clipboard immediately
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email);
      }
    } catch (e) {}

    // 2. Direct attempt to open default mail client
    try {
      window.location.href = mailtoUrl;
    } catch (e) {}

    // 3. Display cute, helpful modal notification with 1-click webmail actions
    showModalBanner(`
      <div class="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 text-left shadow-md animate-fade-in relative mb-2">
        <button onclick="window.clearPartyBalaBanner()" type="button" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer">&#x2715;</button>
        <div class="flex items-start gap-2">
          <!-- Real Mail Envelope Icon -->
          <span class="w-7 h-7 rounded-lg bg-[#c2185b] text-white flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </span>
          <div class="space-y-1 flex-1 pr-3">
            <div class="font-bold text-[11px] sm:text-xs text-gray-900 leading-tight">
              Mailing to <span class="text-[#d91b5c]">${email}</span>
            </div>
            <p class="text-[10px] text-gray-600 leading-tight">
              Copied to clipboard! If mail app did not open automatically, tap below:
            </p>
            <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
              <a href="${gmailWebUrl}" target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] shadow-2xs transition">
                <span>📧 Open in Gmail</span>
              </a>
              <a href="${mailtoUrl}" 
                 class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[10px] transition">
                <span>Launch Mail App</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /**
   * Trigger Call action with 10:00 AM - 6:00 PM IST checking
   * @param {string} role - 'customer' | 'partner'
   */
  function partyBalaTriggerCall(role) {
    const ist = getISTStatus();
    const tel = (role === 'partner') ? PARTNER_TEL : CUSTOMER_TEL;
    const phone = (role === 'partner') ? PARTNER_PHONE : CUSTOMER_PHONE;
    const waUrl = (role === 'partner') 
      ? 'https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20want%20to%20connect%20with%20you'
      : 'https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20want%20to%20inquire%20about%20a%20bridal%20service';

    if (ist.isCallingOnline) {
      // Live during calling hours (10:00 AM - 6:00 PM IST)
      window.location.href = tel;
    } else {
      // Outside calling hours: show cute prompt with 24/7 WhatsApp & Email
      showModalBanner(`
        <div class="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border border-amber-300 text-left shadow-md animate-fade-in relative mb-2">
          <button onclick="window.clearPartyBalaBanner()" type="button" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer">&#x2715;</button>
          <div class="flex items-start gap-2">
            <span class="text-base shrink-0 mt-0.5">🌙</span>
            <div class="space-y-1 flex-1 pr-3">
              <div class="font-serif font-extrabold text-[11px] sm:text-xs text-gray-900 leading-tight">
                Phone Calling Hours: 10:00 AM &ndash; 6:00 PM IST
              </div>
              <p class="text-[10px] text-gray-700 leading-tight">
                Lines reopen at 10 AM IST. But our <strong class="text-emerald-700">WhatsApp &amp; Email are OPEN 24/7</strong>!
              </p>
              <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
                   class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs transition">
                  <!-- Real WhatsApp Icon -->
                  <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.112.551 4.175 1.597 5.992L.057 24l6.19-1.624a11.96 11.96 0 005.784 1.488h.005c6.634 0 12.001-5.367 12.001-11.987A11.93 11.93 0 0012.031 0zm0 21.875h-.004a9.93 9.93 0 01-5.068-1.39l-.364-.216-3.766.988 1.006-3.673-.237-.377a9.92 9.92 0 01-1.52-5.22c0-5.485 4.464-9.948 9.953-9.948 2.656 0 5.152 1.035 7.029 2.912a9.88 9.88 0 012.909 7.03c-.001 5.486-4.466 9.949-9.954 9.949zm5.454-7.447c-.299-.15-1.77-.874-2.045-.973-.274-.1-.474-.15-.674.15-.2.299-.774.973-.948 1.173-.175.199-.349.224-.648.075-.3-.15-1.265-.466-2.41-1.487-.891-.795-1.493-1.777-1.667-2.076-.175-.3-.018-.462.131-.611.135-.135.3-.349.449-.523.15-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.673-1.623-.923-2.222-.243-.583-.49-.504-.673-.513-.174-.009-.374-.01-.573-.01-.199 0-.524.075-.798.374-.274.299-1.048 1.023-1.048 2.495 0 1.472 1.073 2.894 1.222 3.094.15.199 2.112 3.226 5.116 4.524.714.309 1.272.494 1.707.632.718.228 1.371.196 1.888.119.576-.086 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.2-.574-.35z"/></svg>
                  <span>Chat on WhatsApp (24/7)</span>
                </a>
                <button type="button" onclick="window.partyBalaTriggerEmail('${role}')"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#d91b5c] border border-rose-200 font-bold text-[10px] transition cursor-pointer">
                  <span>✉️ Mail Us</span>
                </button>
                <a href="${tel}" 
                   class="inline-flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-gray-800 text-[9px] underline transition">
                  <span>Emergency Call (${phone})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      `);
    }
  }

  /**
   * Open the PartyBala Master "Connect Us" Concierge Modal
   * Small, Cute, Ultra-Premium, Proportional & 100% Responsive on all screens
   * @param {string} [focusRole] - 'customer' | 'partner' | 'all'
   */
  function openPartyBalaConnectModal(focusRole = 'all') {
    closePartyBalaConnectModal();

    const ist = getISTStatus();
    const isPartnerDefault = (focusRole === 'partner');

    const modalHtml = `
      <div id="partybala-connect-modal" 
           class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
           style="overscroll-behavior: contain;">
        
        <!-- Small, Cute, Premium Card Dialog (max-w-[560px]) -->
        <div class="bg-[#FAF7F2] rounded-3xl max-w-[560px] w-full shadow-2xl border-2 border-[#d4af37]/60 relative overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
          
          <!-- ================================================================= -->
          <!-- 1. CUTE ROYAL FOREST GREEN HEADER WITH GOLD BOTANICAL ACCENTS     -->
          <!-- ================================================================= -->
          <div class="relative bg-gradient-to-b from-[#062916] via-[#09351e] to-[#0b3d23] text-center pt-3 pb-3.5 sm:pt-4 sm:pb-4.5 px-4 shrink-0 overflow-hidden">
            
            <!-- Gold Botanical Leaves: Left Decorative Sprig -->
            <div class="absolute -left-1 -top-1 w-16 sm:w-24 h-16 sm:h-24 pointer-events-none opacity-40">
              <svg viewBox="0 0 160 160" fill="none" stroke="#e6ca65" stroke-width="1.8" class="w-full h-full">
                <path d="M10,150 Q40,90 120,40 M40,90 Q30,60 10,70 M45,85 Q70,75 80,50 M80,65 Q85,40 65,30 M85,60 Q110,50 120,20 M120,40 Q135,30 140,10"/>
                <circle cx="10" cy="70" r="3" fill="#e6ca65"/>
                <circle cx="80" cy="50" r="3" fill="#e6ca65"/>
              </svg>
            </div>

            <!-- Gold Botanical Leaves: Right Decorative Sprig -->
            <div class="absolute -right-1 -top-1 w-16 sm:w-24 h-16 sm:h-24 pointer-events-none opacity-40 transform scale-x-[-1]">
              <svg viewBox="0 0 160 160" fill="none" stroke="#e6ca65" stroke-width="1.8" class="w-full h-full">
                <path d="M10,150 Q40,90 120,40 M40,90 Q30,60 10,70 M45,85 Q70,75 80,50 M80,65 Q85,40 65,30 M85,60 Q110,50 120,20 M120,40 Q135,30 140,10"/>
                <circle cx="10" cy="70" r="3" fill="#e6ca65"/>
                <circle cx="80" cy="50" r="3" fill="#e6ca65"/>
              </svg>
            </div>

            <!-- Cute Close 'X' Button (Soft Blush Circle with dark X) -->
            <button onclick="window.closePartyBalaConnectModal()" 
                    type="button" 
                    aria-label="Close connect dialog" 
                    class="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fcecee] hover:bg-rose-200 text-gray-800 hover:text-black border border-rose-300 flex items-center justify-center text-xs sm:text-sm font-extrabold transition shadow-xs hover:scale-105 cursor-pointer z-20">
              &#x2715;
            </button>

            <!-- Title: Connect Us in Cute Luxury Serif Calligraphy -->
            <h2 class="font-serif italic font-extrabold text-2xl sm:text-3xl text-[#faebd7] tracking-normal drop-shadow-sm relative z-10 leading-none">
              Connect Us
            </h2>

            <!-- Center Cute Heart with Golden Whisker Lines -->
            <div class="flex items-center justify-center gap-2 my-1 relative z-10">
              <span class="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]"></span>
              <span class="text-pink-300 text-xs leading-none">♥</span>
              <span class="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]"></span>
            </div>

            <!-- Subtitle -->
            <p class="font-serif italic text-[10.5px] sm:text-xs text-[#eddcd2] tracking-wide max-w-sm mx-auto relative z-10 font-normal">
              We are here for all your Mehndi &amp; Makeup needs
            </p>

            <!-- Bottom Scalloped Golden Arch Edge Divider -->
            <div class="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
              <svg viewBox="0 0 1200 26" preserveAspectRatio="none" class="w-full h-2.5 fill-[#FAF7F2]">
                <path d="M0,0 C300,20 600,24 900,6 C1050,0 1150,8 1200,16 L1200,26 L0,26 Z"></path>
              </svg>
            </div>
          </div>

          <!-- ================================================================= -->
          <!-- 2. SCROLLABLE BODY CONTENT (CUTE COMPACT PROPORTIONS)              -->
          <!-- ================================================================= -->
          <div class="p-2.5 sm:p-3.5 overflow-y-auto flex-1 space-y-2">
            
            <!-- Dynamic Calling Desk Status Pill (Petite & Discreet) -->
            <div class="flex items-center justify-center">
              ${ist.isCallingOnline ? `
                <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shadow-2xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Calls: 10 AM &ndash; 6 PM Live &bull; WhatsApp &amp; Email: 24/7 Open</span>
                </div>
              ` : `
                <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold shadow-2xs">
                  <span>🌙</span>
                  <span>Calls Offline (10 AM &ndash; 6 PM IST) &bull; WhatsApp &amp; Email: 24/7 Live</span>
                </div>
              `}
            </div>

            <!-- Toast / Banner container for Email & Offline notifications -->
            <div id="partybala-modal-toast"></div>

            <!-- Cute Mobile Segmented Pill Toggle (< 640px phones only) -->
            <div class="flex sm:hidden items-center justify-center p-0.5 bg-gray-100/90 rounded-full border border-gray-200 max-w-[260px] mx-auto shadow-2xs">
              <button id="toggle-tab-customer" 
                      type="button" 
                      onclick="window.partyBalaSetMobileTab('customer')" 
                      class="flex-1 py-1 px-2.5 rounded-full text-[11px] font-bold ${isPartnerDefault ? 'text-gray-600' : 'bg-[#fcecee] text-[#c2185b] shadow-2xs'} transition cursor-pointer">
                👑 Customers
              </button>
              <button id="toggle-tab-partner" 
                      type="button" 
                      onclick="window.partyBalaSetMobileTab('partner')" 
                      class="flex-1 py-1 px-2.5 rounded-full text-[11px] font-bold ${isPartnerDefault ? 'bg-[#edf5ed] text-[#1b5e20] shadow-2xs' : 'text-gray-600'} transition cursor-pointer">
                🤝 Partners
              </button>
            </div>

            <!-- GRID: TWO CUTE COMPACT DEPARTMENT CARDS (RESPONSIVE) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-stretch">
              
              <!-- ============================================================= -->
              <!-- LEFT CARD: FOR CUSTOMERS (SOFT BLUSH PINK PALETTE)            -->
              <!-- ============================================================= -->
              <div id="partybala-card-customer" 
                   class="${isPartnerDefault ? 'hidden sm:flex' : 'flex'} bg-[#fcecee] rounded-2xl p-2.5 sm:p-3 border border-[#f5ccd5] shadow-2xs flex-col justify-between hover:shadow-xs transition">
                
                <!-- Card Header with Cute Bride Artwork & Description -->
                <div class="flex items-center gap-2.5 mb-2">
                  
                  <!-- Bride Portrait Artwork (Cute rounded avatar with gold rim) -->
                  <div class="w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden shadow-xs border-2 border-rose-300 bg-white">
                    <img src="assets/images/connect-customer-bride.jpg" 
                         alt="Bridal Mehndi Customer" 
                         class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300">
                  </div>

                  <!-- Text Block -->
                  <div class="flex-1 text-center sm:text-left">
                    <div class="text-rose-400 text-xs leading-none">♡</div>
                    <div class="font-serif text-gray-700 text-[10px] font-semibold leading-tight">For</div>
                    <div class="font-serif font-extrabold text-base sm:text-lg text-[#c2185b] tracking-tight leading-none">
                      Customers
                    </div>
                    <div class="text-[#c2185b] text-[10px] leading-none my-0.5">♥</div>
                    <p class="text-[10px] text-gray-600 leading-tight font-medium">
                      Book Mehndi &amp; Makeup, queries or get support.
                    </p>
                  </div>

                </div>

                <!-- 3 Cute Action Tiles with Real Icons (Call Us, Mail Us, Chat on WhatsApp) -->
                <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-rose-200/60">
                  
                  <!-- Tile 1: Real Call Us -->
                  <button type="button" 
                          onclick="window.partyBalaTriggerCall('customer')"
                          title="Call Bridal Concierge (${CUSTOMER_PHONE})"
                          class="bg-white rounded-xl p-1.5 text-center shadow-2xs hover:shadow-xs hover:bg-rose-50/70 transition border border-rose-100 flex flex-col items-center justify-between group cursor-pointer">
                    <!-- Real Phone Calling Vector SVG -->
                    <span class="w-8 h-8 rounded-full bg-[#0b3b24] text-white flex items-center justify-center mb-1 group-hover:scale-108 transition-transform shadow-2xs">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4.07c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c-.01-.55-.46-1-1.06-1z"/>
                      </svg>
                    </span>
                    <span class="text-[10px] font-bold text-gray-800 leading-tight">Call Us</span>
                  </button>

                  <!-- Tile 2: Real Mail Us (100% Reliable Action) -->
                  <button type="button"
                          onclick="window.partyBalaTriggerEmail('customer', event)"
                          title="Email Our Concierge (${OFFICIAL_EMAIL})"
                          class="bg-white rounded-xl p-1.5 text-center shadow-2xs hover:shadow-xs hover:bg-rose-50/70 transition border border-rose-100 flex flex-col items-center justify-between group cursor-pointer">
                    <!-- Real Sealed Mail Envelope Vector SVG -->
                    <span class="w-8 h-8 rounded-full bg-[#c2185b] text-white flex items-center justify-center mb-1 group-hover:scale-108 transition-transform shadow-2xs">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </span>
                    <span class="text-[10px] font-bold text-gray-800 leading-tight">Mail Us</span>
                  </button>

                  <!-- Tile 3: Real Official WhatsApp -->
                  <a href="https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20want%20to%20inquire%20about%20a%20bridal%20service" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     title="Chat with Customer Concierge on WhatsApp (${CUSTOMER_PHONE})"
                     class="bg-white rounded-xl p-1.5 text-center shadow-2xs hover:shadow-xs hover:bg-emerald-50/70 transition border border-rose-100 flex flex-col items-center justify-between group">
                    <!-- Real Official WhatsApp Emblem SVG -->
                    <span class="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1 group-hover:scale-108 transition-transform shadow-2xs">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.112.551 4.175 1.597 5.992L.057 24l6.19-1.624a11.96 11.96 0 005.784 1.488h.005c6.634 0 12.001-5.367 12.001-11.987A11.93 11.93 0 0012.031 0zm0 21.875h-.004a9.93 9.93 0 01-5.068-1.39l-.364-.216-3.766.988 1.006-3.673-.237-.377a9.92 9.92 0 01-1.52-5.22c0-5.485 4.464-9.948 9.953-9.948 2.656 0 5.152 1.035 7.029 2.912a9.88 9.88 0 012.909 7.03c-.001 5.486-4.466 9.949-9.954 9.949zm5.454-7.447c-.299-.15-1.77-.874-2.045-.973-.274-.1-.474-.15-.674.15-.2.299-.774.973-.948 1.173-.175.199-.349.224-.648.075-.3-.15-1.265-.466-2.41-1.487-.891-.795-1.493-1.777-1.667-2.076-.175-.3-.018-.462.131-.611.135-.135.3-.349.449-.523.15-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.673-1.623-.923-2.222-.243-.583-.49-.504-.673-.513-.174-.009-.374-.01-.573-.01-.199 0-.524.075-.798.374-.274.299-1.048 1.023-1.048 2.495 0 1.472 1.073 2.894 1.222 3.094.15.199 2.112 3.226 5.116 4.524.714.309 1.272.494 1.707.632.718.228 1.371.196 1.888.119.576-.086 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.2-.574-.35z"/>
                      </svg>
                    </span>
                    <span class="text-[9.5px] font-bold text-gray-800 leading-tight text-center">WhatsApp</span>
                  </a>

                </div>

              </div>

              <!-- ============================================================= -->
              <!-- RIGHT CARD: FOR PARTNERS (SOFT MINT/SAGE GREEN PALETTE)       -->
              <!-- ============================================================= -->
              <div id="partybala-card-partner" 
                   class="${isPartnerDefault ? 'flex' : 'hidden sm:flex'} bg-[#edf5ed] rounded-2xl p-2.5 sm:p-3 border border-[#d2e6d2] shadow-2xs flex-col justify-between hover:shadow-xs transition">
                
                <!-- Card Header with Description & Artist Artwork -->
                <div class="flex items-center gap-2.5 mb-2">
                  
                  <!-- Text Block -->
                  <div class="flex-1 text-center sm:text-left">
                    <div class="flex items-center justify-center sm:justify-start gap-1 text-emerald-600 text-xs leading-none">
                      <span>🌿</span>
                      <span>♡</span>
                    </div>
                    <div class="font-serif text-gray-700 text-[10px] font-semibold leading-tight">For</div>
                    <div class="font-serif font-extrabold text-base sm:text-lg text-[#1b5e20] tracking-tight leading-none">
                      Partners
                    </div>
                    <div class="text-[#1b5e20] text-[10px] leading-none my-0.5">♥</div>
                    <p class="text-[10px] text-gray-600 leading-tight font-medium">
                      Join as Mehndi/Makeup Artist, get bookings.
                    </p>
                  </div>

                  <!-- Artist Portrait Artwork (Cute rounded avatar with gold rim) -->
                  <div class="w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden shadow-xs border-2 border-emerald-300 bg-white">
                    <img src="assets/images/connect-partner-artist.jpg" 
                         alt="Artist Partner Network" 
                         class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300">
                  </div>

                </div>

                <!-- 3 Cute Action Tiles with Real Icons (Call Us, Mail Us, Chat on WhatsApp) -->
                <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-emerald-200/60">
                  
                  <!-- Tile 1: Real Call Us -->
                  <button type="button" 
                          onclick="window.partyBalaTriggerCall('partner')"
                          title="Call Artist Partner Desk (${PARTNER_PHONE})"
                          class="bg-white rounded-xl p-1.5 text-center shadow-2xs hover:shadow-xs hover:bg-emerald-50/70 transition border border-emerald-100 flex flex-col items-center justify-between group cursor-pointer">
                    <!-- Real Phone Calling Vector SVG -->
                    <span class="w-8 h-8 rounded-full bg-[#0b3b24] text-white flex items-center justify-center mb-1 group-hover:scale-108 transition-transform shadow-2xs">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 3.9c0-.55-.45-1-1-1H4.07c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.52c-.01-.55-.46-1-1.06-1z"/>
                      </svg>
                    </span>
                    <span class="text-[10px] font-bold text-gray-800 leading-tight">Call Us</span>
                  </button>

                  <!-- Tile 2: Real Mail Us (100% Reliable Action) -->
                  <button type="button"
                          onclick="window.partyBalaTriggerEmail('partner', event)"
                          title="Email Partner Desk (${OFFICIAL_EMAIL})"
                          class="bg-white rounded-xl p-1.5 text-center shadow-2xs hover:shadow-xs hover:bg-emerald-50/70 transition border border-emerald-100 flex flex-col items-center justify-between group cursor-pointer">
                    <!-- Real Sealed Mail Envelope Vector SVG -->
                    <span class="w-8 h-8 rounded-full bg-[#c2185b] text-white flex items-center justify-center mb-1 group-hover:scale-108 transition-transform shadow-2xs">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </span>
                    <span class="text-[10px] font-bold text-gray-800 leading-tight">Mail Us</span>
                  </button>

                  <!-- Tile 3: Real Official WhatsApp -->
                  <a href="https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20want%20to%20partner%20with%20you" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     title="Chat with Artist Partner Desk on WhatsApp (${PARTNER_PHONE})"
                     class="bg-white rounded-xl p-1.5 text-center shadow-2xs hover:shadow-xs hover:bg-emerald-50/70 transition border border-emerald-100 flex flex-col items-center justify-between group">
                    <!-- Real Official WhatsApp Emblem SVG -->
                    <span class="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1 group-hover:scale-108 transition-transform shadow-2xs">
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.112.551 4.175 1.597 5.992L.057 24l6.19-1.624a11.96 11.96 0 005.784 1.488h.005c6.634 0 12.001-5.367 12.001-11.987A11.93 11.93 0 0012.031 0zm0 21.875h-.004a9.93 9.93 0 01-5.068-1.39l-.364-.216-3.766.988 1.006-3.673-.237-.377a9.92 9.92 0 01-1.52-5.22c0-5.485 4.464-9.948 9.953-9.948 2.656 0 5.152 1.035 7.029 2.912a9.88 9.88 0 012.909 7.03c-.001 5.486-4.466 9.949-9.954 9.949zm5.454-7.447c-.299-.15-1.77-.874-2.045-.973-.274-.1-.474-.15-.674.15-.2.299-.774.973-.948 1.173-.175.199-.349.224-.648.075-.3-.15-1.265-.466-2.41-1.487-.891-.795-1.493-1.777-1.667-2.076-.175-.3-.018-.462.131-.611.135-.135.3-.349.449-.523.15-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.673-1.623-.923-2.222-.243-.583-.49-.504-.673-.513-.174-.009-.374-.01-.573-.01-.199 0-.524.075-.798.374-.274.299-1.048 1.023-1.048 2.495 0 1.472 1.073 2.894 1.222 3.094.15.199 2.112 3.226 5.116 4.524.714.309 1.272.494 1.707.632.718.228 1.371.196 1.888.119.576-.086 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.2-.574-.35z"/>
                      </svg>
                    </span>
                    <span class="text-[9.5px] font-bold text-gray-800 leading-tight text-center">WhatsApp</span>
                  </a>

                </div>

              </div>

            </div>

            <!-- ============================================================= -->
            <!-- 3. BOTTOM QUICK NAVIGATION ROW (3 CUTE CIRCULAR PILL BUTTONS)  -->
            <!-- ============================================================= -->
            <div class="pt-1.5 pb-0.5 border-t border-[#eddcd2]">
              <div class="grid grid-cols-3 divide-x divide-[#eddcd2] text-center">
                
                <!-- Pill 1: Mehndi Services -->
                <a href="book-mehndi.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="flex flex-col items-center justify-center p-1 group hover:bg-white/80 rounded-xl transition cursor-pointer">
                  <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#d91b5c]/30 ring-2 ring-white shadow-2xs mb-1 group-hover:scale-108 transition-transform bg-[#fdebee] flex-shrink-0">
                    <img src="assets/images/section-mehndi-circle.png" alt="Mehndi Services" class="w-full h-full object-cover">
                  </div>
                  <span class="font-serif font-bold text-gray-800 group-hover:text-[#044e3a] text-[10px] sm:text-[11px] tracking-tight transition">
                    Mehndi Services
                  </span>
                </a>

                <!-- Pill 2: Makeup Services -->
                <a href="book-makeup.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="flex flex-col items-center justify-center p-1 group hover:bg-white/80 rounded-xl transition cursor-pointer">
                  <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#1b5e20]/30 ring-2 ring-white shadow-2xs mb-1 group-hover:scale-108 transition-transform bg-[#edf5ed] flex-shrink-0">
                    <img src="assets/images/section-makeup-circle.png" alt="Makeup Services" class="w-full h-full object-cover">
                  </div>
                  <span class="font-serif font-bold text-gray-800 group-hover:text-[#d91b5c] text-[10px] sm:text-[11px] tracking-tight transition">
                    Makeup Services
                  </span>
                </a>

                <!-- Pill 3: Partner With Us -->
                <a href="partner.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="flex flex-col items-center justify-center p-1 group hover:bg-white/80 rounded-xl transition cursor-pointer">
                  <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#c2185b]/30 ring-2 ring-white shadow-2xs mb-1 group-hover:scale-108 transition-transform bg-[#fdebee] flex-shrink-0">
                    <img src="assets/images/section-partner-circle.png" alt="Partner With Us" class="w-full h-full object-cover">
                  </div>
                  <span class="font-serif font-bold text-gray-800 group-hover:text-amber-800 text-[10px] sm:text-[11px] tracking-tight transition">
                    Partner With Us
                  </span>
                </a>

              </div>
            </div>

            <!-- Bottom Brand Channel Micro Strip (Real Instagram & Website) -->
            <div class="pt-1 flex items-center justify-center gap-2.5 text-[9.5px] sm:text-[10px] text-gray-500 font-semibold">
              <a href="https://www.partybala.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 hover:text-[#d91b5c] transition">
                <svg class="w-3 h-3 text-amber-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>www.partybala.com</span>
              </a>
              <span class="text-gray-300">&bull;</span>
              <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[#d91b5c] hover:underline transition">
                <!-- Real Instagram Official Vector Glyph -->
                <svg class="w-3 h-3 fill-current text-[#d91b5c]" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@party_bala</span>
              </a>
              <span class="text-gray-300">&bull;</span>
              <a href="mailto:${OFFICIAL_EMAIL}" onclick="window.partyBalaTriggerEmail('customer', event)" class="flex items-center gap-1 hover:text-[#d91b5c] transition">
                <svg class="w-3 h-3 fill-current text-purple-700" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span>${OFFICIAL_EMAIL}</span>
              </a>
            </div>

            <!-- Bottom Center Decorative Pink Ribbon with Heart -->
            <div class="flex items-center justify-center gap-2 pt-0.5 pb-0.5">
              <span class="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-rose-300 to-rose-400"></span>
              <span class="text-rose-400 text-[9px]">♥</span>
              <span class="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent via-rose-300 to-rose-400"></span>
            </div>

          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the Connect Us Modal safely
   */
  function closePartyBalaConnectModal() {
    const modal = document.getElementById('partybala-connect-modal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
    const legacyModal = document.getElementById('partybala-call-modal');
    if (legacyModal) {
      legacyModal.remove();
      document.body.style.overflow = '';
    }
  }

  // Ensure NO floating calling button is ever present
  function ensureNoFloatingButton() {
    const btn = document.getElementById('partybala-floating-call-btn');
    if (btn) btn.remove();
  }

  // Backdrop click listener
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('partybala-connect-modal') || document.getElementById('partybala-call-modal');
    if (modal && e.target === modal) {
      closePartyBalaConnectModal();
    }
  });

  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePartyBalaConnectModal();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureNoFloatingButton);
  } else {
    ensureNoFloatingButton();
  }

  // Expose global methods
  window.openPartyBalaConnectModal = openPartyBalaConnectModal;
  window.closePartyBalaConnectModal = closePartyBalaConnectModal;
  window.partyBalaTriggerCall      = partyBalaTriggerCall;
  window.partyBalaTriggerEmail     = partyBalaTriggerEmail;
  window.partyBalaSetMobileTab     = partyBalaSetMobileTab;
  window.clearPartyBalaBanner      = clearModalBanner;
  // Aliases for backwards compatibility with any other calls
  window.openPartyBalaCallModal    = openPartyBalaConnectModal;
  window.closePartyBalaCallModal   = closePartyBalaConnectModal;
  window.getISTStatus              = getISTStatus;
})();
