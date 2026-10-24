/**
 * =========================================================================
 * PARTYBALA - LUXURY "CONNECT US" CONCIERGE MODAL
 * =========================================================================
 * - 100% Visual Replica of PartyBala "Connect Us" Master Brand Art
 * - Royal Forest Green Header with Gold Botanical Accents & Scalloped Trim
 * - Dual Department Cards: "For Customers" (Pink) & "For Partners" (Sage)
 * - 3 Action Channels per side: Call Us (10 AM–6 PM IST), Mail Us, Chat on WhatsApp (24/7)
 * - Bottom Navigation Row: Mehndi Services, Makeup Services, Partner With Us
 * - Full Indian Standard Time (IST) Calling Hours Intelligence
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
   * Trigger Call with 10:00 AM - 6:00 PM IST checking
   * @param {string} role - 'customer' | 'partner'
   */
  function partyBalaTriggerCall(role) {
    const ist = getISTStatus();
    const tel = (role === 'partner') ? PARTNER_TEL : CUSTOMER_TEL;
    const phone = (role === 'partner') ? PARTNER_PHONE : CUSTOMER_PHONE;
    const roleName = (role === 'partner') ? 'Artist Partner Desk' : 'Customer Bridal Concierge';
    const waUrl = (role === 'partner') 
      ? 'https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20am%20calling%20outside%20hours%20and%20want%20to%20chat'
      : 'https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20am%20calling%20outside%20hours%20and%20want%20to%20chat';

    if (ist.isCallingOnline) {
      // Direct call during 10:00 AM - 6:00 PM IST
      window.location.href = tel;
    } else {
      // Outside calling hours: show luxury alert banner inside modal
      const noticeContainer = document.getElementById('partybala-offline-banner');
      if (noticeContainer) {
        noticeContainer.innerHTML = `
          <div class="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-300 text-left shadow-lg animate-fade-in relative mb-3">
            <button onclick="document.getElementById('partybala-offline-banner').innerHTML=''" 
                    type="button"
                    class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer">
              &#x2715;
            </button>
            <div class="flex items-start gap-2.5">
              <span class="text-xl shrink-0 mt-0.5">🌙</span>
              <div class="space-y-1.5 flex-1 pr-4">
                <div class="font-serif font-extrabold text-sm sm:text-base text-gray-900">
                  Our Calling Desk is Currently Offline
                </div>
                <p class="text-xs text-gray-700 leading-relaxed font-medium">
                  Direct phone calls are active daily from <strong class="text-gray-900">10:00 AM to 6:00 PM IST</strong>. 
                  Current time: <span class="font-bold text-[#d91b5c]">${ist.timeString}</span>.
                </p>
                <p class="text-xs text-emerald-800 font-bold flex items-center gap-1">
                  <span>&#10003;</span>
                  <span>Good news! Our WhatsApp &amp; Email concierges are OPEN 24/7.</span>
                </p>
                <!-- Quick 1-tap Actions -->
                <div class="flex flex-wrap items-center gap-2 pt-1">
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
                     class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-3.5 h-3.5 brightness-0 invert">
                    <span>Chat on WhatsApp (24/7)</span>
                  </a>
                  <a href="mailto:${OFFICIAL_EMAIL}?subject=Inquiry%20from%20PartyBala" 
                     class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#d91b5c] border border-rose-200 font-bold text-xs transition">
                    <span>✉️ Mail Us</span>
                  </a>
                  <a href="${tel}" 
                     class="inline-flex items-center gap-1 px-2.5 py-1.5 text-gray-500 hover:text-gray-800 text-[11px] font-semibold underline transition">
                    <span>Emergency Call (${phone})</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
        noticeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // Fallback alert
        alert(`Our calling desk operates between 10:00 AM and 6:00 PM IST. You can message us on WhatsApp (24/7) or email info@partybala.com anytime!`);
        window.location.href = tel;
      }
    }
  }

  /**
   * Open the PartyBala Master "Connect Us" Concierge Modal
   * Matching 100% of the User's Reference Artwork
   * @param {string} [focusRole] - 'customer' | 'partner' | 'all'
   */
  function openPartyBalaConnectModal(focusRole = 'all') {
    closePartyBalaConnectModal();

    const ist = getISTStatus();

    const modalHtml = `
      <div id="partybala-connect-modal" 
           class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
           style="overscroll-behavior: contain;">
        
        <!-- Main Card Container: 100% replica of the luxury card -->
        <div class="bg-[#FAF7F2] rounded-[28px] sm:rounded-[36px] max-w-4xl w-full shadow-2xl border-2 border-[#d4af37]/50 relative overflow-hidden max-h-[94vh] flex flex-col animate-scale-up">
          
          <!-- ================================================================= -->
          <!-- 1. ROYAL FOREST GREEN LUXURY HEADER WITH GOLD BOTANICAL VINES     -->
          <!-- ================================================================= -->
          <div class="relative bg-gradient-to-b from-[#062916] via-[#09351e] to-[#0b3d23] text-center pt-5 pb-6 sm:pt-7 sm:pb-8 px-4 sm:px-8 shrink-0 overflow-hidden">
            
            <!-- Gold Botanical Leaves: Left Decorative Sprig -->
            <div class="absolute -left-2 -top-2 w-28 sm:w-40 h-28 sm:h-40 pointer-events-none opacity-40 sm:opacity-55">
              <svg viewBox="0 0 160 160" fill="none" stroke="#e6ca65" stroke-width="1.8" class="w-full h-full">
                <path d="M10,150 Q40,90 120,40 M40,90 Q30,60 10,70 M45,85 Q70,75 80,50 M80,65 Q85,40 65,30 M85,60 Q110,50 120,20 M120,40 Q135,30 140,10"/>
                <circle cx="10" cy="70" r="3" fill="#e6ca65"/>
                <circle cx="80" cy="50" r="3" fill="#e6ca65"/>
                <circle cx="65" cy="30" r="3" fill="#e6ca65"/>
                <circle cx="120" cy="20" r="3" fill="#e6ca65"/>
              </svg>
            </div>

            <!-- Gold Botanical Leaves: Right Decorative Sprig -->
            <div class="absolute -right-2 -top-2 w-28 sm:w-40 h-28 sm:h-40 pointer-events-none opacity-40 sm:opacity-55 transform scale-x-[-1]">
              <svg viewBox="0 0 160 160" fill="none" stroke="#e6ca65" stroke-width="1.8" class="w-full h-full">
                <path d="M10,150 Q40,90 120,40 M40,90 Q30,60 10,70 M45,85 Q70,75 80,50 M80,65 Q85,40 65,30 M85,60 Q110,50 120,20 M120,40 Q135,30 140,10"/>
                <circle cx="10" cy="70" r="3" fill="#e6ca65"/>
                <circle cx="80" cy="50" r="3" fill="#e6ca65"/>
                <circle cx="65" cy="30" r="3" fill="#e6ca65"/>
                <circle cx="120" cy="20" r="3" fill="#e6ca65"/>
              </svg>
            </div>

            <!-- Top Close 'X' Button (Soft Blush Circle with dark X) -->
            <button onclick="window.closePartyBalaConnectModal()" 
                    type="button" 
                    aria-label="Close connect dialog" 
                    class="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#fcecee] hover:bg-rose-200 text-gray-800 hover:text-black border border-rose-300 flex items-center justify-center text-sm sm:text-base font-extrabold transition shadow-md hover:scale-105 cursor-pointer z-20">
              &#x2715;
            </button>

            <!-- Title: Connect Us in Luxury Serif Calligraphy -->
            <h2 class="font-serif italic font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#faebd7] tracking-normal drop-shadow-md relative z-10 leading-none">
              Connect Us
            </h2>

            <!-- Center Cute Heart with Golden Whisker Lines -->
            <div class="flex items-center justify-center gap-2 sm:gap-3 my-1.5 sm:my-2 relative z-10">
              <span class="w-10 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]"></span>
              <span class="text-pink-300 text-xs sm:text-sm leading-none animate-pulse">♥</span>
              <span class="w-10 sm:w-20 h-[1px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]"></span>
            </div>

            <!-- Subtitle -->
            <p class="font-serif italic text-xs sm:text-sm md:text-base text-[#eddcd2] tracking-wide max-w-md mx-auto relative z-10 font-normal">
              We are here for all your Mehndi &amp; Makeup needs
            </p>

            <!-- Bottom Scalloped Golden Arch Edge Divider -->
            <div class="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
              <svg viewBox="0 0 1200 40" preserveAspectRatio="none" class="w-full h-3 sm:h-5 fill-[#FAF7F2]">
                <path d="M0,0 C300,35 600,40 900,10 C1050,0 1150,15 1200,25 L1200,40 L0,40 Z"></path>
              </svg>
            </div>
          </div>

          <!-- ================================================================= -->
          <!-- 2. SCROLLABLE BODY CONTENT (TWO SIDE-BY-SIDE CARDS ON DESKTOP)    -->
          <!-- ================================================================= -->
          <div class="p-3.5 sm:p-6 md:p-7 overflow-y-auto flex-1 space-y-4">
            
            <!-- Dynamic Calling Desk Status Pill -->
            <div class="flex items-center justify-center">
              ${ist.isCallingOnline ? `
                <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-xs">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>PHONE CALLS: 10 AM &ndash; 6 PM LIVE NOW &bull; WHATSAPP &amp; EMAIL: 24/7 OPEN</span>
                </div>
              ` : `
                <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold shadow-xs">
                  <span>🌙</span>
                  <span>PHONE DESK OFFLINE (10 AM &ndash; 6 PM IST) &bull; WHATSAPP &amp; EMAIL 24/7 LIVE</span>
                </div>
              `}
            </div>

            <!-- Placeholder for dynamic offline warning when a user tries calling outside hours -->
            <div id="partybala-offline-banner"></div>

            <!-- GRID: TWO DEPARTMENT CARDS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
              
              <!-- ============================================================= -->
              <!-- LEFT CARD: FOR CUSTOMERS (SOFT BLUSH PINK PALETTE)            -->
              <!-- ============================================================= -->
              <div class="bg-[#fcecee] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-[#f5ccd5] shadow-sm flex flex-col justify-between hover:shadow-md transition">
                
                <!-- Card Header with Bride Artwork & Description -->
                <div class="flex items-center gap-3 sm:gap-4 mb-4">
                  
                  <!-- Bride Portrait Artwork -->
                  <div class="w-24 sm:w-28 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-rose-200 bg-white">
                    <img src="assets/images/connect-customer-bride.jpg" 
                         alt="Bridal Mehndi Customer" 
                         class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500">
                  </div>

                  <!-- Text Block -->
                  <div class="flex-1 text-center sm:text-left">
                    <div class="text-rose-400 text-sm mb-0.5">♡</div>
                    <div class="font-serif text-gray-700 text-xs sm:text-sm font-semibold tracking-wide">For</div>
                    <div class="font-serif font-extrabold text-2xl sm:text-3xl text-[#c2185b] tracking-tight leading-none my-0.5">
                      Customers
                    </div>
                    <div class="text-[#c2185b] text-xs mb-1.5">♥</div>
                    <p class="text-[11px] sm:text-xs text-gray-600 leading-snug font-medium">
                      Book your Mehndi &amp; Makeup services, ask queries or get support.
                    </p>
                  </div>

                </div>

                <!-- 3 Action Tiles in Horizontal Row (Call Us, Mail Us, Chat on WhatsApp) -->
                <div class="grid grid-cols-3 gap-2 pt-3 border-t border-rose-200/60">
                  
                  <!-- Tile 1: Call Us -->
                  <button type="button" 
                          onclick="window.partyBalaTriggerCall('customer')"
                          title="Call Bridal Concierge (${CUSTOMER_PHONE})"
                          class="bg-white rounded-2xl p-2.5 sm:p-3 text-center shadow-xs hover:shadow-md hover:bg-rose-50/60 transition border border-rose-100 flex flex-col items-center justify-between group cursor-pointer">
                    <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0b3b24] text-white flex items-center justify-center mb-1.5 group-hover:scale-108 transition-transform shadow-sm">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </span>
                    <span class="text-[11px] sm:text-xs font-bold text-gray-800 tracking-tight">Call Us</span>
                    <span class="text-[9px] text-gray-400 mt-0.5">${ist.isCallingOnline ? '10 AM - 6 PM' : 'Reopens 10 AM'}</span>
                  </button>

                  <!-- Tile 2: Mail Us -->
                  <a href="mailto:${OFFICIAL_EMAIL}?subject=Customer%20Bridal%20Inquiry%20-%20PartyBala&body=Hello%20PartyBala%20Concierge%2C%0A%0AI%20am%20interested%20in%20booking%20bridal%20mehndi%20%2F%20makeup%20services.%0A%0AName%3A%0APhone%3A%0AEvent%20Date%3A%0ACity%3A%0A%0AThank%20you!"
                     title="Email Our Concierge (info@partybala.com)"
                     class="bg-white rounded-2xl p-2.5 sm:p-3 text-center shadow-xs hover:shadow-md hover:bg-rose-50/60 transition border border-rose-100 flex flex-col items-center justify-between group">
                    <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#c2185b] text-white flex items-center justify-center mb-1.5 group-hover:scale-108 transition-transform shadow-sm">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </span>
                    <span class="text-[11px] sm:text-xs font-bold text-gray-800 tracking-tight">Mail Us</span>
                    <span class="text-[9px] text-purple-700 font-bold mt-0.5">24/7 Monitored</span>
                  </a>

                  <!-- Tile 3: Chat on WhatsApp -->
                  <a href="https://wa.me/918933023302?text=Hello%20PartyBala%20Concierge%2C%20I%20want%20to%20inquire%20about%20a%20bridal%20service" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     title="Chat with Customer Concierge on WhatsApp (${CUSTOMER_PHONE})"
                     class="bg-white rounded-2xl p-2.5 sm:p-3 text-center shadow-xs hover:shadow-md hover:bg-emerald-50/60 transition border border-rose-100 flex flex-col items-center justify-between group">
                    <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 group-hover:scale-108 transition-transform shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-5 h-5 sm:w-6 sm:h-6 brightness-0 invert">
                    </span>
                    <span class="text-[11px] sm:text-xs font-bold text-gray-800 tracking-tight leading-tight">Chat on WhatsApp</span>
                    <span class="text-[9px] text-emerald-700 font-bold mt-0.5">24/7 Live</span>
                  </a>

                </div>

              </div>

              <!-- ============================================================= -->
              <!-- RIGHT CARD: FOR PARTNERS (SOFT MINT/SAGE GREEN PALETTE)       -->
              <!-- ============================================================= -->
              <div class="bg-[#edf5ed] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-[#d2e6d2] shadow-sm flex flex-col justify-between hover:shadow-md transition">
                
                <!-- Card Header with Description & Artist Artwork -->
                <div class="flex items-center gap-3 sm:gap-4 mb-4">
                  
                  <!-- Text Block -->
                  <div class="flex-1 text-center sm:text-left">
                    <div class="flex items-center justify-center sm:justify-start gap-1 text-emerald-600 text-sm mb-0.5">
                      <span>🌿</span>
                      <span>♡</span>
                    </div>
                    <div class="font-serif text-gray-700 text-xs sm:text-sm font-semibold tracking-wide">For</div>
                    <div class="font-serif font-extrabold text-2xl sm:text-3xl text-[#1b5e20] tracking-tight leading-none my-0.5">
                      Partners
                    </div>
                    <div class="text-[#1b5e20] text-xs mb-1.5">♥</div>
                    <p class="text-[11px] sm:text-xs text-gray-600 leading-snug font-medium">
                      Join us as a Mehndi Artist or Makeup Artist, collaborate or get partnership support.
                    </p>
                  </div>

                  <!-- Artist & Client Portrait Artwork -->
                  <div class="w-24 sm:w-28 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-emerald-200 bg-white">
                    <img src="assets/images/connect-partner-artist.jpg" 
                         alt="Artist Partner Network" 
                         class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500">
                  </div>

                </div>

                <!-- 3 Action Tiles in Horizontal Row (Call Us, Mail Us, Chat on WhatsApp) -->
                <div class="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-200/60">
                  
                  <!-- Tile 1: Call Us -->
                  <button type="button" 
                          onclick="window.partyBalaTriggerCall('partner')"
                          title="Call Artist Partner Desk (${PARTNER_PHONE})"
                          class="bg-white rounded-2xl p-2.5 sm:p-3 text-center shadow-xs hover:shadow-md hover:bg-emerald-50/60 transition border border-emerald-100 flex flex-col items-center justify-between group cursor-pointer">
                    <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0b3b24] text-white flex items-center justify-center mb-1.5 group-hover:scale-108 transition-transform shadow-sm">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </span>
                    <span class="text-[11px] sm:text-xs font-bold text-gray-800 tracking-tight">Call Us</span>
                    <span class="text-[9px] text-gray-400 mt-0.5">${ist.isCallingOnline ? '10 AM - 6 PM' : 'Reopens 10 AM'}</span>
                  </button>

                  <!-- Tile 2: Mail Us -->
                  <a href="mailto:${OFFICIAL_EMAIL}?subject=Artist%20Partner%20Application%20-%20PartyBala&body=Hello%20PartyBala%20Artist%20Desk%2C%0A%0AI%20am%20interested%20in%20joining%20PartyBala%20as%20an%20artist%20partner.%0A%0AArtist%20Name%3A%0ACategory%20(Mehndi%2FMakeup)%3A%0APhone%3A%0ACity%3A%0AInstagram%2FPortfolio%3A%0A%0AThank%20you!"
                     title="Email Partner Desk (info@partybala.com)"
                     class="bg-white rounded-2xl p-2.5 sm:p-3 text-center shadow-xs hover:shadow-md hover:bg-emerald-50/60 transition border border-emerald-100 flex flex-col items-center justify-between group">
                    <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#c2185b] text-white flex items-center justify-center mb-1.5 group-hover:scale-108 transition-transform shadow-sm">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </span>
                    <span class="text-[11px] sm:text-xs font-bold text-gray-800 tracking-tight">Mail Us</span>
                    <span class="text-[9px] text-purple-700 font-bold mt-0.5">24/7 Monitored</span>
                  </a>

                  <!-- Tile 3: Chat on WhatsApp -->
                  <a href="https://wa.me/918933073307?text=Hello%20PartyBala%20Artist%20Desk%2C%20I%20want%20to%20partner%20with%20you" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     title="Chat with Artist Partner Desk on WhatsApp (${PARTNER_PHONE})"
                     class="bg-white rounded-2xl p-2.5 sm:p-3 text-center shadow-xs hover:shadow-md hover:bg-emerald-50/60 transition border border-emerald-100 flex flex-col items-center justify-between group">
                    <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 group-hover:scale-108 transition-transform shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-5 h-5 sm:w-6 sm:h-6 brightness-0 invert">
                    </span>
                    <span class="text-[11px] sm:text-xs font-bold text-gray-800 tracking-tight leading-tight">Chat on WhatsApp</span>
                    <span class="text-[9px] text-emerald-700 font-bold mt-0.5">24/7 Live</span>
                  </a>

                </div>

              </div>

            </div>

            <!-- ============================================================= -->
            <!-- 3. BOTTOM QUICK NAVIGATION ROW (3 CIRCULAR PILL BUTTONS)       -->
            <!-- ============================================================= -->
            <div class="pt-3 pb-1 border-t border-[#eddcd2]">
              <div class="grid grid-cols-3 divide-x divide-[#eddcd2] text-center">
                
                <!-- Pill 1: Mehndi Services -->
                <a href="book-mehndi.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="flex flex-col items-center justify-center p-2 group hover:bg-white rounded-2xl transition cursor-pointer">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#fdebee] text-[#d91b5c] border border-rose-200 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 stroke-[#d91b5c] fill-none" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                    </svg>
                  </div>
                  <span class="font-serif font-bold text-gray-800 group-hover:text-[#044e3a] text-xs sm:text-sm tracking-tight transition">
                    Mehndi Services
                  </span>
                </a>

                <!-- Pill 2: Makeup Services -->
                <a href="book-makeup.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="flex flex-col items-center justify-center p-2 group hover:bg-white rounded-2xl transition cursor-pointer">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#edf5ed] text-[#1b5e20] border border-emerald-200 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 stroke-[#1b5e20] fill-none" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"></path>
                      <path d="M15 13 9 7l4-4a3.5 3.5 0 0 1 5 0l3 3a3.5 3.5 0 0 1 0 5l-6 2z"></path>
                    </svg>
                  </div>
                  <span class="font-serif font-bold text-gray-800 group-hover:text-[#d91b5c] text-xs sm:text-sm tracking-tight transition">
                    Makeup Services
                  </span>
                </a>

                <!-- Pill 3: Partner With Us -->
                <a href="partner.html" 
                   onclick="window.closePartyBalaConnectModal()"
                   class="flex flex-col items-center justify-center p-2 group hover:bg-white rounded-2xl transition cursor-pointer">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#fdebee] text-[#c2185b] border border-rose-200 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 fill-[#c2185b]" viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <span class="font-serif font-bold text-gray-800 group-hover:text-amber-800 text-xs sm:text-sm tracking-tight transition">
                    Partner With Us
                  </span>
                </a>

              </div>
            </div>

            <!-- Bottom Center Decorative Pink Ribbon with Heart -->
            <div class="flex items-center justify-center gap-2 pt-1 pb-1">
              <span class="w-16 sm:w-28 h-[1.5px] bg-gradient-to-r from-transparent via-rose-300 to-rose-400"></span>
              <span class="text-rose-400 text-xs animate-bounce">♥</span>
              <span class="w-16 sm:w-28 h-[1.5px] bg-gradient-to-l from-transparent via-rose-300 to-rose-400"></span>
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
  // Aliases for backwards compatibility with any other calls
  window.openPartyBalaCallModal    = openPartyBalaConnectModal;
  window.closePartyBalaCallModal   = closePartyBalaConnectModal;
  window.getISTStatus              = getISTStatus;
})();
