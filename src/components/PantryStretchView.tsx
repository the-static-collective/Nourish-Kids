import React, { useState } from "react";
import {
  AlertCircle,
  Baby,
  ChefHat,
  Heart,
  HelpCircle,
  PackageCheck,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";

import { CURATED_RECIPES } from "../data/curatedRecipes";
import {
  REVIEWED_RECIPES,
  admitReviewedRecipes,
  deriveResourceCatalog,
} from "../data/reviewedRecipes.ts";
import {
  setResourceAvailability,
  setResourceQuantity,
} from "../fulfillment/declarations.ts";
import { createFulfillmentEnvelopeV0 } from "../fulfillment/envelope.ts";
import type { FulfillmentEnvelopeV0 } from "../fulfillment/envelope.ts";
import { evaluateRecipe } from "../fulfillment/evaluate.ts";
import {
  partitionEvaluations,
  statusCopy,
} from "../fulfillment/presentation.ts";
import { scaleReviewedRecipe } from "../fulfillment/scale.ts";
import type { DeclaredResource, ReviewedRecipe } from "../fulfillment/types.ts";
import { AgeGroup, Recipe } from "../types";
import { FulfillmentEnvelopePreview } from "./FulfillmentEnvelopePreview.tsx";

interface PantryStretchViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
  savedRecipes: Recipe[];
  onToggleSave: (recipe: Recipe) => void;
}

const REVIEWED_ADMISSION = admitReviewedRecipes(REVIEWED_RECIPES);
const ACTIVE_REVIEWED_RECIPES = REVIEWED_ADMISSION.recipes;
const REVIEWED_DATA_ERRORS = REVIEWED_ADMISSION.errors;
const RESOURCE_CATALOG = deriveResourceCatalog(ACTIVE_REVIEWED_RECIPES);
const NUMBER_FORMAT = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
});

const quantityText = (
  quantity: number | undefined,
  unit: string | undefined,
): string => {
  if (quantity === undefined) return "";
  return ` — ${NUMBER_FORMAT.format(quantity)}${unit ? ` ${unit}` : ""}`;
};

