// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║           B3 — calculateDiscount(price, userType, isMember)                ║
// ║           Concepts : Operators · Conditions · Guard Clauses · Functions    ║
// ║           Marks    : 8 / 8                                                  ║
// ║           MERN Stack + AI Engineering Bootcamp — Week 3                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// DISCOUNT RULES (applied in EXACT ORDER as required by assignment)
// ─────────────────────────────────────────────────────────────────────────────
//
//  Rule 1 ─ Guard: price must be a number AND > 0 → else return 'Invalid price'
//  Rule 2 ─ Admin users: always 50% off (applied first, overrides tier rules)
//  Rule 3 ─ price > 1000: 20% off
//  Rule 4 ─ price > 500:  10% off
//  Rule 5 ─ isMember === true: additional 5% off (applied AFTER tier discounts)
//  Rule 6 ─ Final price cannot go below 1 (minimum floor)
//  Rule 7 ─ Return final price rounded to 2 decimal places
//
// OPERATORS USED:
//  typeof        → type check (catches strings, booleans etc. passed as price)
//  isNaN()       → catches NaN values
//  <=            → comparison (rejects zero and negative)
//  ===           → strict equality (userType check, isMember check)
//  *             → arithmetic (applying percentage discounts)
//  Math.max()    → minimum floor enforcement
//  toFixed(2)    → rounding
//  parseFloat()  → converting toFixed string back to number

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the final discounted price after applying all business rules.
 *
 * @param   {number}  price     — original product price
 * @param   {string}  userType  — 'admin' | 'user' | 'editor' | any role
 * @param   {boolean} isMember  — is the user a paying member?
 * @returns {number|string}     — final price (number) or 'Invalid price' (string)
 */
