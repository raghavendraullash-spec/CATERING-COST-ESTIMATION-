import assert from 'node:assert';
import {
  sanitizeGuestCount,
  calculateStaffing,
  calculateCateringCost,
  formatCurrency,
  convertAmount,
  generateQuotationId,
} from './calculator.ts';

console.log('Running test suite for Catering Calculator Engine...');

// Test 1: sanitizeGuestCount
assert.strictEqual(sanitizeGuestCount(0), 0);
assert.strictEqual(sanitizeGuestCount(-10), 0);
assert.strictEqual(sanitizeGuestCount(NaN), 0);
assert.strictEqual(sanitizeGuestCount(null), 0);
assert.strictEqual(sanitizeGuestCount(undefined), 0);
assert.strictEqual(sanitizeGuestCount('100'), 100);
assert.strictEqual(sanitizeGuestCount('invalid'), 0);
assert.strictEqual(sanitizeGuestCount(45.7), 45);
console.log('✔ Test 1: sanitizeGuestCount passed');

// Test 2: calculateStaffing 1:20 Ceiling Ratio
const staff0 = calculateStaffing(0);
assert.strictEqual(staff0.serversCount, 0);
assert.strictEqual(staff0.totalStaffCost, 0);

const staff1 = calculateStaffing(1);
assert.strictEqual(staff1.serversCount, 1, '1 guest requires 1 server');

const staff20 = calculateStaffing(20);
assert.strictEqual(staff20.serversCount, 1, '20 guests require 1 server');

const staff21 = calculateStaffing(21);
assert.strictEqual(staff21.serversCount, 2, '21 guests require 2 servers (ceil 21/20 = 2)');

const staff100 = calculateStaffing(100, { eventHours: 5, serverHourlyRate: 25, includeSupervisor: false });
assert.strictEqual(staff100.serversCount, 5, '100 guests require 5 servers');
assert.strictEqual(staff100.serverCost, 5 * 25 * 5, '5 servers * $25/hr * 5 hours = $625');
assert.strictEqual(staff100.totalStaffCost, 625);
console.log('✔ Test 2: calculateStaffing ceiling ratio passed');

// Test 3: Menu Tiers & Service Styles
const costStandard = calculateCateringCost({
  guestCount: 50,
  tierId: 'standard', // $15/guest
  serviceStyleId: 'buffet', // $3/guest
  addonIds: [],
  staffingConfig: { includeSupervisor: false, eventHours: 5, serverHourlyRate: 25 },
});

// Food & Service cost: 50 * $15 = $750; Service style: 50 * $3 = $150
assert.strictEqual(costStandard.menuTotal, 750);
assert.strictEqual(costStandard.serviceStyleTotal, 150);

// Staff: ceil(50/20) = 3 servers * $25 * 5h = $375
assert.strictEqual(costStandard.staffing.serversCount, 3);
assert.strictEqual(costStandard.staffing.serverCost, 375);

// Subtotal: 750 + 150 + 0 + 375 = 1275
assert.strictEqual(costStandard.subtotal, 1275);

// 10% Service Fee: 127.50
assert.strictEqual(costStandard.serviceFee, 127.5);

// 8% Tax: 1275 * 0.08 = 102
assert.strictEqual(costStandard.tax, 102);

// Grand Total: 1275 + 127.5 + 102 = 1504.50
assert.strictEqual(costStandard.grandTotal, 1504.5);

// Deposit: 1504.50 * 0.25 = 376.125
assert.strictEqual(costStandard.depositRequired, 1504.5 * 0.25);
console.log('✔ Test 3: Cost calculations, 8% tax, and service fee passed');

// Test 4: Add-ons (Per-guest vs Flat-rate)
const costWithAddons = calculateCateringCost({
  guestCount: 50,
  tierId: 'premium', // $25/guest
  serviceStyleId: 'plated', // $7/guest
  addonIds: ['beverage_station', 'table_decor'], // beverage: $4/guest, table_decor: $350 flat
  staffingConfig: { includeSupervisor: false, eventHours: 5, serverHourlyRate: 25 },
});

// beverage: 50 * 4 = 200, table_decor = 350 -> addonsTotal = 550
assert.strictEqual(costWithAddons.addonsTotal, 550);
console.log('✔ Test 4: Add-ons per-guest and flat-rate passed');

// Test 5: Currency Formatting
const formattedUSD = formatCurrency(1250.5, 'USD');
assert.ok(formattedUSD.includes('$1,250.50'), 'USD should format with dollar symbol and two decimals');

const formattedINR = formatCurrency(100, 'INR', 83.5);
assert.ok(formattedINR.includes('8,350'), 'INR should format converted amount with rupee symbol');
console.log('✔ Test 5: Currency formatting for USD and INR passed');

// Test 6: Amount conversion and Quotation ID generator
assert.strictEqual(convertAmount(100, 'INR', 83.5), 8350);
assert.strictEqual(convertAmount(100.5, 'USD'), 100.5);
assert.ok(generateQuotationId(5555).includes('QT-2026-5555'));
console.log('✔ Test 6: Amount conversion and Quotation ID generator passed');

console.log('ALL TESTS PASSED SUCCESSFULLY! 🚀');
