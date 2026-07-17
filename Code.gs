// ═══════════════════════════════════════════════════════════════
// CLEANING BUSINESS — FORM SUBMISSION HANDLER
// Google Apps Script (Code.gs)
//
// What this does:
//   • Receives form submissions from your website
//   • Writes each submission as a new row in your Google Sheet
//   • Sends you an email alert when a client requests a booking
//   • Sends the client a confirmation email when they request a booking
//
// SETUP — the only things you need to change are in the
// CONFIGURATION block below (lines 20–30).
// ═══════════════════════════════════════════════════════════════

// ── CONFIGURATION ───────────────────────────────────────────────
// Fill these in before deploying.

var YOUR_EMAIL        = 'drame.home.yard@gmail.com';        // Your email address for booking alerts
var SPREADSHEET_ID    = '1adRz3yiBg0tJwEKQT-qF1y2DekspuHUvvoUdxe-2aNw'; // See setup guide Step 3 for how to find this
var SHEET_NAME        = 'Form Responses';          // The tab name in your Google Sheet
var BUSINESS_NAME     = 'Drame Brothers Home & Yard';      // Used in confirmation emails
var BUSINESS_PHONE    = '(929) 274-2102';          // Used in confirmation emails
var REPLY_TO_EMAIL    = 'drame.home.yard@gmail.com';         // Clients reply to this address

// ── END CONFIGURATION ────────────────────────────────────────────
// Do not edit below this line unless you know what you're doing.

// Column headers — must match the Form Responses tab in your workbook exactly.
var HEADERS = [
  'Submission Date',
  'Service Type',
  'Cleaning Scope',
  'Bedrooms',
  'Full Bathrooms',
  'Half Bathrooms',
  'Kitchen',
  'Living Room',
  'Dining Room',
  'Basement',
  'Other Room',
  'Closet',
  'Hallway / Stairwell',
  'Number of Residents',
  'Pets',
  'Home Condition',
  'Inside Refrigerator',
  'Inside Oven',
  'Inside Cabinets',
  'Dishes',
  'Estimated Price',
  'Ready to Book',
  'Client Name',
  'Phone',
  'Email',
  'Address',
  'Product Preference',
  'Appt Choice 1 Day',
  'Appt Choice 1 Time',
  'Appt Choice 2 Day',
  'Appt Choice 2 Time',
  'Appt Choice 3 Day',
  'Appt Choice 3 Time',
  'Additional Notes'
];

// ── Main handler — runs on every form submission ──────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.formType === 'feedback') {
      // Route feedback submissions to email only
      sendFeedbackEmail(data);
    } else {
      // Route service estimate/inquiry submissions to the sheet + email
      writeToSheet(data);
      if (data.readyToBook === 'Yes') {
        sendBookingAlert(data);
        if (data.email) sendClientConfirmation(data);
      }
    }
  } catch (err) {
    Logger.log('Error: ' + err.toString());
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Feedback email ────────────────────────────────────
function sendFeedbackEmail(d) {
  var subject = 'New Feedback — ' + (d.satisfaction || 'No rating') +
                (d.clientName ? ' — ' + d.clientName : '');

  var body =
    'New feedback received through dramebrothers.com.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'CLIENT\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Name:    ' + (d.clientName || '—') + '\n' +
    'Contact: ' + (d.contact   || '—') + '\n' +
    'Service: ' + (d.service   || '—') + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'FEEDBACK\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '1. Satisfaction:\n' +
    (d.satisfaction || '(not answered)') + '\n\n' +
    '2. What could we do better?\n' +
    (d.improve || '(not answered)') + '\n\n' +
    '3. What did they particularly appreciate?\n' +
    (d.appreciated || '(not answered)') + '\n\n' +
    '4. Any other notes?\n' +
    (d.notes || '(not answered)') + '\n\n' +
    'Submitted: ' + (d.submissionDate || '—');

  MailApp.sendEmail({
    to:      YOUR_EMAIL,
    subject: subject,
    body:    body
  });
}

// ── Write a row to Google Sheets ──────────────────────────────────
function writeToSheet(d) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  // Create the sheet and header row if it doesn't exist yet
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    // Bold the header row
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Build the row in the same order as HEADERS
  var row = [
    d.submissionDate    || '',
    d.serviceType       || '',
    d.cleaningScope     || '',
    d.bedrooms          || 0,
    d.fullBathrooms     || 0,
    d.halfBathrooms     || 0,
    d.kitchen           || 0,
    d.livingRoom        || 0,
    d.diningRoom        || 0,
    d.basement          || 0,
    d.otherRoom         || 0,
    d.closet            || 0,
    d.hallway           || 0,
    d.residents         || '',
    d.pets              || '',
    d.condition         || '',
    d.addFridge         || 'No',
    d.addOven           || 'No',
    d.addCabinets       || 'No',
    d.addDishes         || 'No',
    d.estimatedPrice    || '',
    d.readyToBook       || 'No',
    d.clientName        || '',
    d.phone             || '',
    d.email             || '',
    d.address           || '',
    d.productPreference || '',
    d.appt1Day          || '',
    d.appt1Time         || '',
    d.appt2Day          || '',
    d.appt2Time         || '',
    d.appt3Day          || '',
    d.appt3Time         || '',
    d.notes             || ''
  ];

  sheet.appendRow(row);
}

