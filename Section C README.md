
---

# Section C — Scenario-Based Problem Solving

> **30 Marks | 3 Scenarios × 10 marks each**
> Real-world multi-concept problems combining everything from Week 3.

---

## C1 — E-Commerce Product Manager: Shopping Cart System

**Concepts Tested:** `var/let/const` · Pass by Reference · Shallow Copy · Deep Copy · Functions · Conditions

---

### 🧩 Scenario Background

You are building a shopping cart for an e-commerce website. A junior developer wrote the code below and pushed it to **production**. Customers are now reporting a critical bug: **changes made in one browser tab are showing up in another tab's cart.** Your job is to:

1. Predict and explain the current buggy output
2. Identify every bug with a precise explanation
3. Rewrite a fully fixed version
4. Add a pure `addItem()` function and prove it doesn't mutate the original

---

### 🔴 Task 1 — Predict & Explain Output

| Line | Code | Output | Why |
|------|------|--------|-----|
| 1 | `console.log('Tab 1 cart items:', cartA.items.length)` | **`2`** ❌ | `cartB = cartA` is not a copy — both variables point to the **same object in Heap memory**. When `cartB.items.push(...)` runs, it mutates the shared array. `cartA.items` is the same array. |
| 2 | `console.log('Tab 1 total:', cartA.total)` | **`152500`** ❌ | `cartB.total = cartB.total + 2500` modifies the total on the shared object. `cartA.total` is the same property. |
| 3 | `console.log('Original total:', originalCart.total)` | **`450`** ❌ | `applyPromo()` receives the object reference and directly mutates `cart.total`. Since `cart` inside the function is the same object as `originalCart`, the original is permanently changed. |

> 💡 **Root Cause:** In JavaScript, when you assign an object variable to another variable (`cartB = cartA`), you do **not** create a new object. You copy only the **reference** (memory address) stored in `cartA`. Both variables now point to the same heap object. This is called **pass/copy by reference**.

---

### 🔴 Task 2 — Bug Identification

#### Bug 1 — `var cartB = cartA` (Reference Copy, Not a Real Copy)

```js
var cartB = cartA; // ❌ BUG
```

**What is wrong:** This line does not create a new cart. It copies the **reference** (heap address) stored in `cartA` into `cartB`. After this line, `cartA === cartB` is `true` — they are literally the same object. Any property change via `cartB` will be visible through `cartA`.

**Why it matters:** The developer *intended* to create an independent copy for Tab 2. Instead, both tabs share one cart object in memory.

---

#### Bug 2 — `cartB.items.push(...)` (Mutating a Shared Nested Array)

```js
cartB.items.push({ name: 'Mouse', price: 2500 }); // ❌ BUG
```

**What is wrong:** Even if you had used a shallow spread `{ ...cartA }`, the `items` array would still be shared — because spread only copies one level deep. `.push()` mutates the array in-place. Since `cartA.items` and `cartB.items` point to the same array, Tab 1's cart is silently corrupted.

---

#### Bug 3 — `cartB.total = cartB.total + 2500` (Shared Property Mutation)

```js
cartB.total = cartB.total + 2500; // ❌ BUG
```

**What is wrong:** Same shared reference issue. Writing to `cartB.total` is writing to `cartA.total`.

---

#### Bug 4 — `applyPromo()` Mutates Its Input Object

```js
function applyPromo(cart, discount) {
  cart.total = cart.total - discount;   // ❌ BUG — direct mutation
  cart.promoApplied = true;             // ❌ BUG — adds property to original
  return cart;
}
```

**What is wrong:** Objects in JavaScript are passed by reference (technically: *the reference is passed by value*). Inside `applyPromo`, `cart` holds the same memory address as `originalCart`. Mutating `cart.total` permanently changes `originalCart.total`. The function also adds a `promoApplied` property to the original cart, which it should never touch.

---

#### Bug 5 — `var` Used Throughout

```js
var cartA = ...  // ❌ var is function-scoped, not block-scoped
var cartB = ...  // ❌ allows accidental re-declaration
```

