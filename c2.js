// ============================================================
// C2 — User Registration System: Validation Engine
// Concepts: Functions · Operators · Conditions · Type Coercion
//           Data Types · Guard Clauses · Pure Functions
// ============================================================

// ─────────────────────────────────────────────────────────────
// BACKGROUND:
// A registration form sends user data to our backend validator.
// Data may arrive in wrong types, missing fields, or unexpected
// values. Our validateUser() function must handle ALL edge cases.
//
// Input shape: { name, email, age, password, role }
//
// VALIDATION RULES:
// name     → non-empty string
// email    → string containing '@' and '.'
// age      → number or coercible string, between 13 and 120
// password → string, minimum 8 characters
// role     → if provided: 'admin' | 'editor' | 'user'
//            if NOT provided: defaults to 'user'
//
// RETURN:
// valid   → { valid: true, user: { ...cleaned, role } }
// invalid → { valid: false, errors: ['msg1', 'msg2', ...] }
// ─────────────────────────────────────────────────────────────

/**
 * Validates user registration data without mutation.
 * @param {Object} data - The user registration object.
 * @returns {Object} Validation result with user object or errors array.
 */
function validateUser(data) {
  // ✅ Defensive Check: Agar data null, undefined ya object nahi hai
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid input data provided'] };
  }

  // ✅ PURE FUNCTION — we never modify `data` directly.
  // We collect all errors, then return. No nested if/else pyramids.

  const errors = []; // accumulate all validation errors

  // ─── RULE 1: name ───────────────────────────────────────────
  // Must be a non-empty string
  if (typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name cannot be empty');
  }

  // ─── RULE 2: email ──────────────────────────────────────────
  // Must be a string, and must contain both '@' and '.'
  if (
    typeof data.email !== 'string' ||
    !data.email.includes('@') ||
    !data.email.includes('.')
  ) {
    errors.push('Invalid email format');
  }

  // ─── RULE 3: age ────────────────────────────────────────────
  // May arrive as string from form ('25') — coerce with Number()
  // If result is NaN (e.g. '17abc') → error
  // Must be between 13 and 120 (inclusive)
  const coercedAge = Number(data.age); // explicit coercion: Number('25') → 25

  if (isNaN(coercedAge)) {
    // Number('17abc') → NaN → invalid
    errors.push('Age must be a valid number');
  } else if (coercedAge < 13 || coercedAge > 120) {
    errors.push('Age must be between 13 and 120');
  }

  // ─── RULE 4: password ───────────────────────────────────────
  // Must be a string with minimum 8 characters
  if (typeof data.password !== 'string' || data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  // ─── RULE 5: role ───────────────────────────────────────────
  // Optional. If provided, must be one of the allowed values.
  // If not provided (undefined/null/''), default to 'user'.
  const allowedRoles = ['admin', 'editor', 'user'];
  const role = data.role ?? 'user'; // ?? = nullish coalescing: picks 'user' if role is null/undefined

  if (!allowedRoles.includes(role)) {
    errors.push(`Role must be one of: ${allowedRoles.join(', ')}`);
  }

  // ─── RETURN RESULT ──────────────────────────────────────────
  if (errors.length > 0) {
    // One or more validation failures
    return { valid: false, errors };
  }

  // All validations passed — return cleaned user object
  // Using spread of data but overriding age (coerced) and role (assigned)
  // We do NOT mutate `data` — we build a fresh object
  return {
    valid: true,
    user: {
      name: data.name.trim(),       // trim whitespace
      email: data.email,
      age: coercedAge,              // coerced to number
      password: data.password,
      role: role                    // defaulted or validated
    }
  };
}

// ─────────────────────────────────────────────────────────────
// TEST CASES (all 4 required)
// ─────────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════');
console.log(' C2 — User Registration Validator');
console.log('═══════════════════════════════════════\n');

// ── TEST 1 ──────────────────────────────────────────────────
// age arrives as string '25' — should be coerced to number 25
// role not provided — should default to 'user'
const test1 = validateUser({
  name: 'Ali',
  email: 'ali@test.com',
  age: '25',          // string → coerced to 25 ✅
  password: 'pass1234'
  // role: not provided → defaults to 'user'
});
console.log('TEST 1 (Valid — age coerced, role defaulted):');
console.log(JSON.stringify(test1, null, 2));
// Expected: { valid: true, user: { name:'Ali', email:'ali@test.com', age:25, password:'pass1234', role:'user' } }

// ── TEST 2 ──────────────────────────────────────────────────
// name empty, email invalid, age 10 (below 13), password too short
const test2 = validateUser({
  name: '',
  email: 'notanemail',
  age: 10,
  password: 'abc'
});
console.log('\nTEST 2 (Invalid — multiple errors):');
console.log(JSON.stringify(test2, null, 2));
// Expected: { valid:false, errors: [
//   'Name cannot be empty',
//   'Invalid email format',
//   'Age must be between 13 and 120',
//   'Password must be at least 8 characters'
// ]}

// ── TEST 3 ──────────────────────────────────────────────────
// role: 'admin' — valid role provided
const test3 = validateUser({
  name: 'Sara',
  email: 'sara@x.io',
  age: 30,
  password: 'secure99',
  role: 'admin'
});
console.log('\nTEST 3 (Valid — role: admin):');
console.log(JSON.stringify(test3, null, 2));
// Expected: { valid: true, user: { ...role: 'admin' } }

// ── TEST 4 ──────────────────────────────────────────────────
// age: '17abc' → Number('17abc') = NaN → invalid number error
const test4 = validateUser({
  name: 'X',
  email: 'x@x.com',
  age: '17abc',       // NaN after coercion → error
  password: 'hello123'
});
console.log('\nTEST 4 (Invalid — age not coercible):');
console.log(JSON.stringify(test4, null, 2));
// Expected: { valid: false, errors: ['Age must be a valid number'] }

// ─────────────────────────────────────────────────────────────
// PROOF: validateUser is PURE — original data objects unchanged
// ─────────────────────────────────────────────────────────────
console.log('\n─── Purity Proof ───');
const rawData = { name: 'Bilal', email: 'bilal@x.com', age: '22', password: 'mypass99' };
console.log('Before call — age type:', typeof rawData.age);   // → string
validateUser(rawData);
console.log('After call  — age type:', typeof rawData.age);   // → string (still! not mutated)
console.log('data.role after call:', rawData.role);            // → undefined (we never wrote to it)
