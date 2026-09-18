import type { ReviewedRecipe } from "./types.ts";

export function scaleReviewedRecipe(
  recipe: ReviewedRecipe,
  peopleToFeed: number,
): ReviewedRecipe {
  if (!Number.isFinite(peopleToFeed) || peopleToFeed <= 0) {
    throw new Error("People to feed must be a positive number.");
  }

  const factor = peopleToFeed / recipe.serves;
  const scaleRequirement = (requirement: ReviewedRecipe["requirements"][number]) =>
    requirement.kind === "ingredient" && requirement.quantity !== undefined
      ? { ...requirement, quantity: requirement.quantity * factor }
      : { ...requirement };

  return {
    ...recipe,
    serves: peopleToFeed,
    requirements: recipe.requirements.map(scaleRequirement),
    optionalRequirements: recipe.optionalRequirements.map(scaleRequirement),
  };
}