**What is wrong:** `var` has **function scope** and allows re-declaration in the same scope — two major sources of bugs in larger codebases. Modern JS requires `const` for values that don't change and `let` for values that need reassignment.

---

### ✅ Task 3 — Fixed Version

**Key Fixes Applied:**

| Problem | Fix |
|--------|-----|
| `cartB = cartA` (shallow ref copy) | `structuredClone(cartA)` — deep copy |
| `applyPromo` mutates original | Return `{ ...cart, total: ..., promoApplied: true }` |
| `var` throughout | Replace with `const` / `let` |

**Why `structuredClone()` and not spread `{...cartA}`?**

```
Shallow spread:       { ...cartA }
→ Creates new object ✅
→ Copies cartA.owner  ✅  (primitive string — safe)
→ Copies cartA.total  ✅  (primitive number — safe)
→ Copies cartA.items  ❌  (copies the REFERENCE to the array, not the array itself)

Result: cartA.items === cartBFixed.items → still the same array!
```

```
structuredClone(cartA):
→ Creates a new object ✅
→ Recursively clones ALL nested objects and arrays ✅
→ cartA.items !== cartBFixed.items → completely independent ✅
```

**Fixed `applyPromo` — Pure Function:**

```js
function applyPromoFixed(cart, discount) {
  return {
    ...cart,                           // spread all existing properties
    total: cart.total - discount,      // override total only
    promoApplied: true                 // add new property to NEW object only
  };
}
```

The original `cart` is **never touched**. A brand new object is created and returned.

---

### ✅ Task 4 — `addItem(cart, item)` — Pure Function

```js
function addItem(cart, item) {
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + item.price
  };
}
```

**How it stays pure:**
- `...cart` → copies all primitive properties (owner, total) into a new object
- `[...cart.items, item]` → creates a **new array** with all existing items + the new one
- `cart.total + item.price` → arithmetic on a primitive, doesn't touch the original
- The original `cart` object: untouched, unchanged, intact ✅

---

### 🧠 Concepts Demonstrated in C1

| Concept | Where Applied |
|--------|--------------|
| Reference vs Value | `cartB = cartA` analysis |
| Shallow Copy limitation | Spread `{...}` only copies 1 level deep |
| Deep Copy | `structuredClone()` for nested objects |
| Pure Function | `applyPromoFixed()` and `addItem()` return new objects |
| `const` / `let` vs `var` | All variables replaced throughout |
| Object mutation | `.push()`, property assignment on shared references |

---
## `📸  Visual Reference `

<img width="355" height="370" alt="image" src="https://github.com/user-attachments/assets/1b4f43c7-f13f-49ee-8546-aaa16587d924" />

---

## C2 — User Registration System: Validation Engine

**Concepts Tested:** Functions · Operators · Conditions · Type Coercion · Data Types · Guard Clauses · Pure Functions

---

### 🧩 Scenario Background

You are building the **backend validation layer** for a user registration form. Data arrives from the frontend and may be messy — strings where numbers are expected, missing fields, invalid formats, or unrecognized roles.

Your task is to build a **robust `validateUser(data)` function** that:
- Handles all edge cases without crashing
- Returns detailed error messages when validation fails
- Returns a clean, normalized user object when all rules pass
- Never mutates the input `data` object (pure function)
- Uses no `var`, no nested `if/else` pyramids, and leverages JS type tools properly

---

### 📋 Validation Rules — Detailed Breakdown

#### Rule 1: `name`

```js
typeof data.name !== 'string' || data.name.trim() === ''
```

- Must be a **string** (reject numbers, booleans, objects)
- Must not be **empty or whitespace-only**
- `.trim()` removes leading/trailing spaces before checking
- Error message: `'Name cannot be empty'`

---

#### Rule 2: `email`

```js
typeof data.email !== 'string' || !data.email.includes('@') || !data.email.includes('.')
```

