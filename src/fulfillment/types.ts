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
