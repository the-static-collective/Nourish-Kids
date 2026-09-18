import test from "node:test";
import assert from "node:assert/strict";

import {
  SAMPLE_EXPENSES,
  initialExpensesFromStorage,
} from "../src/budget/budgetState.ts";

test("no saved data means no actual purchases", () => {
  assert.deepEqual(initialExpensesFromStorage(null), []);
});

test("malformed saved data fails closed to an empty actual list", () => {
  assert.deepEqual(initialExpensesFromStorage("{bad-json"), []);
});

test("valid saved user expenses are preserved", () => {
  const raw = JSON.stringify([
    { id: "real-1", name: "Rice", cost: 2.5, category: "Grains" },
  ]);

  assert.deepEqual(initialExpensesFromStorage(raw), [
    { id: "real-1", name: "Rice", cost: 2.5, category: "Grains" },
  ]);
});

test("sample data exists separately from actual default state", () => {
  assert.ok(SAMPLE_EXPENSES.length > 0);
  assert.deepEqual(initialExpensesFromStorage(null), []);
});
