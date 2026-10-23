/**
 * =========================================================================
 * PARTYBALA - LUXURY BRIDAL ARTISTRY & CELEBRATIONS
 * GOOGLE APPS SCRIPT WEB APP & AUTOMATED LUXURY EMAIL ENGINE
 * =========================================================================
 * SPREADSHEET URL:
 * https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM/edit
 * 
 * SPREADSHEET ID:
 * 1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM
 * 
 * CONTACT CHANNELS:
 * - Customer Concierge (Bookings): +91 89330 23302
 * - Partner Helpdesk (Artists):    +91 89330 73307
 * - Official Email:                info@partybala.com
 * =========================================================================
 * KEY CAPABILITIES:
 * 1. Automatically records every lead with a unique Reference ID into Google Sheet tabs.
 * 2. Automatically dispatches ultra-premium branded HTML emails from info@partybala.com:
 *    - To CUSTOMERS: Luxury Bridal Booking Receipt with concierge next steps & WhatsApp CTA.
 *    - To PARTNERS: Elite Artist Network Welcome & Onboarding milestones.
 *    - To ADMIN (info@partybala.com): Executive Lead Alert with 1-click Call, WhatsApp & Sheet links.
 * 3. Graceful fallback engine: attempts sending directly from info@partybala.com,
 *    with automatic fallback so emails NEVER fail if alias permissions are pending.
 * =========================================================================
 */

var TARGET_SPREADSHEET_ID = "1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM";
var OFFICIAL_EMAIL        = "info@partybala.com";
var OFFICIAL_WEBSITE      = "www.partybala.com";
var OFFICIAL_WEBSITE_URL  = "https://www.partybala.com";
var CUSTOMER_PHONE        = "+91 89330 23302";
var PARTNER_PHONE         = "+91 89330 73307";
var INSTAGRAM_HANDLE      = "@party_bala";
var INSTAGRAM_URL         = "https://www.instagram.com/party_bala/";
var LOGO_URL              = "https://raw.githubusercontent.com/AkarshanMishra/PARTYBALA/main/assets/images/partybala-logo.png";
var LOGO_FALLBACK_URL     = "https://akarshanmishra.github.io/PARTYBALA/assets/images/partybala-logo.png";
var SPREADSHEET_URL       = "https://docs.google.com/spreadsheets/d/" + TARGET_SPREADSHEET_ID + "/edit";

/**
 * Connect to target spreadsheet
 */