export const PantryStretchView: React.FC<PantryStretchViewProps> = ({
  onSelectRecipe,
  savedRecipes,
  onToggleSave,
}) => {
  const [declaredResources, setDeclaredResources] = useState<DeclaredResource[]>([]);
  const [peopleToFeed, setPeopleToFeed] = useState(2);
  const [selectedResiduals, setSelectedResiduals] = useState<Record<string, string[]>>({});
  const [previewEnvelope, setPreviewEnvelope] =
    useState<FulfillmentEnvelopeV0 | null>(null);

  const [customInput, setCustomInput] = useState("");
  const [customAiIngredients, setCustomAiIngredients] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("all");
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);
  const [encouragement, setEncouragement] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const constraintOptions = [
    "Under 10 Minutes",
    "No Stove / Microwave Only",
    "Under $1.00 Per Portion",
    "High Protein / Iron",
    "Soft Texture / Easy Chew",
    "Hidden Veggies",
  ];

  const ingredientResources = RESOURCE_CATALOG.filter(
    (resource) => resource.kind === "ingredient",
  );
  const equipmentResources = RESOURCE_CATALOG.filter(
    (resource) => resource.kind === "equipment",
  );

  const declaredAiIngredients = declaredResources
    .filter(
      (resource) =>
        resource.kind === "ingredient" && resource.availability === "available",
    )
    .map((resource) => resource.label);

  const aiIngredients = [...new Set([...declaredAiIngredients, ...customAiIngredients])];

  const reviewedResults = ACTIVE_REVIEWED_RECIPES.map((baseRecipe) => {
    const recipe = scaleReviewedRecipe(baseRecipe, peopleToFeed);
    return {
      recipe,
      evaluation: evaluateRecipe(recipe, declaredResources),
      legacyRecipe: CURATED_RECIPES.find((item) => item.id === baseRecipe.id),
    };
  });

  const updateAvailability = (
    id: string,
    kind: DeclaredResource["kind"],
    label: string,
    availability: "available" | "unavailable" | "unknown",
  ) => {
    setDeclaredResources((prior) =>
      setResourceAvailability(prior, { id, kind, label, availability }),
    );
    setPreviewEnvelope(null);
  };

  const updateQuantity = (
    id: string,
    quantity: number | undefined,
    unit: string | undefined,
  ) => {
    setDeclaredResources((prior) =>
      setResourceQuantity(prior, { id, quantity, unit }),
    );
    setPreviewEnvelope(null);
  };

  const toggleResidual = (recipeId: string, requirementId: string) => {
    setSelectedResiduals((prior) => {
      const current = prior[recipeId] ?? [];
      const next = current.includes(requirementId)
        ? current.filter((id) => id !== requirementId)
        : [...current, requirementId];
      return { ...prior, [recipeId]: next };
    });
  };

  const handleAddCustomAiIngredient = (event: React.FormEvent) => {
    event.preventDefault();
    const item = customInput.trim();
    if (!item) return;

    setCustomAiIngredients((prior) =>
      prior.includes(item) ? prior : [...prior, item],
    );
    setCustomInput("");
  };

  const toggleConstraint = (constraint: string) => {
    setSelectedConstraints((prior) =>
      prior.includes(constraint)
        ? prior.filter((item) => item !== constraint)
        : [...prior, constraint],
    );
  };

  const handleGenerateAiRecipes = async () => {
    if (aiIngredients.length === 0) {
      setErrorMessage(
        "Declare at least one ingredient you have, or add an AI-only extra ingredient.",
      );
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/pantry-stretch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: aiIngredients,
          ageGroup:
            ageGroup === "toddler"
              ? "Toddler (1-3 yrs)"
              : ageGroup === "early_child"
                ? "Child (4-7 yrs)"
                : ageGroup === "school_age"
                  ? "School Age (8-12 yrs)"
                  : "All Ages",
          constraints: selectedConstraints,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to AI recipe server.");
      }

      const data = await response.json();
      if (data.recipes && Array.isArray(data.recipes)) {
        setAiRecipes(data.recipes);
      }
      if (data.encouragement) {
        setEncouragement(data.encouragement);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.message ||
          "Something went wrong generating AI ideas. The reviewed local results still work offline.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderResource = (
    resource: (typeof RESOURCE_CATALOG)[number],
  ) => {
    const current = declaredResources.find((entry) => entry.id === resource.id);
    const currentAvailability = current?.availability ?? "unknown";

    return (
      <div
        key={resource.id}
        className="rounded-xl border border-[#e8ded1] bg-[#fffdfa] p-3 space-y-2"
      >
        <div className="text-xs font-semibold text-[#2b2219]">
          {resource.label}
        </div>

        <div
          className="grid grid-cols-3 gap-1"
          role="group"
          aria-label={`Availability of ${resource.label}`}
        >
          {(
            [
              ["unknown", "Not sure"],
              ["available", "Have"],
              ["unavailable", "Don't have"],
            ] as const
          ).map(([availability, label]) => {
            const active = currentAvailability === availability;
            return (
              <button
                key={availability}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  updateAvailability(
                    resource.id,
                    resource.kind,
                    resource.label,
                    availability,
                  )
                }
                className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition ${
                  active
                    ? "border-[#2b2219] bg-[#2b2219] text-white"
                    : "border-[#d2c2b2] bg-[#f9f3ec] text-[#544538]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {current?.availability === "available" && resource.unit && (
          <label className="block text-[11px] font-medium text-[#544538]">
            Amount ({resource.unit})
            <input
              type="number"
              min="0"
              step="0.01"
              value={current.quantity ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                updateQuantity(
                  resource.id,
                  value === "" ? undefined : Number(value),
                  resource.unit,
                );
              }}
              className="mt-1 w-full rounded-lg border border-[#d2c2b2] bg-white px-2 py-1.5 text-xs"
            />
          </label>
        )}
      </div>
    );
  };

  const renderRequirementLine = (
    recipe: ReviewedRecipe,
    requirementId: string,
    residualQuantity?: number,
  ) => {
    const requirement = recipe.requirements.find(
      (item) => item.id === requirementId,
    );
    if (!requirement) return requirementId;

    return `${requirement.label}${quantityText(
      residualQuantity,
      requirement.unit,
    )}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#2b2219] to-[#453325] text-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97736]/20 border border-[#d97736]/30 text-xs font-semibold text-[#f7e09e]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pantry Local Chart</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          What can you actually make, and what is still missing?
        </h2>
        <p className="text-sm text-[#d1c2b5] leading-relaxed max-w-2xl">
          Nothing is assumed. Mark what you have, what you do not have, and what
          you are not sure about. Reviewed meals stay separate from AI ideas.
        </p>
      </div>

      <section className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Baby className="w-5 h-5 text-[#b85a22]" />
          <div>
            <h3 className="font-extrabold text-[#2b2219]">How many people are eating?</h3>
            <p className="text-xs text-[#6e5d50]">
              Reviewed ingredient quantities scale to this count. Equipment does not.
            </p>
          </div>
        </div>
        <input
          type="number"
          min="1"
          step="1"
          value={peopleToFeed}
          onChange={(event) =>
            setPeopleToFeed(Math.max(1, Math.floor(Number(event.target.value) || 1)))
          }
          className="w-32 rounded-xl border border-[#d2c2b2] bg-white px-3 py-2 font-bold text-[#2b2219]"
          aria-label="People to feed"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#2b2219] flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#b85a22]" />
            Declare pantry ingredients
          </h3>
          <p className="text-xs text-[#6e5d50]">
            Untouched items remain unknown. “Don't have” is an explicit declaration.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ingredientResources.map(renderResource)}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#2b2219]">
            Declare cooking equipment
          </h3>
          <p className="text-xs text-[#6e5d50]">
            Equipment is evaluated just like ingredients but is never multiplied by serving count.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {equipmentResources.map(renderResource)}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-[#e8ded1] pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#2b2219]">
              Reviewed meals from what you declared
            </h3>
            <p className="text-xs text-[#6e5d50]">
              Exactly ten reviewed recipes participate in this truth-state gate.
            </p>
          </div>
          <span className="rounded-full bg-[#f3e8dd] px-3 py-1 text-xs font-bold text-[#8a5b28]">
            {reviewedResults.length} reviewed
          </span>
        </div>

        {REVIEWED_DATA_ERRORS.length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-[#f8d7d7] bg-[#fdf2f2] p-4 text-xs text-[#b82a2a]"
          >
            Reviewed recipe data failed validation, so no reviewed recipe is being presented as makeable.
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          {reviewedResults.map(({ recipe, evaluation, legacyRecipe }) => {
            const { missing, unknown } = partitionEvaluations(
              evaluation.evaluations,
            );
            const copy = statusCopy(evaluation.primaryStatus);
            const selected = selectedResiduals[recipe.id] ?? [];
            const activeSelected = selected.filter((id) =>
              missing.some((item) => item.requirementId === id),
            );
            const isSaved =
              legacyRecipe &&
              savedRecipes.some((item) => item.title === legacyRecipe.title);

            return (
              <article
                key={recipe.id}
                className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-5 shadow-sm space-y-4"
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-bold text-[#2b2219]">
                      {recipe.title}
                    </h4>
                    <span className="shrink-0 rounded-full bg-[#f9f3ec] px-2.5 py-1 text-[11px] font-bold text-[#6e5d50]">
                      serves {recipe.serves}
                    </span>
                  </div>
                </div>

                <div
                  role="status"
                  className={`rounded-xl border p-3 text-xs space-y-1 ${
                    evaluation.primaryStatus === "can_make_now"
                      ? "border-[#c4e2bd] bg-[#e3eedb] text-[#214028]"
                      : evaluation.primaryStatus === "missing_requirements"
                        ? "border-[#f0c6ba] bg-[#fff1ec] text-[#7f341f]"
                        : "border-[#e7d7a8] bg-[#fff9e8] text-[#66521b]"
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold">
                    {evaluation.primaryStatus === "can_make_now" ? (
                      <PackageCheck className="w-4 h-4" />
                    ) : evaluation.primaryStatus === "missing_requirements" ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <HelpCircle className="w-4 h-4" />
                    )}
                    <span>{copy.label}</span>
                  </div>
                  <p>{copy.detail}</p>
                </div>

                {missing.length > 0 && (
                  <div className="space-y-2">
                    <strong className="text-xs text-[#2b2219]">
                      Known missing requirements
                    </strong>
                    <div className="space-y-2">
                      {missing.map((item) => (
                        <label
                          key={item.requirementId}
                          className="flex items-start gap-2 rounded-lg border border-[#e8ded1] bg-[#f9f3ec] p-2 text-xs text-[#544538]"
                        >
                          <input
                            type="checkbox"
                            checked={activeSelected.includes(item.requirementId)}
                            onChange={() =>
                              toggleResidual(recipe.id, item.requirementId)
                            }
                            className="mt-0.5"
                          />
                          <span>
                            Ask for{" "}
                            {renderRequirementLine(
                              recipe,
                              item.requirementId,
                              item.residualQuantity,
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                    {unknown.length > 0 && (
                      <p className="text-[11px] text-[#6e5d50]">
                        {unknown.length} other required item
                        {unknown.length === 1 ? "" : "s"} still need information.
                      </p>
                    )}
                  </div>
                )}

                {evaluation.primaryStatus === "unknown_requirements" && (
                  <div className="space-y-1">
                    <strong className="text-xs text-[#2b2219]">Need to know</strong>
                    <ul className="list-disc pl-5 text-xs text-[#544538]">
                      {unknown.map((item) => (
                        <li key={item.requirementId}>
                          {renderRequirementLine(recipe, item.requirementId)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <details className="text-xs text-[#544538]">
                  <summary className="cursor-pointer font-bold text-[#2b2219]">
                    Reviewed cooking notes
                  </summary>
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    {recipe.instructions.map((instruction) => (
                      <li key={instruction}>{instruction}</li>
                    ))}
                  </ol>
                  {recipe.safetyNotes.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {recipe.safetyNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  )}
                </details>

                {missing.length > 0 && (
                  <button
                    type="button"
                    disabled={activeSelected.length === 0}
                    onClick={() => {
                      const envelope = createFulfillmentEnvelopeV0({
                        recipe,
                        evaluations: evaluation.evaluations,
                        selectedRequirementIds: activeSelected,
                        envelopeId: crypto.randomUUID(),
                        createdAt: new Date().toISOString(),
                      });
                      setPreviewEnvelope(envelope);
                    }}
                    className="w-full rounded-xl bg-[#436a52] px-4 py-2.5 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Ask for only the selected missing thing
                  </button>
                )}

                {legacyRecipe && (
                  <div className="flex flex-wrap gap-2 border-t border-[#e8ded1] pt-3">
                    <button
                      type="button"
                      onClick={() => onSelectRecipe(legacyRecipe)}
                      className="text-xs font-bold text-[#b85a22] hover:underline"
                    >
                      View original detailed recipe
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSave(legacyRecipe)}
                      className="text-xs font-bold text-[#436a52] hover:underline"
                    >
                      {isSaved ? "Saved" : "Save recipe"}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {previewEnvelope && (
        <FulfillmentEnvelopePreview
          envelope={previewEnvelope}
          onClose={() => setPreviewEnvelope(null)}
        />
      )}

      <section className="rounded-2xl border border-[#e8ded1] bg-[#fffdfa] p-6 space-y-5 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-[#2b2219]">
            Optional AI meal ideas
          </h3>
          <p className="text-xs text-[#6e5d50]">
            AI ideas are not reviewed against the local truth-state gate and are never labeled “Can make now.”
          </p>
        </div>

        <form onSubmit={handleAddCustomAiIngredient} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            placeholder="Add AI-only extra ingredient"
            className="flex-1 rounded-xl border border-[#d2c2b2] bg-white px-4 py-2.5 text-xs"
          />
          <button
            type="submit"
            className="rounded-xl border border-[#d2c2b2] bg-[#f9f3ec] px-4 py-2.5 text-xs font-bold"
          >
            Add
          </button>
        </form>

        {customAiIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customAiIngredients.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() =>
                  setCustomAiIngredients((prior) =>
                    prior.filter((value) => value !== item),
                  )
                }
                className="rounded-full bg-[#f3e8dd] px-3 py-1 text-[11px] font-semibold text-[#8a5b28]"
                title="Remove AI-only ingredient"
              >
                {item} ×
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 text-xs font-bold text-[#2b2219]">Age group</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "all", label: "All Ages" },
                { id: "toddler", label: "Toddler" },
                { id: "early_child", label: "Child 4-7" },
                { id: "school_age", label: "School Age" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setAgeGroup(item.id as AgeGroup)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                    ageGroup === item.id
                      ? "border-[#b85a22] bg-[#b85a22] text-white"
                      : "border-[#d2c2b2] bg-[#f9f3ec] text-[#544538]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-bold text-[#2b2219]">Optional goals</div>
            <div className="flex flex-wrap gap-2">
              {constraintOptions.map((constraint) => {
                const selected = selectedConstraints.includes(constraint);
                return (
                  <button
                    type="button"
                    key={constraint}
                    onClick={() => toggleConstraint(constraint)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                      selected
                        ? "border-[#436a52] bg-[#436a52] text-white"
                        : "border-[#d2c2b2] bg-[#f9f3ec] text-[#544538]"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {constraint}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-[#f8d7d7] bg-[#fdf2f2] p-3 text-xs text-[#b82a2a] flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerateAiRecipes}
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-[#b85a22] to-[#d97736] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating AI ideas…
            </span>
          ) : (
            "Generate AI ideas from declared available ingredients"
          )}
        </button>

        {encouragement && (
          <div className="rounded-xl border border-[#c4e2bd] bg-[#f0f7ed] p-4 text-xs text-[#214028] flex gap-2">
            <Heart className="w-4 h-4 shrink-0" />
            <span>{encouragement}</span>
          </div>
        )}

        {aiRecipes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm text-[#2b2219]">
                AI meal ideas — not verified against your declared pantry
              </strong>
              <button
                type="button"
                onClick={() => setAiRecipes([])}
                className="text-xs font-bold text-[#b85a22] hover:underline"
              >
                Clear AI ideas
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {aiRecipes.map((recipe, index) => {
                const isSaved = savedRecipes.some(
                  (saved) => saved.title === recipe.title,
                );
                return (
                  <article
                    key={recipe.id || index}
                    className="rounded-2xl border border-[#e8ded1] bg-[#fffdfa] p-4 space-y-3"
                  >
                    <div className="rounded-lg border border-[#e7d7a8] bg-[#fff9e8] p-2 text-[11px] font-bold text-[#66521b]">
                      AI idea — availability not verified
                    </div>
                    <h4 className="font-bold text-[#2b2219]">{recipe.title}</h4>
                    <p className="text-xs text-[#544538]">{recipe.description}</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => onSelectRecipe(recipe)}
                        className="text-xs font-bold text-[#b85a22] hover:underline"
                      >
                        View AI recipe
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleSave(recipe)}
                        className="text-xs font-bold text-[#436a52] hover:underline"
                      >
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
