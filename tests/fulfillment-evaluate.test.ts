import test from "node:test";
import assert from "node:assert/strict";

import { evaluateRecipe, evaluateRequirement } from "../src/fulfillment/evaluate.ts";
import type {
  DeclaredResource,
  Requirement,
  ReviewedRecipe,
} from "../src/fulfillment/types.ts";

const rice: Requirement = {
  id: "ingredient:rice",
  kind: "ingredient",
  label: "Cooked rice",
  required: true,
  quantity: 1,
  unit: "cup",
};

const tomato: Requirement = {
  id: "ingredient:canned_tomatoes",
  kind: "ingredient",
  label: "Canned tomatoes",
  required: true,
  quantity: 0.5,
  unit: "cup",
};

const stove: Requirement = {
  id: "equipment:stovetop",
  kind: "equipment",
  label: "Stovetop",
  required: true,
};

const salt: Requirement = {
  id: "ingredient:salt",
  kind: "ingredient",
  label: "Salt",
  required: false,
};

const recipe: ReviewedRecipe = {
  id: "test-dinner",
  title: "Test Dinner",
  serves: 2,
  requirements: [rice, tomato, stove],
  optionalRequirements: [salt],
  instructions: ["Cook it."],
  safetyNotes: [],
};

const have = (
  id: string,
  quantity?: number,
  unit?: string,
): DeclaredResource => ({
  id,
  kind: id.startsWith("equipment:") ? "equipment" : "ingredient",
  label: id,
  availability: "available",
  quantity,
  unit,
  source: "user_declared",
});

test("one matching ingredient is not enough to make the recipe", () => {
  const result = evaluateRecipe(recipe, [have("ingredient:rice", 1, "cup")]);

  assert.equal(result.primaryStatus, "unknown_requirements");
  assert.equal(
    result.evaluations.find((x) => x.requirementId === "ingredient:rice")?.status,
    "satisfied",
  );
  assert.equal(
    result.evaluations.find((x) => x.requirementId === "ingredient:canned_tomatoes")?.status,
    "unknown",
  );
});

test("all required declarations produce can_make_now", () => {
  const result = evaluateRecipe(recipe, [
    have("ingredient:rice", 1, "cup"),
    have("ingredient:canned_tomatoes", 0.5, "cup"),
    have("equipment:stovetop"),
  ]);

  assert.equal(result.primaryStatus, "can_make_now");
});

test("explicit absence is missing while undeclared remains unknown", () => {
  const declarations: DeclaredResource[] = [
    {
      id: "ingredient:canned_tomatoes",
      kind: "ingredient",
      label: "Canned tomatoes",
      availability: "unavailable",
      source: "user_declared",
    },
  ];

  assert.equal(evaluateRequirement(tomato, declarations).status, "missing");
  assert.equal(evaluateRequirement(rice, declarations).status, "unknown");
});

test("insufficient exact-unit quantity yields a positive residual", () => {
  const result = evaluateRequirement(rice, [
    have("ingredient:rice", 0.25, "cup"),
  ]);

  assert.equal(result.status, "missing");
  assert.equal(result.residualQuantity, 0.75);
});

test("available resource with unknown quantity remains unknown when quantity is required", () => {
  const result = evaluateRequirement(rice, [have("ingredient:rice")]);

  assert.equal(result.status, "unknown");
});

test("unit mismatch remains unknown rather than converting silently", () => {
  const result = evaluateRequirement(rice, [
    have("ingredient:rice", 8, "oz"),
  ]);

  assert.equal(result.status, "unknown");
});

test("missing beats unknown as the primary card state", () => {
  const result = evaluateRecipe(recipe, [
    {
      id: "ingredient:canned_tomatoes",
      kind: "ingredient",
      label: "Canned tomatoes",
      availability: "unavailable",
      source: "user_declared",
    },
  ]);

  assert.equal(result.primaryStatus, "missing_requirements");
  assert.ok(result.evaluations.some((x) => x.status === "missing"));
  assert.ok(result.evaluations.some((x) => x.status === "unknown"));
});

test("optional requirements do not block can_make_now", () => {
  const result = evaluateRecipe(recipe, [
    have("ingredient:rice", 1, "cup"),
    have("ingredient:canned_tomatoes", 0.5, "cup"),
    have("equipment:stovetop"),
  ]);

  assert.equal(
    result.optionalEvaluations.find((x) => x.requirementId === "ingredient:salt")?.status,
    "unknown",
  );
  assert.equal(result.primaryStatus, "can_make_now");
});

test("identical inputs evaluate deterministically", () => {
  const declarations = [
    have("ingredient:rice", 1, "cup"),
    have("ingredient:canned_tomatoes", 0.5, "cup"),
    have("equipment:stovetop"),
  ];

  assert.deepEqual(
    evaluateRecipe(recipe, declarations),
    evaluateRecipe(recipe, declarations),
  );
});
