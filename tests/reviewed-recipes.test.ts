import test from "node:test";
import assert from "node:assert/strict";

import {
  REVIEWED_RECIPES,
  deriveResourceCatalog,
  validateReviewedRecipes,
  admitReviewedRecipes,
} from "../src/data/reviewedRecipes.ts";

test("v0 contains exactly ten reviewed recipes", () => {
  assert.equal(REVIEWED_RECIPES.length, 10);
});

test("reviewed recipes have unique ids and required requirements", () => {
  const ids = REVIEWED_RECIPES.map((recipe) => recipe.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(REVIEWED_RECIPES.every((recipe) => recipe.requirements.length > 0));
});

test("all repeated quantity-bearing resources use one v0 unit", () => {
  const catalog = deriveResourceCatalog(REVIEWED_RECIPES);
  const rice = catalog.find((entry) => entry.id === "ingredient:rice");
  assert.equal(rice?.unit, "cup");
});

test("reviewed recipe validation reports no malformed records", () => {
  assert.deepEqual(validateReviewedRecipes(REVIEWED_RECIPES), []);
});


test("malformed reviewed data is excluded rather than partially admitted", () => {
  const malformed = [
    ...REVIEWED_RECIPES,
    { ...REVIEWED_RECIPES[0] },
  ];

  const admission = admitReviewedRecipes(malformed);
  assert.equal(admission.recipes.length, 0);
  assert.ok(admission.errors.some((error) => error.includes("duplicate recipe id")));
});
