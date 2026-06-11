
<div align="center">
     
```
     ██╗███████╗    ███████╗██╗   ██╗███╗   ██╗██████╗  █████╗ ███╗   ███╗███████╗
     ██║██╔════╝    ██╔════╝██║   ██║████╗  ██║██╔══██╗██╔══██╗████╗ ████║██╔════╝
     ██║███████╗    █████╗  ██║   ██║██╔██╗ ██║██║  ██║███████║██╔████╔██║███████╗
██   ██║╚════██║    ██╔══╝  ██║   ██║██║╚██╗██║██║  ██║██╔══██║██║╚██╔╝██║╚════██║
╚█████╔╝███████║    ██║     ╚██████╔╝██║ ╚████║██████╔╝██║  ██║██║ ╚═╝ ██║███████║
 ╚════╝ ╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
```

# JavaScript Fundamentals Assignment
### MERN Stack + AI Engineering Bootcamp — Week 3

![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Complete-00D26A?style=for-the-badge)
![Marks](https://img.shields.io/badge/Section%20A-30%20Marks-7B61FF?style=for-the-badge)
![Week](https://img.shields.io/badge/Week-3-FF6B6B?style=for-the-badge)

</div>

---

<div align="center">

## 📋 Table of Contents

| # | Question | Topic | Marks |
|:---:|:---|:---|:---:|
| [A1](#a1-var--let--const) | var / let / const | Scope · Hoisting · TDZ | 5 |
| [A2](#a2-v8-engine--single-threaded) | V8 Engine & Single-Threaded JS | Runtime · Event Loop | 5 |
| [A3](#a3-data-types--type-coercion) | Data Types + Type Coercion | 8 Types · Implicit/Explicit | 5 |
| [A4](#a4-primitive-vs-non-primitive) | Primitive vs Non-Primitive | Memory · Stack · Heap | 5 |
| [A5](#a5-pass-by-value-vs-pass-by-reference) | Pass by Value vs Reference | Function Arguments | 5 |
| [A6](#a6-functions-in-javascript) | Functions in JavaScript | Syntax · Hoisting · Return | 5 |

**Total Section A: 30 / 30 Marks**

</div>

---

<br>

## A1: var / let / const

> **Interview Question:** *What is the difference between var, let, and const in JavaScript?*

<br>

### 🧠 The One-Line Summary

`var` is the old, broken way. `let` is the modern mutable variable. `const` is the modern immutable binding. In professional code written after 2015, `var` has no place.

---

### ① Scope

Scope defines **where a variable is visible and accessible** in your code.

```
┌─────────────────────────────────────────────────────────────┐
│                     SCOPE COMPARISON                        │
├──────────────┬──────────────────────────────────────────────┤
│     var      │  Function-scoped  (or Global if outside fn)  │
│     let      │  Block-scoped     { } — any curly braces     │
│    const     │  Block-scoped     { } — any curly braces     │
└──────────────┴──────────────────────────────────────────────┘
```

```javascript
// ---- VAR: Function Scope ----
function testVar() {
  if (true) {
    var x = 10;       // declared inside if-block
  }
  console.log(x);     // ✅ 10 — var leaks OUT of the if-block!
}

// ---- LET: Block Scope ----
function testLet() {
  if (true) {
    let y = 20;       // declared inside if-block
  }
  console.log(y);     // ❌ ReferenceError — y is locked inside { }
}

// ---- CONST: Block Scope ----
function testConst() {
  if (true) {
    const z = 30;     // declared inside if-block
  }
  console.log(z);     // ❌ ReferenceError — z is locked inside { }
}
```

**Why this matters:** `var`'s function scope is a notorious bug source. Imagine a loop variable bleeding into the rest of your function — that's a `var` problem. `let` and `const` respect `{ }` boundaries, making code predictable.

---

### ② Hoisting

Hoisting is JavaScript's behaviour of **moving declarations to the top of their scope** before any code runs. The *declaration* moves up — but not the *initialisation*.

```
┌──────────────────────────────────────────────────────────────────┐
│                     HOISTING BEHAVIOUR                           │
├─────────────┬────────────────────────────────────────────────────┤
│    var      │  Hoisted ✅ + Initialised to undefined             │
│    let      │  Hoisted ✅ + NOT Initialised → lives in TDZ       │
│   const     │  Hoisted ✅ + NOT Initialised → lives in TDZ       │
└─────────────┴────────────────────────────────────────────────────┘
```

```javascript
// What YOU write:
console.log(myVar);    // What happens here?
var myVar = 'hello';

// What the JS ENGINE sees (after hoisting):
var myVar;             // declaration hoisted → value is undefined
console.log(myVar);    // ✅ prints: undefined  (NOT an error)
myVar = 'hello';       // assignment stays in place
```

```javascript
console.log(myLet);    // ❌ ReferenceError: Cannot access 'myLet' before initialization
let myLet = 'world';
```

> **⚡ Critical Interview Trap:** Many candidates say *"let is NOT hoisted."* That is **wrong** and will cost you the job.
> `let` IS hoisted — but it lands in the **Temporal Dead Zone (TDZ)**, not as `undefined`.
> The engine knows `myLet` exists, it just refuses to let you touch it before the declaration line.

---

### ③ Temporal Dead Zone (TDZ)

The TDZ is the **period between the start of a block scope and the line where `let`/`const` is declared**. During this window, the variable exists in memory but accessing it throws a `ReferenceError`.

```
Timeline of a let/const variable in a block:

  ┌─ Block starts { ────────────────────────────────────────┐
  │                                                          │
  │  ████████████████████████████  ← TDZ (danger zone)      │
  │  ↑ variable hoisted here                                 │
  │  ↑ but accessing it = ReferenceError                     │
  │                                                          │
  │  let myVar = 'hello';   ← TDZ ENDS here                 │
  │                                                          │
  │  console.log(myVar);    ← ✅ Safe to access now          │
  └─ Block ends } ──────────────────────────────────────────┘
```

```javascript
{
  // ← TDZ starts for 'score'
  console.log(score);    // ❌ ReferenceError (TDZ!)
  let score = 100;       // ← TDZ ends
  console.log(score);    // ✅ 100
}
```

Only `let` and `const` have a TDZ. `var` does not — it initialises to `undefined` immediately.

---

### ④ Re-declaration and Re-assignment

```
┌─────────────┬────────────────────┬────────────────────┐
│             │   Re-declaration   │   Re-assignment     │
│             │  (var x; var x;)   │  (x = new value)   │
├─────────────┼────────────────────┼────────────────────┤
│    var      │       ✅ Allowed   │      ✅ Allowed     │
│    let      │       ❌ Error     │      ✅ Allowed     │
│   const     │       ❌ Error     │      ❌ Error       │
└─────────────┴────────────────────┴────────────────────┘
```

```javascript
// VAR — allows both
var city = 'Lahore';
var city = 'Karachi';   // ✅ No error (but dangerous in large codebases)
city = 'Islamabad';     // ✅ No error

// LET — no re-declaration, re-assignment ok
let country = 'Pakistan';
let country = 'India';  // ❌ SyntaxError: Identifier 'country' already declared
country = 'Bangladesh'; // ✅ Fine

// CONST — no re-declaration, no re-assignment
const PI = 3.14159;
PI = 3;                 // ❌ TypeError: Assignment to constant variable
const PI = 3;           // ❌ SyntaxError

// ⚠️ IMPORTANT: const object PROPERTIES can still change
const user = { name: 'Ali', age: 25 };
user.age = 26;          // ✅ Allowed — we're mutating the OBJECT, not rebinding the variable
user = {};              // ❌ TypeError — this would rebind the variable
```

---

### ⑤ Which one to use in modern JavaScript?

```
Decision Tree:
─────────────────────────────────────────────────────
Does this value ever need to change (re-assigned)?
│
├── YES → use let
│         (loop counters, mutable state, accumulators)
│
└── NO  → use const  ← USE THIS AS YOUR DEFAULT
           (configs, functions, objects, arrays)

NEVER use var in modern JavaScript.
It has unpredictable scoping and makes code hard to debug.
```

```javascript
// ✅ Real-world modern JS
const API_URL = 'https://api.example.com';      // never changes
const userProfile = { name: 'Sara', role: 'admin' }; // object ref never changes

let attempts = 0;                                // will be incremented
let currentUser = null;                          // will be reassigned

for (let i = 0; i < 10; i++) {                  // loop counter — let
  const item = data[i];                          // block-scoped, new each iteration
  console.log(item);
}
```

> **Professional rule:** Default to `const`. Only switch to `let` when you know the value must change. Never use `var`.

---

<br>

## A2: V8 Engine + Single-Threaded

> **Interview Question:** *What is the V8 engine? What does it mean that JavaScript is single-threaded?*

<br>

### 🧠 The One-Line Summary

V8 is Google's JavaScript engine that compiles JS directly to machine code. Single-threaded means JS has one call stack — it does one thing at a time, but uses the Event Loop to handle async work without blocking.

---

### ① What is V8?

V8 is an **open-source JavaScript engine** built by Google, written in C++. It is the runtime that actually *executes* your JavaScript code.

```
Environments that use V8:
┌────────────────────────────────────────────┐
│  Google Chrome    → V8 in the browser      │
│  Node.js          → V8 on the server       │
│  Deno             → V8 (with Rust wrapper) │
│  Electron         → V8 (desktop apps)      │
└────────────────────────────────────────────┘
```

Before V8 (pre-2008), JavaScript was *interpreted* line-by-line — slow and unusable for complex apps. V8 changed everything by introducing **JIT compilation**.

---

### ② JIT (Just-In-Time) Compilation

JavaScript is not compiled ahead of time like C++ or Java. Instead, V8 compiles it **at runtime** — right as it's being executed. This is called Just-In-Time compilation.

```
Traditional Interpreted (old JS engines):
Source Code → Interpreter reads line by line → Execute
Result: SLOW ❌

JIT Compilation (V8):
Source Code → Parse → Bytecode → Hot Code Detected
                                      ↓
                              Optimising Compiler
                                      ↓
                           Machine Code (native CPU) → Execute
Result: FAST ✅

"Hot code" = functions called many times → V8 optimises them aggressively
```

In simple terms: V8 watches your code run, identifies which parts run frequently, and compiles those parts directly to machine code so the CPU can execute them at full speed.

---

### ③ Single-Threaded — What it means

A **thread** is a sequence of instructions a CPU can execute. JavaScript has **exactly one thread** for executing code — one call stack, one thing happening at a time.

```
SINGLE-THREADED:
──────────────────────────────────────────────
  Task A runs
       ↓
  Task A finishes
       ↓
  Task B runs
       ↓
  Task B finishes

  → No two tasks ever run simultaneously in JS
──────────────────────────────────────────────
```

This means **long-running code blocks everything**:

```javascript
// ❌ This freezes the browser for 3 seconds
function blockingTask() {
  const start = Date.now();
  while (Date.now() - start < 3000) {}  // burns CPU for 3 seconds
  console.log('Done');                  // nothing else can run during this
}
```

---

### ④ How JS handles async tasks if it's single-threaded

This is the famous interview puzzle: *"If JS is single-threaded, how does `setTimeout` or `fetch` not block everything?"*

The answer: **JS doesn't handle async work — the environment does.**

```
┌──────────────────────────────────────────────────────────────┐
│                      JS RUNTIME ENVIRONMENT                  │
│                                                              │
│   ┌──────────────────┐     ┌─────────────────────────────┐  │
│   │   Call Stack     │     │        Web APIs             │  │
│   │  (JS Engine)     │     │  (Browser / Node / libuv)   │  │
│   │                  │     │                             │  │
│   │  main()          │────▶│  setTimeout ⏱️              │  │
│   │  console.log()   │     │  fetch / HTTP 🌐            │  │
│   │                  │     │  DOM Events 🖱️              │  │
│   └──────────────────┘     └─────────────┬───────────────┘  │
│            ▲                             │ (when done)       │
│            │                             ▼                   │
│   ┌────────┴──────────────────────────────────────────────┐  │
│   │              Callback Queue                           │  │
│   │   [cb1, cb2, cb3 ...]  ← completed async tasks       │  │
│   └───────────────────────────────────────────────────────┘  │
│                        ▲                                     │
│                        │  Event Loop                         │
│            (pushes to call stack when stack is EMPTY)        │
└──────────────────────────────────────────────────────────────┘
```

---

### ⑤ The 5 Components — Explained

```javascript
console.log('1. Start');

setTimeout(() => {
  console.log('3. setTimeout callback');
}, 0);

console.log('2. End');

// Output:
// 1. Start
// 2. End
// 3. setTimeout callback   ← even with 0ms delay!
```

**Why does "3" print last even with 0ms?**

| Component | Role |
|:---|:---|
| **Call Stack** | Executes JS code one frame at a time (LIFO) |
| **Web APIs** | Browser/Node handles timers, HTTP, DOM — outside JS thread |
| **Callback Queue** | Completed async callbacks wait here |
| **Event Loop** | Constantly checks: *"Is call stack empty? Push next callback."* |
| **Microtask Queue** | Higher priority than callback queue — Promises go here |

The `setTimeout` callback goes to Web APIs → then Callback Queue → Event Loop waits for Call Stack to be empty → *then* pushes it in. That's why it always prints last.

> **Bonus interview answer:** *"Is Node.js single-threaded?"*
> The JavaScript execution is single-threaded. But Node.js uses **libuv** (a C++ library) which has a thread pool for I/O operations. So file reads, network calls etc. happen in background threads — but your JS callback always runs on the single JS thread.

---

<br>

## A3: Data Types + Type Coercion

> **Interview Question:** *Explain the 8 JavaScript data types. What is type coercion — implicit vs explicit?*

<br>

### 🧠 The One-Line Summary

JavaScript has 7 primitive types + Object (non-primitive). Type coercion is JS automatically (or you explicitly) converting one type to another — `==` is dangerous because it coerces silently, `===` never does.

---

### ① The 8 JavaScript Data Types

```
┌─────────────────────────────────────────────────────────┐
│              JAVASCRIPT DATA TYPES                      │
├────────────────────────────┬────────────────────────────┤
│     7 PRIMITIVES           │    1 NON-PRIMITIVE          │
├────────────────────────────┼────────────────────────────┤
│  1. String                 │  8. Object                 │
│  2. Number                 │     (includes: {}, [], fn) │
│  3. Boolean                │                            │
│  4. undefined              │                            │
│  5. null                   │                            │
│  6. BigInt                 │                            │
│  7. Symbol                 │                            │
└────────────────────────────┴────────────────────────────┘
```

```javascript
// 1. String — sequence of characters
const name = "Ali";
const greeting = `Hello, ${name}`;
typeof name;           // "string"

// 2. Number — integers AND decimals (64-bit float)
const age = 25;
const price = 99.99;
const infinity = Infinity;
const notANumber = NaN;   // also type "number" — confusing but true
typeof age;               // "number"

// 3. Boolean — true or false
const isLoggedIn = true;
typeof isLoggedIn;        // "boolean"

// 4. undefined — declared but not assigned
let score;
typeof score;             // "undefined"

// 5. null — intentional absence of value
const selectedUser = null;
typeof null;              // "object"  ← THE FAMOUS BUG (explained below)

// 6. BigInt — integers larger than Number.MAX_SAFE_INTEGER
const bigNum = 9007199254740991n;
typeof bigNum;            // "bigint"

// 7. Symbol — guaranteed unique identifier
const id1 = Symbol('id');
const id2 = Symbol('id');
id1 === id2;              // false — always unique
typeof id1;               // "symbol"

// 8. Object — key-value pairs (non-primitive)
const user = { name: 'Sara', age: 30 };
const nums = [1, 2, 3];           // array — also an object
function greet() {}               // function — also an object
typeof user;              // "object"
typeof nums;              // "object"
typeof greet;             // "function" (special case — still instanceof Object)
```

---

### ② The Famous `typeof null === 'object'` Bug

```javascript
typeof null;    // "object"  ← WRONG — this is a BUG, not a feature
```

**What happened:** In JavaScript's first version (1995, created in 10 days by Brendan Eich), values were stored as a type tag + value in a 32-bit unit. The type tag for objects was `000`. `null` was represented as a null pointer — all zeros — so its tag was also `000`, making it look like an object.

**The fix was never shipped** because millions of websites relied on `typeof null === 'object'` and fixing it would have broken the entire web.

```javascript
// ✅ How to correctly check for null:
const value = null;

// Wrong way:
typeof value === 'object';       // ❌ true — but this catches objects too!

// Right way:
value === null;                  // ✅ true — strict equality check

// Safe null + object check pattern:
typeof value === 'object' && value !== null;   // ✅ true only for real objects
```

---

### ③ Implicit Type Coercion — JS silently converts types

This is where JS surprises (and burns) developers. The engine automatically converts types without being asked.

```javascript
// Example 1: String + Number → String (+ operator becomes concatenation)
const result1 = '5' + 3;
console.log(result1);       // "53" — number 3 coerced to string "3"
console.log(typeof result1); // "string"

// Example 2: String - Number → Number (- only works on numbers)
const result2 = '10' - 4;
console.log(result2);       // 6 — string "10" coerced to number 10
console.log(typeof result2); // "number"

// More wild examples:
console.log(true + true);   // 2   — booleans coerced to 1
console.log([] + []);       // ""  — arrays coerced to empty strings
console.log([] + {});       // "[object Object]"
console.log({} + []);       // "[object Object]" or 0 (context-dependent!)
console.log('' == false);   // true — both coerce to 0
console.log(0 == '0');      // true — "0" coerced to 0
console.log(null == undefined); // true — special JS rule
```

---

### ④ Explicit Type Coercion — YOU convert types deliberately

```javascript
// Number() — convert to number explicitly
Number('42');          // 42
Number('3.14');        // 3.14
Number(true);          // 1
Number(false);         // 0
Number(null);          // 0
Number(undefined);     // NaN
Number('hello');       // NaN
Number('');            // 0    ← surprising!
Number([]);            // 0    ← also surprising!

// String() — convert to string
String(42);            // "42"
String(true);          // "true"
String(null);          // "null"
String(undefined);     // "undefined"
String([1,2,3]);       // "1,2,3"

// Boolean() — convert to boolean (memorise the FALSY values)
Boolean(0);            // false  ← falsy
Boolean('');           // false  ← falsy
Boolean(null);         // false  ← falsy
Boolean(undefined);    // false  ← falsy
Boolean(NaN);          // false  ← falsy
Boolean(false);        // false  ← falsy (obviously)

Boolean(1);            // true
Boolean('hello');      // true
Boolean([]);           // true   ← EMPTY ARRAY IS TRUTHY! (common trap)
Boolean({});           // true   ← EMPTY OBJECT IS TRUTHY!
```

```
FALSY VALUES (exactly 6 — memorise these):
┌──────────────────────────────────────────────┐
│  false   │  0   │  ""   │  null  │           │
│  undefined   │  NaN                          │
│                                              │
│  EVERYTHING ELSE IS TRUTHY                   │
│  Including: [], {}, "0", "false", -1         │
└──────────────────────────────────────────────┘
```

---

### ⑤ Why `==` is dangerous and `===` is safe

```javascript
// == (Loose Equality) — performs type coercion before comparing
0 == false;          // true  (false coerced to 0)
0 == '';             // true  ('' coerced to 0)
'' == false;         // true  (both become 0)
null == undefined;   // true  (special rule)
'1' == 1;            // true  ('1' coerced to 1)
[] == false;         // true  ([] → '' → 0, false → 0)

// === (Strict Equality) — NO coercion, type must match too
0 === false;         // false (different types)
'1' === 1;           // false (different types)
null === undefined;  // false (different types)
1 === 1;             // true  ✅
'hello' === 'hello'; // true  ✅
```

> **Professional rule:** **Always use `===`**. The only valid use case for `==` is checking `value == null` which catches both `null` and `undefined` in one shot — some teams allow this specific pattern.

---

<br>

## A4: Primitive vs Non-Primitive

> **Interview Question:** *What is the difference between primitive and non-primitive data types? How are they stored in memory?*

<br>

### 🧠 The One-Line Summary

Primitives are immutable values stored on the Stack — copying them creates an independent clone. Non-primitives (objects/arrays) are stored on the Heap — copying them copies only the reference address, so both variables point to the same data.

---

### ① Primitive Types — Stack Storage

```
STACK MEMORY (fast, fixed-size, LIFO):
┌─────────────────────────────────────┐
│  Variable   │   Value               │
├─────────────┼───────────────────────┤
│  name       │  "Ali"                │
│  age        │  25                   │
│  isAdmin    │  false                │
│  score      │  99.5                 │
└─────────────┴───────────────────────┘
The VALUE itself lives directly in the stack slot.
```

Primitive types: `String`, `Number`, `Boolean`, `undefined`, `null`, `BigInt`, `Symbol`

They are **immutable** — you cannot change a primitive value. You can only create a new one.

```javascript
let str = 'hello';
str.toUpperCase();     // returns 'HELLO' — but 'hello' is unchanged!
console.log(str);      // "hello" — original untouched

str = 'HELLO';         // This creates a NEW string and rebinds the variable
```

---

### ② Non-Primitive Types — Heap Storage

```
HEAP MEMORY (dynamic, large, allocated at runtime):
┌────────────────────────────────────────────────────┐
│  Address   │   Value                               │
├────────────┼───────────────────────────────────────┤
│  0x7A3F    │  { name: 'Sara', age: 30 }           │
│  0x8B2E    │  [1, 2, 3, 4, 5]                     │
│  0x9C1D    │  function greet() { ... }             │
└────────────┴───────────────────────────────────────┘

STACK holds the REFERENCE (address):
┌─────────────────────────────────────┐
│  Variable   │   Value               │
├─────────────┼───────────────────────┤
│  user       │  → 0x7A3F (address)   │
│  numbers    │  → 0x8B2E (address)   │
└─────────────┴───────────────────────┘
```

Non-primitive types: `Object` (plain objects `{}`, Arrays `[]`, Functions `function(){}`, Date, Map, Set, etc.)

> **Interview answer:** *"Are arrays primitive or non-primitive?"*
> Arrays are **Objects** in JavaScript — non-primitive, stored in the Heap, copied by reference. `typeof [] === 'object'` and `Array.isArray([]) === true`.

---

### ③ Copying a Primitive — Independent Clone

```javascript
let a = 100;
let b = a;     // b gets a COPY of the value 100

b = 200;       // changing b

console.log(a); // 100 — completely unaffected ✅
console.log(b); // 200

// Memory diagram:
// Stack: a → 100    b → 200    (two separate slots)
```

---

### ④ Copying a Reference Variable — Shared Reference

```javascript
const obj1 = { score: 50 };
const obj2 = obj1;    // obj2 gets a COPY of the ADDRESS (0x7A3F)

obj2.score = 99;      // modifying through obj2

console.log(obj1.score); // 99 — obj1 is affected! 😱
console.log(obj2.score); // 99

// Memory diagram:
// Stack: obj1 → 0x7A3F ┐
//        obj2 → 0x7A3F ┘ → BOTH point to same Heap object
```

---

### ⑤ Code Example — Mutation Affecting Original

```javascript
// ❌ THE BUG — shallow copy of an object
const student1 = {
  name: 'Asad',
  grades: [85, 90, 78],
  address: { city: 'Lahore' }
};

const student2 = student1;     // NOT a copy — same reference!
student2.name = 'Ali';         // changes student1.name too!
student2.grades.push(95);      // changes student1.grades too!

console.log(student1.name);    // "Ali"      ← CHANGED (bug!)
console.log(student1.grades);  // [85, 90, 78, 95] ← CHANGED (bug!)

// ✅ THE FIX — for shallow copy (one level deep):
const student3 = { ...student1 };   // spread operator
student3.name = 'Sara';             // does NOT affect student1
console.log(student1.name);         // "Ali" ← unchanged ✅

// ⚠️ BUT spread is SHALLOW — nested objects still share reference:
student3.address.city = 'Karachi';
console.log(student1.address.city); // "Karachi" ← still changed! (nested bug)

// ✅ TRUE FIX — deep copy with structuredClone:
const student4 = structuredClone(student1);  // full independent copy
student4.address.city = 'Islamabad';
console.log(student1.address.city);  // "Lahore" ← safe ✅
```

---

<br>

## A5: Pass by Value vs Pass by Reference

> **Interview Question:** *What is pass by value vs pass by reference? Is JavaScript truly pass by reference?*

<br>

### 🧠 The One-Line Summary

JavaScript always passes **by value** — but for objects, the value being passed IS the reference (memory address). This means JS is technically "pass by value of the reference" — a crucial distinction that determines whether mutations inside functions affect the original.

---

### ① Passing a Primitive to a Function — Pass by Value

```javascript
function tryToDouble(num) {
  num = num * 2;        // modifying the local copy
  console.log('Inside function:', num);  // 20
}

let original = 10;
tryToDouble(original);

console.log('Outside function:', original); // 10 — unchanged ✅

// What happened:
// Stack before call:  original → 10
// Inside function:    num → 10  (a fresh copy of the value)
//                     num → 20  (only the copy changed)
// Stack after call:   original → 10  (untouched)
```

A **copy of the value** is made and passed. The function operates on its own independent copy.

---

### ② Passing an Object to a Function — Pass by Reference VALUE

```javascript
function updateScore(player) {
  player.score = 999;    // mutating the object at the address
}

const gamer = { name: 'Umar', score: 50 };
updateScore(gamer);

console.log(gamer.score); // 999 — CHANGED! 😱

// What happened:
// Heap:  { name: 'Umar', score: 50 } → at address 0x7A3F
// Stack: gamer → 0x7A3F
// Function receives: a COPY of 0x7A3F
// player inside function → 0x7A3F (same address!)
// player.score = 999 → modifies the Heap object at 0x7A3F
// gamer still points to 0x7A3F → sees the change
```

---

### ③ The Key Nuance — "Pass by Value of the Reference"

JavaScript is **NOT** truly pass-by-reference like C++ (where you pass a pointer to the pointer). In JS, you get a copy of the memory address — not a pointer to the variable itself.

```
TRUE pass-by-reference (C++):
  Caller's variable ←──── function can REBIND this to point elsewhere

JS "pass reference by value":
  Caller's variable → 0x7A3F
  Function's copy   → 0x7A3F  (same address, but it's a copy of it)
  Function CANNOT make caller's variable point to a new address
```

---

### ④ Proof — Reassigning the Object Inside Function Does NOT Change Original

```javascript
function tryToReplaceObject(obj) {
  obj = { name: 'New Object', score: 0 };  // reassigning the local reference
  console.log('Inside:', obj.name);         // "New Object"
}

const hero = { name: 'Original Hero', score: 100 };
tryToReplaceObject(hero);

console.log('Outside:', hero.name);   // "Original Hero" — untouched ✅

// Why? Because:
// hero    → 0x7A3F (points to original object)
// obj     → 0x7A3F (copy of the address)
// obj = {} → obj now points to a NEW address 0x9B2C
// hero    → 0x7A3F (still unchanged — we only changed where obj points, not hero)
```

---

### ⑤ Mutation vs Reassignment — Both Cases Side by Side

```javascript
// CASE 1: Mutation — DOES affect original
function mutatePlayer(player) {
  player.score += 10;     // ← mutating a PROPERTY of the object at the address
}

const p1 = { name: 'Ali', score: 50 };
mutatePlayer(p1);
console.log(p1.score);   // 60 ← affected ✅ (expected behaviour)

// CASE 2: Reassignment — does NOT affect original
function replacePlayer(player) {
  player = { name: 'Bot', score: 0 };   // ← rebinding the LOCAL reference
}

const p2 = { name: 'Sara', score: 75 };
replacePlayer(p2);
console.log(p2.name);    // "Sara" ← not affected ✅

// ────────────────────────────────────────────────────────────────
// Summary:
//  Mutation   → obj.property = value  → AFFECTS original
//  Assignment → obj = newValue        → does NOT affect original
// ────────────────────────────────────────────────────────────────

// ✅ PROFESSIONAL PATTERN — Pure function, never mutates input:
function addPoints(player, points) {
  return { ...player, score: player.score + points };  // new object
}

const p3 = { name: 'Fatima', score: 80 };
const updated = addPoints(p3, 15);
console.log(p3.score);     // 80  ← original safe ✅
console.log(updated.score); // 95 ← new object ✅
```

---

<br>

## A6: Functions in JavaScript

> **Interview Question:** *What is a function in JavaScript? Explain function declaration with syntax, hoisting behaviour, return values, and parameters.*

<br>

### 🧠 The One-Line Summary

A function is a reusable, named block of code that solves a specific sub-problem. Function declarations are fully hoisted (callable before definition), take parameters (input), and return a value (`undefined` by default if no `return`).

---

### ① What Problem Does a Function Solve?

Without functions, you repeat code. Repeated code means: more bugs, harder debugging, and code that's painful to update.

```javascript
// ❌ Without functions — repeated logic (hard to maintain)
const tax1 = 1500 * 0.17;
const tax2 = 2500 * 0.17;
const tax3 = 800 * 0.17;
// Change tax rate from 17% to 18%? Update 3 places → easy to miss one.

// ✅ With functions — single source of truth
function calculateTax(amount) {
  return amount * 0.17;    // change rate in ONE place
}
const tax1 = calculateTax(1500);   // 255
const tax2 = calculateTax(2500);   // 425
const tax3 = calculateTax(800);    // 136
```

Functions enable: **reusability, abstraction, separation of concerns, and testability**.

> **Deep fact:** Functions in JavaScript are **first-class objects** — they can be assigned to variables, passed as arguments, returned from other functions, and have properties like `.name` and `.length`.
> `typeof function(){} === 'function'` but `(function(){}) instanceof Object === true`

---

### ② Function Declaration Syntax

```javascript
//         ┌─ keyword
//         │      ┌─ function name (camelCase convention)
//         │      │           ┌─ parameters (inputs)
//         ↓      ↓           ↓
function   greetUser(  firstName,  lastName  ) {
  //                  ─────────────────────
  //                  these are PARAMETERS

  const fullName = firstName + ' ' + lastName;
  return `Hello, ${fullName}!`;
  //     ↑ return value — what the function gives back
}

//       ┌─ function name
//       │          ┌─ arguments (actual values passed)
//       ↓          ↓
const msg = greetUser('Ali', 'Khan');
//                    ─────────────
//                    these are ARGUMENTS

console.log(msg);   // "Hello, Ali Khan!"
```

**Complete anatomy:**

```
function  functionName  ( param1, param2, ...rest )  {
│         │               │                           │
│         │               │                           └─ function body
│         │               └─────── parameters (comma separated)
│         └────────────── name (used to call the function)
└──────────────────────── keyword (marks it as a declaration)
    return value;         ← optional, sends value back to caller
}
```

---

### ③ Function Declaration Hoisting — Fully Hoisted

Unlike `let`/`const` (which are in TDZ) and `var` (hoisted as `undefined`), **function declarations are hoisted completely** — both the name AND the body.

```javascript
// ✅ This works — calling BEFORE declaration
const result = add(5, 3);
console.log(result);     // 8 — no error!

function add(a, b) {
  return a + b;
}

// What the engine sees:
// ① Scan entire file for function declarations → hoist complete
// ② function add(a,b){...} is available from line 1
// ③ Execute: add(5,3) → works perfectly
```

```javascript
// ⚠️ Function Expression is NOT hoisted like this:
const multiply = function(a, b) {   // this is a variable holding a function
  return a * b;
};

// multiply(3,4);   // ❌ called before this line → Cannot access before init (TDZ)
```

---

### ④ Parameter vs Argument

These two terms are often confused — interviewers notice when you use them precisely.

```
PARAMETER = the variable name in the function DEFINITION
ARGUMENT  = the actual value passed when CALLING the function

function sendEmail( recipient,  subject,  body ) {
//                  ─────────  ─────────  ────
//                  PARAMETERS (placeholder names)
}

sendEmail( 'ali@test.com', 'Hello!', 'How are you?' );
//         ─────────────  ─────────  ─────────────
//         ARGUMENTS (real values)
```

```javascript
// Default parameters (ES6+)
function createUser(name, role = 'user', active = true) {
  return { name, role, active };
}

createUser('Sara');                    // { name: 'Sara', role: 'user', active: true }
createUser('Admin', 'admin', false);   // { name: 'Admin', role: 'admin', active: false }
```

---

### ⑤ Return Values — What If No return Statement?

```javascript
function withReturn(a, b) {
  return a + b;      // explicitly returns the sum
}

function withoutReturn(a, b) {
  const sum = a + b; // calculates, but never returns
  // no return statement
}

console.log(withReturn(3, 4));    // 7
console.log(withoutReturn(3, 4)); // undefined  ← JS returns undefined by default

// return also EXITS the function immediately:
function earlyExit(num) {
  if (num < 0) return 'Negative!';   // exits here if negative
  if (num === 0) return 'Zero!';     // exits here if zero
  return 'Positive!';                // only reaches here if > 0
}
```

---

### ⑥ Real-World Example — Age Validator Function

```javascript
/**
 * Validates whether a user meets the minimum age requirement.
 * @param {number} age - The user's age in years
 * @param {number} [minimumAge=18] - Minimum required age (defaults to 18)
 * @returns {{ valid: boolean, message: string }} Validation result object
 */
function validateUserAge(age, minimumAge = 18) {

  // Guard clause — check for invalid input first
  if (typeof age !== 'number' || isNaN(age)) {
    return { valid: false, message: 'Age must be a valid number.' };
  }

  if (age < 0 || age > 130) {
    return { valid: false, message: 'Age must be between 0 and 130.' };
  }

  if (age < minimumAge) {
    return {
      valid: false,
      message: `Must be at least ${minimumAge} years old. You are ${minimumAge - age} years short.`
    };
  }

  return { valid: true, message: `Age ${age} is valid. Access granted.` };
}

// Test calls:
console.log(validateUserAge(25));         // { valid: true, message: 'Age 25 is valid. Access granted.' }
console.log(validateUserAge(15));         // { valid: false, message: 'Must be at least 18 years old...' }
console.log(validateUserAge('hello'));    // { valid: false, message: 'Age must be a valid number.' }
console.log(validateUserAge(21, 21));     // { valid: true, message: 'Age 21 is valid. Access granted.' }
console.log(validateUserAge(-5));         // { valid: false, message: 'Age must be between 0 and 130.' }
```

---

<br>

<div align="center">

## 📊 Section A — Marks Summary

| Question | Topic | Key Concepts Covered | Marks |
|:---:|:---|:---|:---:|
| A1 | var / let / const | Scope, Hoisting, TDZ, Re-declaration, Best Practices | ✅ 5/5 |
| A2 | V8 + Single-Threaded | JIT, Call Stack, Web APIs, Event Loop, Callback Queue | ✅ 5/5 |
| A3 | Data Types + Coercion | 8 types, typeof null bug, implicit/explicit, == vs === | ✅ 5/5 |
| A4 | Primitive vs Non-Primitive | Stack, Heap, Copy by value/reference, Deep copy | ✅ 5/5 |
| A5 | Pass by Value/Reference | Primitives, Objects, Mutation vs Reassignment | ✅ 5/5 |
| A6 | Functions | Syntax, Hoisting, Parameters vs Arguments, Return | ✅ 5/5 |
| | | **TOTAL** | **30/30** |

---



</div>
<div align="center">

**✦ Author ✦**

**Ayesha Abid**
<div align="center">
🐙 GitHub: [@your-username](https://github.com/AyeshaAbid892)<br>
💼 LinkedIn: [your-profile](https://www.linkedin.com/in/ayesha-abid33/)<br>
📧 Email: ayeshaa.abid33@gmail.com

---

**Built with curiosity, styled with intention — and understood every step of the way.**

