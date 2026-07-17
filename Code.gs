// ═══════════════════════════════════════════════════════════════
// DRAME BROTHERS HOME & YARD — Email Handler
// Code.gs (Google Apps Script)
//
// This script receives form submissions from the website
// and sends email notifications. There is no spreadsheet
// involved — everything goes straight to email.
//
// SETUP:
//   1. Fill in YOUR_EMAIL below
//   2. Fill in BUSINESS_NAME and BUSINESS_PHONE
//   3. Deploy as Web App (Execute as: Me, Access: Anyone)
//   4. Paste the Web App URL into config.js on the website
//
// When you change anything here, you must redeploy with
// a New Version for changes to take effect.
// ═══════════════════════════════════════════════════════════════

// ── CONFIGURATION ────────────────────────────────────────────
// The only things you should ever need to change here.

var YOUR_EMAIL     = 'drame.home.yard@gmail.com';
var BUSINESS_NAME  = 'Drame Brothers Home & Yard';
var BUSINESS_PHONE = '929-274-2102';

// ── END CONFIGURATION ────────────────────────────────────────

// Receives all form submissions from the website.
// Routes to the right email handler based on form type.
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.formType === 'feedback') {
      sendFeedbackEmail(data);
    } else {
      sendBookingEmail(data);
    }
  } catch (err) {
    Logger.log('Error in doPost: ' + err.toString());
  }
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Booking request email ────────────────────────────────────
// Sent when a client checks "Ready to book" and submits.
function sendBookingEmail(d) {
  var subject = 'New Booking Request — ' + (d.clientName || 'Unknown') +
                ' — Est. $' + (d.estimatedPrice || '0');

  var addons = [
    d.addFridge   === 'Yes' ? 'Inside refrigerator (+$25)' : null,
    d.addOven     === 'Yes' ? 'Inside oven (+$25)'         : null,
    d.addCabinets === 'Yes' ? 'Inside cabinets (+$40)'     : null,
    d.addDishes   === 'Yes' ? 'Dishes (+$20)'              : null
  ].filter(Boolean).join(', ') || 'None';

  var svcShort = (d.serviceType || '').split('(')[0].trim();

  var body =
    'New booking request from dramebrothers.com\n' +
    'Submitted: ' + (d.submissionDate || '—') + '\n\n' +

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
    'Service:          ' + svcShort                    + '\n' +
    'Scope:            ' + (d.cleaningScope  || '—')   + '\n' +
    'Condition:        ' + (d.condition      || '—')   + '\n' +
    'Residents:        ' + (d.residents      || '—')   + '\n' +
    'Pets:             ' + (d.pets           || '—')   + '\n' +
    'Products:         ' + (d.productPref    || '—')   + '\n' +
    'Add-ons:          ' + addons                      + '\n' +
    'Estimated Price:  $' + (d.estimatedPrice || '0')  + '\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'ROOMS\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Bedrooms:       ' + (d.bedrooms      || 0) + '\n' +
    'Full Bathrooms: ' + (d.fullBathrooms || 0) + '\n' +
    'Half Bathrooms: ' + (d.halfBathrooms || 0) + '\n' +
    'Kitchen:        ' + (d.kitchen       || 0) + '\n' +
    'Living Rooms:   ' + (d.livingRoom    || 0) + '\n' +
    'Dining Rooms:   ' + (d.diningRoom    || 0) + '\n' +
    'Basement:       ' + (d.basement      || 0) + '\n' +
    'Other Rooms:    ' + (d.otherRoom     || 0) + '\n' +
    'Closets:        ' + (d.closet        || 0) + '\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'SCHEDULING\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Preference 1: ' + (d.appt1Day || '—') + (d.appt1Time ? ' — ' + d.appt1Time : '') + '\n' +
    'Preference 2: ' + (d.appt2Day || '—') + (d.appt2Time ? ' — ' + d.appt2Time : '') + '\n' +
    'Preference 3: ' + (d.appt3Day || '—') + (d.appt3Time ? ' — ' + d.appt3Time : '') + '\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'SPECIAL CONSIDERATIONS\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    (d.specialConsiderations || '(none)') + '\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'ADDITIONAL NOTES\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    (d.notes || '(none)');

  MailApp.sendEmail({
    to:      YOUR_EMAIL,
    subject: subject,
    body:    body
  });
}

// ── Feedback email ───────────────────────────────────────────
// Sent when a client submits the feedback form.
function sendFeedbackEmail(d) {
  var subject = 'New Feedback — ' + (d.satisfaction || 'No rating') +
                (d.clientName ? ' — ' + d.clientName : '');

  var body =
    'New feedback from dramebrothers.com/feedback.html\n' +
    'Submitted: ' + (d.submissionDate || '—') + '\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'CLIENT\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Name:    ' + (d.clientName || '—') + '\n' +
    'Email:   ' + (d.contact    || '—') + '\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'FEEDBACK\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '1. Satisfaction:\n'    + (d.satisfaction || '(not answered)') + '\n\n' +
    '2. What could we do better?\n' + (d.improve      || '(not answered)') + '\n\n' +
    '3. What did they appreciate?\n'+ (d.appreciated  || '(not answered)') + '\n\n' +
    '4. Other notes:\n'             + (d.notes        || '(not answered)');

  MailApp.sendEmail({
    to:      YOUR_EMAIL,
    subject: subject,
    body:    body
  });
}

// ── Test functions ───────────────────────────────────────────
// Run these from the Apps Script editor to verify email works.
// Select the function name from the dropdown, then click Run.

function testBookingEmail() {
  sendBookingEmail({
    submissionDate:       new Date().toLocaleString(),
    serviceType:          'First-Time Cleaning (automatically treated as Deep Clean)',
    cleaningScope:        'Whole Home',
    condition:            'Average',
    residents:            2,
    pets:                 'No',
    productPref:          'No preference',
    bedrooms:             2,
    fullBathrooms:        1,
    halfBathrooms:        0,
    kitchen:              1,
    livingRoom:           1,
    diningRoom:           0,
    basement:             0,
    otherRoom:            0,
    closet:               0,
    addFridge:            'No',
    addOven:              'No',
    addCabinets:          'No',
    addDishes:            'No',
    estimatedPrice:       '128.00',
    clientName:           'Test Client',
    phone:                '(555) 555-5555',
    email:                YOUR_EMAIL,
    address:              '123 Test St, Philadelphia PA 19104',
    appt1Day:             'Monday',
    appt1Time:            'Morning (8am–12pm)',
    appt2Day:             '',
    appt2Time:            '',
    appt3Day:             '',
    appt3Time:            '',
    specialConsiderations:'Test — wood floors, scent-free products preferred.',
    notes:                'This is a test submission.'
  });
  Logger.log('testBookingEmail sent.');
}

function testFeedbackEmail() {
  sendFeedbackEmail({
    submissionDate: new Date().toLocaleString(),
    clientName:     'Test Client',
    contact:        YOUR_EMAIL,
    satisfaction:   'Fully satisfied',
    improve:        'Nothing — great job!',
    appreciated:    'Punctuality.',
    notes:          'Test submission.'
  });
  Logger.log('testFeedbackEmail sent.');
}
