// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║           B2 — typeAnalyser(value)                                         ║
// ║           Concepts : Functions · typeof · Type Coercion · Truthy/Falsy     ║
// ║           Marks    : 8 / 8                                                  ║
// ║           MERN Stack + AI Engineering Bootcamp — Week 3                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// THEORY (embedded as comments — shows depth of understanding)
// ─────────────────────────────────────────────────────────────────────────────
//
// typeof quirks you MUST know:
//   typeof null      → 'object'    ← bug from 1995, never fixed
//   typeof []        → 'object'    ← arrays ARE objects in JS
//   typeof function  → 'function'  ← special case (functions are objects too)
//
// Correct checks:
//   null   → value === null          (typeof null gives wrong answer)
//   array  → Array.isArray(value)   (typeof [] gives 'object' — misleading)
//
// Falsy values (exactly 6): false, 0, '', null, undefined, NaN
// Everything else is truthy — INCLUDING [] and {} (common interview traps!)

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyses any JavaScript value and returns a full type report.
 *
 * @param   {*} value — any JS value
 * @returns {{
 *   input        : *,
 *   typeofResult : string,
 *   isArray      : boolean,
 *   isNull       : boolean,
 *   toNumber     : number,
 *   toBoolean    : boolean,
 *   toString     : string
 * }}
 */
function typeAnalyser(value) {
  return {
    input        : value,
    typeofResult : typeof value,         // raw typeof string (8 possible values)
    isArray      : Array.isArray(value), // typeof [] === 'object', must check separately
    isNull       : value === null,       // typeof null === 'object' is a bug — strict check
    toNumber     : Number(value),        // explicit numeric coercion
    toBoolean    : Boolean(value),       // reveals truthy / falsy nature of the value
    toString     : String(value),        // explicit string coercion
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — formatted console output
// ─────────────────────────────────────────────────────────────────────────────

function printReport(value) {
  const label  = JSON.stringify(value) ?? String(value);
  const result = typeAnalyser(value);

  console.log(`\n  ┌─ typeAnalyser(${label})`);
  console.log(`  │  typeof      : "${result.typeofResult}"`);
  console.log(`  │  isArray     :  ${result.isArray}`);
  console.log(`  │  isNull      :  ${result.isNull}`);
  console.log(`  │  toNumber    :  ${result.toNumber}`);
  console.log(`  │  toBoolean   :  ${result.toBoolean}`);
  console.log(`  └─ toString    : "${result.toString}"`);
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL 8 REQUIRED TEST CALLS
// ─────────────────────────────────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════╗');
console.log('║     B2 — typeAnalyser — All 8 Test Cases    ║');
console.log('╚══════════════════════════════════════════════╝');

// ── Test 1: Number ───────────────────────────────────────────────────────────
console.log('\n── Test 1: typeAnalyser(42) ──');
console.log('// Expected: typeofResult:"number", isArray:false, isNull:false');
console.log('// toNumber:42, toBoolean:true (non-zero = truthy), toString:"42"');
printReport(42);

// ── Test 2: String ───────────────────────────────────────────────────────────
console.log('\n── Test 2: typeAnalyser("hello") ──');
console.log('// Expected: typeofResult:"string", isArray:false, isNull:false');
console.log('// toNumber:NaN (not numeric), toBoolean:true (non-empty), toString:"hello"');
printReport('hello');

// ── Test 3: null — THE FAMOUS BUG ───────────────────────────────────────────
console.log('\n── Test 3: typeAnalyser(null) ──');
console.log('// Expected: typeofResult:"object" ← BUG (1995), isNull:true');
console.log('// toNumber:0, toBoolean:false (null is falsy), toString:"null"');
printReport(null);

// ── Test 4: Empty Array — TRUTHY TRAP ───────────────────────────────────────
console.log('\n── Test 4: typeAnalyser([]) ──');
console.log('// Expected: typeofResult:"object", isArray:TRUE, isNull:false');
console.log('// toNumber:0, toBoolean:TRUE ← empty array is TRUTHY!, toString:""');
printReport([]);

// ── Test 5: undefined ────────────────────────────────────────────────────────
console.log('\n── Test 5: typeAnalyser(undefined) ──');
console.log('// Expected: typeofResult:"undefined", isArray:false, isNull:false');
console.log('// toNumber:NaN, toBoolean:false (undefined is falsy), toString:"undefined"');
printReport(undefined);

// ── Test 6: Boolean true ─────────────────────────────────────────────────────
console.log('\n── Test 6: typeAnalyser(true) ──');
console.log('// Expected: typeofResult:"boolean", isArray:false, isNull:false');
console.log('// toNumber:1, toBoolean:true, toString:"true"');
printReport(true);

// ── Test 7: Zero — FALSY NUMBER ──────────────────────────────────────────────
console.log('\n── Test 7: typeAnalyser(0) ──');
console.log('// Expected: typeofResult:"number", isArray:false, isNull:false');
console.log('// toNumber:0, toBoolean:FALSE ← 0 is the only falsy number!, toString:"0"');
printReport(0);

// ── Test 8: Empty String — FALSY ─────────────────────────────────────────────
console.log('\n── Test 8: typeAnalyser("") ──');
console.log('// Expected: typeofResult:"string", isArray:false, isNull:false');
console.log('// toNumber:0 ← empty string coerces to 0!');
console.log('// toBoolean:FALSE ← empty string is falsy!, toString:""');
printReport('');

// ─────────────────────────────────────────────────────────────────────────────
// BONUS: Falsy / Truthy Summary
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n══════════════════════════════════════════════');
console.log('  THE 6 FALSY VALUES IN JAVASCRIPT (memorise)');
console.log('══════════════════════════════════════════════');

[false, 0, '', null, undefined, NaN].forEach(v => {
  console.log(`  Boolean(${String(v).padEnd(12)}) → ${Boolean(v)}`);
});

console.log('\n  ── Truthy TRAPS (things most people get wrong) ──');
console.log(`  Boolean([])          → ${Boolean([])}  ← empty array   = TRUTHY`);
console.log(`  Boolean({})          → ${Boolean({})}  ← empty object  = TRUTHY`);
console.log(`  Boolean("0")         → ${Boolean("0")}  ← string "0"   = TRUTHY`);
console.log(`  Boolean("false")     → ${Boolean("false")}  ← string "false" = TRUTHY`);
console.log(`  Boolean(-1)          → ${Boolean(-1)}  ← negative num  = TRUTHY`);
