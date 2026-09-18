# FULFILLMENT / The Last Mile v0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Nourish truthfully distinguish makeable, missing, and unknown recipe requirements, then export only user-selected unmet residuals as a local `fulfillment-envelope/v0`.

**Architecture:** Keep the fulfillment kernel as pure TypeScript under `src/fulfillment/`; UI components consume it but do not own truth rules. Ten explicitly reviewed recipes form the first Local Chart. The export constructor accepts only reviewed recipe data plus selected missing evaluations, so private pantry state is structurally absent from the envelope path.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Node 18+ built-in `node:test` executed through the repository's existing `tsx` dependency.

**Spec:** `docs/superpowers/specs/2026-09-18-fulfillment-envelope-v0-design.md`

## Global Constraints

- V0 remains local-first; no Campfire network transmission or public posting.
- No BODY/ALEX/3rdi/LOADOUT runtime dependency.
- No ranking, reputation, deservingness, urgency, or truthfulness score.
- Undeclared required state is `unknown`; only explicit unavailability is `missing`.
- Primary recipe-state precedence is `missing_requirements > unknown_requirements > can_make_now`.
- Optional requirements never block `can_make_now`.
- Quantity comparison is exact-unit only in v0; unconvertible unit mismatch is `unknown`.
- A newly exported `fulfillment-envelope/v0` always has status `unmet`.
- Private pantry state, budget, identity, location, and unrelated household history are absent from the envelope constructor.
- Existing AI recipe generation remains optional and must not be labeled as locally verified against declared pantry state.
- Default grocery expense state is empty unless actual saved user data exists; sample data is loaded only by an explicit user action.
- Core evaluation and envelope creation work without AI or network access.
- No new test framework dependency; use `node:test` + `node:assert/strict` through `tsx`.

---

## File Map

### Create

- `src/fulfillment/types.ts` — owner-local v0 contract types.
- `src/fulfillment/evaluate.ts` — pure requirement and recipe evaluation.
- `src/fulfillment/declarations.ts` — pure tri-state declaration updates.
- `src/fulfillment/envelope.ts` — selected-residual-only envelope projection.
- `src/data/reviewedRecipes.ts` — exactly ten reviewed recipes plus resource-unit derivation/validation.
- `src/budget/budgetState.ts` — empty actual state, explicit sample data, storage parsing.
- `tests/fulfillment-evaluate.test.ts` — truth-state and residual contract.
- `tests/reviewed-recipes.test.ts` — ten-recipe data contract and unit consistency.
- `tests/fulfillment-envelope.test.ts` — privacy/export contract.
- `tests/declarations.test.ts` — unknown/available/unavailable transition contract.
- `tests/budget-state.test.ts` — no invented purchases.
- `src/components/FulfillmentEnvelopePreview.tsx` — exact payload preview/copy/print surface.

### Modify

- `package.json` — add deterministic test script only.
- `src/components/PantryStretchView.tsx` — replace any-one-ingredient curated fallback with reviewed truth-state UI and local export flow.
- `src/components/GroceryBudgetTracker.tsx` — consume truthful budget initialization helper.
- `README.md` — document the local Last Mile specimen and its non-network boundary.

### Explicitly do not modify in v0

- `server.ts`
- Gemini API request/response contract
- Jubilee-Campfire
- BODY surfaces
- ALEX.2
- 3rdi
- LOADOUT
- Free Graph

---

### Task 1: Establish the deterministic fulfillment kernel

**Files:**
- Modify: `package.json`
- Create: `src/fulfillment/types.ts`
- Create: `src/fulfillment/evaluate.ts`
- Create: `tests/fulfillment-evaluate.test.ts`

**Interfaces:**
- Produces:
  - `RequirementKind`
  - `RequirementStatus`
  - `Requirement`
  - `DeclaredResource`
  - `RequirementEvaluation`
  - `ReviewedRecipe`
  - `RecipeEvaluation`
  - `evaluateRequirement(requirement, declarations)`
  - `evaluateRecipe(recipe, declarations)`
- Consumes: no application state; pure data only.

- [ ] **Step 1: Add the test command**

Change `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit",
    "test": "tsx --test tests/*.test.ts"
  }
}
```

Do not add a test dependency.

- [ ] **Step 2: Write the RED evaluator tests**

Create `tests/fulfillment-evaluate.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { evaluateRecipe, evaluateRequirement } from "../src/fulfillment/evaluate";
import type {
  DeclaredResource,
  Requirement,
  ReviewedRecipe,
} from "../src/fulfillment/types";

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
```

- [ ] **Step 3: Run the RED test**

Run:

```bash
npm test -- --test-name-pattern="one matching ingredient"
```

Expected: FAIL because `src/fulfillment/evaluate.ts` does not exist.

- [ ] **Step 4: Implement the exact v0 contract types**

Create `src/fulfillment/types.ts`:

