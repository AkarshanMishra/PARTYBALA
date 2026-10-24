/**
 * =========================================================================
 * PARTYBALA - UNIFIED "CONNECT US" CONCIERGE (CALL, WHATSAPP & EMAIL)
 * =========================================================================
 * - Single unified "Connect Us" interface
 * - Calling Hours: 10:00 AM to 6:00 PM IST
 * - Outside 10 AM – 6 PM: Displays "Team is offline for calls, WhatsApp & Email 24/7 open"
 * - WhatsApp: Open 24/7 for both Customers & Partners
 * - Email: Open 24/7 at info@partybala.com
 * =========================================================================
 */

(function () {
  'use strict';

  const CUSTOMER_PHONE = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_CUSTOMER_DISPLAY) || "+91 89330 23302";
  const PARTNER_PHONE  = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_PARTNER_DISPLAY)  || "+91 89330 73307";
  const CUSTOMER_TEL   = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_CUSTOMER_TEL)      || "tel:+918933023302";
  const PARTNER_TEL    = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.PHONE_PARTNER_TEL)       || "tel:+918933073307";
  const OFFICIAL_EMAIL = (window.PARTYBALA_CONFIG && window.PARTYBALA_CONFIG.SUPPORT_EMAIL)           || "info@partybala.com";

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
   * Open the PartyBala Unified "Connect Us" Concierge Modal
   * Displays Calling (10 AM - 6 PM IST), WhatsApp (24/7), and Email (24/7)
   * @param {string} [focusRole] - 'customer' | 'partner' | 'all'
   */
  function openPartyBalaConnectModal(focusRole = 'all') {
    closePartyBalaConnectModal();

    const ist = getISTStatus();
    const isCustomerFocus = (focusRole === 'customer');
    const isPartnerFocus  = (focusRole === 'partner');

    let bodyContentHtml = '';

    if (ist.isCallingOnline) {
      /* ========================================================================= */
      /* STATE 1: CALLING HOURS ONLINE (10:00 AM – 6:00 PM IST)                   */
      /* ========================================================================= */
      bodyContentHtml = `
        <!-- Live Status Badge: Online Calling -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-3 shadow-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>CALLS: 10 AM – 6 PM &bull; WHATSAPP &amp; EMAIL: 24/7 LIVE</span>
        </div>

        <h3 class="font-serif font-extrabold text-xl sm:text-2xl text-gray-900 mb-1">
          Connect With PartyBala
        </h3>
        <p class="text-xs text-gray-600 mb-4 max-w-sm mx-auto">
          Choose your preferred method &mdash; Phone Call, WhatsApp, or Official Email.
        </p>

        <!-- Department Options Container -->
        <div class="space-y-3.5 text-left mb-4">
          
          <!-- OPTION 1: CUSTOMER BRIDAL CONCIERGE -->
          <div class="bg-white rounded-2xl p-4 border ${isCustomerFocus ? 'border-[#d91b5c] ring-2 ring-rose-200' : 'border-[#EADCC9]'} shadow-sm transition hover:shadow-md">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-[#d91b5c] border border-rose-200">
                👑 Customer Bridal Desk
              </span>
              <span class="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Calling Live Now
              </span>
            </div>

            <div class="font-bold text-gray-900 text-sm mb-0.5">
              Bridal Mehndi &amp; Makeup Bookings
            </div>
            <p class="text-[11px] text-gray-500 mb-3">
              For brides, family bookings, urgent dates, look recommendations &amp; packages.
            </p>

            <!-- Dual Actions: Call & WhatsApp -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="${CUSTOMER_TEL}" 
                 class="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#d91b5c] to-[#c2144d] hover:from-[#c2144d] hover:to-[#9f1239] text-white font-bold text-xs shadow-sm hover:shadow transition transform active:scale-98">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>Call: ${CUSTOMER_PHONE}</span>
              </a>
              <a href="https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20want%20to%20inquire%20about%20a%20bridal%20service" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-3.5 h-3.5">
                <span>WhatsApp (24/7)</span>
              </a>
            </div>
          </div>

          <!-- OPTION 2: ARTIST PARTNER DESK -->
          <div class="bg-white rounded-2xl p-4 border ${isPartnerFocus ? 'border-amber-600 ring-2 ring-amber-200' : 'border-[#EADCC9]'} shadow-sm transition hover:shadow-md">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                🤝 Artist Partner Desk
              </span>
              <span class="text-[10px] text-amber-800 font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Desk Live Now
              </span>
            </div>

            <div class="font-bold text-gray-900 text-sm mb-0.5">
              Artist Registrations &amp; Onboarding
            </div>
            <p class="text-[11px] text-gray-500 mb-3">
              For Mehndi &amp; Makeup artist guild registrations, rate cards &amp; payouts.
            </p>

            <!-- Dual Actions: Call & WhatsApp -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="${PARTNER_TEL}" 
                 class="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold text-xs shadow-sm hover:shadow transition transform active:scale-98">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>Call: ${PARTNER_PHONE}</span>
              </a>
              <a href="https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20want%20to%20partner%20with%20you" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-3.5 h-3.5">
                <span>WhatsApp (24/7)</span>
              </a>
            </div>
          </div>

          <!-- OPTION 3: OFFICIAL EMAIL CONCIERGE (24/7) -->
          <div class="bg-white rounded-2xl p-3.5 border border-[#EADCC9] shadow-sm transition hover:shadow-md">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
                ✉️ Official Email Desk
              </span>
              <span class="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                24/7 Monitored
              </span>
            </div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div class="font-bold text-gray-900 text-xs sm:text-sm">
                  ${OFFICIAL_EMAIL}
                </div>
                <p class="text-[11px] text-gray-500">
                  Custom bridal quotes, large wedding bookings &amp; artist inquiries.
                </p>
              </div>
              <a href="mailto:${OFFICIAL_EMAIL}?subject=PartyBala%20Inquiry" 
                 class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs transition shrink-0">
                <span>Write Email &rarr;</span>
              </a>
            </div>
          </div>

        </div>

        <!-- Schedule info footer -->
        <div class="pt-3 border-t border-[#EADCC9] text-center">
          <p class="text-[11px] text-gray-600 font-medium">
            📞 Direct Phone Calling Hours: <strong class="text-gray-900">10:00 AM – 6:00 PM IST</strong>
          </p>
          <p class="text-[10px] text-emerald-800 font-bold mt-0.5">
            💬 WhatsApp &bull; ✉️ Email: Both 24/7 Live
          </p>
        </div>
      `;
    } else {
      /* ========================================================================= */
      /* STATE 2: OUTSIDE CALLING HOURS (OFFLINE FOR CALLS, WHATSAPP & EMAIL 24/7) */
      /* ========================================================================= */
      bodyContentHtml = `
        <!-- Live Status Badge: Phone Desk Offline -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold mb-3 shadow-xs">
          <span>🌙</span>
          <span>PHONE DESK OFFLINE &bull; REOPENS 10:00 AM IST</span>
        </div>

        <h3 class="font-serif font-extrabold text-xl sm:text-2xl text-gray-900 mb-1.5">
          Our Calling Desk is Currently Offline
        </h3>
        
        <!-- Notice Box: Explaining 10 AM - 6 PM Calling vs 24/7 WhatsApp & Email -->
        <div class="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EADCC9] text-left mb-4 shadow-sm">
          <p class="text-xs text-gray-700 leading-relaxed font-medium">
            Our phone calling lines operate daily from <strong class="text-gray-900">10:00 AM to 6:00 PM IST</strong>.
          </p>
          <div class="mt-2 pt-2 border-t border-gray-100 flex items-start gap-2 text-xs text-emerald-900">
            <span class="text-emerald-600 font-bold text-sm leading-none mt-0.5">&#10003;</span>
            <p class="leading-relaxed">
              <strong class="text-emerald-700">Good news!</strong> Our <strong class="text-emerald-800">WhatsApp &amp; Email Concierge are OPEN 24/7</strong>. Chat with us on WhatsApp or send an email below, and our team will assist you immediately.
            </p>
          </div>
        </div>

        <!-- 24/7 WhatsApp & Email Options (Primary) -->
        <div class="space-y-3 text-left mb-4">
          
          <!-- 24/7 WHATSAPP FOR BRIDAL CUSTOMERS -->
          <a href="https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20am%20messaging%20to%20inquire%20about%20a%20bridal%20booking" 
             target="_blank" 
             rel="noopener noreferrer"
             class="group block p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md hover:shadow-lg transition transform active:scale-98">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-6 h-6 brightness-0 invert">
                </span>
                <div>
                  <div class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">24/7 Open Now &bull; Customers</div>
                  <div class="text-sm font-bold text-white">Chat Bridal Concierge on WhatsApp</div>
                  <div class="text-[11px] text-emerald-100">${CUSTOMER_PHONE}</div>
                </div>
              </div>
              <svg class="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </a>

          <!-- 24/7 WHATSAPP FOR ARTIST PARTNERS -->
          <a href="https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20am%20messaging%20to%20inquire%20about%20artist%20onboarding" 
             target="_blank" 
             rel="noopener noreferrer"
             class="group block p-3.5 rounded-2xl bg-white hover:bg-amber-50/80 text-gray-900 border border-amber-300 shadow-sm hover:shadow transition transform active:scale-98">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-5 h-5">
                </span>
                <div>
                  <div class="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">24/7 Open Now &bull; Artists</div>
                  <div class="text-sm font-bold text-gray-900">Chat Artist Partner Desk on WhatsApp</div>
                  <div class="text-[11px] text-gray-500">${PARTNER_PHONE}</div>
                </div>
              </div>
              <svg class="w-5 h-5 text-amber-700 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </a>

          <!-- DIRECT EMAIL CONCIERGE (24/7) -->
          <a href="mailto:${OFFICIAL_EMAIL}?subject=Urgent%20Inquiry%20-%20PartyBala" 
             class="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-purple-200 text-gray-800 hover:bg-purple-50/70 transition shadow-xs">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg shrink-0">✉️</span>
              <div>
                <div class="text-[10px] font-extrabold uppercase tracking-wider text-purple-800">24/7 Open &bull; Official Email</div>
                <div class="text-sm font-bold text-gray-900">Email Our Concierge Team</div>
                <div class="text-[11px] text-gray-500">${OFFICIAL_EMAIL}</div>
              </div>
            </div>
            <span class="text-xs text-purple-700 font-bold group-hover:underline">Send Email &rarr;</span>
          </a>

        </div>

        <!-- Emergency Overnight Call Notice -->
        <div class="pt-3 border-t border-[#EADCC9] text-center">
          <p class="text-[11px] text-gray-500">
            Have an ongoing wedding emergency tonight?
          </p>
          <div class="mt-1 flex items-center justify-center gap-3 text-xs">
            <a href="${CUSTOMER_TEL}" class="text-[#d91b5c] hover:underline font-bold">
              📞 Emergency Call (${CUSTOMER_PHONE})
            </a>
            <span class="text-gray-300">&bull;</span>
            <a href="${PARTNER_TEL}" class="text-amber-800 hover:underline font-bold">
              📞 Artist Line (${PARTNER_PHONE})
            </a>
          </div>
        </div>
      `;
    }

    const modalHtml = `
      <div id="partybala-connect-modal" 
           class="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in"
           style="overscroll-behavior: contain;">
        
        <div class="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[#EADCC9] text-center relative overflow-hidden max-h-[92vh] overflow-y-auto">
          
          <!-- Top Accent Hairline -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d91b5c] via-[#d4af37] to-[#059669]"></div>

          <!-- Close 'X' Button -->
          <button onclick="window.closePartyBalaConnectModal()" 
                  type="button" 
                  aria-label="Close connect modal" 
                  class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-gray-500 hover:text-[#d91b5c] border border-[#EADCC9] flex items-center justify-center text-sm font-bold transition shadow-xs cursor-pointer">
            &#x2715;
          </button>

          <!-- Modal Brand Header -->
          <div class="flex items-center justify-center gap-2 mb-2 pt-1">
            <img src="assets/images/partybala-logo.png" alt="PartyBala" class="w-8 h-8 object-contain">
            <span class="font-serif font-black text-xl text-gray-900 tracking-tight">Party<span class="text-[#d91b5c]">Bala</span></span>
          </div>

          ${bodyContentHtml}

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
  // Aliases for backwards compatibility with any other calls
  window.openPartyBalaCallModal    = openPartyBalaConnectModal;
  window.closePartyBalaCallModal   = closePartyBalaConnectModal;
  window.getISTStatus              = getISTStatus;
})();