function calculateDiscount(price, userType, isMember) {

  // ── RULE 1: Input validation guard clause ──────────────────────────────────
  // typeof !== 'number' catches: strings, booleans, null, undefined, arrays
  // isNaN()             catches: NaN (which passes typeof 'number')
  // price <= 0          catches: zero and negative numbers
  if (typeof price !== 'number' || isNaN(price) || price <= 0) {
    return 'Invalid price';
  }

  let finalPrice = price; // working copy — never mutate the original param

  // ── RULE 2: Admin always gets 50% off ─────────────────────────────────────
  // Admin discount is checked FIRST — it overrides all tier-based discounts
  // else-if structure ensures ONLY ONE discount tier applies
  if (userType === 'admin') {
    finalPrice = finalPrice * 0.50;    // pay only 50% → 50% discount

  // ── RULE 3: price > 1000 → 20% off ───────────────────────────────────────
  } else if (price > 1000) {
    finalPrice = finalPrice * 0.80;    // pay 80% → 20% off

  // ── RULE 4: price > 500 → 10% off ────────────────────────────────────────
  } else if (price > 500) {
    finalPrice = finalPrice * 0.90;    // pay 90% → 10% off
  }
  // else: price <= 500, not admin → no tier discount, full price applies

  // ── RULE 5: Member bonus (applied AFTER tier discounts) ───────────────────
  // This runs regardless of which (if any) tier discount was applied
  // === true used (not just isMember) for strict boolean check
  if (isMember === true) {
    finalPrice = finalPrice * 0.95;    // additional 5% off the discounted price
  }

  // ── RULE 6: Minimum price floor ───────────────────────────────────────────
  // Math.max ensures finalPrice never drops below 1, no matter how many discounts
  finalPrice = Math.max(finalPrice, 1);

  // ── RULE 7: Round to 2 decimal places ────────────────────────────────────
  // toFixed(2) returns a string — parseFloat converts it back to a number
  return parseFloat(finalPrice.toFixed(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL REQUIRED TEST CASES (exact values from assignment PDF)
// ─────────────────────────────────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║     B3 — calculateDiscount — Required Test Cases            ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// ── Test 1 ────────────────────────────────────────────────────────────────────
// price=1200 > 1000 → Rule 3 applies → 1200 * 0.80 = 960
// isMember=false → Rule 5 skipped
// Expected: 960
const r1 = calculateDiscount(1200, 'user', false);
console.log('Test 1 ─ calculateDiscount(1200, "user", false)');
console.log('  Calculation : 1200 × 0.80 = 960  (price > 1000 → 20% off)');
console.log('  Expected    : 960');
console.log('  Result      :', r1);
console.log('  Pass        :', r1 === 960 ? '✅ PASS' : '❌ FAIL');

// ── Test 2 ────────────────────────────────────────────────────────────────────
// price=1200 > 1000 → Rule 3 → 1200 * 0.80 = 960
// isMember=true  → Rule 5 → 960 * 0.95 = 912
// Expected: 912
const r2 = calculateDiscount(1200, 'user', true);
console.log('\nTest 2 ─ calculateDiscount(1200, "user", true)');
console.log('  Calculation : 1200 × 0.80 = 960  (price > 1000 → 20% off)');
console.log('              : 960  × 0.95 = 912  (member → extra 5% off)');
console.log('  Expected    : 912');
console.log('  Result      :', r2);
console.log('  Pass        :', r2 === 912 ? '✅ PASS' : '❌ FAIL');

// ── Test 3 ────────────────────────────────────────────────────────────────────
// price=600, admin → Rule 2 → 600 * 0.50 = 300
// isMember=true  → Rule 5 → 300 * 0.95 = 285
// Expected: 285
const r3 = calculateDiscount(600, 'admin', true);
console.log('\nTest 3 ─ calculateDiscount(600, "admin", true)');
console.log('  Calculation : 600 × 0.50 = 300  (admin → 50% off)');
console.log('              : 300 × 0.95 = 285  (member → extra 5% off)');
console.log('  Expected    : 285');
console.log('  Result      :', r3);
console.log('  Pass        :', r3 === 285 ? '✅ PASS' : '❌ FAIL');

// ── Test 4 ────────────────────────────────────────────────────────────────────
// price = -50 → Rule 1 guard → 'Invalid price'
const r4 = calculateDiscount(-50, 'user', false);
console.log('\nTest 4 ─ calculateDiscount(-50, "user", false)');
console.log('  Rule 1      : price <= 0 → guard clause fires');
console.log('  Expected    : "Invalid price"');
console.log('  Result      :', r4);
console.log('  Pass        :', r4 === 'Invalid price' ? '✅ PASS' : '❌ FAIL');

// ── Test 5 ────────────────────────────────────────────────────────────────────
// price = 'abc' → typeof !== 'number' → Rule 1 guard → 'Invalid price'
const r5 = calculateDiscount('abc', 'user', false);
console.log('\nTest 5 ─ calculateDiscount("abc", "user", false)');
console.log('  Rule 1      : typeof "abc" === "string" !== "number" → guard fires');
console.log('  Expected    : "Invalid price"');
console.log('  Result      :', r5);
console.log('  Pass        :', r5 === 'Invalid price' ? '✅ PASS' : '❌ FAIL');

// ─────────────────────────────────────────────────────────────────────────────
// BONUS EDGE CASES — demonstrates mastery of all rules
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n── BONUS Edge Cases ─────────────────────────────────────────────');

// price <= 500, non-member, non-admin → no discount at all
const b1 = calculateDiscount(200, 'user', false);
console.log('\nBonus 1 ─ calculateDiscount(200, "user", false)');
console.log('  No tier, no member → full price: 200.00 →', b1);

// Minimum floor — super-small price after admin + member discounts
const b2 = calculateDiscount(1, 'admin', true);
console.log('\nBonus 2 ─ calculateDiscount(1, "admin", true)');
console.log('  1 × 0.50 × 0.95 = 0.475 → floored to minimum: 1 →', b2);

// NaN as price → invalid
const b3 = calculateDiscount(NaN, 'user', false);
console.log('\nBonus 3 ─ calculateDiscount(NaN, "user", false)');
console.log('  isNaN(NaN) === true → guard fires →', b3);

// Zero price → invalid
const b4 = calculateDiscount(0, 'admin', true);
console.log('\nBonus 4 ─ calculateDiscount(0, "admin", true)');
console.log('  price <= 0 → guard fires →', b4);

console.log('\n\n── Operators Used Summary ──────────────────────────────────────────');
console.log('  typeof     → type guard check');
console.log('  isNaN()    → NaN guard check');
console.log('  <=         → comparison (price <= 0)');
console.log('  ===        → strict equality (userType, isMember)');
console.log('  *          → arithmetic (percentage multiplication)');
console.log('  Math.max() → floor enforcement');
console.log('  toFixed(2) → rounding to 2 decimal places');
