// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║           B5 — Pure Functions Library                                      ║
// ║           Concepts : Primitives · Immutability · Pure Functions            ║
// ║           Marks    : 9 / 9                                                  ║
// ║           MERN Stack + AI Engineering Bootcamp — Week 3                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// WHAT IS A PURE FUNCTION?
// ─────────────────────────────────────────────────────────────────────────────
//
//  A pure function has two strict rules:
//   (a) No side effects — it NEVER modifies its input arguments
//   (b) Deterministic   — same input ALWAYS produces same output
//
//  Why does this matter?
//   → Predictable behaviour — no hidden mutations elsewhere in your code
//   → Testable             — each function can be tested in complete isolation
//   → Reusable             — safe to use anywhere without unexpected effects
//   → React / Redux        — these frameworks REQUIRE pure functions for state updates
//
//  How to achieve immutability:
//   Arrays  → spread [...arr], .slice(), .filter(), .map(), .concat()  (NOT .push/.splice)
//   Objects → spread { ...obj }, Object.assign({}, obj)                 (NOT direct mutation)
//   Strings → already immutable — all string methods return NEW strings

// ══════════════════════════════════════════════════════════════════════════════
// FUNCTION 1 — addToCart(cart, item)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Adds an item to a shopping cart array without mutating the original.
 *
 * @param   {string[]} cart — current cart items
 * @param   {string}   item — item to add
 * @returns {string[]}       NEW array with item appended
 *
 * PURE? YES — spread [...cart, item] creates a brand new array.
 *       The original cart reference is never touched.
 */
function addToCart(cart, item) {
  return [...cart, item];
  // [...cart]    → copies all existing items into a new array
  // , item       → appends the new item at the end
  // The original cart array is never modified.
}

// Test call + proof original is unchanged
console.log('╔══════════════════════════════════════════════╗');
console.log('║  B5 — Pure Functions Library                ║');
console.log('╚══════════════════════════════════════════════╝\n');

console.log('── FUNCTION 1: addToCart ─────────────────────');
const cart        = ['milk', 'eggs'];
const updatedCart = addToCart(cart, 'bread');
console.log("  Call          : addToCart(['milk','eggs'], 'bread')");
console.log('  Result        :', updatedCart);  // ['milk', 'eggs', 'bread']
console.log('  Original cart :', cart);          // ['milk', 'eggs'] ← unchanged ✅
console.log('  Same array?   :', cart === updatedCart); // false ✅

// ══════════════════════════════════════════════════════════════════════════════
// FUNCTION 2 — updateUserAge(user, newAge)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Returns a new user object with the age updated.
 * The original user object is never modified.
 *
 * @param   {{ name: string, age: number }} user
 * @param   {number} newAge — the new age to set
 * @returns {{ name: string, age: number }}  NEW object with updated age
 *
 * PURE? YES — spread { ...user, age: newAge } creates a new Heap object.
 *       The original user reference is untouched.
 */
function updateUserAge(user, newAge) {
  return { ...user, age: newAge };
  // { ...user }     → copies ALL properties of user into a new object
  // , age: newAge   → overrides the 'age' property with the new value
  // Result: independent object, original user unchanged
}

console.log('\n── FUNCTION 2: updateUserAge ─────────────────');
const user        = { name: 'Ali', age: 25 };
const updatedUser = updateUserAge(user, 26);
console.log("  Call           : updateUserAge({ name:'Ali', age:25 }, 26)");
console.log('  Result         :', updatedUser);       // { name: 'Ali', age: 26 }
console.log('  Original.age   :', user.age);          // 25 ← unchanged ✅
console.log('  Same object?   :', user === updatedUser); // false ✅

// ══════════════════════════════════════════════════════════════════════════════
// FUNCTION 3 — incrementScore(scores, playerName)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Returns a new scores object with the specified player's score incremented by 1.
 * The original scores object is never modified.
 *
 * @param   {{ [player: string]: number }} scores
 * @param   {string} playerName — which player to increment
 * @returns {{ [player: string]: number }}  NEW scores object
 *
 * PURE? YES — computed property [playerName] inside a new spread object.
 *       Original scores is untouched.
 */
function incrementScore(scores, playerName) {
  return {
    ...scores,                                // copy all existing scores
    [playerName]: (scores[playerName] || 0) + 1,
    // [playerName]           → computed property — uses the variable as the key
    // (scores[playerName] || 0) → safely handles players not yet in scores (defaults to 0)
    // + 1                    → increments that player's score
  };
}

