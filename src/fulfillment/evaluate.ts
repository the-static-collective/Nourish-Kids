import type {
  DeclaredResource,
  RecipeEvaluation,
  Requirement,
  RequirementEvaluation,
  ReviewedRecipe,
} from "./types.ts";

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

  if (declaration.quantity === undefined || declaration.unit === undefined) {
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