- Must be a **string**
- Must contain `'@'` (presence of at-sign)
- Must contain `'.'` (presence of dot)
- Note: This is a basic format check — full regex-based email validation is beyond scope
- Error message: `'Invalid email format'`

---

#### Rule 3: `age` — Type Coercion Required

```js
const coercedAge = Number(data.age);
if (isNaN(coercedAge)) → error
if (coercedAge < 13 || coercedAge > 120) → error
```

**This rule is the most nuanced.** Age may arrive as a string from an HTML form:

| Input | `Number(input)` | `isNaN(...)` | Action |
|-------|----------------|-------------|--------|
| `25` (number) | `25` | `false` | ✅ Valid |
| `'25'` (string) | `25` | `false` | ✅ Coerced, valid |
| `'17abc'` (bad string) | `NaN` | `true` | ❌ Error |
| `null` | `0` | `false` | ❌ Fails range check (0 < 13) |
| `undefined` | `NaN` | `true` | ❌ Error |

- We use `Number()` (explicit coercion), **not** `parseInt` or `parseFloat` as per assignment constraints
- `isNaN()` checks if the coercion produced a valid number
- Error messages: `'Age must be a valid number'` or `'Age must be between 13 and 120'`

---

#### Rule 4: `password`

```js
typeof data.password !== 'string' || data.password.length < 8
```

- Must be a **string**
- Minimum **8 characters** length
- Error message: `'Password must be at least 8 characters'`

---

#### Rule 5: `role` — Nullish Coalescing + Default Value

```js
const role = data.role ?? 'user';
const allowedRoles = ['admin', 'editor', 'user'];
if (!allowedRoles.includes(role)) → error
```

- `??` is the **nullish coalescing operator** — it returns the right side only if the left side is `null` or `undefined`
- If `role` is not provided → defaults to `'user'`
- If provided, must be one of: `'admin'`, `'editor'`, `'user'`
- An invalid role like `'adm'` (typo) triggers an error
- Error message: `'Role must be one of: admin, editor, user'`

---

### 🏗️ Architectural Decisions

**Why Guard Clauses + Error Array, Not Nested If/Else?**

❌ Anti-pattern (deeply nested, hard to read, misses multiple errors):
```js
if (name valid) {
  if (email valid) {
    if (age valid) {
      // ...
    } else { return error }
  } else { return error }
} else { return error }
```

✅ Our approach (flat, collects ALL errors, easy to extend):
```js
const errors = [];
if (!nameValid) errors.push('...');
if (!emailValid) errors.push('...');
if (!ageValid) errors.push('...');
// ...
if (errors.length > 0) return { valid: false, errors };
return { valid: true, user: { ...cleaned } };
```

This approach is **production-standard**: it returns all errors at once so the user can fix everything in one go, rather than discovering failures one by one.

---

### ✅ Test Case Walkthrough

| Test | Input | Expected Output | Key Concept |
|------|-------|----------------|------------|
| 1 | age: `'25'` (string), no role | `valid: true`, age coerced to `25`, role `'user'` | Implicit coercion handled explicitly with `Number()` |
| 2 | name: `''`, email: `'notanemail'`, age: `10`, password: `'abc'` | `valid: false`, 4 errors | All validations run independently, all errors collected |
| 3 | role: `'admin'` | `valid: true`, role preserved | Valid role passes allowedRoles check |
| 4 | age: `'17abc'` | `valid: false`, error about invalid number | `Number('17abc')` = `NaN`, caught by `isNaN()` |

---

### 🧠 Concepts Demonstrated in C2

| Concept | Where Applied |
|--------|--------------|
| Type checking | `typeof` for name, email, password |
| Explicit coercion | `Number(data.age)` for age |
| `isNaN()` | Detecting failed coercion |
| Nullish coalescing `??` | Role defaulting |
| Logical operators `&&`, `\|\|` | Combining conditions |
| Guard clauses | Flat conditional structure, no pyramids |
| Pure function | `data` object never mutated |
| `const` / `let` | `var` not used anywhere |
| Error accumulation pattern | Collecting all errors before returning |

---
## `📸  Visual Reference `

