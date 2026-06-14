// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║           B4 — Find Bugs + Fix: Shallow Copy + Pass by Reference           ║
// ║           Concepts : Shallow/Deep Copy · Pass by Reference · structuredClone║
// ║           Marks    : 8 / 8                                                  ║
// ║           MERN Stack + AI Engineering Bootcamp — Week 3                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// MEMORY MODEL REMINDER (helps understand all 3 bugs)
// ─────────────────────────────────────────────────────────────────────────────
//
//  STACK holds: primitives + object REFERENCES (memory addresses)
//  HEAP  holds: the actual objects and arrays
//
//  When you copy an object with spread { ...obj } or Object.assign():
//   → A NEW object is created in the Heap
//   → BUT nested objects/arrays are NOT cloned — only their ADDRESSES are copied
//   → Both the original and the copy share the SAME nested reference
//   This is called a SHALLOW COPY.
//
//  structuredClone(obj) performs a true DEEP COPY:
//   → Every level of nesting is cloned into new Heap memory
//   → Original and clone are 100% independent

// ══════════════════════════════════════════════════════════════════════════════
// BUG 1 — Cart Duplication Bug (Shallow Copy of Nested Array)
// ══════════════════════════════════════════════════════════════════════════════

console.log('╔══════════════════════════════════════════════╗');
console.log('║   BUG 1 — Cart Duplication (Shallow Copy)   ║');
console.log('╚══════════════════════════════════════════════╝\n');

// ── ORIGINAL BUGGY CODE ──────────────────────────────────────────────────────

const cart1 = { items: ['JS Book', 'React Book'], total: 150 };
const cart2  = { ...cart1 };          // spread = SHALLOW copy

cart2.items.push('Node Book');        // pushes to the SHARED items array

console.log('BUGGY OUTPUT:');
console.log('  cart1.items:', cart1.items);
// ➜ ['JS Book', 'React Book', 'Node Book']  ← cart1 was NOT supposed to change!
console.log('  cart2.items:', cart2.items);
// ➜ ['JS Book', 'React Book', 'Node Book']

// ── WHAT THE BUG IS ──────────────────────────────────────────────────────────
console.log('\nWHAT IS THE BUG:');
console.log('  { ...cart1 } creates a new object BUT only copies the TOP LEVEL.');
console.log('  The "items" array is a reference — only its ADDRESS is copied.');
console.log('  cart1.items and cart2.items both point to the SAME array in Heap.');
console.log('  So pushing to cart2.items mutates the shared array — cart1 is affected.');
console.log('  cart1.items === cart2.items →', cart1.items === cart2.items); // true

// ── WHAT THE WRONG OUTPUT IS ─────────────────────────────────────────────────
console.log('\nWRONG OUTPUT WAS:');
console.log('  cart1.items = ["JS Book", "React Book", "Node Book"] ← should not change');

// ── FIXED CODE ───────────────────────────────────────────────────────────────
console.log('\nFIXED CODE:');

const cart1Fixed = { items: ['JS Book', 'React Book'], total: 150 };

// FIX A — Spread the nested array separately
const cart2FixA = { ...cart1Fixed, items: [...cart1Fixed.items] };
cart2FixA.items.push('Node Book');
console.log('\n  Fix A — spread nested array: { ...cart1, items: [...cart1.items] }');
console.log('  cart1Fixed.items:', cart1Fixed.items); // unchanged ✅
console.log('  cart2FixA.items :', cart2FixA.items);  // has Node Book ✅
console.log('  Same array?      :', cart1Fixed.items === cart2FixA.items); // false ✅

// FIX B — structuredClone (best for deeply nested objects)
const cart2FixB = structuredClone(cart1Fixed);
cart2FixB.items.push('Vue Book');
console.log('\n  Fix B — structuredClone(cart1):');
console.log('  cart1Fixed.items:', cart1Fixed.items); // unchanged ✅
console.log('  cart2FixB.items :', cart2FixB.items);  // has Vue Book ✅

// ══════════════════════════════════════════════════════════════════════════════
// BUG 2 — Function Mutating the Original Object
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n╔═════════════════════════════════════════════════╗');
console.log('║   BUG 2 — Function Mutates Original (Ref Bug)  ║');
console.log('╚═════════════════════════════════════════════════╝\n');

// ── ORIGINAL BUGGY CODE ──────────────────────────────────────────────────────

function applyTax(order) {
  order.total = order.total * 1.17;   // ← mutates the object at the memory address
  return order;
}

const myOrder    = { id: 1, total: 100 };
const taxedOrder = applyTax(myOrder);

console.log('BUGGY OUTPUT:');
console.log('  myOrder.total   :', myOrder.total);    // 117 ← WRONG, original changed!
console.log('  taxedOrder.total:', taxedOrder.total); // 117

