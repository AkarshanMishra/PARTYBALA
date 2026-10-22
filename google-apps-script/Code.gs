/**
 * =========================================================================
 * PARTYBALA - GOOGLE APPS SCRIPT WEB APP INTEGRATION
 * TARGET SPREADSHEET: https://docs.google.com/spreadsheets/d/1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM
 * SPREADSHEET ID: 1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM
 * CONTACTS:
 * - Customer WhatsApp: +91 89330 23302
 * - Partner WhatsApp:  +91 89330 73307
 * - Official Email:    info@partybala.com
 * =========================================================================
 * FEATURES:
 * 1. Automatically appends leads into 4 separate tabs in your Google Sheet.
 * 2. Automatically sends a luxury HTML Thank You Email from info@partybala.com to the Customer/Partner.
 * 3. Automatically sends an Admin Notification Email to info@partybala.com for every new inquiry.
 * =========================================================================
 */

var TARGET_SPREADSHEET_ID = "1QwN0r1V8TsVY5rvDsswwQnBB7Tuj9U-NMuhpqx_S9rM";
var OFFICIAL_EMAIL = "info@partybala.com";
var CUSTOMER_PHONE = "+91 89330 23302";
var PARTNER_PHONE  = "+91 89330 73307";

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
    var sheetName = "";
    var headers = [];
    var rowData = [];
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd HH:mm:ss");

    // Route to appropriate sheet based on formType
    switch (formType) {
      case "book-mehndi":
        sheetName = "Mehndi_Bookings";
        headers = [
          "Timestamp", "Status", "Full Name", "Phone / WhatsApp", "Email",
          "Event Date", "Event Time", "City & Area", "Venue Address",
          "Occasion / Event Type", "Mehndi Style Preference", "Coverage Level",
          "Total Guests for Mehndi", "Special Requests / Notes"
        ];
        rowData = [
          timestamp, "New Lead", data.fullName || "", data.phone || "", data.email || "",
          data.eventDate || "", data.eventTime || "", data.cityArea || "Kanpur", data.venueAddress || "",
          data.occasion || "", data.stylePreference || "", data.coverageLevel || "",
          data.guestCount || "", data.notes || ""
        ];
        break;

      case "book-makeup":
        sheetName = "Makeup_Bookings";
        headers = [
          "Timestamp", "Status", "Full Name", "Phone / WhatsApp", "Email",
          "Event Date", "Event Time", "Service Location", "City & Area", "Venue Address",
          "Makeup Service Type", "Makeup Look Preference", "Number of People",
          "Include Hair & Saree/Lehenga Draping?", "Special Requests / Notes"
        ];
        rowData = [
          timestamp, "New Lead", data.fullName || "", data.phone || "", data.email || "",
          data.eventDate || "", data.eventTime || "", data.locationType || "", data.cityArea || "Kanpur",
          data.venueAddress || "", data.serviceType || "", data.makeupStyle || "",
          data.personCount || "", data.hairDraping || "", data.notes || ""
        ];
        break;

      case "customer-review":
        sheetName = "Customer_Reviews";
        headers = [
          "Timestamp", "Status", "Customer Name", "Phone / WhatsApp", "Email (Optional)",
          "Service Experienced", "Star Rating", "Customer Review"
        ];
        rowData = [
          timestamp, "Verified Review", data.fullName || "", data.phone || "", data.email || "Not Provided",
          data.serviceUsed || "Bridal Service", (data.rating || 5) + " / 5 Stars", data.reviewText || ""
        ];
        break;

      case "partner-unified":
        sheetName = "Partner_Registrations";
        headers = [
          "Timestamp", "Status", "Full Name", "Profession", "Mobile Phone",
          "WhatsApp Number", "Email", "City", "Experience", "Service Location",
          "Portfolio / Instagram Link", "Additional Note"
        ];
        rowData = [
          timestamp, "Pending Review", data.fullName || "", data.profession || "",
          data.phone || "", data.whatsapp || "", data.email || "", data.city || "Kanpur",
          data.experience || "", data.serviceLocation || "Kanpur & Nearby", data.portfolioLink || "",
          data.notes || ""
        ];
        break;

      case "partner-mehndi":
        sheetName = "Mehndi_Partners";
        headers = [
          "Timestamp", "Status", "Artist Name", "Brand / Studio Name", "Phone / WhatsApp", "Email",
          "City of Operation", "Areas Covered", "Years of Experience", "Specialty Styles",
          "Team Size", "Willing to Travel for Destination?", "Base Bridal Pricing",
          "Base Guest Pricing", "Portfolio / Instagram Link", "About Artist & Achievements"
        ];
        rowData = [
          timestamp, "Pending Review", data.artistName || "", data.brandName || "",
          data.phone || "", data.email || "", data.city || "", data.areasCovered || "",
          data.experience || "", data.specialties || "", data.teamSize || "",
          data.willingToTravel || "", data.bridalPricing || "", data.guestPricing || "",
          data.portfolioLink || "", data.aboutArtist || ""
        ];
        break;

      case "partner-makeup":
        sheetName = "Makeup_Partners";
        headers = [
          "Timestamp", "Status", "Artist Name", "Brand / Studio Name", "Phone / WhatsApp", "Email",
          "City of Operation", "Areas Covered", "Years of Experience", "Key Services Offered",
          "Cosmetics & Brands Used", "Team Availability", "Willing to Travel for Outstation?",
          "Base Bridal Makeup Starting Price", "Base Party Makeup Starting Price",
          "Portfolio / Instagram Link", "Certifications & Bio"
        ];
        rowData = [
          timestamp, "Pending Review", data.artistName || "", data.brandName || "",
          data.phone || "", data.email || "", data.city || "", data.areasCovered || "",
          data.experience || "", data.servicesOffered || "", data.brandsUsed || "",
          data.teamAvailability || "", data.willingToTravel || "", data.bridalPrice || "",
          data.partyPrice || "", data.portfolioLink || "", data.bio || ""
        ];
        break;

      default:
        sheetName = "General_Inquiries";
        headers = ["Timestamp", "Raw Data"];
        rowData = [timestamp, JSON.stringify(data)];
    }

    // Get or create the worksheet
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#831843");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Append the row data
    sheet.appendRow(rowData);
    var lastRow = sheet.getLastRow();
    var statusCell = sheet.getRange(lastRow, 2);
    if (sheetName.indexOf("Bookings") !== -1) {
      statusCell.setBackground("#fef3c7");
      statusCell.setFontColor("#92400e");
      statusCell.setFontWeight("bold");
    } else {
      statusCell.setBackground("#e0e7ff");
      statusCell.setFontColor("#3730a3");
      statusCell.setFontWeight("bold");
    }

    // Auto-resize first 10 rows
    if (lastRow <= 10) {
      for (var col = 1; col <= headers.length; col++) {
        sheet.autoResizeColumn(col);
      }
    }

    // =========================================================================
    // AUTOMATIC EMAIL NOTIFICATIONS (FROM info@partybala.com)
    // =========================================================================
    try {
      sendAutomatedEmails(formType, data, timestamp);
    } catch (emailErr) {
      Logger.log("Email dispatch note: " + emailErr.toString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Data saved successfully to " + sheetName + " in spreadsheet: " + TARGET_SPREADSHEET_ID,
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
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
 * Sends branded Thank You Note to Customer/Partner and Admin Notification to info@partybala.com
 */
function sendAutomatedEmails(formType, data, timestamp) {
  var isPartner = formType.indexOf("partner") !== -1;
  var recipientEmail = (data.email || "").trim();
  var recipientName = data.fullName || data.artistName || "Valued Guest";
  var serviceTitle = "";
  var subject = "";
  var helpline = isPartner ? PARTNER_PHONE : CUSTOMER_PHONE;

  if (formType === "book-mehndi") {
    serviceTitle = "Bridal / Party Mehndi Artist Booking";
    subject = "Thank You for Your Mehndi Booking Request - PartyBala";
  } else if (formType === "book-makeup") {
    serviceTitle = "Bridal / Party Makeup Artist Booking";
    subject = "Thank You for Your Makeup Artist Booking Request - PartyBala";
  } else if (formType === "partner-unified") {
    serviceTitle = "Artist Partner Application (" + (data.profession || "Mehndi / Makeup Artist") + ")";
    subject = "Thank You for Applying to Partner with PartyBala - Artist Network";
  } else if (formType === "partner-mehndi") {
    serviceTitle = "Mehndi Artist Partner Application";
    subject = "Thank You for Applying to Partner with PartyBala - Mehndi Network";
  } else if (formType === "partner-makeup") {
    serviceTitle = "Makeup Artist Partner Application";
    subject = "Thank You for Applying to Partner with PartyBala - MUA Network";
  } else if (formType === "customer-review") {
    serviceTitle = "Customer Review & Testimonial";
    subject = "Thank You for Reviewing PartyBala";
  }

  // 1. SEND THANK YOU EMAIL TO CLIENT / PARTNER (IF EMAIL PROVIDED)
  if (recipientEmail && recipientEmail.indexOf("@") !== -1) {
    var userHtml = buildThankYouHtml(formType, recipientName, serviceTitle, data, helpline);
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      htmlBody: userHtml,
      name: "PartyBala Concierge",
      replyTo: OFFICIAL_EMAIL
    });
  }

  // 2. SEND ADMIN ALERT TO info@partybala.com
  var adminSubject = "⚡ New Lead: " + serviceTitle + " (" + recipientName + " - " + (data.phone || "") + ")";
  var adminHtml = buildAdminNotificationHtml(formType, data, timestamp);
  MailApp.sendEmail({
    to: OFFICIAL_EMAIL,
    subject: adminSubject,
    htmlBody: adminHtml,
    name: "PartyBala Lead System",
    replyTo: recipientEmail || OFFICIAL_EMAIL
  });
}

