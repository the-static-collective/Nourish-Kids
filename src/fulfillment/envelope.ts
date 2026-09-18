import type {
  RequirementEvaluation,
  RequirementKind,
  ReviewedRecipe,
} from "./types.ts";

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
      throw new Error(`Selected requirement is not missing: ${requirementId}`);
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
      quantity: evaluation.residualQuantity ?? requirement.quantity,
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