// ── WHAT THE BUG IS ──────────────────────────────────────────────────────────
console.log('\nWHAT IS THE BUG:');
console.log('  When myOrder is passed to applyTax(), JS copies its MEMORY ADDRESS.');
console.log('  Inside the function, "order" points to the SAME Heap object as myOrder.');
console.log('  order.total = order.total * 1.17 modifies the actual Heap object.');
console.log('  Both myOrder and taxedOrder reference the same object.');
console.log('  myOrder === taxedOrder →', myOrder === taxedOrder); // true — same object!

// ── WHAT THE WRONG OUTPUT IS ─────────────────────────────────────────────────
console.log('\nWRONG OUTPUT WAS:');
console.log('  myOrder.total = 117 ← should have stayed 100');

// ── FIXED CODE ───────────────────────────────────────────────────────────────
console.log('\nFIXED CODE:');

function applyTaxFixed(order) {
  // Return a BRAND NEW object — never touch the original
  return { ...order, total: parseFloat((order.total * 1.17).toFixed(2)) };
}

const myOrderFixed    = { id: 1, total: 100 };
const taxedOrderFixed = applyTaxFixed(myOrderFixed);

console.log('  myOrderFixed.total   :', myOrderFixed.total);    // 100 ← unchanged ✅
console.log('  taxedOrderFixed.total:', taxedOrderFixed.total); // 117 ✅
console.log('  Same object?         :', myOrderFixed === taxedOrderFixed); // false ✅

// ══════════════════════════════════════════════════════════════════════════════
// BUG 3 — Config Reset That Does Nothing
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n\n╔══════════════════════════════════════════════════════╗');
console.log('║   BUG 3 — Param Rebind + Nested Shallow Copy Bug    ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// ── ORIGINAL BUGGY CODE ──────────────────────────────────────────────────────

const defaultConfig = { theme: 'dark', lang: 'en', nested: { fontSize: 14 } };

function resetConfig(config) {
  config = { ...defaultConfig };      // rebinds LOCAL variable only
  config.nested.fontSize = 14;        // mutates shared nested object!
}

const appConfig = { theme: 'light', lang: 'ur', nested: { fontSize: 20 } };
resetConfig(appConfig);

console.log('BUGGY OUTPUT:');
console.log('  appConfig.theme           :', appConfig.theme);           // 'light' ← NOT reset
console.log('  appConfig.nested.fontSize :', appConfig.nested.fontSize); // 20 ← NOT reset

// ── WHAT THE BUG IS ──────────────────────────────────────────────────────────
console.log('\nWHAT IS THE BUG (two bugs in one function):');
console.log('  BUG A — config = { ...defaultConfig }');
console.log('    JS passed the REFERENCE BY VALUE — "config" is a COPY of the address.');
console.log('    Reassigning "config = ..." only changes the LOCAL variable.');
console.log('    The original appConfig in the caller is completely unaffected.');
console.log('    This is the classic "reassigning a parameter doesn\'t work" mistake.');
console.log('');
console.log('  BUG B — { ...defaultConfig } is a SHALLOW copy.');
console.log('    config.nested still points to defaultConfig.nested (same Heap address).');
console.log('    config.nested.fontSize = 14 mutates defaultConfig.nested — a side effect!');

// ── WHAT THE WRONG OUTPUT IS ─────────────────────────────────────────────────
console.log('\nWRONG OUTPUT WAS:');
console.log('  theme = "light"  (unchanged — reset had no effect)');
console.log('  fontSize = 20    (unchanged — assignment to local param was useless)');

// ── FIXED CODE ───────────────────────────────────────────────────────────────
console.log('\nFIXED CODE:');

const defaultConfigFixed = { theme: 'dark', lang: 'en', nested: { fontSize: 14 } };

// FIX: return a deep clone — let the CALLER assign it
function resetConfigFixed() {
  return structuredClone(defaultConfigFixed); // full deep copy, all levels
}

let appConfigFixed = { theme: 'light', lang: 'ur', nested: { fontSize: 20 } };
appConfigFixed = resetConfigFixed();   // ← caller assigns the returned deep clone

console.log('  appConfigFixed.theme           :', appConfigFixed.theme);           // 'dark' ✅
console.log('  appConfigFixed.nested.fontSize :', appConfigFixed.nested.fontSize); // 14 ✅
console.log('  defaultConfigFixed.nested.fontSize:', defaultConfigFixed.nested.fontSize); // 14 ← untouched ✅
console.log('  Same object?                   :', appConfigFixed === defaultConfigFixed); // false ✅

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL SUMMARY TABLE
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n══════════════════════════════════════════════════════════════════');
console.log('  SUMMARY — What Went Wrong + How To Fix');
console.log('══════════════════════════════════════════════════════════════════');
console.log('  Bug 1 │ Shallow spread  │ Nested array shared  → spread nested: [...arr]');
console.log('  Bug 2 │ Ref mutation    │ Object mutated in fn → return { ...obj, changes }');
console.log('  Bug 3 │ Param rebind +  │ Assignment to param  → return value, caller assigns');
console.log('        │ Shallow copy    │ Nested still shared  → use structuredClone()');
console.log('══════════════════════════════════════════════════════════════════');