<img width="560" height="409" alt="image" src="https://github.com/user-attachments/assets/4706d347-74af-4327-9e93-f7a2a334f058" />


<img width="560" height="375" alt="image" src="https://github.com/user-attachments/assets/d6d10d7e-442b-43dc-9255-e58de8c01837" />


---

## C3 — Student Grade Management System: Report Generator

**Concepts Tested:** ALL — `var/let/const` · Types · Coercion · Functions · Conditions · Immutability · Reduce · Map · Filter

---

### 🧩 Scenario Background

You are building a **grade management system** for the bootcamp. You receive an array of student objects where:
- Some scores are **strings** (coerce them)
- Some scores are **null** (skip them, don't count toward average)
- Some students have **empty score arrays** (average = 0)
- Some students are **absent** (affect the `passed` field)

You must build 4 functions that work together as a pipeline:

```
students → generateReport() → report → getSummary()
```

**Critical constraint:** The original `students` array must remain **completely unchanged** after all functions run. Immutability is tested explicitly.

---

### 🔧 Function 1: `getAverage(scores)`

**What it does:** Computes the average of a mixed-type array (numbers, strings, nulls).

**Step-by-step logic:**

```
Input: [70, 65, '80', 75]

Step 1: Loop through each score
Step 2: Skip if null or undefined (continue)
Step 3: Run Number(score) on each remaining item
        → Number(70)   = 70  ✅
        → Number(65)   = 65  ✅
        → Number('80') = 80  ✅ (string coerced)
        → Number(75)   = 75  ✅
Step 4: Skip if result is NaN
Step 5: sum = 70+65+80+75 = 290, validCount = 4
Step 6: average = 290/4 = 72.5 → rounded to 72.5
```

**Edge Cases Handled:**

| Input | Behavior |
|-------|---------|
| `[]` | Returns `0` immediately (guard clause) |
| `[55, 60, 50, null]` | null is skipped → avg of `[55, 60, 50]` only |
| `[70, 65, '80', 75]` | `'80'` coerced with `Number()` → `80` |
| `[55, 'abc', 50]` | `Number('abc')` = `NaN` → skipped |

**Why `Number()` and not `parseInt/parseFloat`?**
- Assignment explicitly forbids `parseInt`/`parseFloat`
- `Number('80')` → `80` ✅
- `Number(null)` → `0` — but we skip null before this step
- `Number('80abc')` → `NaN` — caught by `isNaN()` check

---

### 🔧 Function 2: `getGrade(average)`

**What it does:** Maps a numeric average to a letter grade string.

```
90–100  →  'A+'
80–89   →  'A'
70–79   →  'B'
60–69   →  'C'
50–59   →  'D'
< 50    →  'F'
```

**Implementation uses cascading `if` statements** (most readable for grade ranges):

```js
if (average >= 90) return 'A+';
if (average >= 80) return 'A';
// ...
```

Each condition is checked from highest to lowest. Once a condition matches, the function returns immediately. This is the **guard clause pattern** — no `else` needed.

**Pure Function:** takes a number, returns a string. No side effects, no state mutation. Same input always produces same output.

---

### 🔧 Function 3: `generateReport(students)`

**What it does:** Transforms the `students` array into a `report` array.

**Why `.map()` is the right tool:**
- `.map()` creates a **brand new array** — never modifies the original
- Each element of `students` is processed through a callback
- The callback returns a **new object** — the original student object is never written to

```
students[1] = { name: 'Sara', scores: [70, 65, '80', 75], present: true }
                                                    ↓ map callback
report[1]   = { name: 'Sara', average: 72.5, grade: 'B', status: 'present', passed: true }
```

**The `passed` logic requires TWO conditions:**

```js
const passed = average >= 60 && student.present === true;
```

| Condition | Means |
|-----------|-------|
| `average >= 60` | Student scored C or higher |
| `student.present === true` | Student attended class |

Both must be true. Ali has average 55.0 (D grade) AND is absent → `passed = false`. Even if he were present, D is below 60.

---

### 🔧 Function 4: `getSummary(report)`

**What it does:** Aggregates the full report into key statistics.

**Finding `topStudent` with `.reduce()`:**

```js
const topStudentObj = report.reduce((best, current) => {
  return current.average > best.average ? current : best;
});
```

`.reduce()` walks through the array, comparing each student's average against the running `best`. At the end, `best` holds the student with the highest average.

**Calculating `classAverage`:**

```js
const sumOfAverages = report.reduce((acc, r) => acc + r.average, 0);
const classAverage  = Math.round((sumOfAverages / total) * 10) / 10;
```

Sum all averages → divide by total count → round to 1 decimal.

---

### 📊 Full Output Walkthrough

| Student | Scores (raw) | Valid Scores | Average | Grade | Status | Passed |
|---------|-------------|-------------|---------|-------|--------|--------|
| Asad | `[85, 90, 78, 92]` | all 4 | 86.3 | A | present | ✅ true |
| Sara | `[70, 65, '80', 75]` | all 4 (`'80'`→80) | 72.5 | B | present | ✅ true |
| Ali | `[55, 60, 50, null]` | 3 (null skipped) | 55.0 | D | absent | ❌ false |
| Fatima | `[95, 98, 100, 92]` | all 4 | 96.3 | A+ | present | ✅ true |
| Umar | `[]` | 0 (empty) | 0 | F | present | ❌ false |

**Summary:**
```js
{
  total: 5,
  passed: 3,
  failed: 2,
  topStudent: 'Fatima',
  classAverage: 62.0    // (86.3 + 72.5 + 55.0 + 96.3 + 0) / 5
}
```

---

### 🛡️ Immutability Proof

After `generateReport(students)` runs:

```js
console.log(students[1].scores);         // → [70, 65, '80', 75]  ← '80' still a string ✅
console.log(students[2].scores);         // → [55, 60, 50, null]  ← null still present ✅
console.log(students[0].average);        // → undefined            ← no .average added ✅
```

The original student objects have **no new properties**, **no modified values**, **no removed elements**. `.map()` with a new return object guarantees this.

---

### 🧠 Concepts Demonstrated in C3

| Concept | Where Applied |
|--------|--------------|
| `const` / `let` | Used throughout — no `var` anywhere |
| Type coercion | `Number(score)` to handle string scores |
| `typeof` | Used to verify types where needed |
| `isNaN()` | Detect failed coercion in `getAverage` |
| Pure functions | `getAverage`, `getGrade` — no side effects |
| Immutability | `generateReport` uses `.map()` + new return objects |
| `.map()` | Creates new report array without touching students |
| `.filter()` | Count passed students in `getSummary` |
| `.reduce()` | Find top student + compute class average |
| Guard clauses | Empty array check in `getAverage` |
| Cascading conditions | Grade bracket logic in `getGrade` |
| Null handling | `null` scores skipped, not coerced |
| Edge cases | Empty array, null, string, absent student |

---
## ` 📸 Visual Reference `

<img width="558" height="547" alt="image" src="https://github.com/user-attachments/assets/2f25117d-fb8d-4f51-8a5d-7ef55dba64c5" />

<img width="558" height="496" alt="image" src="https://github.com/user-attachments/assets/3e9ea2a4-eba8-4a6e-808f-928c5dd2b7a3" />

<img width="558" height="489" alt="image" src="https://github.com/user-attachments/assets/40e033b2-345f-4ca6-9c33-eba09b705ef3" />

<img width="558" height="322" alt="image" src="https://github.com/user-attachments/assets/4e5824d6-2f6a-493a-b0b2-1cf5705d9795" />



---

<div align="center">

**✦ Author ✦**

**Ayesha Abid**
<div align="center">
🐙 GitHub: [@your-username](https://github.com/AyeshaAbid892)<br>
💼 LinkedIn: [your-profile](https://www.linkedin.com/in/ayesha-abid33/)<br>
📧 Email: ayeshaa.abid33@gmail.com

---