// ── Email to you when someone requests a booking ──────────────────
function sendBookingAlert(d) {
  var subject = 'New Booking Request — ' + (d.clientName || 'Unknown') +
                ' — Est. $' + (d.estimatedPrice || '0');

  var svcShort = (d.serviceType || '').split('(')[0].trim();

  var body =
    'A new booking request was submitted through your website.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'CLIENT\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Name:    ' + (d.clientName || '—') + '\n' +
    'Phone:   ' + (d.phone      || '—') + '\n' +
    'Email:   ' + (d.email      || '—') + '\n' +
    'Address: ' + (d.address    || '—') + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'SERVICE\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Service:   ' + svcShort                  + '\n' +
    'Scope:     ' + (d.cleaningScope || '—')  + '\n' +
    'Condition: ' + (d.condition     || '—')  + '\n' +
    'Residents: ' + (d.residents     || '—')  + '\n' +
    'Pets:      ' + (d.pets          || '—')  + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'ROOMS\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Bedrooms:           ' + (d.bedrooms      || 0) + '\n' +
    'Full Bathrooms:     ' + (d.fullBathrooms || 0) + '\n' +
    'Half Bathrooms:     ' + (d.halfBathrooms || 0) + '\n' +
    'Kitchen:            ' + (d.kitchen       || 0) + '\n' +
    'Living Rooms:       ' + (d.livingRoom    || 0) + '\n' +
    'Dining Rooms:       ' + (d.diningRoom    || 0) + '\n' +
    'Basement:           ' + (d.basement      || 0) + '\n' +
    'Other Rooms:        ' + (d.otherRoom     || 0) + '\n' +
    'Closets:            ' + (d.closet        || 0) + '\n' +
    'Hallways/Stairs:    ' + (d.hallway       || 0) + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'ADD-ONS\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Inside Fridge:   ' + (d.addFridge   || 'No') + '\n' +
    'Inside Oven:     ' + (d.addOven     || 'No') + '\n' +
    'Inside Cabinets: ' + (d.addCabinets || 'No') + '\n' +
    'Dishes:          ' + (d.addDishes   || 'No') + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'ESTIMATE & SCHEDULING\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Estimated Price:  $' + (d.estimatedPrice || '0')   + '\n' +
    'Products:         '  + (d.productPreference || '—') + '\n\n' +
    'Appointment Preference 1: ' + (d.appt1Day  || '—') + ' — ' + (d.appt1Time  || '—') + '\n' +
    'Appointment Preference 2: ' + (d.appt2Day  || '—') + ' — ' + (d.appt2Time  || '—') + '\n' +
    'Appointment Preference 3: ' + (d.appt3Day  || '—') + ' — ' + (d.appt3Time  || '—') + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'CLIENT NOTES\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    (d.notes || '(none)') + '\n\n' +
    'Submitted: ' + (d.submissionDate || '—');

  MailApp.sendEmail({
    to:      YOUR_EMAIL,
    subject: subject,
    body:    body
  });
}