/**
 * Luxury HTML Thank You Email Template
 */
function buildThankYouHtml(formType, name, serviceTitle, data, helpline) {
  var isPartner = formType.indexOf("partner") !== -1;
  var introMessage = isPartner
    ? "Thank you for applying to join the <strong>PartyBala Elite Artist Network</strong>. We have received your partner registration profile and our artist onboarding team has begun reviewing your experience and portfolio."
    : "Thank you for choosing <strong>PartyBala</strong> for your special celebration! We have safely recorded your booking inquiry and our dedicated bridal concierge team is now checking artist availability and best package quotes.";

  var nextStepMessage = isPartner
    ? "Our team reviews your portfolio and verification details within <strong>24 business hours</strong>. You will receive a direct WhatsApp message from our Partner Desk to finalize your profile listing."
    : "Our concierge will connect with you directly via WhatsApp at <strong>" + (data.phone || "your number") + "</strong> within a few hours to share certified artist portfolios, availability, and transparent pricing.";

  return `
    <div style="background-color: #faf7f5; padding: 40px 15px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #fecdd3;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #831843 0%, #be123c 100%); padding: 35px 25px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">PartyBala</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #fef08a; text-transform: uppercase; letter-spacing: 2px;">Your Plans, Our Duty</p>
        </div>

        <!-- Body -->
        <div style="padding: 35px 30px;">
          <h2 style="margin-top: 0; font-size: 22px; color: #111827;">Dear ${name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
            ${introMessage}
          </p>

          <!-- Highlight Box -->
          <div style="background-color: #fff1f2; border-left: 4px solid #be123c; border-radius: 8px; padding: 18px 20px; margin: 25px 0;">
            <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; text-transform: uppercase; color: #9f1239;">Inquiry Summary</p>
            <p style="margin: 3px 0; font-size: 14px; color: #374151;"><strong>Service:</strong> ${serviceTitle}</p>
            ${data.eventDate ? `<p style="margin: 3px 0; font-size: 14px; color: #374151;"><strong>Event Date:</strong> ${data.eventDate} (${data.eventTime || 'Flexible'})</p>` : ''}
            ${data.cityArea || data.city ? `<p style="margin: 3px 0; font-size: 14px; color: #374151;"><strong>City / Location:</strong> ${data.cityArea || data.city}</p>` : ''}
            ${data.phone ? `<p style="margin: 3px 0; font-size: 14px; color: #374151;"><strong>Contact Phone:</strong> ${data.phone}</p>` : ''}
          </div>

          <h3 style="font-size: 16px; color: #111827; margin-top: 25px;">What Happens Next?</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
            ${nextStepMessage}
          </p>

          <!-- WhatsApp Connect CTA -->
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="https://wa.me/${helpline.replace(/[^0-9]/g, '')}" 
               style="background-color: #059669; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; padding: 14px 28px; border-radius: 12px; display: inline-block;">
               Chat on WhatsApp (${helpline})
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #fdf2f8; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #fce7f3;">
          <p style="margin: 0 0 4px 0;">PartyBala Luxury Mehndi & Makeup Artist Network</p>
          <p style="margin: 0 0 4px 0;">Official Email: <a href="mailto:${OFFICIAL_EMAIL}" style="color: #be123c; text-decoration: none;">${OFFICIAL_EMAIL}</a> | Helpline: ${helpline}</p>
          <p style="margin: 0; color: #9ca3af;">© PartyBala. Your Plans, Our Duty.</p>
        </div>

      </div>
    </div>
  `;
}

/**
 * Admin Notification Email Template
 */
function buildAdminNotificationHtml(formType, data, timestamp) {
  var rows = "";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      rows += '<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb; font-size: 13px; text-transform: capitalize;">' + key + '</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-size: 13px;">' + data[key] + '</td></tr>';
    }
  }

  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; padding: 20px;">
      <h2 style="color: #831843;">New Lead Received on PartyBala</h2>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
      <p><strong>Form Type:</strong> ${formType}</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 15px;">
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">This lead has also been recorded in your Google Sheet: https://docs.google.com/spreadsheets/d/${TARGET_SPREADSHEET_ID}/edit</p>
    </div>
  `;
}

function doGet(e) {
  var ss = getTargetSpreadsheet();
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      spreadsheetName: ss ? ss.getName() : "Unknown",
      spreadsheetId: TARGET_SPREADSHEET_ID,
      officialEmail: OFFICIAL_EMAIL,
      customerPhone: CUSTOMER_PHONE,
      partnerPhone: PARTNER_PHONE,
      message: "PartyBala Google Apps Script Web App is connected and running."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
