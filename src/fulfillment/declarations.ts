import type { DeclaredResource, RequirementKind } from "./types.ts";

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

  if (input.availability === "unknown") return remaining;

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
      ? { ...resource, quantity: input.quantity, unit: input.unit }
      : resource,
  );
}