console.log('\n── FUNCTION 3: incrementScore ────────────────');
const scores        = { Ali: 5, Sara: 3 };
const updatedScores = incrementScore(scores, 'Ali');
console.log("  Call           : incrementScore({ Ali:5, Sara:3 }, 'Ali')");
console.log('  Result         :', updatedScores);     // { Ali: 6, Sara: 3 }
console.log('  Original.Ali   :', scores.Ali);        // 5 ← unchanged ✅
console.log('  Same object?   :', scores === updatedScores); // false ✅

// ══════════════════════════════════════════════════════════════════════════════
// FUNCTION 4 — reverseString(str)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Returns the reversed version of a string.
 *
 * @param   {string} str
 * @returns {string}     reversed string (new string — original unchanged)
 *
 * PURE? YES — and strings in JS are IMMUTABLE PRIMITIVES by nature.
 *       No string method ever modifies the original string.
 *       .split(), .reverse(), .join() all return NEW values.
 *       The original `str` variable is physically impossible to mutate.
 */
function reverseString(str) {
  return str
    .split('')    // split('')   → new Array of characters (str is untouched)
    .reverse()    // .reverse()  → reverses the TEMPORARY array in place (safe — it's ours)
    .join('');    // .join('')   → joins into a NEW string and returns it
}

console.log('\n── FUNCTION 4: reverseString ─────────────────');
const original = 'hello';
const reversed = reverseString(original);
console.log("  Call           : reverseString('hello')");
console.log('  Result         :', reversed);   // 'olleh'
console.log('  Original       :', original);   // 'hello' ← unchanged ✅

// Demonstrate why strings are already "safe" — immutability is built-in
let testStr = 'world';
testStr.toUpperCase();  // returns new string — doesn't change testStr
console.log('  String demo    : "world".toUpperCase() does NOT change "world"');
console.log('  testStr after  :', testStr); // 'world' — strings are immutable by nature ✅

// ══════════════════════════════════════════════════════════════════════════════
// FUNCTION 5 — removeItem(arr, index)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Returns a new array with the element at the given index removed.
 * The original array is never mutated.
 *
 * @param   {any[]}  arr   — source array
 * @param   {number} index — 0-based index of element to remove
 * @returns {any[]}         NEW array without that element
 *
 * PURE? YES — .slice() returns new arrays, spread creates new array.
 *       .splice() is NOT used because it mutates the original array.
 */
function removeItem(arr, index) {
  return [
    ...arr.slice(0, index),   // all elements BEFORE the index (new array)
    ...arr.slice(index + 1),  // all elements AFTER the index (new array)
  ];
  // Why NOT arr.splice(index, 1)?
  // .splice() MUTATES the original array — it is impure!
  // .slice() always returns a new array — safe and pure.
}

console.log('\n── FUNCTION 5: removeItem ────────────────────');
const nums       = [1, 2, 3, 4];
const afterRemove = removeItem(nums, 1); // remove index 1 (value 2)
console.log("  Call           : removeItem([1,2,3,4], 1)  ← removes index 1 (value: 2)");
console.log('  Result         :', afterRemove); // [1, 3, 4]
console.log('  Original       :', nums);         // [1, 2, 3, 4] ← unchanged ✅
console.log('  Same array?    :', nums === afterRemove); // false ✅

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE SUMMARY — all 5 functions, all expected outputs at a glance
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n══════════════════════════════════════════════════════════════════');
console.log('  COMPLETE SUMMARY — Expected Outputs (Assignment PDF Values)');
console.log('══════════════════════════════════════════════════════════════════');

const c  = ['milk', 'eggs'];
const u  = { name: 'Ali', age: 25 };
const sc = { Ali: 5, Sara: 3 };
const s  = 'hello';
const a  = [1, 2, 3, 4];

console.log('\n  addToCart(["milk","eggs"], "bread")');
console.log('    Result  :', addToCart(c, 'bread'));   // ['milk','eggs','bread']
console.log('    Original:', c);                        // ['milk','eggs'] unchanged ✅

console.log('\n  updateUserAge({ name:"Ali", age:25 }, 26)');
console.log('    Result     :', updateUserAge(u, 26)); // { name:'Ali', age:26 }
console.log('    Original age:', u.age);               // 25 unchanged ✅

console.log('\n  incrementScore({ Ali:5, Sara:3 }, "Ali")');
console.log('    Result      :', incrementScore(sc, 'Ali')); // { Ali:6, Sara:3 }
console.log('    Original.Ali:', sc.Ali);                    // 5 unchanged ✅

console.log('\n  reverseString("hello")');
console.log('    Result  :', reverseString(s)); // 'olleh'
console.log('    Original:', s);                // 'hello' unchanged ✅

console.log('\n  removeItem([1,2,3,4], 1)');
console.log('    Result  :', removeItem(a, 1)); // [1,3,4]
console.log('    Original:', a);                // [1,2,3,4] unchanged ✅

console.log('\n══════════════════════════════════════════════════════════════════');