// ── Confirmation email to the client ─────────────────────────────
function sendClientConfirmation(d) {
  var svcShort = (d.serviceType || '').split('(')[0].trim();
  var name     = (d.clientName  || 'there').split(' ')[0]; // First name only

  var apptLine = '';
  if (d.appt1Day) apptLine += '\n  • ' + d.appt1Day + (d.appt1Time ? ' — ' + d.appt1Time : '');
  if (d.appt2Day) apptLine += '\n  • ' + d.appt2Day + (d.appt2Time ? ' — ' + d.appt2Time : '');
  if (d.appt3Day) apptLine += '\n  • ' + d.appt3Day + (d.appt3Time ? ' — ' + d.appt3Time : '');

  var body =
    'Hi ' + name + ',\n\n' +
    'Thanks for submitting your booking request — we\'ve received it and will ' +
    'be in touch within 1 business day to confirm your appointment.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'YOUR REQUEST SUMMARY\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Service:         ' + svcShort                 + '\n' +
    'Scope:           ' + (d.cleaningScope || '—') + '\n' +
    'Estimated Price: $' + (d.estimatedPrice || '0') + '\n' +
    (apptLine ? '\nYour preferred appointment times:' + apptLine + '\n' : '') +
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    'Please note: this estimate is based on the information you provided. ' +
    'Final pricing may be adjusted after reviewing your home\'s condition and ' +
    'scope of work. Any changes will be discussed with you before work begins.\n\n' +
    'If you have questions in the meantime, reply to this email or call us at ' +
    BUSINESS_PHONE + '.\n\n' +
    'Talk soon,\n' +
    BUSINESS_NAME;

  MailApp.sendEmail({
    to:      d.email,
    subject: 'Your booking request is confirmed — ' + BUSINESS_NAME,
    body:    body,
    replyTo: REPLY_TO_EMAIL
  });
}

// ── Test function — run this manually to verify the sheet works ───
// In Apps Script editor: select "testSubmission" from the dropdown and click Run.
function testSubmission() {
  var fakeData = {
    submissionDate:    new Date().toLocaleString(),
    serviceType:       'First-Time Cleaning (automatically treated as Deep Clean)',
    cleaningScope:     'Whole Home',
    bedrooms:          3,
    fullBathrooms:     2,
    halfBathrooms:     0,
    kitchen:           1,
    livingRoom:        1,
    diningRoom:        1,
    basement:          0,
    otherRoom:         0,
    closet:            0,
    hallway:           0,
    residents:         2,
    pets:              'No',
    condition:         'Average',
    addFridge:         'No',
    addOven:           'No',
    addCabinets:       'No',
    addDishes:         'No',
    estimatedPrice:    '539.00',
    readyToBook:       'Yes',
    clientName:        'Test Client',
    phone:             '(555) 555-5555',
    email:             YOUR_EMAIL,
    address:           '123 Test Street, Cincinnati, OH 45202',
    productPreference: 'No preference',
    appt1Day:          'Monday',
    appt1Time:         'Morning (8am–12pm)',
    appt2Day:          'Wednesday',
    appt2Time:         'Afternoon (12pm–4pm)',
    appt3Day:          '',
    appt3Time:         '',
    notes:             'This is a test submission.'
  };
  writeToSheet(fakeData);
  Logger.log('Test row written to sheet.');
  // Uncomment the line below to also test the email alerts:
  // sendBookingAlert(fakeData); sendClientConfirmation(fakeData);
}
