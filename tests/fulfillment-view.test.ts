import test from "node:test";
import assert from "node:assert/strict";

import { partitionEvaluations, statusCopy } from "../src/fulfillment/presentation.ts";
import type { RequirementEvaluation } from "../src/fulfillment/types.ts";

const evaluations: RequirementEvaluation[] = [
  { requirementId: "a", status: "satisfied", reason: "yes" },
  { requirementId: "b", status: "missing", reason: "no" },
  { requirementId: "c", status: "unknown", reason: "fog" },
];

test("partitions evaluated requirements without collapsing uncertainty", () => {
  const result = partitionEvaluations(evaluations);
  assert.deepEqual(result.satisfied.map((x) => x.requirementId), ["a"]);
  assert.deepEqual(result.missing.map((x) => x.requirementId), ["b"]);
  assert.deepEqual(result.unknown.map((x) => x.requirementId), ["c"]);
});

test("primary status copy stays explicit", () => {
  assert.equal(statusCopy("can_make_now").label, "Can make now");
  assert.equal(statusCopy("missing_requirements").label, "Missing");
  assert.equal(statusCopy("unknown_requirements").label, "Need more information");
});
