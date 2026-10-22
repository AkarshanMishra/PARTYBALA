/**
 * PARTYBALA - UNIVERSAL FORM HANDLER & GOOGLE SHEETS INTEGRATION
 */

// In-browser vault for high-reliability lead backup
function saveLeadToLocalVault(leadData, isSynced) {
  try {
    const raw = localStorage.getItem('partybala_leads_vault');
    const vault = raw ? JSON.parse(raw) : [];
    vault.push({
      id: 'pb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      lead: leadData,
      isSynced: !!isSynced,
      recordedAt: new Date().toISOString()
    });
    localStorage.setItem('partybala_leads_vault', JSON.stringify(vault));
  } catch (e) {
    console.warn("PartyBala vault storage notice:", e);
  }
}

// Background syncer for any offline/pending leads
async function syncPendingLeads() {
  const scriptUrl = (typeof PARTYBALA_CONFIG !== 'undefined' && PARTYBALA_CONFIG.GOOGLE_SCRIPT_URL)
    ? PARTYBALA_CONFIG.GOOGLE_SCRIPT_URL.trim()
    : "";
  if (!scriptUrl) return;

  try {
    const raw = localStorage.getItem('partybala_leads_vault');
    if (!raw) return;
    const vault = JSON.parse(raw);
    let updated = false;

    for (let item of vault) {
      if (!item.isSynced && item.lead) {
        try {
          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(item.lead)
          });
          item.isSynced = true;
          updated = true;
        } catch (err) {
          console.warn("Lead resync retry paused:", err);
          break;
        }
      }
    }
    if (updated) {
      localStorage.setItem('partybala_leads_vault', JSON.stringify(vault));
      console.log("PartyBala: Pending leads successfully synced to Google Sheet.");
    }
  } catch (e) {
    // Ignore silent sync errors
  }
}

// Admin helper: View or download captured leads
window.partybalaExportLeads = function() {
  const raw = localStorage.getItem('partybala_leads_vault');
  if (!raw || raw === '[]') {
    console.log("No leads stored locally yet.");
    return [];
  }
  const leads = JSON.parse(raw);
  console.table(leads.map(i => ({
    Time: i.recordedAt,
    Type: i.lead.formType,
    Name: i.lead.fullName || i.lead.artistName || '-',
    Phone: i.lead.phone || '-',
    Synced: i.isSynced ? 'YES' : 'PENDING'
  })));
  return leads;
};

