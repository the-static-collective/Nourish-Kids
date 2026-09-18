import type {
  RecipePrimaryStatus,
  RequirementEvaluation,
} from "./types.ts";

export function partitionEvaluations(evaluations: RequirementEvaluation[]) {
  return {
    satisfied: evaluations.filter((item) => item.status === "satisfied"),
    missing: evaluations.filter((item) => item.status === "missing"),
    unknown: evaluations.filter((item) => item.status === "unknown"),
  };
}

export function statusCopy(status: RecipePrimaryStatus): {
  label: string;
  detail: string;
} {
  switch (status) {
    case "can_make_now":
      return {
        label: "Can make now",
        detail: "All required items are explicitly declared available.",
      };
    case "missing_requirements":
      return {
        label: "Missing",
        detail: "At least one required item is explicitly absent or insufficient.",
      };
    case "unknown_requirements":
      return {
        label: "Need more information",
        detail: "At least one required item has not been explicitly declared.",
      };
  }
}
