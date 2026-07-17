// ═══════════════════════════════════════════════════════════════
// DRAME BROTHERS HOME & YARD — Site Configuration
// config.js
//
// This is the ONLY file you need to edit when:
//   • Pricing changes (base rate, room points, multipliers, add-on prices)
//   • Contact info changes (phone, email)
//   • You redeploy the Apps Script and get a new URL
//
// Changes here automatically update the estimate form and the
// rates reference page. No other files need to be touched.
//
// Load this file before any other scripts on every page.
// ═══════════════════════════════════════════════════════════════

var DB = {

	// ── Apps Script URL ─────────────────────────────────────────
	// Paste your deployed Google Apps Script URL here.
	// When you redeploy and get a new URL, update this line only.
	scriptUrl: 'https://script.google.com/macros/s/AKfycbyUKQ6NpVJyPWRl3WcAWbWhCZiTlk6h1XMHT_aWQYn-sco0WH3I2I5fzpyW8m-rxhyzGg/exec',

	// ── Business Information ─────────────────────────────────────
	business: {
		name: 'Drame Brothers Home & Yard',
		nameLines: ['Drame Brothers', 'Home & Yard'], // for footer layout
		phone: '929-274-2102',
		phoneHref: '9292742102', // digits only for tel: links
		email: 'drame.home.yard@gmail.com',
		location: 'West Philadelphia & surrounding areas'
	},

	// ── Service Types ────────────────────────────────────────────
	// Listed in the order they appear in the dropdown.
	serviceTypes: [
    'First-Time Cleaning (automatically treated as Deep Clean)',
    'One-Time Deep Clean',
    'Weekly Service',
    'Biweekly Service',
    'Monthly Service'
  ],

	// Which service types trigger the deep clean multiplier:
	deepCleanServices: [
    'First-Time Cleaning (automatically treated as Deep Clean)',
    'One-Time Deep Clean'
  ],

	// ── Base Rate ────────────────────────────────────────────────
	// Dollar value per room point. Changing this single number
	// adjusts all quotes proportionally.
	baseRate: 15,

	// ── Room Points ──────────────────────────────────────────────
	// Each room type is worth this many points.
	// Estimated price starts as: (total points × baseRate).
	// Keys must match the input field IDs in home-cleaning.html.
	// To add or remove a room type: update both here AND the
	// room grid HTML in home-cleaning.html.
	roomPoints: {
		bedroom: 1.00,
		full_bathroom: 2.00,
		half_bathroom: 1.00,
		kitchen: 3.00,
		living_room: 2.00,
		dining_room: 1.00,
		basement: 1.50,
		other_room: 1.00,
		closet: 0.25
	},

	// ── Scope Adjustment ─────────────────────────────────────────
	// Whole Home adds this fraction to the base price.
	// 0.10 = 10% surcharge.
	wholeHomeAdj: 0.10,

	// ── Occupancy Adjustments ────────────────────────────────────
	// Fraction added to price based on number of residents.
	// Tiers are evaluated top to bottom; the first match wins.
	occupancyAdj: [
		{ min: 7, max: Infinity, rate: 0.30 }, // 7+ residents:  +30%
		{ min: 5, max: 6, rate: 0.20 }, // 5–6 residents: +20%
		{ min: 3, max: 4, rate: 0.10 } // 3–4 residents: +10%
  ],

	// ── Condition Adjustments ────────────────────────────────────
	// Fraction added or subtracted based on home condition.
	conditionAdj: {
		'Light': -0.10, // -10%
		'Average': 0.00,
		'Heavy': 0.20 // +20%
	},

	// ── Deep Clean Multiplier ────────────────────────────────────
	// Multiplied onto the adjusted price for deep clean visits.
	deepCleanMultiplier: 1.5,

	// ── Recurring Discounts ──────────────────────────────────────
	// Fraction discounted for recurring service types.
	// Applied after the deep clean multiplier.
	recurringDiscounts: {
		'Weekly Service': 0.15, // 15% off
		'Biweekly Service': 0.10, // 10% off
		'Monthly Service': 0.05 //  5% off
	},

	// ── Pet Surcharge ────────────────────────────────────────────
	// Flat dollar amount added when pets are present.
	petFee: 20,

	// ── Add-On Services ──────────────────────────────────────────
	// Each entry renders as a checkbox on the estimate form
	// and a line on the rates page.
	// To add a new add-on: add an entry here, then add
	// a matching line in the submitForm() data object in
	// home-cleaning.html so it appears in the booking email.
	addOns: [
		{ id: 'add_fridge', label: 'Inside refrigerator cleaning', price: 25 },
		{ id: 'add_oven', label: 'Inside oven cleaning', price: 25 },
		{ id: 'add_cabinets', label: 'Inside cabinet cleaning', price: 40 },
		{ id: 'add_dishes', label: 'Dish washing', price: 20 }
  ]

};