```ts
export type RequirementKind =
  | "ingredient"
  | "equipment"
  | "time"
  | "transport"
  | "other";

export type RequirementStatus = "satisfied" | "missing" | "unknown";

export interface Requirement {
  id: string;
  kind: RequirementKind;
  label: string;
  required: boolean;
  quantity?: number;
  unit?: string;
  notes?: string;
}

export interface RequirementEvaluation {
  requirementId: string;
  status: RequirementStatus;
  declaredQuantity?: number;
  residualQuantity?: number;
  reason: string;
}

export interface DeclaredResource {
  id: string;
  kind: RequirementKind;
  label: string;
  quantity?: number;
  unit?: string;
  availability: "available" | "unavailable" | "unknown";
  source: "user_declared";
}

export interface ReviewedRecipe {
  id: string;
  title: string;
  serves: number;
  requirements: Requirement[];
  optionalRequirements: Requirement[];
  instructions: string[];
  safetyNotes: string[];
}

export type RecipePrimaryStatus =
  | "can_make_now"
  | "missing_requirements"
  | "unknown_requirements";

export interface RecipeEvaluation {
  recipeId: string;
  primaryStatus: RecipePrimaryStatus;
  evaluations: RequirementEvaluation[];
  optionalEvaluations: RequirementEvaluation[];
}
```

- [ ] **Step 5: Implement the pure evaluator**

Create `src/fulfillment/evaluate.ts`:

```ts
import type {
  DeclaredResource,
  RecipeEvaluation,
  Requirement,
  RequirementEvaluation,
  ReviewedRecipe,
} from "./types";

export function evaluateRequirement(
  requirement: Requirement,
  declarations: DeclaredResource[],
): RequirementEvaluation {
  const declaration = declarations.find((item) => item.id === requirement.id);

  if (!declaration || declaration.availability === "unknown") {
    return {
      requirementId: requirement.id,
      status: "unknown",
      reason: "No explicit availability declaration exists.",
    };
  }

  if (declaration.availability === "unavailable") {
    return {
      requirementId: requirement.id,
      status: "missing",
      reason: "The user explicitly declared this resource unavailable.",
      residualQuantity: requirement.quantity,
    };
  }

  if (requirement.quantity === undefined) {
    return {
      requirementId: requirement.id,
      status: "satisfied",
      declaredQuantity: declaration.quantity,
      reason: "The user explicitly declared this resource available.",
    };
  }

  if (
    declaration.quantity === undefined ||
    declaration.unit === undefined
  ) {
    return {
      requirementId: requirement.id,
      status: "unknown",
      declaredQuantity: declaration.quantity,
      reason: "Availability is declared, but quantity or unit is unknown.",
    };
  }

  if (declaration.unit !== requirement.unit) {
    return {
      requirementId: requirement.id,
      status: "unknown",
      declaredQuantity: declaration.quantity,
      reason: "Declared and required units differ; v0 performs no silent conversion.",
    };
  }

  const residual = Math.max(requirement.quantity - declaration.quantity, 0);

  if (residual > 0) {
    return {
      requirementId: requirement.id,
      status: "missing",
      declaredQuantity: declaration.quantity,
      residualQuantity: residual,
      reason: "Declared quantity is below the reviewed recipe requirement.",
    };
  }

  return {
    requirementId: requirement.id,
    status: "satisfied",
    declaredQuantity: declaration.quantity,
    residualQuantity: 0,
    reason: "Declared quantity satisfies the reviewed recipe requirement.",
  };
}

export function evaluateRecipe(
  recipe: ReviewedRecipe,
  declarations: DeclaredResource[],
): RecipeEvaluation {
  const evaluations = recipe.requirements.map((requirement) =>
    evaluateRequirement(requirement, declarations),
  );
  const optionalEvaluations = recipe.optionalRequirements.map((requirement) =>
    evaluateRequirement(requirement, declarations),
  );

  const primaryStatus =
    evaluations.some((item) => item.status === "missing")
      ? "missing_requirements"
      : evaluations.some((item) => item.status === "unknown")
        ? "unknown_requirements"
        : "can_make_now";

  return {
    recipeId: recipe.id,
    primaryStatus,
    evaluations,
    optionalEvaluations,
  };
}
```

- [ ] **Step 6: Run the kernel tests GREEN**

Run:

```bash
npm test -- tests/fulfillment-evaluate.test.ts
npm run lint
```

Expected: all evaluator tests PASS; TypeScript emits no errors.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json src/fulfillment/types.ts src/fulfillment/evaluate.ts tests/fulfillment-evaluate.test.ts
git commit -m "feat: add truthful recipe requirement evaluator"
```

---

### Task 2: Add tri-state declarations and exactly ten reviewed recipes

**Files:**
- Create: `src/fulfillment/declarations.ts`
- Create: `src/data/reviewedRecipes.ts`
- Create: `tests/declarations.test.ts`
- Create: `tests/reviewed-recipes.test.ts`

**Interfaces:**
- Consumes: `DeclaredResource`, `ReviewedRecipe`, `Requirement`.
- Produces:
  - `setResourceAvailability(resources, input)`
  - `setResourceQuantity(resources, input)`
  - `REVIEWED_RECIPES`
  - `deriveResourceCatalog(recipes)`
  - `validateReviewedRecipes(recipes)`

- [ ] **Step 1: Write RED tri-state declaration tests**

Create `tests/declarations.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  setResourceAvailability,
  setResourceQuantity,
} from "../src/fulfillment/declarations";

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
```

- [ ] **Step 2: Write RED reviewed-data tests**

Create `tests/reviewed-recipes.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  REVIEWED_RECIPES,
  deriveResourceCatalog,
  validateReviewedRecipes,
} from "../src/data/reviewedRecipes";

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
```

- [ ] **Step 3: Run RED**

Run:

```bash
npm test -- tests/declarations.test.ts tests/reviewed-recipes.test.ts
```

Expected: FAIL because the declaration and reviewed-recipe modules do not exist.

- [ ] **Step 4: Implement declaration updates**

Create `src/fulfillment/declarations.ts`:

```ts
import type {
  DeclaredResource,
  RequirementKind,
} from "./types";

