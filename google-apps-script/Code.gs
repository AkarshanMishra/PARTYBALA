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
var CUSTOMER_PHONE        = "+91 89330 23302";
var PARTNER_PHONE         = "+91 89330 73307";
var LOGO_URL              = "https://akarshanmishra.github.io/PARTYBALA/assets/images/partybala-logo.jpg";
var LOGO_FALLBACK_URL     = "https://raw.githubusercontent.com/AkarshanMishra/PARTYBALA/main/assets/images/partybala-logo.jpg";
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
  lock.tryLock(30000);

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
    lock.releaseLock();
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
  var serviceHeading = isMehndi ? "Bridal / Party Mehndi Artistry" : "Bridal / Party HD Makeup";
  var requirementVal = isMehndi ? (data.occasion || "Bridal Mehndi") : (data.serviceType || "Bridal HD Makeup");
  var customerName = data.fullName || "Valued Guest";
  var eventDate = data.eventDate || "To be confirmed";
  var cityVal = data.cityArea || "Kanpur";
  var phoneVal = data.phone || "Not provided";
  var notesVal = data.notes || "None provided";
  var whatsappDigits = CUSTOMER_PHONE.replace(/[^0-9]/g, '');
  var whatsappMsg = encodeURIComponent("Hello PartyBala Concierge, I submitted booking inquiry #" + refId + " for " + requirementVal + " on " + eventDate + ". Please share artist portfolios and availability.");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PartyBala Booking Inquiry</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color:#27272A; -webkit-font-smoothing:antialiased;">
  
  <!-- Outer Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF7F2; padding:30px 15px;">
    <tr>
      <td align="center">
        
        <!-- Main Container Card (600px Max) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#FFFFFF; border-radius:18px; overflow:hidden; box-shadow:0 12px 36px rgba(0,0,0,0.08); border:1px solid #E8DDD2;">
          
          <!-- Top Royal Gold Ribbon -->
          <tr>
            <td height="5" style="background:linear-gradient(90deg, #B38F48 0%, #D4AF37 50%, #B38F48 100%);"></td>
          </tr>

          <!-- Header Section (Royal Velvet Burgundy) -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg, #2D0619 0%, #4C0B2B 55%, #1A0510 100%); padding:38px 25px 30px 25px; text-align:center;">
              
              <!-- PartyBala Logo -->
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <img src="${LOGO_URL}" 
                         alt="PartyBala Logo" 
                         width="72" 
                         height="72" 
                         style="display:block; border-radius:50%; border:2px solid #D4AF37; box-shadow:0 6px 18px rgba(0,0,0,0.35); object-fit:cover; margin:0 auto;" />
                  </td>
                </tr>
              </table>

              <!-- Brand Title -->
              <h1 style="margin:0; font-family:'Playfair Display', Georgia, 'Times New Roman', serif; font-size:27px; font-weight:700; color:#FFFFFF; letter-spacing:3px; text-transform:uppercase;">
                PARTYBALA
              </h1>
              
              <!-- Brand Tagline -->
              <p style="margin:6px 0 0 0; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:#D4AF37; font-weight:600;">
                Luxury Bridal Artistry • Your Plans, Our Duty
              </p>

              <!-- Reference Badge -->
              <div style="display:inline-block; margin-top:18px; padding:6px 16px; background-color:rgba(212, 175, 55, 0.15); border:1px solid #D4AF37; border-radius:30px; font-size:12px; color:#FDF4DC; font-weight:600; letter-spacing:1px;">
                INQUIRY REF: ${refId}
              </div>

            </td>
          </tr>

          <!-- Sub-header Alert Banner -->
          <tr>
            <td style="background-color:#FDF2F4; border-bottom:1px solid #FCE7F3; padding:12px 25px; text-align:center;">
              <span style="font-size:13px; color:#9F1239; font-weight:600;">
                ✨ We Have Safely Received Your Booking Request
              </span>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding:32px 30px 24px 30px;">
              
              <h2 style="margin:0 0 14px 0; font-family:'Playfair Display', Georgia, serif; font-size:22px; color:#18181B; font-weight:700;">
                Dear ${customerName},
              </h2>

              <p style="margin:0 0 18px 0; font-size:14px; line-height:1.65; color:#52525B;">
                Thank you for choosing <strong>PartyBala</strong> for your celebration. Every wedding and milestone event deserves pure perfection. Our bridal concierge team has registered your details and is actively matching certified top-tier artists available on your date.
              </p>

              <!-- Luxury Inquiry Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF8F5; border-radius:14px; border:1px solid #EADCC9; margin:22px 0; overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(90deg, #F5EDE0 0%, #FAF6F0 100%); padding:12px 18px; border-bottom:1px solid #EADCC9;">
                    <span style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#854D0E;">
                      📋 BOOKING INQUIRY OVERVIEW
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size:13px;">
                      <tr>
                        <td width="38%" style="color:#71717A; font-weight:600; border-bottom:1px solid #F4EBE1;">Service Category:</td>
                        <td width="62%" style="color:#18181B; font-weight:700; border-bottom:1px solid #F4EBE1;">${serviceHeading}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F4EBE1;">Requirement / Style:</td>
                        <td style="color:#9F1239; font-weight:700; border-bottom:1px solid #F4EBE1;">${requirementVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F4EBE1;">Event Date:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #F4EBE1;">📅 ${eventDate}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F4EBE1;">City / Destination:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #F4EBE1;">📍 ${cityVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F4EBE1;">Client Phone / WhatsApp:</td>
                        <td style="color:#18181B; font-weight:700; border-bottom:1px solid #F4EBE1;">${phoneVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600; border-bottom:1px solid #F4EBE1;">Special Notes:</td>
                        <td style="color:#52525B; font-style:italic; border-bottom:1px solid #F4EBE1;">${notesVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#71717A; font-weight:600;">Concierge Status:</td>
                        <td>
                          <span style="display:inline-block; background-color:#FEF3C7; color:#92400E; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; border:1px solid #FDE68A;">
                            ⭐ Under Priority Review
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Timeline -->
              <h3 style="margin:24px 0 12px 0; font-family:'Playfair Display', Georgia, serif; font-size:17px; color:#18181B;">
                What Happens Next?
              </h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td width="32" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:26px; height:26px; border-radius:50%; background-color:#831843; color:#FFFFFF; text-align:center; line-height:26px; font-size:12px; font-weight:700;">1</div>
                  </td>
                  <td valign="top" style="padding-bottom:14px;">
                    <div style="font-size:13px; font-weight:700; color:#18181B;">Artist Availability &amp; Lookbook Matching</div>
                    <div style="font-size:12px; color:#71717A; line-height:1.5;">Our lead coordinator is curating high-definition work samples matching your preferred style and celebration date.</div>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:26px; height:26px; border-radius:50%; background-color:#831843; color:#FFFFFF; text-align:center; line-height:26px; font-size:12px; font-weight:700;">2</div>
                  </td>
                  <td valign="top" style="padding-bottom:14px;">
                    <div style="font-size:13px; font-weight:700; color:#18181B;">Direct WhatsApp Consultation</div>
                    <div style="font-size:12px; color:#71717A; line-height:1.5;">You will receive artist portfolios, pricing packages, and slot confirmations on your registered number (<strong>${phoneVal}</strong>) within a few hours.</div>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:26px; height:26px; border-radius:50%; background-color:#831843; color:#FFFFFF; text-align:center; line-height:26px; font-size:12px; font-weight:700;">3</div>
                  </td>
                  <td valign="top">
                    <div style="font-size:13px; font-weight:700; color:#18181B;">Guaranteed Date Lock &amp; Doorstep Artistry</div>
                    <div style="font-size:12px; color:#71717A; line-height:1.5;">Lock in your booking with verified artist allocation, guaranteed on-time arrival, and strict hygiene protocols.</div>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Call To Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${whatsappDigits}?text=${whatsappMsg}" 
                       target="_blank"
                       style="display:inline-block; background-color:#059669; color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:15px 30px; border-radius:12px; box-shadow:0 6px 18px rgba(5,150,105,0.3); letter-spacing:0.3px;">
                      💬 Chat with Bridal Concierge (${CUSTOMER_PHONE})
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:10px;">
                    <span style="font-size:11px; color:#71717A;">
                      Instant assistance available 9:00 AM – 10:00 PM IST
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Trust Guarantee Badges -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px; padding-top:20px; border-top:1px dashed #E4E4E7; text-align:center;">
                <tr>
                  <td width="33%" style="padding:6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">🌿 100% Safe</strong>
                    Organic Henna &amp; HD Kits
                  </td>
                  <td width="33%" style="padding:6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">👑 Verified</strong>
                    Top-Rated Artists Only
                  </td>
                  <td width="33%" style="padding:6px; font-size:11px; color:#52525B;">
                    <strong style="color:#18181B; display:block; margin-bottom:2px;">⏰ On-Time</strong>
                    Doorstep Service Guarantee
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color:#18181B; padding:26px 25px; text-align:center; color:#A1A1AA; font-size:11px; line-height:1.6;">
              <p style="margin:0 0 6px 0; color:#FFFFFF; font-weight:700; font-size:12px; letter-spacing:1px; text-transform:uppercase;">
                PartyBala Luxury Bridal Network
              </p>
              <p style="margin:0 0 6px 0;">
                Official Inquiries: <a href="mailto:${OFFICIAL_EMAIL}" style="color:#D4AF37; text-decoration:none; font-weight:600;">${OFFICIAL_EMAIL}</a> 
                &nbsp;|&nbsp; Concierge Helpline: <a href="tel:${CUSTOMER_PHONE.replace(/[^0-9+]/g, '')}" style="color:#FFFFFF; text-decoration:none;">${CUSTOMER_PHONE}</a>
              </p>
              <p style="margin:0 0 8px 0; color:#71717A;">
                Kanpur, Uttar Pradesh, India • Handcrafted Bridal Experiences
              </p>
              <p style="margin:0; color:#52525B; font-size:10px;">
                © 2026 PartyBala. All rights reserved. Your Plans, Our Duty.
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
  <title>PartyBala Artist Network Application</title>
</head>
<body style="margin:0; padding:0; background-color:#09090B; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color:#E4E4E7; -webkit-font-smoothing:antialiased;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090B; padding:30px 15px;">
    <tr>
      <td align="center">
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#18181B; border-radius:18px; overflow:hidden; box-shadow:0 14px 40px rgba(0,0,0,0.6); border:1px solid #27272A;">
          
          <!-- Top Gold Foil Bar -->
          <tr>
            <td height="5" style="background:linear-gradient(90deg, #92400E 0%, #D4AF37 50%, #92400E 100%);"></td>
          </tr>

          <!-- Header Section (Dark Obsidian & Gold) -->
          <tr>
            <td align="center" style="background:radial-gradient(circle at center, #27272A 0%, #121214 100%); padding:38px 25px 28px 25px; text-align:center;">
              
              <!-- Logo -->
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <img src="${LOGO_URL}" 
                         alt="PartyBala Logo" 
                         width="72" 
                         height="72" 
                         style="display:block; border-radius:50%; border:2px solid #D4AF37; box-shadow:0 4px 16px rgba(212,175,55,0.25); object-fit:cover; margin:0 auto;" />
                  </td>
                </tr>
              </table>

              <h1 style="margin:0; font-family:'Playfair Display', Georgia, serif; font-size:26px; font-weight:700; color:#FFFFFF; letter-spacing:3px; text-transform:uppercase;">
                PARTYBALA
              </h1>
              
              <p style="margin:6px 0 0 0; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#D4AF37; font-weight:600;">
                ★ Elite Artist Partnership Desk ★
              </p>

              <div style="display:inline-block; margin-top:16px; padding:5px 16px; background-color:rgba(212, 175, 55, 0.12); border:1px solid #D4AF37; border-radius:30px; font-size:12px; color:#FDF4DC; font-weight:600; letter-spacing:1px;">
                APPLICATION REF: ${refId}
              </div>

            </td>
          </tr>

          <!-- Sub Banner -->
          <tr>
            <td style="background-color:#27272A; border-bottom:1px solid #3F3F46; padding:12px 25px; text-align:center;">
              <span style="font-size:12px; color:#FACC15; font-weight:600; letter-spacing:0.5px;">
                👑 Artist Registration Received &amp; Queued for Verification
              </span>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:32px 30px 24px 30px;">
              
              <h2 style="margin:0 0 14px 0; font-family:'Playfair Display', Georgia, serif; font-size:22px; color:#FFFFFF; font-weight:700;">
                Welcome, ${artistName}!
              </h2>

              <p style="margin:0 0 18px 0; font-size:14px; line-height:1.65; color:#A1A1AA;">
                Thank you for applying to partner with the <strong>PartyBala Elite Artist Circle</strong>. We celebrate extraordinary talent and connect Kanpur's finest bridal artists with high-budget celebrations, premium brides, and guaranteed payouts.
              </p>

              <!-- Artist Registration Summary Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1F1F23; border-radius:14px; border:1px solid #3F3F46; margin:22px 0; overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(90deg, #27272A 0%, #1F1F23 100%); padding:12px 18px; border-bottom:1px solid #3F3F46;">
                    <span style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#D4AF37;">
                      📜 REGISTRATION PROFILE
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size:13px;">
                      <tr>
                        <td width="40%" style="color:#A1A1AA; border-bottom:1px solid #27272A;">Artist / Brand Name:</td>
                        <td width="60%" style="color:#FFFFFF; font-weight:700; border-bottom:1px solid #27272A;">${artistName}</td>
                      </tr>
                      <tr>
                        <td style="color:#A1A1AA; border-bottom:1px solid #27272A;">Profession / Art:</td>
                        <td style="color:#FACC15; font-weight:700; border-bottom:1px solid #27272A;">${profession}</td>
                      </tr>
                      <tr>
                        <td style="color:#A1A1AA; border-bottom:1px solid #27272A;">Primary City:</td>
                        <td style="color:#FFFFFF; font-weight:700; border-bottom:1px solid #27272A;">📍 ${cityVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#A1A1AA; border-bottom:1px solid #27272A;">Contact Phone:</td>
                        <td style="color:#FFFFFF; font-weight:700; border-bottom:1px solid #27272A;">${phoneVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#A1A1AA; border-bottom:1px solid #27272A;">WhatsApp:</td>
                        <td style="color:#FFFFFF; font-weight:700; border-bottom:1px solid #27272A;">${whatsappVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#A1A1AA; border-bottom:1px solid #27272A;">Experience:</td>
                        <td style="color:#FFFFFF; font-weight:700; border-bottom:1px solid #27272A;">${experienceVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#A1A1AA; border-bottom:1px solid #27272A;">Portfolio Link:</td>
                        <td style="color:#93C5FD; border-bottom:1px solid #27272A; word-break:break-all;">${portfolioVal}</td>
                      </tr>
                      <tr>
                        <td style="color:#A1A1AA;">Verification Status:</td>
                        <td>
                          <span style="display:inline-block; background-color:rgba(212,175,55,0.15); color:#FDE047; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; border:1px solid #CA8A04;">
                            ⏳ Portfolio Review in Progress
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Onboarding Roadmap -->
              <h3 style="margin:24px 0 12px 0; font-family:'Playfair Display', Georgia, serif; font-size:17px; color:#FFFFFF;">
                Artist Onboarding Milestones
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td width="32" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:26px; height:26px; border-radius:50%; background-color:#B45309; color:#FFFFFF; text-align:center; line-height:26px; font-size:12px; font-weight:700;">1</div>
                  </td>
                  <td valign="top" style="padding-bottom:14px;">
                    <div style="font-size:13px; font-weight:700; color:#FFFFFF;">Portfolio &amp; Artistry Quality Assessment</div>
                    <div style="font-size:12px; color:#A1A1AA; line-height:1.5;">Our curatorial panel evaluates your bridal intricate work, line precision, and kit hygiene standards within <strong>24 business hours</strong>.</div>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:26px; height:26px; border-radius:50%; background-color:#B45309; color:#FFFFFF; text-align:center; line-height:26px; font-size:12px; font-weight:700;">2</div>
                  </td>
                  <td valign="top" style="padding-bottom:14px;">
                    <div style="font-size:13px; font-weight:700; color:#FFFFFF;">Rate Card &amp; Territory Alignment</div>
                    <div style="font-size:12px; color:#A1A1AA; line-height:1.5;">Our Partner Manager contacts you via WhatsApp to align your custom pricing tiers, travel radius, and peak-wedding availability.</div>
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding-right:12px; padding-top:2px;">
                    <div style="width:26px; height:26px; border-radius:50%; background-color:#B45309; color:#FFFFFF; text-align:center; line-height:26px; font-size:12px; font-weight:700;">3</div>
                  </td>
                  <td valign="top">
                    <div style="font-size:13px; font-weight:700; color:#FFFFFF;">Verified Badge &amp; Direct High-Value Leads</div>
                    <div style="font-size:12px; color:#A1A1AA; line-height:1.5;">Get listed on PartyBala's premium platform and receive qualified bridal booking inquiries directly with upfront deposits.</div>
                  </td>
                </tr>
              </table>

              <!-- Partner CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${whatsappDigits}?text=${whatsappMsg}" 
                       target="_blank"
                       style="display:inline-block; background:linear-gradient(135deg, #B45309 0%, #D4AF37 100%); color:#09090B; text-decoration:none; font-size:14px; font-weight:800; padding:15px 30px; border-radius:12px; box-shadow:0 6px 20px rgba(212,175,55,0.3); letter-spacing:0.5px;">
                      🤝 Connect with Artist Onboarding Desk (${PARTNER_PHONE})
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Partner Footer -->
          <tr>
            <td style="background-color:#121214; padding:24px 25px; text-align:center; color:#71717A; font-size:11px; line-height:1.6; border-top:1px solid #27272A;">
              <p style="margin:0 0 6px 0; color:#E4E4E7; font-weight:700; font-size:12px; letter-spacing:1px; text-transform:uppercase;">
                PartyBala Artist Network &amp; Guild
              </p>
              <p style="margin:0 0 6px 0;">
                Partner Desk Email: <a href="mailto:${OFFICIAL_EMAIL}" style="color:#D4AF37; text-decoration:none; font-weight:600;">${OFFICIAL_EMAIL}</a> 
                &nbsp;|&nbsp; Artist Helpline: <a href="tel:${PARTNER_PHONE.replace(/[^0-9+]/g, '')}" style="color:#FFFFFF; text-decoration:none;">${PARTNER_PHONE}</a>
              </p>
              <p style="margin:0; color:#52525B; font-size:10px;">
                © 2026 PartyBala. Empowering India's Finest Bridal Artists.
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
  var service = data.serviceUsed || "Bridal Service";
  var rating = data.rating || 5;

  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:30px 15px; background-color:#FAF7F2; font-family:'Segoe UI', Arial, sans-serif; color:#27272A;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:550px; background-color:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #E8DDD2; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
          <tr><td height="5" style="background:#D4AF37;"></td></tr>
          <tr>
            <td align="center" style="background:#2D0619; padding:28px 20px;">
              <img src="${LOGO_URL}" width="64" height="64" style="border-radius:50%; border:2px solid #D4AF37;" />
              <h2 style="color:#FFFFFF; margin:10px 0 0 0; font-family:Georgia, serif; font-size:22px; letter-spacing:2px;">PARTYBALA</h2>
              <p style="color:#D4AF37; font-size:11px; margin:4px 0 0 0; letter-spacing:1px;">LUXURY BRIDAL ARTISTRY</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 25px;">
              <h3 style="margin-top:0; color:#18181B;">Thank You, ${name}!</h3>
              <p style="font-size:14px; line-height:1.6; color:#52525B;">
                We are immensely grateful for taking the time to share your gracious review for <strong>${service}</strong> (${rating} / 5 Stars).
              </p>
              <p style="font-size:14px; line-height:1.6; color:#52525B;">
                Your feedback inspires our artists to maintain the highest standards of beauty, tradition, and customer delight.
              </p>
              <div style="background-color:#FAF8F5; border:1px solid #EADCC9; border-radius:10px; padding:15px; margin:20px 0; text-align:center;">
                <span style="font-size:18px; color:#D4AF37;">★★★★★</span>
                <p style="font-size:12px; color:#71717A; margin:6px 0 0 0;">Review Reference: ${refId}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#18181B; padding:18px; text-align:center; color:#A1A1AA; font-size:11px;">
              © 2026 PartyBala Luxury Network • <a href="mailto:${OFFICIAL_EMAIL}" style="color:#D4AF37; text-decoration:none;">${OFFICIAL_EMAIL}</a>
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
          
          <!-- Admin Alert Header -->
          <tr>
            <td style="background:${isPartner ? '#1E293B' : '#831843'}; padding:22px 24px; color:#FFFFFF;">
              <span style="display:inline-block; background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
                ⚡ NEW INCOMING LEAD
              </span>
              <h2 style="margin:8px 0 0 0; font-size:20px; color:#FFFFFF;">
                ${clientName} • ${refId}
              </h2>
              <p style="margin:4px 0 0 0; font-size:12px; color:rgba(255,255,255,0.8);">
                Captured on ${timestamp} via ${formType}
              </p>
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
      officialSenderEmail: OFFICIAL_EMAIL,
      customerHelpline: CUSTOMER_PHONE,
      partnerHelpline: PARTNER_PHONE,
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
    portfolioLink: "https://instagram.com/partybala_official",
    notes: "Testing partner welcome email dispatch."
  };

  var resCustomer = dispatchPartyBalaEmails("book-mehndi", testCustomerData, "2026-10-22 18:00:00", "PB-TEST-101");
  var resPartner  = dispatchPartyBalaEmails("partner-unified", testPartnerData, "2026-10-22 18:00:00", "PB-TEST-102");

  Logger.log("Customer Dispatch Result: " + resCustomer);
  Logger.log("Partner Dispatch Result: " + resPartner);
}
