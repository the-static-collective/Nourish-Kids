import test from "node:test";
import assert from "node:assert/strict";

import {
  setResourceAvailability,
  setResourceQuantity,
} from "../src/fulfillment/declarations.ts";

test("untouched resource is absent from declarations and therefore unknown", () => {
  const resources = setResourceAvailability([], {
    id: "ingredient:rice",
    kind: "ingredient",
    label: "Rice",
    availability: "unknown",
  });

  assert.deepEqual(resources, []);
});

test("resource can be explicitly declared available", () => {
  const resources = setResourceAvailability([], {
    id: "ingredient:rice",
    kind: "ingredient",
    label: "Rice",
    availability: "available",
  });

  assert.equal(resources[0].availability, "available");
  assert.equal(resources[0].source, "user_declared");
});

test("resource can be explicitly declared unavailable", () => {
  const resources = setResourceAvailability([], {
    id: "ingredient:rice",
    kind: "ingredient",
    label: "Rice",
    availability: "unavailable",
  });

  assert.equal(resources[0].availability, "unavailable");
});

test("returning to unknown removes the explicit declaration", () => {
  const available = setResourceAvailability([], {
    id: "ingredient:rice",
    kind: "ingredient",
    label: "Rice",
    availability: "available",
  });

  const unknown = setResourceAvailability(available, {
    id: "ingredient:rice",
    kind: "ingredient",
    label: "Rice",
    availability: "unknown",
  });

  assert.deepEqual(unknown, []);
});

test("quantity update preserves explicit availability and unit", () => {
  const available = setResourceAvailability([], {
    id: "ingredient:rice",
    kind: "ingredient",
    label: "Rice",
    availability: "available",
  });

  const quantified = setResourceQuantity(available, {
    id: "ingredient:rice",
    quantity: 1.5,
    unit: "cup",
  });

  assert.equal(quantified[0].quantity, 1.5);
  assert.equal(quantified[0].unit, "cup");
});