interface AvailabilityInput {
  id: string;
  kind: RequirementKind;
  label: string;
  availability: "available" | "unavailable" | "unknown";
}

interface QuantityInput {
  id: string;
  quantity?: number;
  unit?: string;
}

export function setResourceAvailability(
  resources: DeclaredResource[],
  input: AvailabilityInput,
): DeclaredResource[] {
  const remaining = resources.filter((resource) => resource.id !== input.id);

  if (input.availability === "unknown") {
    return remaining;
  }

  const previous = resources.find((resource) => resource.id === input.id);

  return [
    ...remaining,
    {
      id: input.id,
      kind: input.kind,
      label: input.label,
      availability: input.availability,
      quantity: input.availability === "available" ? previous?.quantity : undefined,
      unit: input.availability === "available" ? previous?.unit : undefined,
      source: "user_declared",
    },
  ];
}

export function setResourceQuantity(
  resources: DeclaredResource[],
  input: QuantityInput,
): DeclaredResource[] {
  return resources.map((resource) =>
    resource.id === input.id && resource.availability === "available"
      ? {
          ...resource,
          quantity: input.quantity,
          unit: input.unit,
        }
      : resource,
  );
}
```

- [ ] **Step 5: Create the ten reviewed recipe records**

Create `src/data/reviewedRecipes.ts`.

Use these exact v0 resource IDs and units for quantity-bearing ingredients:

```ts
import type {
  Requirement,
  ReviewedRecipe,
} from "../fulfillment/types";

const ingredient = (
  id: string,
  label: string,
  quantity?: number,
  unit?: string,
  required = true,
): Requirement => ({
  id: `ingredient:${id}`,
  kind: "ingredient",
  label,
  required,
  quantity,
  unit,
});

const equipment = (
  id: string,
  label: string,
): Requirement => ({
  id: `equipment:${id}`,
  kind: "equipment",
  label,
  required: true,
});

