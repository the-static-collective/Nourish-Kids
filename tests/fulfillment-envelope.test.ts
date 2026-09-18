import test from "node:test";
import assert from "node:assert/strict";

import { createFulfillmentEnvelopeV0 } from "../src/fulfillment/envelope.ts";
import type {
  RequirementEvaluation,
  ReviewedRecipe,
} from "../src/fulfillment/types.ts";

const recipe: ReviewedRecipe = {
  id: "test-dinner",
  title: "Test Dinner",
  serves: 2,
  requirements: [
    {
      id: "ingredient:tomatoes",
      kind: "ingredient",
      label: "Canned tomatoes",
      required: true,
      quantity: 0.5,
      unit: "cup",
    },
    {
      id: "ingredient:cheese",
      kind: "ingredient",
      label: "Cheese",
      required: true,
      quantity: 0.25,
      unit: "cup",
    },
  ],
  optionalRequirements: [],
  instructions: ["Cook it."],
  safetyNotes: [],
};

const evaluations: RequirementEvaluation[] = [
  {
    requirementId: "ingredient:tomatoes",
    status: "missing",
    residualQuantity: 0.25,
    reason: "short",
  },
  {
    requirementId: "ingredient:cheese",
    status: "missing",
    residualQuantity: 0.25,
    reason: "absent",
  },
];

test("exports only selected missing residuals", () => {
  const envelope = createFulfillmentEnvelopeV0({
    recipe,
    evaluations,
    selectedRequirementIds: ["ingredient:tomatoes"],
    envelopeId: "env-001",
    createdAt: "2026-09-18T13:00:00.000Z",
  });

  assert.equal(envelope.requirements.length, 1);
  assert.equal(envelope.requirements[0].id, "ingredient:tomatoes");
  assert.equal(envelope.requirements[0].quantity, 0.25);
});

test("new envelope remains unmet", () => {
  const envelope = createFulfillmentEnvelopeV0({
    recipe,
    evaluations,
    selectedRequirementIds: ["ingredient:tomatoes"],
    envelopeId: "env-001",
    createdAt: "2026-09-18T13:00:00.000Z",
  });

  assert.equal(envelope.status, "unmet");
});

test("envelope shape has no pantry, budget, identity, or location fields", () => {
  const envelope = createFulfillmentEnvelopeV0({
    recipe,
    evaluations,
    selectedRequirementIds: ["ingredient:tomatoes"],
    envelopeId: "env-001",
    createdAt: "2026-09-18T13:00:00.000Z",
  });
  const serialized = JSON.stringify(envelope);

  assert.equal(serialized.includes("pantry"), false);
  assert.equal(serialized.includes("budget"), false);
  assert.equal(serialized.includes("identity"), false);
  assert.equal(serialized.includes("location"), false);
  assert.equal(envelope.disclosure.includesOnlySelectedResiduals, true);
  assert.equal(envelope.disclosure.omittedPrivateContext, true);
});

test("zero selected residuals is refused", () => {
  assert.throws(
    () =>
      createFulfillmentEnvelopeV0({
        recipe,
        evaluations,
        selectedRequirementIds: [],
        envelopeId: "env-001",
        createdAt: "2026-09-18T13:00:00.000Z",
      }),
    /at least one missing requirement/i,
  );
});

test("unknown or satisfied requirements cannot be exported as unmet residuals", () => {
  assert.throws(
    () =>
      createFulfillmentEnvelopeV0({
        recipe,
        evaluations: [
          {
            requirementId: "ingredient:tomatoes",
            status: "unknown",
            reason: "not declared",
          },
        ],
        selectedRequirementIds: ["ingredient:tomatoes"],
        envelopeId: "env-001",
        createdAt: "2026-09-18T13:00:00.000Z",
      }),
    /selected requirement is not missing/i,
  );
});
