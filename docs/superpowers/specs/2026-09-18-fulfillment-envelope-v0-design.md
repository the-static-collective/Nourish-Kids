# FULFILLMENT / The Last Mile — Nourish Local Chart Design

**Status:** Approved design direction; implementation not yet authorized by this document alone  
**Owner-local source:** Nourish-Kids  
**Date:** 2026-09-18  
**Experimental contract:** `fulfillment-envelope/v0`

## 1. Purpose

Nourish currently helps a person reason about food they may be able to prepare. The first Last Mile slice changes one critical behavior:

> A recipe recommendation must not silently imply that the person has everything required to make it.

The slice introduces an owner-local requirement evaluator that distinguishes what is declared present, what is explicitly missing, and what remains unknown. It then permits the user to export only a selected missing requirement as a portable, privacy-bounded fulfillment envelope.

This is the first Local Chart for a broader cross-organ hypothesis. It does not establish a global Static Collective runtime, ontology, authority layer, or mutual-aid platform.

## 2. Governing Law

The system must preserve these distinctions until evidence legitimately closes them:

```text
HELP EXISTS
  != HELP OFFERED
  != HELP COMMITTED
  != HELP ATTEMPTED
  != HELP RECEIVED
```

Likewise:

```text
RESOURCE-FEASIBLE
  != COMMITTED
  != ATTEMPTED
  != RECEIVED
```

No local or imported event may skip these distinctions merely because a later state appears plausible.

## 3. V0 Scope

V0 is deliberately local-first and narrow.

### Included

- exactly ten reviewed curated recipes;
- explicit required ingredient quantities where practical;
- explicit required equipment;
- distinction between required and optional additions;
- user-declared pantry/equipment state;
- deterministic evaluation into:
  - `can_make_now`
  - `missing_requirements`
  - `unknown_requirements`;
- residual calculation for quantity-bearing requirements;
- a user-controlled “Ask for only the missing thing” projection;
- a local `fulfillment-envelope/v0` object;
- printable/readable result surfaces;
- tests proving no omitted or unknown requirement becomes satisfied by inference.

### Excluded

- automatic Campfire network transmission;
- public posting;
- account creation;
- social ranking;
- reputation systems;
- urgency or deservingness scoring;
- AI deciding whether a need is valid;
- automatic service-directory lookup;
- automatic purchase or delivery;
- medical or dietary diagnosis;
- generalized recipe conversion of the entire existing recipe corpus;
- BODY/ALEX/3rdi/LOADOUT runtime dependencies.

## 4. User Flow

### 4.1 Declare local state

The user declares:

- people to feed;
- pantry items and quantities when known;
- available equipment;
- optional preparation constraints.

An undeclared field remains unknown. Absence of a declaration is not evidence of absence.

### 4.2 Evaluate reviewed recipes

Each reviewed recipe is evaluated against declared state.

The result has three requirement buckets:

```text
SATISFIED
MISSING
UNKNOWN
```

A recipe is `can_make_now` only when all required requirements are satisfied.

A recipe with known missing requirements is not represented as makeable.

A recipe with unresolved required requirements is not represented as makeable.

When a recipe has both known missing requirements and unresolved requirements, the card's primary state is `missing_requirements` while the full evaluation retains the unknown requirements. Primary-state precedence is therefore:

```text
missing_requirements
  > unknown_requirements
  > can_make_now
```

Known actionable blockers must not be hidden merely because another fact remains unknown.

### 4.3 Show the smallest truthful blocker set

The UI presents the requirement structure needed for the immediate action, not every derivable dependency.

Example:

```text
Dinner
├── Ingredients
└── Cooking capability
    ├── Stove
    └── Pan
```

If the user has already declared the stove and pan, the visible residual may be only:

```text
Need:
- 1 can tomatoes
```

Derived or redundant dependency edges must not create duplicate asks.

### 4.4 Export only a chosen residual

The user can select one or more missing requirements and generate a local portable envelope.

Private pantry state is not exported by default.

Before export, the UI shows the exact projected payload.

## 5. Requirement Model