export const REVIEWED_RECIPES: ReviewedRecipe[] = [
  {
    id: "staple-1-tomato-bean-rice-bowl",
    title: "Creamy Tomato & Black Bean Rice Bowl",
    serves: 2,
    requirements: [
      ingredient("rice", "Cooked rice", 1, "cup"),
      ingredient("canned_beans", "Canned black or pinto beans", 0.5, "cup"),
      ingredient("canned_tomatoes", "Canned tomatoes or sauce", 0.5, "cup"),
      ingredient("cheese", "Cheddar or cheese", 0.25, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("saucepan", "Saucepan"),
    ],
    optionalRequirements: [
      ingredient("butter", "Butter or cooking oil", undefined, undefined, false),
      ingredient("salt", "Salt or seasoning", undefined, undefined, false),
    ],
    instructions: [
      "Warm tomatoes with a small amount of water.",
      "Add drained beans and mash part of them into the sauce.",
      "Simmer until thickened.",
      "Serve over warm cooked rice and add cheese.",
    ],
    safetyNotes: ["Serve at a safe eating temperature."],
  },
  {
    id: "staple-2-mild-tomato-lentil-rice-chili",
    title: "Mild Tomato Lentil Rice Chili",
    serves: 2,
    requirements: [
      ingredient("lentils", "Dry lentils", 0.5, "cup"),
      ingredient("canned_tomatoes", "Canned tomatoes", 0.5, "cup"),
      ingredient("rice", "Cooked rice", 0.5, "cup"),
      ingredient("canned_corn", "Canned corn", 0.25, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("saucepan", "Saucepan"),
    ],
    optionalRequirements: [
      ingredient("salt", "Salt", undefined, undefined, false),
      ingredient("cumin", "Cumin", undefined, undefined, false),
    ],
    instructions: [
      "Simmer lentils with tomatoes and water until very soft.",
      "Stir in corn and cooked rice.",
      "Season only with optional ingredients that are actually available.",
    ],
    safetyNotes: ["Ensure lentils are fully cooked and soft."],
  },
  {
    id: "staple-3-rice-bean-quesadilla",
    title: "Rice & Bean Stuffed Tortilla",
    serves: 1,
    requirements: [
      ingredient("bread", "Tortilla or other flatbread", 1, "each"),
      ingredient("canned_beans", "Canned beans", 0.33, "cup"),
      ingredient("rice", "Cooked rice", 0.33, "cup"),
      ingredient("canned_tomatoes", "Tomato sauce", 0.125, "cup"),
      ingredient("cheese", "Cheese", 0.125, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("skillet", "Skillet"),
    ],
    optionalRequirements: [
      ingredient("oil", "Cooking oil", undefined, undefined, false),
    ],
    instructions: [
      "Mix rice, beans, and tomato sauce.",
      "Spread the mixture on the tortilla and add cheese.",
      "Roll and warm in a skillet until heated through.",
    ],
    safetyNotes: ["Cut food into an age-appropriate shape before serving."],
  },
  {
    id: "staple-4-one-pot-spanish-rice",
    title: "One-Pot Golden Tomato Rice with Beans & Peas",
    serves: 3,
    requirements: [
      ingredient("rice", "Dry rice", 1, "cup"),
      ingredient("canned_tomatoes", "Tomato sauce", 0.5, "cup"),
      ingredient("canned_beans", "Canned beans", 0.33, "cup"),
      ingredient("frozen_veg", "Frozen peas or mixed vegetables", 0.33, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("saucepan", "Saucepan with lid"),
    ],
    optionalRequirements: [
      ingredient("oil", "Cooking oil", undefined, undefined, false),
      ingredient("salt", "Salt or seasoning", undefined, undefined, false),
    ],
    instructions: [
      "Combine the reviewed ingredients in a saucepan using the recipe's cooking method.",
      "Cook covered until the rice is tender.",
      "Rest covered before serving.",
    ],
    safetyNotes: ["Check that rice and vegetables are fully cooked."],
  },
  {
    id: "staple-5-tomato-rice-egg-scramble",
    title: "Cheesy Tomato-Rice & Egg Skillet",
    serves: 2,
    requirements: [
      ingredient("rice", "Cooked rice", 0.5, "cup"),
      ingredient("canned_tomatoes", "Tomato sauce", 0.125, "cup"),
      ingredient("eggs", "Eggs", 2, "each"),
      ingredient("cheese", "Cheese", 0.125, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("skillet", "Skillet"),
    ],
    optionalRequirements: [
      ingredient("butter", "Butter or cooking oil", undefined, undefined, false),
    ],
    instructions: [
      "Warm the rice and tomato sauce.",
      "Add beaten eggs and cook until fully set.",
      "Add cheese after cooking.",
    ],
    safetyNotes: ["Cook eggs fully before serving."],
  },
  {
    id: "pancake-banana-oat",
    title: "Banana Oat Pancakes",
    serves: 2,
    requirements: [
      ingredient("bananas", "Banana", 1, "each"),
      ingredient("eggs", "Egg", 1, "each"),
      ingredient("oats", "Rolled oats", 0.5, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("skillet", "Skillet"),
    ],
    optionalRequirements: [
      ingredient("cinnamon", "Cinnamon", undefined, undefined, false),
      ingredient("butter", "Butter or cooking oil", undefined, undefined, false),
    ],
    instructions: [
      "Mash the banana and mix with the egg.",
      "Stir in oats and allow the mixture to thicken briefly.",
      "Cook small pancakes in a skillet until cooked through.",
    ],
    safetyNotes: ["Cool before serving."],
  },
  {
    id: "egg-veggie-mug-bake",
    title: "Microwave Egg & Veggie Mug Bake",
    serves: 1,
    requirements: [
      ingredient("eggs", "Eggs", 2, "each"),
      ingredient("frozen_veg", "Frozen vegetables", 0.125, "cup"),
      ingredient("milk", "Milk or milk alternative", 0.0625, "cup"),
      ingredient("cheese", "Cheese", 0.125, "cup"),
      equipment("microwave", "Microwave"),
      equipment("microwave_mug", "Microwave-safe mug"),
    ],
    optionalRequirements: [
      ingredient("salt", "Salt or seasoning", undefined, undefined, false),
    ],
    instructions: [
      "Whisk the reviewed ingredients in a microwave-safe mug.",
      "Microwave in short intervals, stirring between intervals.",
      "Continue until the egg is fully set.",
    ],
    safetyNotes: ["The mug may be hotter than the food; verify temperature before serving."],
  },
  {
    id: "golden-carrot-mac-cheese",
    title: "Golden Carrot Macaroni & Cheese",
    serves: 2,
    requirements: [
      ingredient("pasta", "Dry pasta", 1, "cup"),
      ingredient("carrots", "Carrot or squash", 0.5, "cup"),
      ingredient("cheese", "Cheese", 0.5, "cup"),
      ingredient("milk", "Milk or milk alternative", 0.25, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("pot", "Cooking pot"),
    ],
    optionalRequirements: [
      ingredient("butter", "Butter", undefined, undefined, false),
    ],
    instructions: [
      "Cook pasta until tender.",
      "Cook carrot or squash until very soft and mash it.",
      "Combine pasta, mashed vegetable, milk, and cheese over low heat.",
    ],
    safetyNotes: ["Vegetables should be soft enough for the intended eater."],
  },
  {
    id: "creamy-tuna-pasta-salad",
    title: "Creamy Tuna & Sweet Corn Pasta",
    serves: 2,
    requirements: [
      ingredient("pasta", "Dry pasta", 1, "cup"),
      ingredient("tuna", "Canned tuna or chicken", 1, "can"),
      ingredient("canned_corn", "Canned corn", 0.5, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("pot", "Cooking pot"),
    ],
    optionalRequirements: [
      ingredient("mayo_yogurt", "Mayonnaise or plain yogurt", undefined, undefined, false),
    ],
    instructions: [
      "Cook pasta until tender and drain.",
      "Combine with drained tuna or chicken and corn.",
      "Add an optional creamy ingredient only if available.",
    ],
    safetyNotes: ["Inspect canned fish for unexpected bones before serving."],
  },
  {
    id: "peanut-butter-apple-oat-crunch",
    title: "Warm Apple, Peanut Butter & Oats",
    serves: 1,
    requirements: [
      ingredient("oats", "Rolled oats", 0.5, "cup"),
      ingredient("apples", "Apple or applesauce", 0.5, "cup"),
      ingredient("pb", "Peanut or nut butter", 0.0625, "cup"),
      equipment("microwave", "Microwave"),
      equipment("microwave_bowl", "Microwave-safe bowl"),
    ],
    optionalRequirements: [
      ingredient("cinnamon", "Cinnamon", undefined, undefined, false),
    ],
    instructions: [
      "Combine oats and apple with water or an available liquid.",
      "Microwave until the oats and apple are soft.",
      "Stir in nut butter after heating.",
    ],
    safetyNotes: ["Serve at a safe eating temperature and account for known allergies."],
  },
];

export interface ResourceCatalogEntry {
  id: string;
  kind: Requirement["kind"];
  label: string;
  unit?: string;
}

export function deriveResourceCatalog(
  recipes: ReviewedRecipe[],
): ResourceCatalogEntry[] {
  const catalog = new Map<string, ResourceCatalogEntry>();

  for (const recipe of recipes) {
    for (const requirement of [...recipe.requirements, ...recipe.optionalRequirements]) {
      const existing = catalog.get(requirement.id);
      catalog.set(requirement.id, {
        id: requirement.id,
        kind: requirement.kind,
        label: existing?.label ?? requirement.label,
        unit: existing?.unit ?? requirement.unit,
      });
    }
  }

  return [...catalog.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function validateReviewedRecipes(
  recipes: ReviewedRecipe[],
): string[] {
  const errors: string[] = [];
  const recipeIds = new Set<string>();
  const units = new Map<string, string>();

  for (const recipe of recipes) {
    if (recipeIds.has(recipe.id)) {
      errors.push(`duplicate recipe id: ${recipe.id}`);
    }
    recipeIds.add(recipe.id);

    if (recipe.requirements.length === 0) {
      errors.push(`recipe has no requirements: ${recipe.id}`);
    }

    for (const requirement of [...recipe.requirements, ...recipe.optionalRequirements]) {
      if (requirement.quantity !== undefined && !requirement.unit) {
        errors.push(`quantity has no unit: ${recipe.id}/${requirement.id}`);
      }

      if (requirement.unit) {
        const prior = units.get(requirement.id);
        if (prior && prior !== requirement.unit) {
          errors.push(
            `unit mismatch for ${requirement.id}: ${prior} vs ${requirement.unit}`,
          );
        } else {
          units.set(requirement.id, requirement.unit);
        }
      }
    }
  }

  return errors;
}
```

- [ ] **Step 6: Run Task 2 GREEN**

Run:

```bash
npm test -- tests/declarations.test.ts tests/reviewed-recipes.test.ts
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit Task 2**

```bash
git add src/fulfillment/declarations.ts src/data/reviewedRecipes.ts tests/declarations.test.ts tests/reviewed-recipes.test.ts
git commit -m "feat: add reviewed recipes and explicit declarations"
```

---

### Task 3: Build the selected-residual-only envelope projection

**Files:**
- Create: `src/fulfillment/envelope.ts`
- Create: `tests/fulfillment-envelope.test.ts`

**Interfaces:**
- Consumes:
  - `ReviewedRecipe`
  - `RequirementEvaluation[]`
  - selected requirement IDs
- Produces:
  - `FulfillmentEnvelopeV0`
  - `createFulfillmentEnvelopeV0(input)`
- Critical boundary: the constructor does **not** accept `DeclaredResource[]`.

- [ ] **Step 1: Write RED envelope tests**

Create `tests/fulfillment-envelope.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { createFulfillmentEnvelopeV0 } from "../src/fulfillment/envelope";
import type {
  RequirementEvaluation,
  ReviewedRecipe,
} from "../src/fulfillment/types";

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
```

- [ ] **Step 2: Run RED**

Run:

```bash
npm test -- tests/fulfillment-envelope.test.ts
```

Expected: FAIL because `src/fulfillment/envelope.ts` does not exist.

- [ ] **Step 3: Implement the envelope constructor**

Create `src/fulfillment/envelope.ts`:

```ts
import type {
  RecipeEvaluation,
  RequirementEvaluation,
  RequirementKind,
  ReviewedRecipe,
} from "./types";

export interface FulfillmentEnvelopeV0 {
  schema: "fulfillment-envelope/v0";
  envelopeId: string;
  purpose: string;
  createdAt: string;
  requirements: Array<{
    id: string;
    kind: RequirementKind;
    description: string;
    quantity?: number;
    unit?: string;
    neededBy?: string;
  }>;
  source: {
    system: "Nourish-Kids";
    recipeId?: string;
  };
  disclosure: {
    includesOnlySelectedResiduals: true;
    omittedPrivateContext: true;
  };
  status: "unmet";
}

interface CreateEnvelopeInput {
  recipe: ReviewedRecipe;
  evaluations: RequirementEvaluation[];
  selectedRequirementIds: string[];
  envelopeId: string;
  createdAt: string;
  neededBy?: string;
}

export function createFulfillmentEnvelopeV0(
  input: CreateEnvelopeInput,
): FulfillmentEnvelopeV0 {
  if (input.selectedRequirementIds.length === 0) {
    throw new Error("Select at least one missing requirement.");
  }

  const requirements = input.selectedRequirementIds.map((requirementId) => {
    const evaluation = input.evaluations.find(
      (item) => item.requirementId === requirementId,
    );
    if (!evaluation || evaluation.status !== "missing") {
      throw new Error(
        `Selected requirement is not missing: ${requirementId}`,
      );
    }

    const requirement = input.recipe.requirements.find(
      (item) => item.id === requirementId,
    );
    if (!requirement) {
      throw new Error(
        `Selected requirement is not part of the reviewed recipe: ${requirementId}`,
      );
    }

    return {
      id: requirement.id,
      kind: requirement.kind,
      description: requirement.label,
      quantity:
        evaluation.residualQuantity ?? requirement.quantity,
      unit: requirement.unit,
      neededBy: input.neededBy,
    };
  });

  return {
    schema: "fulfillment-envelope/v0",
    envelopeId: input.envelopeId,
    purpose: `Help me make ${input.recipe.title}`,
    createdAt: input.createdAt,
    requirements,
    source: {
      system: "Nourish-Kids",
      recipeId: input.recipe.id,
    },
    disclosure: {
      includesOnlySelectedResiduals: true,
      omittedPrivateContext: true,
    },
    status: "unmet",
  };
}
```

Remove the unused `RecipeEvaluation` import if TypeScript flags it.

- [ ] **Step 4: Run envelope tests GREEN**

Run:

```bash
npm test -- tests/fulfillment-envelope.test.ts
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit Task 3**

```bash
git add src/fulfillment/envelope.ts tests/fulfillment-envelope.test.ts
git commit -m "feat: add privacy-bounded fulfillment envelope"
```

---

### Task 4: Wire the truthful Local Chart into the Pantry UI

**Files:**
- Modify: `src/components/PantryStretchView.tsx`
- Create: `src/components/FulfillmentEnvelopePreview.tsx`

**Interfaces:**
- Consumes:
  - `REVIEWED_RECIPES`
  - `deriveResourceCatalog()`
  - `setResourceAvailability()`
  - `setResourceQuantity()`
  - `evaluateRecipe()`
  - `createFulfillmentEnvelopeV0()`
- Produces:
  - visible tri-state declarations;
  - recipe cards with one truthful primary state;
  - selectable known residuals;
  - exact export preview;
  - explicit copy and print actions.

- [ ] **Step 1: Replace implicit pantry ownership with explicit declarations**

In `PantryStretchView.tsx`, remove the preselected ingredient array:

```ts
const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
  "Rolled Oats / Oatmeal",
  "Eggs",
  "Bananas",
  "Canned Black/Pinto Beans"
]);
```

Replace it with:

```ts
const [declaredResources, setDeclaredResources] =
  useState<DeclaredResource[]>([]);
const [selectedResiduals, setSelectedResiduals] =
  useState<Record<string, string[]>>({});
const [previewEnvelope, setPreviewEnvelope] =
  useState<FulfillmentEnvelopeV0 | null>(null);

const resourceCatalog = deriveResourceCatalog(REVIEWED_RECIPES);
const reviewedResults = REVIEWED_RECIPES.map((recipe) => ({
  recipe,
  evaluation: evaluateRecipe(recipe, declaredResources),
}));
```

Keep the existing AI request state separate. Do not feed the reviewed truth-state result from an AI response.

- [ ] **Step 2: Add a three-state resource declaration control**

For each `resourceCatalog` entry, render:

```tsx
<div key={resource.id} className="rounded-xl border border-[#e8ded1] p-3 space-y-2">
  <div className="font-semibold text-xs text-[#2b2219]">
    {resource.label}
  </div>

  <div
    className="grid grid-cols-3 gap-1"
    role="group"
    aria-label={`Availability of ${resource.label}`}
  >
    {(["unknown", "available", "unavailable"] as const).map((availability) => (
      <button
        key={availability}
        type="button"
        aria-pressed={current?.availability === availability || (
          availability === "unknown" && !current
        )}
        onClick={() =>
          setDeclaredResources((prior) =>
            setResourceAvailability(prior, {
              id: resource.id,
              kind: resource.kind,
              label: resource.label,
              availability,
            }),
          )
        }
        className="rounded-lg border px-2 py-1.5 text-[11px] font-semibold"
      >
        {availability === "unknown"
          ? "Not sure"
          : availability === "available"
            ? "Have"
            : "Don't have"}
      </button>
    ))}
  </div>

  {current?.availability === "available" && resource.unit && (
    <label className="block text-[11px] text-[#544538]">
      Amount ({resource.unit})
      <input
        type="number"
        min="0"
        step="0.01"
        value={current.quantity ?? ""}
        onChange={(event) => {
          const value = event.target.value;
          setDeclaredResources((prior) =>
            setResourceQuantity(prior, {
              id: resource.id,
              quantity: value === "" ? undefined : Number(value),
              unit: resource.unit,
            }),
          );
        }}
        className="mt-1 w-full rounded-lg border px-2 py-1.5"
      />
    </label>
  )}
</div>
```

`current` is:

```ts
const current = declaredResources.find(
  (entry) => entry.id === resource.id,
);
```

Do not synthesize an `unavailable` declaration when the user has not touched a resource.

- [ ] **Step 3: Separate reviewed local results from AI ideas**

Replace the old `matchedCuratedRecipes` any-one-ingredient fallback and `recipesToDisplay` logic.

Render the reviewed Local Chart under a heading such as:

```text
Reviewed meals from what you declared
```

If AI results exist, render them in a separate section labeled:

```text
AI meal ideas — not verified against your declared pantry
```

Do not allow AI results to display `Can make now`, `Missing`, or `Need more information` badges unless they are later promoted into the reviewed recipe contract through a separate process.

- [ ] **Step 4: Render exact primary states**

For each reviewed result:

```tsx
const missing = evaluation.evaluations.filter(
  (item) => item.status === "missing",
);
const unknown = evaluation.evaluations.filter(
  (item) => item.status === "unknown",
);
```

Map requirement IDs back to `recipe.requirements`.

Render:

```tsx
{evaluation.primaryStatus === "can_make_now" && (
  <div role="status">
    <strong>Can make now</strong>
    <span>All required items you need are explicitly declared available.</span>
  </div>
)}

{evaluation.primaryStatus === "missing_requirements" && (
  <div role="status">
    <strong>Missing</strong>
    <ul>
      {missing.map((item) => (
        <li key={item.requirementId}>
          {labelFor(item.requirementId)}
          {item.residualQuantity !== undefined
            ? ` — ${item.residualQuantity} ${unitFor(item.requirementId) ?? ""}`
            : ""}
        </li>
      ))}
    </ul>
    {unknown.length > 0 && (
      <p>{unknown.length} other required item(s) still need information.</p>
    )}
  </div>
)}

{evaluation.primaryStatus === "unknown_requirements" && (
  <div role="status">
    <strong>Need more information</strong>
    <ul>
      {unknown.map((item) => (
        <li key={item.requirementId}>
          {labelFor(item.requirementId)}
        </li>
      ))}
    </ul>
  </div>
)}
```

Use visible words/icons in addition to color.

- [ ] **Step 5: Add residual selection**

Only known `missing` requirements receive export checkboxes:

```tsx
<label key={item.requirementId} className="flex items-start gap-2">
  <input
    type="checkbox"
    checked={(selectedResiduals[recipe.id] ?? []).includes(item.requirementId)}
    onChange={() => toggleResidual(recipe.id, item.requirementId)}
  />
  <span>
    Ask for {labelFor(item.requirementId)}
  </span>
</label>
```

Unknown requirements are never selectable as missing requests.

- [ ] **Step 6: Generate the local preview only after explicit selection**

Button:

```tsx
<button
  type="button"
  disabled={(selectedResiduals[recipe.id] ?? []).length === 0}
  onClick={() => {
    const envelope = createFulfillmentEnvelopeV0({
      recipe,
      evaluations: evaluation.evaluations,
      selectedRequirementIds: selectedResiduals[recipe.id] ?? [],
      envelopeId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    setPreviewEnvelope(envelope);
  }}
>
  Ask for only the selected missing thing
</button>
```

No fetch call is added.

- [ ] **Step 7: Implement the exact payload preview component**

Create `src/components/FulfillmentEnvelopePreview.tsx`:

```tsx
import React from "react";
import type { FulfillmentEnvelopeV0 } from "../fulfillment/envelope";

interface Props {
  envelope: FulfillmentEnvelopeV0;
  onClose: () => void;
}

export const FulfillmentEnvelopePreview: React.FC<Props> = ({
  envelope,
  onClose,
}) => {
  const payload = JSON.stringify(envelope, null, 2);

  const copyPayload = async () => {
    await navigator.clipboard.writeText(payload);
  };

  return (
    <section
      aria-labelledby="fulfillment-preview-title"
      className="rounded-2xl border border-[#d2c2b2] bg-[#fffdfa] p-5 space-y-4"
    >
      <div>
        <h3 id="fulfillment-preview-title" className="font-extrabold">
          Exact handoff preview
        </h3>
        <p className="text-xs">
          This is the complete payload. Your full pantry and budget are not included.
        </p>
      </div>

      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#2b2219] p-4 text-xs text-white">
        {payload}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copyPayload}>
          Copy handoff
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
        <button type="button" onClick={onClose}>
          Close preview
        </button>
      </div>
    </section>
  );
};
```

Render this component only when `previewEnvelope` is non-null.

- [ ] **Step 8: Verify Pantry integration**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests pass; TypeScript and Vite build pass.

Manual dev check:

```bash
npm run dev
```

Verify exactly these cases:

1. fresh page: no resource is silently declared present or absent;
2. one `Have` ingredient does not create `Can make now`;
3. `Don't have` creates a visible `Missing` requirement;
4. untouched required items remain `Need more information`;
5. known missing + unknown shows primary `Missing` plus an uncertainty note;
6. only checked missing requirements appear in the preview JSON;
7. preview contains no pantry array, budget, identity, or location;
8. preview status is `unmet`;
9. AI results are visibly separated and not called verified.

- [ ] **Step 9: Commit Task 4**

```bash
git add src/components/PantryStretchView.tsx src/components/FulfillmentEnvelopePreview.tsx
git commit -m "feat: wire truthful pantry residual flow"
```

---

### Task 5: Remove invented budget purchases and close the v0 evidence loop

**Files:**
- Create: `src/budget/budgetState.ts`
- Create: `tests/budget-state.test.ts`
- Modify: `src/components/GroceryBudgetTracker.tsx`
- Modify: `README.md`

**Interfaces:**
- Produces:
  - `ExpenseItem`
  - `SAMPLE_EXPENSES`
  - `initialExpensesFromStorage(raw)`
- Consumes: browser `localStorage` string only at the component boundary.

- [ ] **Step 1: Write RED budget-state tests**

Create `tests/budget-state.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  SAMPLE_EXPENSES,
  initialExpensesFromStorage,
} from "../src/budget/budgetState";

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
```

- [ ] **Step 2: Run RED**

Run:

```bash
npm test -- tests/budget-state.test.ts
```

Expected: FAIL because `src/budget/budgetState.ts` does not exist.

- [ ] **Step 3: Extract the budget truth-state helper**

Create `src/budget/budgetState.ts`:

```ts
export interface ExpenseItem {
  id: string;
  name: string;
  cost: number;
  category:
    | "Produce"
    | "Protein"
    | "Dairy"
    | "Grains"
    | "Canned / Pantry"
    | "Snacks";
}

export const SAMPLE_EXPENSES: ExpenseItem[] = [
  { id: "e1", name: "Rolled Oats (Big Container)", cost: 3.8, category: "Grains" },
  { id: "e2", name: "Large Eggs (1 Dozen)", cost: 2.5, category: "Protein" },
  { id: "e3", name: "Store Brand Peanut Butter (28 oz)", cost: 2.8, category: "Protein" },
  { id: "e4", name: "Canned Diced Tomatoes (3 cans)", cost: 2.25, category: "Canned / Pantry" },
  { id: "e5", name: "Black Beans & Pinto Beans (4 cans)", cost: 3.2, category: "Canned / Pantry" },
  { id: "e6", name: "White Rice (3 lb bag)", cost: 2.3, category: "Grains" },
  { id: "e7", name: "Frozen Peas & Corn (2 bags)", cost: 2.8, category: "Produce" },
  { id: "e8", name: "Bananas & Apples", cost: 3.5, category: "Produce" },
  { id: "e9", name: "Cheddar Cheese Block", cost: 2.5, category: "Dairy" },
];

export function initialExpensesFromStorage(
  raw: string | null,
): ExpenseItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ExpenseItem[]) : [];
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Wire GroceryBudgetTracker to truthful defaults**

In `GroceryBudgetTracker.tsx`:

1. remove the local `ExpenseItem` interface;
2. import:
   ```ts
   import {
     SAMPLE_EXPENSES,
     initialExpensesFromStorage,
     type ExpenseItem,
   } from "../budget/budgetState";
   ```
3. replace the current expense initializer with:
   ```ts
   const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
     try {
       return initialExpensesFromStorage(
         localStorage.getItem("nourish_grocery_expenses"),
       );
     } catch {
       return [];
     }
   });
   ```
4. replace `handleResetSample` with:
   ```ts
   const handleLoadSample = () => {
     setWeeklyBudget(75);
     setExpenses(SAMPLE_EXPENSES.map((item) => ({ ...item })));
   };
   ```
5. rename the handler reference to `handleLoadSample`;
6. keep the visible label `Load Sample Cart`;
7. change the button title to `Load clearly labeled sample budget items`.

Do not automatically persist sample data merely by rendering the page. Persistence occurs only after the explicit click changes `expenses`.

- [ ] **Step 5: Run budget tests GREEN**

Run:

```bash
npm test -- tests/budget-state.test.ts
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Document the witnessed boundary**

Append a concise section to `README.md`:

```md
## FULFILLMENT / The Last Mile v0

Nourish contains an experimental local-first fulfillment specimen.

The reviewed pantry flow distinguishes:

- explicitly available requirements;
- explicitly missing requirements;
- undeclared/unknown requirements.

A recipe is never labeled “Can make now” from a partial ingredient match.

Known missing requirements can be projected into a local
`fulfillment-envelope/v0` preview. The preview includes only the
requirements the user selected and begins with `status: "unmet"`.

V0 does not send requests to Jubilee Campfire or any external service.
It does not rank needs, infer deservingness, or claim real-world
fulfillment. The first proof is only that one missing dinner
requirement can cross the Nourish boundary without gaining facts,
losing uncertainty, or leaking the rest of the pantry.
```

- [ ] **Step 7: Run the full verification gate**

Run in this order:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected:

- all Node/TypeScript tests PASS;
- `tsc --noEmit` PASS;
- production build PASS;
- `git diff --check` emits no whitespace errors.

- [ ] **Step 8: Perform the first end-to-end manual specimen**

Using the dev server:

1. leave most resources untouched;
2. explicitly mark the reviewed recipe's rice, beans, cheese, stove, and saucepan available with sufficient quantities;
3. explicitly mark canned tomatoes unavailable;
4. confirm the recipe state is `Missing`;
5. confirm untouched unrelated requirements remain unknown elsewhere;
6. select only canned tomatoes;
7. generate the preview;
8. inspect the complete JSON;
9. confirm it contains only the tomato residual plus bounded recipe/source metadata;
10. confirm `status` is `unmet`;
11. confirm no full pantry, budget, identity, location, or unrelated history appears.

Preserve the JSON payload in the PR description or a small eval receipt only if it contains no personal data.

- [ ] **Step 9: Commit Task 5**

```bash
git add src/budget/budgetState.ts tests/budget-state.test.ts src/components/GroceryBudgetTracker.tsx README.md
git commit -m "fix: keep sample budget data separate from user state"
```

---

## Final Review Gate

Before declaring v0 complete, inspect the effective diff and explicitly answer:

1. Can any undeclared resource become `missing` instead of `unknown`?
2. Can one matching ingredient still produce `can_make_now`?
3. Can an unknown requirement be exported as if it were missing?
4. Can the envelope constructor receive the complete pantry state?
5. Can a new envelope begin in any state except `unmet`?
6. Can AI output impersonate reviewed local evaluation?
7. Does any new code perform network transmission?
8. Are sample purchases present before the user explicitly loads them?
9. Did any BODY/ALEX/3rdi/LOADOUT/Campfire runtime dependency enter the implementation?
10. Does the end-to-end specimen still satisfy the design acceptance statement?

Any `yes` to questions 1–9 is a release blocker. Question 10 must be `yes`.

## Expected v0 Receipt

A successful implementation may truthfully claim only:

> Nourish can evaluate ten reviewed recipes against explicit local declarations, preserve missing versus unknown state, calculate exact-unit residuals, and create a user-previewed `fulfillment-envelope/v0` containing only selected known missing requirements. The envelope begins unmet and no network fulfillment is claimed.

It may not yet claim Campfire interoperability, community adequacy, actual delivery, or a Collective-wide standard.
