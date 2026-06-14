// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║           B1 — Predict Output + Fix Bugs                                   ║
// ║           Concepts : var / let / const · Hoisting · TDZ · Immutability     ║
// ║           Marks    : 7 / 7                                                  ║
// ║           MERN Stack + AI Engineering Bootcamp — Week 3                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 ▸ ORIGINAL CODE — Predict Every Line + Explain WHY
// ─────────────────────────────────────────────────────────────────────────────
//
// Before a single line runs, the JS engine does a "compilation pass" and HOISTS
// all declarations. Here is what the engine sees internally:
//
//   var a;          ← hoisted, value set to undefined immediately
//   let b;          ← hoisted, but NOT initialised → lands in TDZ
//   const c;        ← hoisted, but NOT initialised → lands in TDZ
//   ... rest of code runs line by line ...

// ── Part 1: Predict and Explain ──────────────────────────────────────────────

console.log(a); // OUTPUT ➜ undefined
                //
                // WHY: var is hoisted to the TOP of its function/global scope
                //      AND auto-initialised to `undefined` before any code runs.
                //      So when this line executes, `a` already exists in memory
                //      with the value `undefined` — not an error, just undefined.

// console.log(b); // OUTPUT ➜ ReferenceError: Cannot access 'b' before initialization
                //
                // WHY: let IS hoisted (the engine knows 'b' exists), but it is
                //      deliberately NOT initialised. This window — from the start
                //      of the scope until the `let b = 20` line — is called the
                //      TEMPORAL DEAD ZONE (TDZ). Any access inside the TDZ throws
                //      a ReferenceError. This is intentional safety by design.
                //
                // ⚡ INTERVIEW TRAP: Many candidates say "let is NOT hoisted."
                //    WRONG. let IS hoisted — it just goes into TDZ, not undefined.
                //    The engine knows it exists but refuses to give you the value.

// console.log(c); // OUTPUT ➜ ReferenceError: Cannot access 'c' before initialization
                //
                // WHY: const behaves exactly like let regarding TDZ.
                //      It is hoisted but stays in TDZ until the declaration line.
                //      Same ReferenceError, same reason.

var   a = 10;   // var assignment — a was already undefined, now becomes 10
let   b = 20;   // TDZ ENDS here — b is now safely accessible
const c = 30;   // TDZ ENDS here — c is now safely accessible

// ── Part 2: Predict Re-declaration Errors ────────────────────────────────────

var  a = 99;    // OUTPUT ➜ No error — a is now 99
                // WHY: var allows re-declaration in the same scope.
                //      The engine treats it as: var a; (already done) + a = 99.
                //      DANGEROUS in real code — easy to accidentally overwrite vars.

// let  b = 88; // OUTPUT ➜ SyntaxError: Identifier 'b' has already been declared
                // WHY: let DOES NOT allow re-declaration in the same scope.
                //      This error fires at PARSE TIME (before any code even runs).
                //      The entire file would be rejected.

// const c = 77; // OUTPUT ➜ SyntaxError: Identifier 'c' has already been declared
                // WHY: const also DOES NOT allow re-declaration.
                //      Same parse-time SyntaxError as let.

// ── Part 3: Predict const Object Behaviour ───────────────────────────────────

const user = { name: 'Asad' };

user.name = 'Ali'; // OUTPUT ➜ ALLOWED ✅  — user.name is now 'Ali'
                   //
                   // WHY: const prevents RE-BINDING the variable (making `user`
                   //      point to a different address in memory).
                   //      It does NOT make the object immutable.
                   //      The `user` variable still holds the same memory address.
                   //      We are just changing a property of the object AT that address.
                   //      Stack: user → 0x7A3F (unchanged)
                   //      Heap:  0x7A3F → { name: 'Ali' }  (property changed — fine)

// user = {};     // OUTPUT ➜ TypeError: Assignment to constant variable
                  //
                  // WHY: This would make `user` point to a brand new object at a
                  //      DIFFERENT memory address (e.g. 0x9C2B). That IS re-binding.
                  //      const explicitly forbids re-binding. TypeError at runtime.

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 ▸ CORRECTED VERSION — clean, professional, bug-free
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n══════════════ CORRECTED VERSION ══════════════\n');

// FIX 1: Always declare before accessing — eliminate TDZ issues
let   playerScore = 0;       // ✅ declared first, accessed after
const MAX_SCORE   = 1000;    // ✅ const for values that never change

console.log('Initial score :', playerScore); // 0 ✅

// FIX 2: Use re-assignment instead of re-declaration
playerScore = 50;            // ✅ re-assigning let — perfectly fine
playerScore = 99;            // ✅ re-assigning again — fine
console.log('Updated score :', playerScore); // 99 ✅

// let playerScore = 200;    // ❌ WRONG — SyntaxError (would re-declare)

// FIX 3: No re-declaring let or const — just reassign (let) or use new variable
const config = { theme: 'dark' };
config.theme = 'light';              // ✅ property mutation — fine with const
console.log('Config theme  :', config.theme); // 'light' ✅

// To replace the object entirely — use a new variable
const newConfig = { ...config, lang: 'en' }; // ✅ spread into new const
console.log('New config    :', newConfig);    // { theme: 'light', lang: 'en' } ✅

// FIX 4: const object — mutate properties, never rebind
const currentUser  = { name: 'Asad', role: 'student' };
currentUser.name   = 'Ali';          // ✅ allowed — property change
currentUser.role   = 'admin';        // ✅ allowed — property change
console.log('User mutated  :', currentUser); // { name: 'Ali', role: 'admin' } ✅
// currentUser = {};                  // ❌ would throw TypeError — don't do this

// FIX 5: var vs let in a loop — why let wins
console.log('\n── var vs let scope in loop ──');
for (var  vi = 0; vi < 3; vi++) {}
console.log('var  i after loop:', vi); // 3 — LEAKS out of block (var is function-scoped)

for (let li = 0; li < 3; li++) {}
// console.log(li);                   // ❌ ReferenceError — let is block-scoped ✅
console.log('let  i after loop: block-scoped, not accessible ✅');

console.log('\n── Summary Table ──');
console.log('┌─────────────┬─────────────────┬─────────────────┬──────────────┐');
console.log('│             │  Scope          │  Hoisting       │  Re-declare  │');
console.log('├─────────────┼─────────────────┼─────────────────┼──────────────┤');
console.log('│  var        │  Function       │  undefined      │  ✅ Allowed  │');
console.log('│  let        │  Block  {}      │  TDZ Error      │  ❌ Error    │');
console.log('│  const      │  Block  {}      │  TDZ Error      │  ❌ Error    │');
console.log('└─────────────┴─────────────────┴─────────────────┴──────────────┘');
