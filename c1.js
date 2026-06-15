// ============================================================
// C1 — E-Commerce Product Manager: Shopping Cart System
// Concepts: var/let/const · Pass by Reference · Shallow Copy
//           Deep Copy · Functions · Conditions
// ============================================================

// ─────────────────────────────────────────────────────────────
// ORIGINAL BUGGY CODE — Analysis with Explanation Comments
// ─────────────────────────────────────────────────────────────

var cartA = { owner: 'Asad', items: [{ name: 'Laptop', price: 150000 }], total: 150000 };
var cartB = cartA; // BUG #1: This is NOT a copy. cartB and cartA both point to the SAME
                   // object in Heap memory. No new object is created. Any change to
                   // cartB will directly affect cartA because they share one reference.

// Tab 2 user adds an item
cartB.items.push({ name: 'Mouse', price: 2500 });
// BUG #2: .push() mutates the shared items array. Since cartB === cartA (same ref),
// cartA.items is also modified.

cartB.total = cartB.total + 2500;
// BUG #3: Same shared reference — cartA.total is also updated to 152500.

// ─────────────────────────────────────────────────────────────
// TASK 1 — Predict & Explain Output (as comments)
// ─────────────────────────────────────────────────────────────
console.log('Tab 1 cart items:', cartA.items.length);
// OUTPUT → 2   (BUG! Should be 1. cartB = cartA shares same reference, so push
//               on cartB.items mutated cartA.items too. Tab 1 is affected.)

console.log('Tab 1 total:', cartA.total);
// OUTPUT → 152500  (BUG! Should be 150000. cartB.total = cartA.total because
//                   both variables point to the same heap object.)

// ─────────────────────────────────────────────────────────────
// applyPromo — Buggy Function
// ─────────────────────────────────────────────────────────────
function applyPromo(cart, discount) {
  // BUG #4: Directly mutates the cart object passed in.
  // In JS, objects are passed by reference (more precisely: the reference is
  // passed by value). So `cart` inside here is the SAME object as originalCart.
  // Modifying cart.total modifies originalCart.total.
  cart.total = cart.total - discount;
  cart.promoApplied = true;
  return cart;
}

const originalCart = { owner: 'Sara', items: ['Book'], total: 500 };
const discountedCart = applyPromo(originalCart, 50);

console.log('Original total:', originalCart.total);
// OUTPUT → 450   (BUG! Should be 500. The function mutated the original object
//                 because cart inside applyPromo references the same heap object.)

// ─────────────────────────────────────────────────────────────
// TASK 2 — Bug Summary
// ─────────────────────────────────────────────────────────────
// BUG #1 → var cartB = cartA  →  Not a copy. Same reference. Fix: structuredClone()
// BUG #2 → cartB.items.push() →  Mutates shared array. Fix: spread nested array
// BUG #3 → cartB.total += ... →  Mutates shared total. Fixed by real clone.
// BUG #4 → applyPromo mutates cart.total and adds promoApplied to original object
//           Fix: return a new object using spread { ...cart, total: ..., promoApplied: true }
// BUG #5 → var used throughout. Should use const/let per modern JS standards.

// ─────────────────────────────────────────────────────────────
// TASK 3 — Fixed Version
// ─────────────────────────────────────────────────────────────

// ✅ Using structuredClone() for a true DEEP COPY
// structuredClone creates an entirely new object, including all nested arrays/objects.
// Spread {...obj} is only SHALLOW — it copies one level deep, leaving nested refs shared.

const cartAFixed = {
  owner: 'Asad',
  items: [{ name: 'Laptop', price: 150000 }],
  total: 150000
};

const cartBFixed = structuredClone(cartAFixed);
// ✅ cartBFixed is now a completely independent deep copy.
// Modifying cartBFixed.items or cartBFixed.total has ZERO effect on cartAFixed.

cartBFixed.items.push({ name: 'Mouse', price: 2500 });
cartBFixed.total = cartBFixed.total + 2500;

console.log('\n--- TASK 3: Fixed Cart Cloning ---');
console.log('Tab 1 items (cartAFixed):', cartAFixed.items.length);
// ✅ OUTPUT → 1   (Correct! cartAFixed is untouched)

console.log('Tab 1 total (cartAFixed):', cartAFixed.total);
// ✅ OUTPUT → 150000  (Correct! Only cartBFixed was modified)

console.log('Tab 2 items (cartBFixed):', cartBFixed.items.length);
// ✅ OUTPUT → 2

console.log('Tab 2 total (cartBFixed):', cartBFixed.total);
// ✅ OUTPUT → 152500

// ✅ Fixed applyPromo — Pure Function (no mutation)
/**
 * Applies a discount to the cart immutably.
 * @param {Object} cart - The original cart object.
 * @param {number} discount - The amount to subtract.
 * @returns {Object} A new cart object with the discount applied.
 */
function applyPromoFixed(cart, discount) {
  // Defensive check yahan add karein
  if (!cart || typeof cart.total !== 'number') {
    console.error("Error: Invalid cart provided");
    return cart;
  }

  return {
    ...cart,
    total: cart.total - discount,
    promoApplied: true
  };
}

const originalCartFixed = { owner: 'Sara', items: ['Book'], total: 500 };
const discountedCartFixed = applyPromoFixed(originalCartFixed, 50);

console.log('\n--- TASK 3: Fixed applyPromo ---');
console.log('Original total (must stay 500):', originalCartFixed.total);
// ✅ OUTPUT → 500  (Correct! Original untouched)

console.log('Discounted total:', discountedCartFixed.total);
// ✅ OUTPUT → 450

console.log('promoApplied on original:', originalCartFixed.promoApplied);
// ✅ OUTPUT → undefined  (Correct! promoApplied only exists on discountedCartFixed)

// ─────────────────────────────────────────────────────────────
// TASK 4 — addItem(cart, item) — Pure Function
// Returns a NEW cart with item added and total updated.
// Original cart is NEVER mutated.
// ─────────────────────────────────────────────────────────────

// ↓↓↓ Yahan JSDoc Comments add kardiye ↓↓↓
/**
 * Adds an item to the cart immutably.
 * @param {Object} cart - The current cart object.
 * @param {Object} item - The new item to add.
 * @returns {Object} A new cart object with the item added.
 */
function addItem(cart, item) {
  // ↓↓↓ Yahan Defensive Check add kardiye ↓↓↓
  if (!cart || !Array.isArray(cart.items) || !item) {
    console.error("Error: Invalid cart or item data");
    return cart; // Agar data galat ho to original cart hi wapis bhej do
  }

  // Yahan aapka purana logic waise ka waisa hi hai
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + (item.price || 0)
  };
}

const baseCart = {
  owner: 'Umar',
  items: [{ name: 'Keyboard', price: 5000 }],
  total: 5000
};

console.log('\n--- TASK 4: addItem() proof ---');
console.log('Before addItem — items count:', baseCart.items.length); // → 1
console.log('Before addItem — total:', baseCart.total);              // → 5000

const updatedCart = addItem(baseCart, { name: 'Monitor', price: 25000 });

console.log('After addItem — original items count:', baseCart.items.length); // ✅ → 1 (unchanged)
console.log('After addItem — original total:', baseCart.total);              // ✅ → 5000 (unchanged)
console.log('New cart items count:', updatedCart.items.length);              // → 2
console.log('New cart total:', updatedCart.total);                           // → 30000