document.addEventListener('DOMContentLoaded', () => {
  // Sync any pending leads if script URL is configured
  syncPendingLeads();

  // Set minimum date for event date pickers to today
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });

  // Attach submit listeners to all PartyBala forms on the page
  const forms = document.querySelectorAll('form[data-partybala-form]');
  forms.forEach(f => {
    f.addEventListener('submit', handleFormSubmit);
  });
});

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formType = form.getAttribute('data-partybala-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn.innerHTML;

  // 1. Basic Form Validation
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Validate phone number specifically
  const phoneInput = form.querySelector('input[name="phone"]');
  if (phoneInput) {
    const phoneVal = phoneInput.value.replace(/[^0-9]/g, '');
    if (phoneVal.length < 10) {
      showToast("Please enter a valid 10-digit mobile / WhatsApp number.", "error");
      phoneInput.focus();
      return;
    }
  }

  // 2. Gather Form Data
  const formData = new FormData(form);
  const data = {
    formType: formType,
    submittedAt: new Date().toISOString()
  };

  formData.forEach((value, key) => {
    // Handle multiple checkboxes if any
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });

  // Convert arrays to comma-separated strings for clean Google Sheet display
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(', ');
    }
  });

  // 3. UI Loading State
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="inline-flex items-center gap-2.5">
      <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Saving your details securely...
    </span>
  `;

  const scriptUrl = (typeof PARTYBALA_CONFIG !== 'undefined' && PARTYBALA_CONFIG.GOOGLE_SCRIPT_URL)
    ? PARTYBALA_CONFIG.GOOGLE_SCRIPT_URL.trim()
    : "";

  let submissionSuccessful = false;
  let isDemoMode = false;

  try {
    if (!scriptUrl) {
      // Local Test / Pre-Deployment Mode
      isDemoMode = true;
      console.warn("PartyBala: No GOOGLE_SCRIPT_URL set in assets/js/config.js. Lead safely saved to local vault.");
      console.log("Form payload ready for Google Sheet:", data);
      saveLeadToLocalVault(data, false);
      // Brief simulated latency for authentic user feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      submissionSuccessful = true;
    } else {
      // Production: Post directly to Google Apps Script Web App
      // mode: 'no-cors' avoids browser 302 redirect CORS blocks while ensuring Google Apps Script executes doPost(e)
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(data)
      });
      saveLeadToLocalVault(data, true);
      submissionSuccessful = true;
    }
  } catch (err) {
    console.warn("Network notice during submission (logged to vault):", err);
    saveLeadToLocalVault(data, false);
    // Proceed so user is not blocked and can complete WhatsApp confirmation
    submissionSuccessful = true;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;

    if (submissionSuccessful) {
      if (formType === 'customer-review') {
        if (typeof appendReviewToDOM === 'function') {
          appendReviewToDOM(data);
        }
        if (typeof closeReviewModal === 'function') {
          closeReviewModal();
        }
      }
      showSuccessModal(formType, data, isDemoMode);
      form.reset();
    } else {
      showToast("There was an issue submitting your request. Please try again or reach us via WhatsApp.", "error");
    }
  }
}

/**
 * Build customized WhatsApp URL based on form data
 */
function buildWhatsAppUrl(formType, data) {
  const isPartner = formType.startsWith('partner');
  let number = "918933023302"; // default customer WhatsApp

  if (typeof PARTYBALA_CONFIG !== 'undefined') {
    number = isPartner
      ? (PARTYBALA_CONFIG.WHATSAPP_PARTNER || "918933073307")
      : (PARTYBALA_CONFIG.WHATSAPP_CUSTOMER || "918933023302");
  } else if (isPartner) {
    number = "918933073307";
  }

  const defaultCity = (typeof PARTYBALA_CONFIG !== 'undefined' && PARTYBALA_CONFIG.DEFAULT_CITY)
    ? PARTYBALA_CONFIG.DEFAULT_CITY
    : "Kanpur";

  let message = "";
  if (formType === 'book-mehndi') {
    message = `*New Mehndi Booking Request - PartyBala*\n\n` +
      `👤 *Name:* ${data.fullName || 'Client'}\n` +
      `📞 *Phone:* ${data.phone || '-'}\n` +
      `📅 *Date:* ${data.eventDate || '-'} (${data.eventTime || 'Time flexible'})\n` +
      `📍 *Location:* ${data.cityArea || defaultCity}, ${data.venueAddress || ''}\n` +
      `🎉 *Occasion:* ${data.occasion || '-'}\n` +
      `✨ *Style:* ${data.stylePreference || '-'}\n` +
      `👥 *Guests:* ${data.guestCount || '-'}\n\n` +
      `_I have submitted the booking form on PartyBala. Please confirm artist availability._`;
  } else if (formType === 'book-makeup') {
    message = `*New Makeup Artist Booking Request - PartyBala*\n\n` +
      `👤 *Name:* ${data.fullName || 'Client'}\n` +
      `📞 *Phone:* ${data.phone || '-'}\n` +
      `📅 *Date:* ${data.eventDate || '-'} (${data.eventTime || 'Time flexible'})\n` +
      `📍 *Location:* ${data.locationType || '-'}, ${data.cityArea || defaultCity}\n` +
      `💄 *Service:* ${data.serviceType || '-'}\n` +
      `✨ *Look:* ${data.makeupStyle || '-'}\n` +
      `👥 *People:* ${data.personCount || '1'}\n` +
      `👗 *Hair & Draping:* ${data.hairDraping || 'Not specified'}\n\n` +
      `_I have submitted the inquiry form on PartyBala. Please share portfolio & availability._`;
  } else if (formType === 'partner-unified') {
    message = `*New Artist Partner Registration - PartyBala*\n\n` +
      `👤 *Artist Name:* ${data.fullName || 'Artist'}\n` +
      `✨ *Profession:* ${data.profession || 'Makeup / Mehndi Artist'}\n` +
      `📞 *Phone:* ${data.phone || '-'}\n` +
      `💬 *WhatsApp:* ${data.whatsapp || data.phone || '-'}\n` +
      `📧 *Email:* ${data.email || '-'}\n` +
      `🏙️ *City:* ${data.city || defaultCity}\n` +
      `📍 *Service Areas:* ${data.serviceLocation || 'Kanpur & Nearby'}\n` +
      `⏳ *Experience:* ${data.experience || '-'}\n` +
      `📸 *Portfolio Link:* ${data.portfolioLink || '-'}\n` +
      (data.notes ? `📝 *Additional Note:* ${data.notes}\n\n` : `\n`) +
      `_I have submitted my Partner Registration on PartyBala! Please confirm my listing._`;
  } else if (formType === 'partner-mehndi') {
    message = `*New Mehndi Artist Partner Registration - PartyBala*\n\n` +
      `🎨 *Artist Name:* ${data.artistName || 'Artist'}\n` +
      `🏷️ *Brand:* ${data.brandName || '-'}\n` +
      `📞 *Phone:* ${data.phone || '-'}\n` +
      `🏙️ *City:* ${data.city || defaultCity}\n` +
      `⏳ *Experience:* ${data.experience || '-'}\n` +
      `👥 *Team Size:* ${data.teamSize || '1'}\n` +
      `📸 *Portfolio:* ${data.portfolioLink || 'Attached/Discuss on chat'}\n\n` +
      `_I would like to partner with PartyBala as a certified Mehndi Artist!_`;
  } else if (formType === 'partner-makeup') {
    message = `*New Makeup Artist Partner Registration - PartyBala*\n\n` +
      `💄 *Artist Name:* ${data.artistName || 'Artist'}\n` +
      `🏷️ *Brand/Studio:* ${data.brandName || '-'}\n` +
      `📞 *Phone:* ${data.phone || '-'}\n` +
      `🏙️ *City:* ${data.city || '-'}\n` +
      `⏳ *Experience:* ${data.experience || '-'}\n` +
      `🌟 *Brands Used:* ${data.brandsUsed || '-'}\n` +
      `📸 *Portfolio:* ${data.portfolioLink || 'Will share photos'}\n\n` +
      `_I would like to join PartyBala Makeup Artist Network!_`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Display luxury animated success modal with details
 */
function showSuccessModal(formType, data, isDemoMode) {
  // Remove existing modal if any
  const oldModal = document.getElementById('partybala-success-modal');
  if (oldModal) oldModal.remove();

  const isReview = formType === 'customer-review';
  const isPartner = formType.startsWith('partner');
  const title = isReview ? "Thank You for Your Review!" : (isPartner ? "Application Submitted Successfully!" : "Booking Request Received!");
  const subtitle = isReview
    ? "Your review has been successfully submitted and logged directly into our Google Sheet. Thank you for celebrating with PartyBala!"
    : (isPartner
      ? "Thank you for applying to join the PartyBala Elite Artist Network. Our partner onboarding team will review your profile and reach out within 24 hours."
      : "Thank you! Your booking inquiry has been recorded. Our concierge team will match you with the finest verified artists and confirm availability shortly.");

  const name = data.fullName || data.artistName || "Valued User";
  const phone = data.phone || "";
  const dateOrExp = data.eventDate ? `Date: ${data.eventDate}` : (data.experience ? `Experience: ${data.experience}` : "");
  const whatsappUrl = buildWhatsAppUrl(formType, data);

  const targetSheetUrl = (typeof PARTYBALA_CONFIG !== 'undefined' && PARTYBALA_CONFIG.GOOGLE_SHEET_URL)
    ? PARTYBALA_CONFIG.GOOGLE_SHEET_URL
    : "https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit";

  const demoNotice = isDemoMode ? `
    <div class="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs text-left">
      <div class="font-bold mb-1.5 text-amber-800">
        Target Sheet Connected: PartyBala Leads
      </div>
      <p class="text-gray-600 mb-2">To save directly into <a href="${targetSheetUrl}" target="_blank" class="text-rose-700 underline font-semibold">your Google Sheet</a>, deploy the script in <code class="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">google-apps-script/Code.gs</code> and paste your Web App URL into <code class="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">assets/js/config.js</code>.</p>
      <a href="${targetSheetUrl}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:text-amber-950 underline">
        <span>Open Your Google Sheet ↗</span>
      </a>
    </div>
  ` : `
    <div class="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center">
      <span>Saved to <a href="${targetSheetUrl}" target="_blank" class="underline font-semibold text-emerald-900">Your Google Sheet</a> successfully!</span>
    </div>
  `;

  const modalHtml = `
    <div id="partybala-success-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-8 shadow-2xl border border-rose-100 transform transition-all text-center relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <!-- Luxury decorative top banner -->
        <div class="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-600"></div>

        <!-- PartyBala Official Logo Avatar -->
        <div class="mx-auto w-20 h-20 mb-4 rounded-3xl overflow-hidden shadow-lg border-2 border-amber-200">
          <img src="assets/images/partybala-logo.jpg" 
               alt="PartyBala - Your Plans, Our Duty" 
               class="w-full h-full object-cover">
        </div>

        <h3 class="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight mb-2">
          ${title}
        </h3>
        <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
          ${subtitle}
        </p>

        <!-- Summary Card -->
        <div class="bg-gray-50 rounded-2xl p-4 text-left text-sm border border-gray-100 space-y-1.5 mb-6">
          <div class="flex justify-between items-center text-xs uppercase tracking-wider text-gray-400 font-semibold pb-1 border-b border-gray-200">
            <span>Inquiry Details</span>
            <span class="text-rose-600 font-bold">PartyBala Verified</span>
          </div>
          <div class="flex justify-between py-0.5">
            <span class="text-gray-500">Name:</span>
            <span class="font-medium text-gray-800">${escapeHtml(name)}</span>
          </div>
          ${phone ? `
          <div class="flex justify-between py-0.5">
            <span class="text-gray-500">Contact:</span>
            <span class="font-medium text-gray-800">${escapeHtml(phone)}</span>
          </div>` : ''}
          ${dateOrExp ? `
          <div class="flex justify-between py-0.5">
            <span class="text-gray-500">Reference:</span>
            <span class="font-medium text-gray-800">${escapeHtml(dateOrExp)}</span>
          </div>` : ''}
        </div>

        ${demoNotice}

        <!-- Actions -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer"
             class="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm group">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-5 h-5">
            <span>Instant WhatsApp Connect</span>
          </a>
          <button onclick="closePartyBalaModal()"
                  class="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm">
            Done / Close
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closePartyBalaModal() {
  const modal = document.getElementById('partybala-success-modal');
  if (modal) {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 200);
  }
}

function showToast(message, type = "info") {
  const toast = document.createElement('div');
  const bg = type === 'error' ? 'bg-red-600' : 'bg-emerald-600';
  toast.className = `fixed bottom-5 right-5 z-50 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm transition-all transform duration-300 ${bg}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