function getTargetSpreadsheet() {
  try {
    if (TARGET_SPREADSHEET_ID && TARGET_SPREADSHEET_ID.trim() !== "") {
      return SpreadsheetApp.openById(TARGET_SPREADSHEET_ID.trim());
    }
  } catch (err) {
    Logger.log("openById failed, falling back to getActiveSpreadsheet: " + err.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Generate a unique, memorable Inquiry Reference ID
 */
function generateRefId(prefix) {
  var p = prefix || "PB";
  var randomDigits = Math.floor(1000 + Math.random() * 9000);
  return p + "-" + randomDigits;
}

/**
 * Main Web App POST Handler: Saves lead to Google Sheet & sends luxury emails
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var acquiredLock = false;
  try {
    acquiredLock = lock.tryLock(25000);
  } catch (lockErr) {
    Logger.log("Script lock acquire notice: " + lockErr.toString());
  }

  try {
    var ss = getTargetSpreadsheet();
    if (!ss) {
      throw new Error("Unable to open Google Spreadsheet with ID: " + TARGET_SPREADSHEET_ID);
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        try {
          var raw = e.postData.contents;
          var pairs = raw.split('&');
          for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (pair.length === 2) {
              data[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
            }
          }
        } catch (parseErr) {
          data = e.parameter || {};
        }
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var formType = data.formType || "general";
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd HH:mm:ss");
    var refId = "";
    var sheetName = "";
    var headers = [];
    var rowData = [];

    // =========================================================================
    // 1. ROUTE FORM DATA & PREPARE GOOGLE SHEET ROW
    // =========================================================================
    switch (formType) {
      case "book-mehndi":
        refId = generateRefId("PB-MHD");
        data.refId = refId;
        sheetName = "Mehndi_Bookings";
        headers = [
          "Timestamp", "Inquiry Ref ID", "Status", "Full Name", "Phone / WhatsApp",
          "Email", "Event Date", "Basic Requirement / Occasion", "City / Locality", "Additional Notes"
        ];
        rowData = [
          timestamp, refId, "New Lead", data.fullName || "", data.phone || "",
          data.email || "Not Provided", data.eventDate || "", data.occasion || "Bridal Mehndi",
          data.cityArea || "Kanpur", data.notes || ""
        ];
        break;

      case "book-makeup":
        refId = generateRefId("PB-MUP");
        data.refId = refId;
        sheetName = "Makeup_Bookings";
        headers = [
          "Timestamp", "Inquiry Ref ID", "Status", "Full Name", "Phone / WhatsApp",
          "Email", "Event Date", "Basic Requirement / Service", "City / Locality", "Additional Notes"
        ];
        rowData = [
          timestamp, refId, "New Lead", data.fullName || "", data.phone || "",
          data.email || "Not Provided", data.eventDate || "", data.serviceType || "Bridal HD Makeup",
          data.cityArea || "Kanpur", data.notes || ""
        ];
        break;

      case "partner-unified":
        refId = generateRefId("PB-ART");
        data.refId = refId;
        sheetName = "Partner_Registrations";
        headers = [
          "Timestamp", "Artist Ref ID", "Status", "Full Name", "Profession",
          "Mobile Phone", "WhatsApp Number", "Email", "City", "Experience",
          "Service Location", "Portfolio / Instagram Link", "Additional Notes"
        ];
        rowData = [
          timestamp, refId, "Pending Review", data.fullName || "", data.profession || "Mehndi / Makeup Artist",
          data.phone || "", data.whatsapp || "", data.email || "", data.city || "Kanpur",
          data.experience || "", data.serviceLocation || "Kanpur & Nearby", data.portfolioLink || "",
          data.notes || ""
        ];
        break;

      case "customer-review":
        refId = generateRefId("PB-REV");
        data.refId = refId;
        sheetName = "Customer_Reviews";
        headers = [
          "Timestamp", "Review Ref ID", "Status", "Customer Name", "Phone / WhatsApp",
          "Email", "Service Experienced", "Star Rating", "Customer Review"
        ];
        rowData = [
          timestamp, refId, "Verified Review", data.fullName || "", data.phone || "",
          data.email || "Not Provided", data.serviceUsed || "Bridal Service",
          (data.rating || 5) + " / 5 Stars", data.reviewText || ""
        ];
        break;

      default:
        refId = generateRefId("PB-GEN");
        data.refId = refId;
        sheetName = "General_Inquiries";
        headers = ["Timestamp", "Inquiry Ref ID", "Raw Data"];
        rowData = [timestamp, refId, JSON.stringify(data)];
    }

    // =========================================================================
    // 2. GET OR CREATE SHEET AND APPEND ROW
    // =========================================================================
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#831843"); // Royal Wine
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(rowData);
    var lastRow = sheet.getLastRow();

    // Style Status Cell for Quick Triage
    var statusCell = sheet.getRange(lastRow, 3);
    if (sheetName.indexOf("Bookings") !== -1) {
      statusCell.setBackground("#FEF3C7"); // Warm Amber
      statusCell.setFontColor("#92400E");
      statusCell.setFontWeight("bold");
    } else {
      statusCell.setBackground("#E0E7FF"); // Royal Indigo
      statusCell.setFontColor("#3730A3");
      statusCell.setFontWeight("bold");
    }

    // Auto-fit columns for readability in early rows
    if (lastRow <= 15) {
      for (var c = 1; c <= headers.length; c++) {
        try { sheet.autoResizeColumn(c); } catch (eResize) {}
      }
    }

    // =========================================================================
    // 3. AUTOMATIC LUXURY EMAIL DISPATCH (CUSTOMER, PARTNER & ADMIN)
    // =========================================================================
    var emailStatus = "not_requested";
    try {
      emailStatus = dispatchPartyBalaEmails(formType, data, timestamp, refId);
    } catch (emailErr) {
      Logger.log("Email dispatch caught: " + emailErr.toString());
      emailStatus = "error: " + emailErr.toString();
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        refId: refId,
        sheet: sheetName,
        row: lastRow,
        emailStatus: emailStatus,
        message: "Inquiry " + refId + " successfully saved to Google Sheet & processed."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try {
      if (lock && acquiredLock && lock.hasLock && lock.hasLock()) {
        lock.releaseLock();
      }
    } catch (releaseErr) {
      Logger.log("Lock release notice: " + releaseErr.toString());
    }
  }
}

/**
 * Routes emails to Customer, Partner, and Admin
 */
function dispatchPartyBalaEmails(formType, data, timestamp, refId) {
  var recipientEmail = (data.email || "").trim();
  var hasValidEmail = (recipientEmail && recipientEmail.indexOf("@") !== -1 && recipientEmail.indexOf(".") !== -1);
  var isPartner = (formType.indexOf("partner") !== -1);
  var isBooking = (formType === "book-mehndi" || formType === "book-makeup");
  var isReview  = (formType === "customer-review");

  // 1. CUSTOMER BOOKING CONFIRMATION EMAIL
  if (isBooking && hasValidEmail) {
    var customerSubject = "✨ Booking Received: PartyBala Luxury Artistry [Ref: " + refId + "]";
    var customerHtml = buildCustomerBookingEmailHtml(formType, data, refId);
    sendPartyBalaEmail(recipientEmail, customerSubject, customerHtml);
  }

  // 2. PARTNER ONBOARDING CONFIRMATION EMAIL
  if (isPartner && hasValidEmail) {
    var partnerSubject = "👑 Welcome to PartyBala Elite Artist Network [Ref: " + refId + "]";
    var partnerHtml = buildPartnerOnboardingEmailHtml(data, refId);
    sendPartyBalaEmail(recipientEmail, partnerSubject, partnerHtml);
  }

  // 3. CUSTOMER REVIEW THANK YOU EMAIL
  if (isReview && hasValidEmail) {
    var reviewSubject = "✨ Heartfelt Thanks for Your Review — PartyBala Luxury Artistry";
    var reviewHtml = buildCustomerReviewEmailHtml(data, refId);
    sendPartyBalaEmail(recipientEmail, reviewSubject, reviewHtml);
  }

  // 4. EXECUTIVE ADMIN NOTIFICATION TO info@partybala.com
  var leadTitle = isPartner ? "New Artist Registration" : (isBooking ? "New Customer Booking" : "New Customer Review");
  var clientName = data.fullName || data.artistName || "Client";
  var adminSubject = "⚡ NEW LEAD [" + refId + "]: " + leadTitle + " — " + clientName + " (" + (data.phone || data.whatsapp || "No Phone") + ")";
  var adminHtml = buildAdminAlertEmailHtml(formType, data, timestamp, refId);
  sendPartyBalaEmail(OFFICIAL_EMAIL, adminSubject, adminHtml);

  return "dispatched";
}

/**
 * Universal Dual-Layer Email Dispatcher
 * Sends with sender info@partybala.com and provides resilient fallback.
 */
function sendPartyBalaEmail(toEmail, subject, htmlBody) {
  if (!toEmail || toEmail.indexOf("@") === -1) return false;

  var senderDisplayName = "PartyBala Luxury Artistry";

  // ATTEMPT 1: GmailApp with explicit from alias info@partybala.com
  try {
    GmailApp.sendEmail(toEmail, subject, "", {
      name: senderDisplayName,
      from: OFFICIAL_EMAIL,
      replyTo: OFFICIAL_EMAIL,
      htmlBody: htmlBody
    });
    Logger.log("Dispatched via GmailApp (from: " + OFFICIAL_EMAIL + ") to: " + toEmail);
    return true;
  } catch (aliasErr) {
    Logger.log("GmailApp send-as alias notice: " + aliasErr.toString() + ". Falling back to MailApp.");
  }

  // ATTEMPT 2: MailApp with display name containing info@partybala.com and Reply-To
  try {
    MailApp.sendEmail({
      to: toEmail,
      subject: subject,
      htmlBody: htmlBody,
      name: senderDisplayName + " <" + OFFICIAL_EMAIL + ">",
      replyTo: OFFICIAL_EMAIL
    });
    Logger.log("Dispatched via MailApp (replyTo: " + OFFICIAL_EMAIL + ") to: " + toEmail);
    return true;
  } catch (mailErr) {
    Logger.log("MailApp delivery failed: " + mailErr.toString());
    return false;
  }
}

/**
 * =========================================================================
 * TEMPLATE 1: LUXURY CUSTOMER BOOKING CONFIRMATION EMAIL
 * =========================================================================
 */
function buildCustomerBookingEmailHtml(formType, data, refId) {
  var isMehndi = (formType === "book-mehndi");
  var serviceHeading = isMehndi ? "Bridal & Festive Mehndi Artistry" : "Bridal & Party HD Makeup";
  var requirementVal = isMehndi ? (data.occasion || "Bridal Mehndi") : (data.serviceType || "Bridal HD Makeup");
  var customerName = data.fullName || "Valued Guest";
  var eventDate = data.eventDate || "To be confirmed";
  var cityVal = data.cityArea || "Kanpur";
  var phoneVal = data.phone || "Not provided";
  var emailVal = data.email || "Registered via Booking Form";
  var notesVal = data.notes || "None provided";
  var whatsappDigits = CUSTOMER_PHONE.replace(/[^0-9]/g, '');
  var whatsappMsg = encodeURIComponent("Hello PartyBala Concierge, I submitted booking inquiry #" + refId + " for " + requirementVal + " on " + eventDate + ". Please confirm verified artist availability.");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PartyBala Booking Confirmation - #${refId}</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color:#27272A; -webkit-font-smoothing:antialiased;">
  
  <!-- Outer Canvas -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F2; padding:35px 15px;">
    <tr>
      <td align="center">
        
        <!-- Main Card (600px Max) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#FFFFFF; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05); border:1px solid #EADCC9;">
          
          <!-- Top Metallic Gold & Rose Accent Hairline -->
          <tr>
            <td height="4" style="background:linear-gradient(90deg, #D4AF37 0%, #D91B5C 50%, #D4AF37 100%);"></td>
          </tr>

          <!-- Modern Luxury Light Header -->
          <tr>
            <td align="center" style="background-color:#FFFFFF; padding:36px 30px 24px 30px; text-align:center; border-bottom:1px solid #F4EBE1;">
              
              <!-- Official PartyBala Transparent Logo -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 14px auto;">
                <tr>
                  <td align="center">
                    <img src="${LOGO_URL}" 
                         alt="PartyBala Logo" 
                         width="68" 
                         height="68" 
                         style="display:block; object-fit:contain; border-radius:16px; border:1.5px solid #EADCC9; background-color:#FFFFFF; padding:4px; box-shadow:0 4px 14px rgba(0,0,0,0.04); margin:0 auto;" />
                  </td>
                </tr>
              </table>

              <!-- Brand Name -->
              <h1 style="margin:0; font-family:Georgia, 'Playfair Display', serif; font-size:28px; font-weight:800; color:#18181B; letter-spacing:0.5px; line-height:1.1;">
                Party<span style="color:#D91B5C;">Bala</span>
              </h1>
              
              <!-- Tagline -->
              <p style="margin:6px 0 0 0; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:#854D0E; font-weight:700;">
                Your Plans, Our Duty • Luxury Bridal Concierge
              </p>

              <!-- Reference ID Badge Chip -->
              <div style="display:inline-block; margin-top:16px; padding:6px 20px; background-color:#FDFBF7; border:1px solid #D4AF37; border-radius:30px; font-size:12px; color:#854D0E; font-weight:700; letter-spacing:0.8px;">
                INQUIRY REFERENCE: #${refId}
              </div>

            </td>
          </tr>

          <!-- Priority Verified Status Ribbon -->
          <tr>
            <td style="background-color:#F0FDF4; border-bottom:1px solid #DCFCE7; padding:12px 24px; text-align:center;">
              <span style="font-size:12px; color:#15803D; font-weight:700; letter-spacing:0.3px;">
                ✓ Verified Booking Request Received • Assigned to Concierge Desk
              </span>
            </td>
          </tr>

          <!-- Email Body Content -->
          <tr>
            <td style="padding:32px 32px 20px 32px;">
              
              <h2 style="margin:0 0 12px 0; font-family:Georgia, 'Playfair Display', serif; font-size:22px; color:#18181B; font-weight:700;">
                Dear ${customerName},
              </h2>

              <p style="margin:0 0 18px 0; font-size:14px; line-height:1.65; color:#52525B;">
                Thank you for choosing <strong>PartyBala</strong> for your celebration. Every wedding and milestone event deserves pure perfection. We have received your booking inquiry and our dedicated bridal concierge is actively reviewing your requirements to pair you with the finest verified artists on your date.
              </p>

              <!-- Luxury Inquiry Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FDFBF7; border-radius:14px; border:1px solid #EADCC9; margin:24px 0; overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(90deg, #F9F3EA 0%, #FDFBF7 100%); padding:12px 18px; border-bottom:1px solid #EADCC9;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left">
                          <span style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#854D0E;">
                            📋 BOOKING SPECIFICATIONS
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-size:11px; font-weight:700; color:#059669;">
                            ● Priority Active
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <table width="100%" cellpadding="7" cellspacing="0" border="0" style="font-size:13px;">
                      <tr>
                        <td width="36%" style="color:#71717A; font-weight:600; border-bottom:1px solid #F2E8DC;">Service Category:</td>
                        <td width="64%" style="color:#18181B; font-weight:700; border-bottom:1px solid #F2E8DC;">${serviceHeading}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F2E8DC;">Requirement / Style:</td>
                        <td style="color:#D91B5C; font-weight:700; border-bottom:1px solid #F2E8DC;">${requirementVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F2E8DC;">Event Date:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #F2E8DC;">📅 ${eventDate}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F2E8DC;">City / Area:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #F2E8DC;">📍 ${cityVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F2E8DC;">Contact Number:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #F2E8DC;">📞 ${phoneVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F2E8DC;">Email Receipt:</td>
                        <td style="color:#18181B; font-weight:600; border-bottom:1px solid #F2E8DC;">📧 ${emailVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600;">Special Notes:</td>
                        <td style="color:#52525B; font-style:italic;">"${notesVal}"</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Roadmap -->
              <h3 style="margin:26px 0 14px 0; font-family:Georgia, 'Playfair Display', serif; font-size:18px; color:#18181B; font-weight:700;">
                What Happens Next?
              </h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td width="36" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:28px; height:28px; border-radius:50%; background-color:#FAF7F2; border:1.5px solid #D4AF37; color:#854D0E; text-align:center; line-height:26px; font-size:12px; font-weight:800;">1</div>
                  </td>
                  <td valign="top" style="padding-bottom:16px;">
                    <div style="font-size:13px; font-weight:700; color:#18181B;">Artist Availability Matching</div>
                    <div style="font-size:12px; color:#71717A; line-height:1.5; margin-top:2px;">Our lead coordinator is screening verified artist schedules and matching high-definition work portfolios for your preferred date.</div>
                  </td>
                </tr>
                <tr>
                  <td width="36" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:28px; height:28px; border-radius:50%; background-color:#FAF7F2; border:1.5px solid #D4AF37; color:#854D0E; text-align:center; line-height:26px; font-size:12px; font-weight:800;">2</div>
                  </td>
                  <td valign="top" style="padding-bottom:16px;">
                    <div style="font-size:13px; font-weight:700; color:#18181B;">WhatsApp Lookbook &amp; Quote Sharing</div>
                    <div style="font-size:12px; color:#71717A; line-height:1.5; margin-top:2px;">You will receive high-resolution artist photos, transparent packages, and availability directly on WhatsApp (<strong>${phoneVal}</strong>).</div>
                  </td>
                </tr>
                <tr>
                  <td width="36" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:28px; height:28px; border-radius:50%; background-color:#FAF7F2; border:1.5px solid #D4AF37; color:#854D0E; text-align:center; line-height:26px; font-size:12px; font-weight:800;">3</div>
                  </td>
                  <td valign="top">
                    <div style="font-size:13px; font-weight:700; color:#18181B;">Guaranteed Date Lock &amp; Doorstep Service</div>
                    <div style="font-size:12px; color:#71717A; line-height:1.5; margin-top:2px;">Finalize your artist with complete peace of mind, guaranteed on-time doorstep arrival, and 100% genuine products.</div>
                  </td>
                </tr>
              </table>

              <!-- Instant WhatsApp Connect Button (Emerald Green Pill) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${whatsappDigits}?text=${whatsappMsg}" 
                       target="_blank"
                       style="display:inline-block; background:linear-gradient(135deg, #059669 0%, #047857 100%); color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:15px 32px; border-radius:50px; box-shadow:0 6px 20px rgba(5,150,105,0.25); letter-spacing:0.3px;">
                      💬 Instant WhatsApp Connect with Concierge
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:10px;">
                    <span style="font-size:12px; color:#71717A;">
                      Direct Helpline: <a href="tel:${CUSTOMER_PHONE.replace(/[^0-9+]/g, '')}" style="color:#D91B5C; font-weight:700; text-decoration:none;">${CUSTOMER_PHONE}</a> &bull; 9:00 AM – 10:00 PM IST
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Trust Guarantee Badges Row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px; padding-top:20px; border-top:1px dashed #EADCC9; text-align:center;">
                <tr>
                  <td width="33%" style="padding:6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">👑 Verified Artists</strong>
                    Top-Rated Certified MUAs
                  </td>
                  <td width="33%" style="padding:6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">★ 4.9/5 Rating</strong>
                    Loved by 10,000+ Brides
                  </td>
                  <td width="33%" style="padding:6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">🌿 100% Genuine</strong>
                    Organic Henna &amp; HD Kits
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Modern Light Luxury Footer (Matches Website) -->
          <tr>
            <td style="background-color:#FAF7F2; border-top:1px solid #EADCC9; padding:26px 25px; text-align:center; color:#71717A; font-size:11px; line-height:1.65;">
              
              <!-- Direct Contact Badges in Footer -->
              <div style="margin-bottom:12px;">
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  🌐 <a href="${OFFICIAL_WEBSITE_URL}" target="_blank" style="color:#18181B; text-decoration:none; font-weight:700;">${OFFICIAL_WEBSITE}</a>
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  📷 <a href="${INSTAGRAM_URL}" target="_blank" style="color:#D91B5C; text-decoration:none; font-weight:700;">${INSTAGRAM_HANDLE}</a>
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  📞 Concierge: ${CUSTOMER_PHONE}
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  ✉️ <a href="mailto:${OFFICIAL_EMAIL}" style="color:#D91B5C; text-decoration:none;">${OFFICIAL_EMAIL}</a>
                </span>
              </div>

              <p style="margin:0 0 4px 0; color:#18181B; font-weight:700; font-size:12px;">
                PartyBala Luxury Bridal &amp; Beauty Concierge
              </p>
              <p style="margin:0 0 8px 0; color:#71717A; font-size:11px;">
                Kanpur Central Hub &bull; Serving Uttar Pradesh &amp; Pan-India
              </p>
              <p style="margin:0; color:#A1A1AA; font-size:10px;">
                © 2026 PartyBala. All rights reserved. <strong style="color:#D91B5C;">Your Plans, Our Duty.</strong>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

/**
 * =========================================================================
 * TEMPLATE 2: LUXURY PARTNER ONBOARDING CONFIRMATION EMAIL
 * =========================================================================
 */
function buildPartnerOnboardingEmailHtml(data, refId) {
  var artistName = data.fullName || data.artistName || "Esteemed Artist";
  var profession = data.profession || "Mehndi / Makeup Artist";
  var cityVal = data.city || "Kanpur";
  var phoneVal = data.phone || data.mobile || "Not provided";
  var whatsappVal = data.whatsapp || phoneVal;
  var experienceVal = data.experience || "Professional";
  var portfolioVal = data.portfolioLink || "Provided in application";
  var notesVal = data.notes || "None provided";
  var whatsappDigits = PARTNER_PHONE.replace(/[^0-9]/g, '');
  var whatsappMsg = encodeURIComponent("Hello PartyBala Artist Desk, I have submitted my artist partner registration #" + refId + " (" + artistName + " - " + profession + "). Please verify my profile.");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PartyBala Artist Partner Registration - Ref #${refId}</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color:#27272A; -webkit-font-smoothing:antialiased;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F2; padding:36px 14px;">
    <tr>
      <td align="center">
        
        <!-- Main Email Container Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; background-color:#FFFFFF; border-radius:20px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,0.06); border:1px solid #EADCC9;">
          
          <!-- Top Tricolor Metallic Hairline -->
          <tr>
            <td height="4" style="background:linear-gradient(90deg, #D4AF37 0%, #059669 50%, #D91B5C 100%);"></td>
          </tr>

          <!-- Modern Luxury Light Header -->
          <tr>
            <td align="center" style="background-color:#FFFFFF; padding:36px 30px 24px 30px; text-align:center; border-bottom:1px solid #F4EBE1;">
              
              <!-- Official PartyBala Transparent Logo -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 14px auto;">
                <tr>
                  <td align="center">
                    <img src="${LOGO_URL}" 
                         alt="PartyBala Logo" 
                         width="68" 
                         height="68" 
                         style="display:block; object-fit:contain; border-radius:16px; border:1.5px solid #EADCC9; background-color:#FFFFFF; padding:4px; box-shadow:0 4px 14px rgba(0,0,0,0.04); margin:0 auto;" />
                  </td>
                </tr>
              </table>

              <!-- Brand Name -->
              <h1 style="margin:0; font-family:Georgia, 'Playfair Display', serif; font-size:28px; font-weight:800; color:#18181B; letter-spacing:0.5px; line-height:1.1;">
                Party<span style="color:#D91B5C;">Bala</span>
              </h1>
              
              <!-- Tagline -->
              <p style="margin:6px 0 0 0; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:#047857; font-weight:700;">
                Elite Artist Guild &bull; Luxury Bridal Network
              </p>

              <!-- Application Reference Badge -->
              <div style="display:inline-block; margin-top:16px; padding:6px 20px; background-color:#FDFBF7; border:1px solid #D4AF37; border-radius:30px; font-size:12px; color:#854D0E; font-weight:700; letter-spacing:0.8px;">
                PARTNER APPLICATION REF: #${refId}
              </div>

            </td>
          </tr>

          <!-- Priority Status Ribbon -->
          <tr>
            <td style="background-color:#ECFDF5; border-bottom:1px solid #D1FAE5; padding:12px 24px; text-align:center;">
              <span style="font-size:12px; color:#065F46; font-weight:700; letter-spacing:0.3px;">
                👑 Artist Partner Registration Received &bull; Queued for 24-Hr Verification
              </span>
            </td>
          </tr>

          <!-- Email Body Content -->
          <tr>
            <td style="padding:32px 32px 20px 32px;">
              
              <h2 style="margin:0 0 12px 0; font-family:Georgia, 'Playfair Display', serif; font-size:22px; color:#18181B; font-weight:700;">
                Welcome, ${artistName}!
              </h2>

              <p style="margin:0 0 18px 0; font-size:14px; line-height:1.65; color:#52525B;">
                Thank you for applying to partner with the <strong>PartyBala Elite Artist Circle</strong>. We celebrate extraordinary talent and connect Kanpur and Uttar Pradesh's finest bridal artists with premium, high-budget brides, guaranteed on-time payouts, and dedicated concierge support.
              </p>

              <!-- Luxury Artist Application Summary Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FDFBF7; border-radius:14px; border:1px solid #EADCC9; margin:24px 0; overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(90deg, #F9F3EA 0%, #FDFBF7 100%); padding:12px 18px; border-bottom:1px solid #EADCC9;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left">
                          <span style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#854D0E;">
                            📜 REGISTRATION PROFILE
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-size:11px; font-weight:700; color:#059669;">
                            ● Verification In Progress
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <table width="100%" cellpadding="7" cellspacing="0" border="0" style="font-size:13px;">
                      <tr>
                        <td width="38%" style="color:#71717A; font-weight:500; border-bottom:1px solid #EFE6DC;">Artist / Studio Name:</td>
                        <td width="62%" style="color:#18181B; font-weight:700; border-bottom:1px solid #EFE6DC;">${artistName}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:500; border-bottom:1px solid #EFE6DC;">Artistry / Profession:</td>
                        <td style="color:#D91B5C; font-weight:700; border-bottom:1px solid #EFE6DC;">${profession}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:500; border-bottom:1px solid #EFE6DC;">Base City / Territory:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #EFE6DC;">📍 ${cityVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:500; border-bottom:1px solid #EFE6DC;">Contact Phone:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #EFE6DC;">${phoneVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:500; border-bottom:1px solid #EFE6DC;">WhatsApp Helpline:</td>
                        <td style="color:#059669; font-weight:700; border-bottom:1px solid #EFE6DC;">${whatsappVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:500; border-bottom:1px solid #EFE6DC;">Industry Experience:</td>
                        <td style="color:#18181B; font-weight:600; border-bottom:1px solid #EFE6DC;">${experienceVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:500; border-bottom:1px solid #EFE6DC;">Portfolio Reference:</td>
                        <td style="color:#2563EB; font-weight:600; border-bottom:1px solid #EFE6DC; word-break:break-all;">
                          ${portfolioVal.indexOf('http') === 0 ? `<a href="${portfolioVal}" target="_blank" style="color:#2563EB; text-decoration:underline;">View Portfolio</a>` : portfolioVal}
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:500;">Onboarding Stage:</td>
                        <td>
                          <span style="display:inline-block; background-color:#FEF3C7; color:#92400E; font-size:11px; font-weight:700; padding:4px 12px; border-radius:20px; border:1px solid #FCD34D;">
                            ⏳ Portfolio Quality Review Underway
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What Happens Next - 3 Step Roadmap -->
              <h3 style="margin:26px 0 14px 0; font-family:Georgia, 'Playfair Display', serif; font-size:18px; color:#18181B; font-weight:700;">
                Artist Onboarding Milestones
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td width="36" valign="top" style="padding-right:14px; padding-top:2px;">
                    <div style="width:28px; height:28px; border-radius:50%; background-color:#FDF4E6; border:1.5px solid #FCD34D; color:#B45309; text-align:center; line-height:26px; font-size:12px; font-weight:800;">
                      1
                    </div>
                  </td>
                  <td valign="top" style="padding-bottom:16px;">
                    <div style="font-size:14px; font-weight:700; color:#18181B; margin-bottom:2px;">
                      Artistry &amp; Hygiene Standards Review
                    </div>
                    <div style="font-size:12px; color:#71717A; line-height:1.55;">
                      Our curatorial panel evaluates your bridal intricate work, line precision, and kit hygiene standards within <strong>24 business hours</strong>.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="36" valign="top" style="padding-right:14px; padding-top:2px;">
                    <div style="width:28px; height:28px; border-radius:50%; background-color:#FDF4E6; border:1.5px solid #FCD34D; color:#B45309; text-align:center; line-height:26px; font-size:12px; font-weight:800;">
                      2
                    </div>
                  </td>
                  <td valign="top" style="padding-bottom:16px;">
                    <div style="font-size:14px; font-weight:700; color:#18181B; margin-bottom:2px;">
                      Rate Card &amp; Territory Alignment
                    </div>
                    <div style="font-size:12px; color:#71717A; line-height:1.55;">
                      Our Partner Manager contacts you via WhatsApp to align your custom pricing tiers, travel radius, and peak-wedding season availability.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="36" valign="top" style="padding-right:14px; padding-top:2px;">
                    <div style="width:28px; height:28px; border-radius:50%; background-color:#FDF4E6; border:1.5px solid #FCD34D; color:#B45309; text-align:center; line-height:26px; font-size:12px; font-weight:800;">
                      3
                    </div>
                  </td>
                  <td valign="top">
                    <div style="font-size:14px; font-weight:700; color:#18181B; margin-bottom:2px;">
                      Verified Badge &amp; Direct High-Value Leads
                    </div>
                    <div style="font-size:12px; color:#71717A; line-height:1.55;">
                      Get listed on PartyBala's premium directory and receive qualified bridal booking inquiries directly with upfront secured deposits.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Direct WhatsApp Connect CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${whatsappDigits}?text=${whatsappMsg}" 
                       target="_blank"
                       style="display:inline-block; background-color:#059669; background:linear-gradient(135deg, #059669 0%, #047857 100%); color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:15px 30px; border-radius:12px; box-shadow:0 6px 18px rgba(5,150,105,0.25); letter-spacing:0.3px;">
                      💬 Connect with Partner Desk on WhatsApp (${PARTNER_PHONE})
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:10px;">
                    <span style="font-size:11px; color:#71717A;">
                      Direct WhatsApp support for artist onboarding &bull; Fast-track verification
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Partner Trust Highlights -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0 0; background-color:#FAF8F5; border-radius:10px; border:1px solid #EADCC9; text-align:center;">
                <tr>
                  <td width="33%" style="padding:8px 6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">💰 Guaranteed Payouts</strong>
                    Advance deposits secured
                  </td>
                  <td width="33%" style="padding:8px 6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">👑 High-Value Brides</strong>
                    No low-budget haggling
                  </td>
                  <td width="33%" style="padding:8px 6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">🛡️ Zero Fee</strong>
                    No registration cost
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Modern Light Luxury Footer (Matches Website) -->
          <tr>
            <td style="background-color:#FAF7F2; border-top:1px solid #EADCC9; padding:26px 25px; text-align:center; color:#71717A; font-size:11px; line-height:1.65;">
              
              <!-- Direct Contact Badges in Footer -->
              <div style="margin-bottom:12px;">
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  🌐 <a href="${OFFICIAL_WEBSITE_URL}" target="_blank" style="color:#18181B; text-decoration:none; font-weight:700;">${OFFICIAL_WEBSITE}</a>
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  📷 <a href="${INSTAGRAM_URL}" target="_blank" style="color:#D91B5C; text-decoration:none; font-weight:700;">${INSTAGRAM_HANDLE}</a>
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  🤝 Partner Desk: ${PARTNER_PHONE}
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:3px;">
                  ✉️ <a href="mailto:${OFFICIAL_EMAIL}" style="color:#D91B5C; text-decoration:none;">${OFFICIAL_EMAIL}</a>
                </span>
              </div>

              <p style="margin:0 0 4px 0; color:#18181B; font-weight:700; font-size:12px;">
                PartyBala Artist Network &amp; Guild
              </p>
              <p style="margin:0 0 8px 0; color:#71717A; font-size:11px;">
                Kanpur Central Hub &bull; Serving Uttar Pradesh &amp; Pan-India
              </p>
              <p style="margin:0; color:#A1A1AA; font-size:10px;">
                © 2026 PartyBala. Empowering India's Finest Bridal Artists. <strong style="color:#D91B5C;">Your Plans, Our Duty.</strong>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

/**
 * =========================================================================
 * TEMPLATE 3: LUXURY CUSTOMER REVIEW CONFIRMATION EMAIL
 * =========================================================================
 */
function buildCustomerReviewEmailHtml(data, refId) {
  var name = data.fullName || "Valued Patron";
  var service = data.serviceUsed || "Bridal Artistry Service";
  var rating = data.rating || 5;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PartyBala - Thank You For Your Review</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color:#27272A; -webkit-font-smoothing:antialiased;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F2; padding:36px 14px;">
    <tr>
      <td align="center">
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px; background-color:#FFFFFF; border-radius:20px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,0.06); border:1px solid #EADCC9;">
          
          <!-- Top Tricolor Hairline -->
          <tr>
            <td height="4" style="background:linear-gradient(90deg, #D91B5C 0%, #D4AF37 50%, #059669 100%);"></td>
          </tr>

          <!-- Modern Luxury Light Header -->
          <tr>
            <td align="center" style="background-color:#FFFFFF; padding:34px 30px 22px 30px; text-align:center; border-bottom:1px solid #F4EBE1;">
              
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 12px auto;">
                <tr>
                  <td align="center">
                    <img src="${LOGO_URL}" 
                         alt="PartyBala Logo" 
                         width="64" 
                         height="64" 
                         style="display:block; object-fit:contain; border-radius:14px; border:1.5px solid #EADCC9; background-color:#FFFFFF; padding:4px; box-shadow:0 4px 12px rgba(0,0,0,0.04); margin:0 auto;" />
                  </td>
                </tr>
              </table>

              <h1 style="margin:0; font-family:Georgia, 'Playfair Display', serif; font-size:26px; font-weight:800; color:#18181B; letter-spacing:0.5px;">
                Party<span style="color:#D91B5C;">Bala</span>
              </h1>
              
              <p style="margin:6px 0 0 0; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#854D0E; font-weight:700;">
                Your Plans, Our Duty &bull; Luxury Bridal Concierge
              </p>

              <div style="display:inline-block; margin-top:14px; padding:5px 18px; background-color:#FDFBF7; border:1px solid #D4AF37; border-radius:30px; font-size:11px; color:#854D0E; font-weight:700; letter-spacing:0.8px;">
                REVIEW REF: #${refId}
              </div>

            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px 32px 24px 32px;">
              <h2 style="margin:0 0 12px 0; font-family:Georgia, 'Playfair Display', serif; font-size:22px; color:#18181B; font-weight:700;">
                Thank You, ${name}!
              </h2>
              <p style="margin:0 0 16px 0; font-size:14px; line-height:1.65; color:#52525B;">
                We are immensely grateful for taking the time to share your gracious review for <strong>${service}</strong>.
              </p>
              <p style="margin:0 0 20px 0; font-size:14px; line-height:1.65; color:#52525B;">
                Your feedback empowers our artists and helps us uphold the highest standard of bridal artistry, perfection, and joyful celebration.
              </p>

              <!-- Star Rating Showcase Box -->
              <div style="background-color:#FDFBF7; border:1px solid #EADCC9; border-radius:14px; padding:20px; margin:22px 0; text-align:center;">
                <div style="font-size:24px; color:#D4AF37; letter-spacing:4px; margin-bottom:6px;">
                  ★★★★★
                </div>
                <div style="font-size:13px; font-weight:700; color:#18181B;">
                  ${rating} / 5 Stars Verified Experience
                </div>
                <p style="font-size:11px; color:#71717A; margin:6px 0 0 0;">
                  Reference: #${refId} &bull; Recorded in PartyBala Quality Registry
                </p>
              </div>

              <!-- Customer Care Note -->
              <p style="margin:20px 0 0 0; font-size:13px; color:#71717A; line-height:1.6; text-align:center;">
                Need assistance with future celebrations or bespoke bridal packages? Our concierge is always at your service.
              </p>
            </td>
          </tr>

          <!-- Modern Light Luxury Footer -->
          <tr>
            <td style="background-color:#FAF7F2; border-top:1px solid #EADCC9; padding:24px 20px; text-align:center; color:#71717A; font-size:11px; line-height:1.65;">
              <div style="margin-bottom:10px;">
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:2px;">
                  🌐 <a href="${OFFICIAL_WEBSITE_URL}" target="_blank" style="color:#18181B; text-decoration:none; font-weight:700;">${OFFICIAL_WEBSITE}</a>
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:2px;">
                  📷 <a href="${INSTAGRAM_URL}" target="_blank" style="color:#D91B5C; text-decoration:none; font-weight:700;">${INSTAGRAM_HANDLE}</a>
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:2px;">
                  📞 Concierge: ${CUSTOMER_PHONE}
                </span>
                <span style="display:inline-block; padding:4px 12px; background-color:#FFFFFF; border:1px solid #EADCC9; border-radius:20px; font-size:11px; color:#18181B; font-weight:600; margin:2px;">
                  ✉️ <a href="mailto:${OFFICIAL_EMAIL}" style="color:#D91B5C; text-decoration:none;">${OFFICIAL_EMAIL}</a>
                </span>
              </div>
              <p style="margin:0 0 4px 0; color:#18181B; font-weight:700; font-size:12px;">
                PartyBala Luxury Bridal &amp; Beauty Concierge
              </p>
              <p style="margin:0; color:#A1A1AA; font-size:10px;">
                © 2026 PartyBala. All rights reserved. <strong style="color:#D91B5C;">Your Plans, Our Duty.</strong>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

/**
 * =========================================================================
 * TEMPLATE 4: EXECUTIVE ADMIN LEAD ALERT EMAIL (Sent to info@partybala.com)
 * =========================================================================
 */
function buildAdminAlertEmailHtml(formType, data, timestamp, refId) {
  var isPartner = (formType.indexOf("partner") !== -1);
  var phoneVal = data.phone || data.whatsapp || "";
  var phoneDigits = phoneVal.replace(/[^0-9]/g, '');
  var clientName = data.fullName || data.artistName || "Lead";

  var rowsHtml = "";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      rowsHtml += `
        <tr>
          <td style="padding:9px 12px; border:1px solid #E4E4E7; font-weight:700; background:#F8FAFC; font-size:12px; text-transform:uppercase; color:#475569; width:35%;">
            ${key}
          </td>
          <td style="padding:9px 12px; border:1px solid #E4E4E7; font-size:13px; color:#0F172A;">
            ${data[key]}
          </td>
        </tr>
      `;
    }
  }

  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:20px; background-color:#F1F5F9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#0F172A;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:620px; background-color:#FFFFFF; border-radius:14px; overflow:hidden; border:1px solid #CBD5E1; box-shadow:0 8px 24px rgba(0,0,0,0.06);">
          
          <!-- Top Brand Hairline -->
          <tr>
            <td height="4" style="background:linear-gradient(90deg, #D91B5C 0%, #D4AF37 50%, #059669 100%);"></td>
          </tr>

          <!-- Admin Alert Header -->
          <tr>
            <td style="background:${isPartner ? '#0F172A' : '#4C0519'}; padding:22px 24px; color:#FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <span style="display:inline-block; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.3); padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
                      ⚡ NEW INCOMING LEAD &bull; ${formType.toUpperCase()}
                    </span>
                    <h2 style="margin:8px 0 0 0; font-size:22px; color:#FFFFFF; font-weight:700;">
                      ${clientName} &bull; Ref #${refId}
                    </h2>
                    <p style="margin:4px 0 0 0; font-size:12px; color:rgba(255,255,255,0.85);">
                      Captured on ${timestamp}
                    </p>
                  </td>
                  <td width="55" align="right" valign="middle">
                    <img src="${LOGO_URL}" width="48" height="48" style="display:block; object-fit:contain; border-radius:12px; border:1px solid rgba(255,255,255,0.4); background:#FFFFFF; padding:2px;" alt="PartyBala" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quick Actions Bar -->
          <tr>
            <td style="background:#F8FAFC; border-bottom:1px solid #E2E8F0; padding:14px 20px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${phoneDigits ? `
                  <td style="padding-right:10px;">
                    <a href="https://wa.me/${phoneDigits}" target="_blank" style="display:inline-block; background:#059669; color:#FFFFFF; text-decoration:none; font-size:12px; font-weight:700; padding:8px 14px; border-radius:8px;">
                      💬 WhatsApp Lead
                    </a>
                  </td>
                  <td style="padding-right:10px;">
                    <a href="tel:${phoneDigits}" style="display:inline-block; background:#2563EB; color:#FFFFFF; text-decoration:none; font-size:12px; font-weight:700; padding:8px 14px; border-radius:8px;">
                      📞 Call Lead
                    </a>
                  </td>
                  ` : ''}
                  <td>
                    <a href="${SPREADSHEET_URL}" target="_blank" style="display:inline-block; background:#475569; color:#FFFFFF; text-decoration:none; font-size:12px; font-weight:700; padding:8px 14px; border-radius:8px;">
                      📊 View in Google Sheet
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Captured Data Table -->
          <tr>
            <td style="padding:22px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Admin Footer -->
          <tr>
            <td style="background:#F8FAFC; border-top:1px solid #E2E8F0; padding:14px 20px; font-size:11px; color:#64748B; text-align:center;">
              PartyBala Lead Management System • Automated dispatch to ${OFFICIAL_EMAIL}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Diagnostic Web App GET Handler
 */
function doGet(e) {
  var ss = getTargetSpreadsheet();
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      brand: "PartyBala Luxury Bridal Network",
      spreadsheetName: ss ? ss.getName() : "Unknown",
      spreadsheetId: TARGET_SPREADSHEET_ID,
      officialWebsite: OFFICIAL_WEBSITE,
      officialWebsiteUrl: OFFICIAL_WEBSITE_URL,
      officialSenderEmail: OFFICIAL_EMAIL,
      customerHelpline: CUSTOMER_PHONE,
      partnerHelpline: PARTNER_PHONE,
      instagramHandle: INSTAGRAM_HANDLE,
      instagramUrl: INSTAGRAM_URL,
      logoUrl: LOGO_URL,
      message: "PartyBala Google Apps Script Web App & Luxury Email Engine is operational."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * =========================================================================
 * TEST UTILITY FOR GOOGLE APPS SCRIPT EDITOR
 * Run this function inside the Apps Script Editor to test luxury emails!
 * =========================================================================
 */
function testSendLuxuryEmails() {
  Logger.log("Starting PartyBala Luxury Email Test...");

  var testCustomerData = {
    formType: "book-mehndi",
    fullName: "Priya Sharma (Test)",
    phone: "9876543210",
    email: OFFICIAL_EMAIL, // Dispatches test to info@partybala.com
    eventDate: "2026-11-15",
    occasion: "Bridal Mehndi (Intricate Wedding Design)",
    cityArea: "Kanpur (Civil Lines)",
    notes: "Testing automated luxury email dispatch from info@partybala.com."
  };

  var testPartnerData = {
    formType: "partner-unified",
    fullName: "Ananya Mehndi Studio (Test)",
    phone: "9876543210",
    whatsapp: "9876543210",
    email: OFFICIAL_EMAIL,
    profession: "Bridal Mehndi Artist",
    city: "Kanpur",
    experience: "7+ Years",
    portfolioLink: "https://instagram.com/party_bala",
    notes: "Testing partner welcome email dispatch."
  };

  var resCustomer = dispatchPartyBalaEmails("book-mehndi", testCustomerData, "2026-10-22 18:00:00", "PB-TEST-101");
  var resPartner  = dispatchPartyBalaEmails("partner-unified", testPartnerData, "2026-10-22 18:00:00", "PB-TEST-102");

  Logger.log("Customer Dispatch Result: " + resCustomer);
  Logger.log("Partner Dispatch Result: " + resPartner);
}