```ts
type RequirementKind =
  | "ingredient"
  | "equipment"
  | "time"
  | "transport"
  | "other";

type RequirementStatus =
  | "satisfied"
  | "missing"
  | "unknown";

interface Requirement {
  id: string;
  kind: RequirementKind;
  label: string;
  required: boolean;
  quantity?: number;
  unit?: string;
  notes?: string;
}

interface RequirementEvaluation {
  requirementId: string;
  status: RequirementStatus;
  declaredQuantity?: number;
  residualQuantity?: number;
  reason: string;
}
```

For quantity-bearing requirements:

```text
residual = max(required - declared_available, 0)
```

If either quantity is unknown, quantity sufficiency remains unknown rather than being coerced to zero or true.

## 6. Reviewed Recipe Contract

The first ten recipes must be explicitly reviewed and represented separately from the legacy `Recipe` shape where necessary.

A reviewed recipe must declare:

```ts
interface ReviewedRecipe {
  id: string;
  title: string;
  serves: number;
  requirements: Requirement[];
  optionalRequirements: Requirement[];
  instructions: string[];
  safetyNotes: string[];
}
```

V0 must not infer exact quantities from prose at runtime. Quantities used for evaluation are authored and reviewed data.

Existing unreviewed recipes may remain visible elsewhere, but they do not participate in the truthful “can make now” gate until reviewed.

## 7. Local Declaration Model

```ts
interface DeclaredResource {
  id: string;
  kind: RequirementKind;
  label: string;
  quantity?: number;
  unit?: string;
  availability: "available" | "unavailable" | "unknown";
  source: "user_declared";
}
```

No default sample ingredient is treated as user-owned inventory.

Sample/demo state, when shown, must be visibly labeled and isolated from actual user state.

## 8. `fulfillment-envelope/v0`

The exported object is intentionally small.

```ts
interface FulfillmentEnvelopeV0 {
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
```

### V0 invariant

A newly exported envelope always begins as `unmet`.

Nourish cannot mark it committed, attempted, reported, confirmed, or fulfilled merely because a compatible offer exists.

## 9. Future Lifecycle Compatibility

A future receiver such as Jubilee Campfire may add owner-local lifecycle events:

```text
declared
  -> proposed
  -> committed
  -> attempted
  -> reported
  -> confirmed
```

Withdrawal, refusal, expiration, partial completion, and blocked states remain representable without rewriting history.

Nourish V0 does not implement those transitions. It exports the unmet requirement faithfully and stops.

## 10. Residual as First-Class State

Residual is not an exception path.

For any fulfillment attempt, the conceptual result is:

```text
original requirement
  - confirmed received contribution
  = residual
```

Residual status must permit:

- `unmet`
- `partial`
- `unknown`
- `blocked`
- `none`

`none` is permitted only when the relevant local authority has sufficient evidence for scoped completion.

A report by a helper is not automatically recipient confirmation.

## 11. Privacy Boundary

Default rule:

> Project the need, not the person.

The export preview must show the exact information leaving Nourish.

The following remain local unless separately and explicitly selected:

- full pantry contents;
- household composition beyond what is required for the selected request;
- budget;
- unrelated dietary information;
- prior requests;
- location;
- identity;
- free-form history.

V0 contains no automatic network send. Export is a local copy/download/print surface or equivalent user-controlled transfer.

## 12. UI Contract

The first implementation modifies the Pantry flow around a simple result hierarchy.

Each reviewed recipe card displays exactly one primary state:

### Can make now

All required requirements are satisfied.

### Missing

Shows the concrete known residuals.

Example:

```text
Missing:
- Canned tomatoes — 1 can
- Cheddar — 2 oz
```

### Need more information

Shows required facts that were not declared.

Example:

```text
Need to know:
- Do you have a stovetop?
- How much rice is available?
```

A recipe must never appear under “Can make now” because one ingredient happened to match.

## 13. Existing Nourish Corrections Included in This Slice

### Pantry selection

The current curated fallback matches when any one recipe ingredient overlaps the selected ingredients. The reviewed flow replaces that implication with complete requirement evaluation.

### Budget state

The current Grocery Budget Tracker initializes with sample purchases when there is no saved user data. That sample data must not be represented as actual spending.

For this slice, sample budget data must either:

