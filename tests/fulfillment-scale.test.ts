import test from "node:test";
import assert from "node:assert/strict";

import { scaleReviewedRecipe } from "../src/fulfillment/scale.ts";
import type { ReviewedRecipe } from "../src/fulfillment/types.ts";

const recipe: ReviewedRecipe = {
  id: "dinner",
  title: "Dinner",
  serves: 2,
  requirements: [
    {
      id: "ingredient:rice",
      kind: "ingredient",
      label: "Rice",
      required: true,
      quantity: 1,
      unit: "cup",
    },
    {
      id: "equipment:pot",
      kind: "equipment",
      label: "Pot",
      required: true,
    },
  ],
  optionalRequirements: [],
  instructions: ["Cook."],
  safetyNotes: [],
};

test("ingredient quantities scale to people being fed", () => {
  const scaled = scaleReviewedRecipe(recipe, 4);
  assert.equal(scaled.serves, 4);
  assert.equal(scaled.requirements[0].quantity, 2);
});

test("equipment requirements do not multiply with serving count", () => {
  const scaled = scaleReviewedRecipe(recipe, 4);
  assert.equal(scaled.requirements[1].quantity, undefined);
});

test("invalid people count is refused", () => {
  assert.throws(() => scaleReviewedRecipe(recipe, 0), /positive/i);
});
