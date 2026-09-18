import test from "node:test";
import assert from "node:assert/strict";
import type { FulfillmentEnvelopeV0 } from "../src/fulfillment/envelope.ts";
import { projectReturnedHelpStatus } from "../src/fulfillment/status.ts";

const envelope: FulfillmentEnvelopeV0 = {
  schema: "fulfillment-envelope/v0",
  envelopeId: "env-return-1",
  purpose: "Help me make dinner",
  createdAt: "2026-09-18T16:20:00.000Z",
  requirements: [
    {
      id: "ingredient:beans",
      kind: "ingredient",
      description: "Beans",
      quantity: 4,
      unit: "can",
    },
    {
      id: "equipment:pot",
      kind: "equipment",
      description: "Pot",
    },
  ],
  source: { system: "Nourish-Kids", recipeId: "recipe-1" },
  disclosure: {
    includesOnlySelectedResiduals: true,
    omittedPrivateContext: true,
  },
  status: "unmet",
};

function packet(): any {
  return {
    schema: "help-case-status/v0",
    caseId: "help-case:abc",
    sourceEnvelopeId: "env-return-1",
    sourcePayloadHash: "payload-hash",
    projectedAt: "2026-09-18T16:30:00.000Z",
    projectionCut: {
      eventRefs: ["confirm-1", "elsewhere-1"],
      occurrences: [
        {
          eventRef: "confirm-1",
          type: "receipt.confirmed",
          occurredAt: "2026-09-18T16:25:00.000Z",
        },
        {
          eventRef: "elsewhere-1",
          type: "requirement.resolved_elsewhere",
          occurredAt: "2026-09-18T16:26:00.000Z",
        },
      ],
    },
    requirements: [
      {
        requirementId: "ingredient:beans",
        description: "Beans",
        unit: "can",
        requestedQuantity: 4,
        confirmedReceivedQuantity: 1,
        resolvedElsewhereQuantity: 1,
        waivedQuantity: 0,
        confirmedResidualQuantity: 2,
        excessResolvedQuantity: 0,
        qualitativeResolved: false,
        warnings: [],
        conservation: {
          requestedPlusExcess: 4,
          consequencePlusResidual: 4,
          holds: true,
        },
      },
      {
        requirementId: "equipment:pot",
        description: "Pot",
        confirmedReceivedQuantity: 0,
        resolvedElsewhereQuantity: 0,
        waivedQuantity: 0,
        excessResolvedQuantity: 0,
        qualitativeResolved: true,
        warnings: [],
      },
    ],
    claims: {
      projectionOnly: true,
      residualChangesOnlyThroughRecipientConsequence: true,
      quantitativeConservationChecked: true,
    },
    doesNotClaim: [
      "status packet != authority",
      "delivery reported != receipt confirmed",
      "projection != source request",
      "status packet != Book of Acts entry",
    ],
  };
}

test("returned status updates the view without rewriting the source envelope", () => {
  const before = structuredClone(envelope);
  const projection = projectReturnedHelpStatus(envelope, packet());

  assert.deepEqual(envelope, before);
  assert.equal(projection.sourceEnvelopeUnchanged, true);
  assert.equal(projection.authority, "projection-only");
  assert.equal(projection.status, "partially_resolved");
  assert.equal(projection.requirements[0].residualQuantity, 2);
  assert.equal(projection.requirements[1].qualitativeResolved, true);
  assert.deepEqual(projection.eventRefs, ["confirm-1", "elsewhere-1"]);
});

test("returned status refuses a different source envelope", () => {
  const wrong = packet();
  wrong.sourceEnvelopeId = "env-other";

  assert.throws(
    () => projectReturnedHelpStatus(envelope, wrong),
    /HELP_CASE_STATUS_ENVELOPE_MISMATCH/,
  );
});

test("returned status refuses conservation drift", () => {
  const bad = packet();
  bad.requirements[0].confirmedResidualQuantity = 1;

  assert.throws(
    () => projectReturnedHelpStatus(envelope, bad),
    /HELP_CASE_STATUS_CONSERVATION_BREACH/,
  );
});

test("returned status refuses source requirement drift", () => {
  const bad = packet();
  bad.requirements[0].unit = "jar";

  assert.throws(
    () => projectReturnedHelpStatus(envelope, bad),
    /HELP_CASE_STATUS_REQUIREMENT_UNIT_MISMATCH/,
  );
});