1. be removed from default actual state, or
2. be explicitly isolated behind a visible “Load sample” action.

The implementation should use empty actual expenses by default and preserve “Load Sample Cart” as an explicit demo action.

## 14. Architecture Boundaries

### Nourish owns

- recipe requirements;
- pantry/equipment declarations;
- local evaluation;
- residual projection;
- export preview;
- envelope creation.

### Jubilee Campfire may later own

- offers;
- joins/pledges;
- commitment;
- attempt/report/confirmation lifecycle;
- append-only social receipts.

### mundaneWORMHOLE contributes a pattern, not a dependency

Its explicit excerpt-selection and payload-preview pattern informs the privacy UX. Nourish does not import mundaneWORMHOLE runtime code in V0.

### BODY may later discover compatibility

BODY surfaces may declare that two systems expose compatible interfaces. BODY compatibility does not execute the handoff or promote the contract into authority.

### ALEX / 3rdi / LOADOUT / Free Graph / Dogram

They are architectural pressure sources for provenance, occurrence, authority, disclosure, graph reduction, and residual reasoning. None is a production runtime dependency of Nourish V0.

## 15. Error and Uncertainty Behavior

- Missing user declaration -> `unknown`, not `missing`.
- Explicit user declaration of absence -> `missing`.
- Known insufficient quantity -> `missing` with positive residual quantity.
- Unit mismatch that cannot be converted safely -> `unknown`.
- Malformed reviewed recipe data -> recipe excluded from evaluated results and surfaced as a development/data error.
- Envelope export with zero selected residuals -> refused.
- Optional requirements never block `can_make_now`.

## 16. Accessibility and Offline Behavior

The reviewed-recipe evaluator must work without AI and without network access.

Core state labels must not depend on color alone.

The result and export preview must be keyboard reachable and readable by screen readers.

The printable handoff must remain understandable without application styling.

## 17. Testing Contract

At minimum, automated tests must prove:

1. one matching ingredient is insufficient for `can_make_now`;
2. all required declared resources produce `can_make_now`;
3. explicit absence produces `missing`;
4. undeclared required resource produces `unknown`;
5. insufficient quantity produces the correct positive residual;
6. optional requirements do not block completion;
7. a missing equipment requirement behaves like an ingredient requirement;
8. export contains only user-selected residuals;
9. export omits complete pantry state;
10. a new envelope has status `unmet`;
11. zero-residual export is refused;
12. default budget state contains no invented purchases;
13. loading the sample cart is explicit;
14. evaluation is deterministic for identical declarations and reviewed recipe data.

## 18. First End-to-End Specimen

The first success specimen is intentionally mundane.

A person declares enough pantry/equipment state to evaluate one reviewed dinner recipe.

Nourish identifies exactly one missing requirement.

The user selects that requirement and previews an export.

The exported envelope contains only the selected unmet requirement plus bounded source/purpose metadata.

The user's full pantry, budget, and unrelated history do not appear.

The envelope remains `unmet`.

### Acceptance statement

> One actual missing dinner requirement can cross the Nourish boundary without gaining facts, losing uncertainty, leaking private pantry context, or being represented as fulfilled.

## 19. Promotion Boundary

Successful implementation proves only that Nourish can produce a truthful local residual and portable envelope.

It does not prove:

- Campfire interoperability;
- real-world fulfillment;
- community resource sufficiency;
- cross-repo standard status;
- BODY compatibility;
- social usefulness at scale.

Those require separate witnessed crossings.

## 20. Follow-On Seams

Only after the Nourish local specimen is green:

1. define a Campfire receiver adapter for `fulfillment-envelope/v0`;
2. preserve Campfire's own pledge/event authority;
3. execute one real trusted-circle handoff;
4. compare reported completion with recipient confirmation;
5. retain any remaining residual;
6. only then consider BODY surface declarations for the tested compatibility.

The sequence is deliberate:

```text
LOCAL TRUTH
  -> PORTABLE RESIDUAL
  -> RECEIVER ADMISSION
  -> HUMAN HANDOFF
  -> RECEIPT
  -> CONFIRMATION
  -> RESIDUAL AGAIN
```

The loop ends only where reality ends.
