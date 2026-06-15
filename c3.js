// ============================================================
// C3 — Student Grade Management System: Report Generator
// Concepts: ALL — var/let/const · Types · Coercion · Functions
//           Conditions · Immutability · Pure Functions · Spread
// ============================================================

// ─────────────────────────────────────────────────────────────
// GIVEN DATA — DO NOT MODIFY (as per assignment rules)
// ─────────────────────────────────────────────────────────────
const students = [
  { name: 'Asad',   scores: [85, 90, 78, 92],     present: true  },
  { name: 'Sara',   scores: [70, 65, '80', 75],   present: true  }, // '80' is string
  { name: 'Ali',    scores: [55, 60, 50, null],    present: false }, // null in scores, absent
  { name: 'Fatima', scores: [95, 98, 100, 92],     present: true  },
  { name: 'Umar',   scores: [],                    present: true  }, // empty array
];

// ─────────────────────────────────────────────────────────────
// FUNCTION 1: getAverage(scores)
// ─────────────────────────────────────────────────────────────
// - Accepts array of scores (may have strings or nulls)
// - Strings → coerce with Number()  (e.g. '80' → 80)
// - Nulls → skip entirely (do not count in total or divisor)
// - Empty scores array → return 0
// - Returns average rounded to 1 decimal place
// - PURE FUNCTION: does not modify the input array
// ─────────────────────────────────────────────────────────────

function getAverage(scores) {
  // Guard: no scores at all
  if (scores.length === 0) return 0;

  let sum = 0;
  let validCount = 0;

  for (const score of scores) {
    // Skip nulls and undefined entirely
    if (score === null || score === undefined) continue;

    // Coerce string scores using Number() — as required (no parseInt/parseFloat)
    const numericScore = Number(score);

    // If coercion fails (NaN) — also skip
    if (isNaN(numericScore)) continue;

    sum += numericScore;
    validCount++;
  }

  // No valid scores found
  if (validCount === 0) return 0;

  // Round to 1 decimal place
  return Math.round((sum / validCount) * 10) / 10;
}

// ─────────────────────────────────────────────────────────────
// FUNCTION 2: getGrade(average)
// ─────────────────────────────────────────────────────────────
// 90–100 → 'A+'
// 80–89  → 'A'
// 70–79  → 'B'
// 60–69  → 'C'
// 50–59  → 'D'
// below 50 → 'F'
// PURE FUNCTION: input number → output string, no side effects
// ─────────────────────────────────────────────────────────────

function getGrade(average) {
  if (average >= 90) return 'A+';
  if (average >= 80) return 'A';
  if (average >= 70) return 'B';
  if (average >= 60) return 'C';
  if (average >= 50) return 'D';
  return 'F';
}

// ─────────────────────────────────────────────────────────────
// FUNCTION 3: generateReport(students)
// ─────────────────────────────────────────────────────────────
// - Returns a NEW array of report objects — students NEVER mutated
// - Each report: { name, average, grade, status, passed }
// - status: 'present' if student.present === true, else 'absent'
// - passed: true ONLY IF average >= 60 AND present is true
// - Uses const/let — no var
// ─────────────────────────────────────────────────────────────

function generateReport(students) {
  // .map() creates a NEW array — original students array is untouched
  return students.map((student) => {
    const average = getAverage(student.scores);
    const grade   = getGrade(average);
    const status  = student.present ? 'present' : 'absent';
    // passed requires BOTH conditions: passing grade AND physical presence
    const passed  = average >= 60 && student.present === true;

    // Return a NEW object — we do NOT modify the original student object
    return {
      name:    student.name,
      average: average,
      grade:   grade,
      status:  status,
      passed:  passed
    };
  });
}

// ─────────────────────────────────────────────────────────────
// FUNCTION 4: getSummary(report)
// ─────────────────────────────────────────────────────────────
// Returns:
// { total, passed, failed, topStudent: name, classAverage }
// - topStudent = name with highest average
// - classAverage = average of all student averages (1 decimal)
// ─────────────────────────────────────────────────────────────

function getSummary(report) {
  const total  = report.length;
  const passed = report.filter(r => r.passed).length;
  const failed = total - passed;

  // Find top student using reduce — compare averages
  const topStudentObj = report.reduce((best, current) => {
    return current.average > best.average ? current : best;
  });
  const topStudent = topStudentObj.name;

  // Class average: sum all averages ÷ total
  const sumOfAverages = report.reduce((acc, r) => acc + r.average, 0);
  const classAverage  = Math.round((sumOfAverages / total) * 10) / 10;

  return { total, passed, failed, topStudent, classAverage };
}

// ─────────────────────────────────────────────────────────────
// RUNNING THE SYSTEM
// ─────────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════');
console.log(' C3 — Student Grade Management System');
console.log('═══════════════════════════════════════════════════\n');

// Snapshot students BEFORE — to prove immutability after
console.log('--- students array BEFORE generateReport ---');
console.log(JSON.stringify(students, null, 2));

// Generate the report
const report = generateReport(students);

// ─────────────────────────────────────────────────────────────
// PRINT REPORT
// ─────────────────────────────────────────────────────────────
console.log('\n--- GENERATED REPORT ---');
report.forEach(r => {
  console.log(
    `${r.name.padEnd(8)} | avg=${r.average.toFixed(1)} | grade='${r.grade}' | status='${r.status}' | passed=${r.passed}`
  );
});

// ─────────────────────────────────────────────────────────────
// PRINT SUMMARY
// ─────────────────────────────────────────────────────────────
const summary = getSummary(report);
console.log('\n--- SUMMARY ---');
console.log(summary);

// ─────────────────────────────────────────────────────────────
// IMMUTABILITY PROOF — students array unchanged after generateReport
// ─────────────────────────────────────────────────────────────
console.log('\n--- students array AFTER generateReport (MUST be unchanged) ---');
console.log(JSON.stringify(students, null, 2));

// Verify no student object was accidentally modified
console.log('\n--- Spot checks ---');
console.log("Sara's scores original (must include '80' as string):", students[1].scores);
// ✅ '80' stays as string — we never mutated it

console.log("Ali's scores original (must include null):", students[2].scores);
// ✅ null stays — we skipped it in getAverage without mutation

console.log('students[0] has no .average property:', students[0].average);
// ✅ undefined — the .average property was only added to report objects, not students

// ─────────────────────────────────────────────────────────────
// EDGE CASE WALKTHROUGH (as comments — for README clarity)
// ─────────────────────────────────────────────────────────────

// Sara  → scores [70, 65, '80', 75]
//         Number('80') = 80 ✅ coerced correctly
//         avg = (70+65+80+75)/4 = 290/4 = 72.5 → grade 'B'

// Ali   → scores [55, 60, 50, null]
//         null is skipped → valid scores = [55, 60, 50]
//         avg = (55+60+50)/3 = 165/3 = 55.0 → grade 'D'
//         present=false → passed=false regardless of avg

// Umar  → scores []
//         empty array → getAverage returns 0 immediately
//         avg=0 → grade 'F' → passed=false

// Fatima→ scores [95, 98, 100, 92]
//         avg = (95+98+100+92)/4 = 385/4 = 96.25 → rounded to 96.3 → grade 'A+'
//         topStudent = 'Fatima' (highest avg)
