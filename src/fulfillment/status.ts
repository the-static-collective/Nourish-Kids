import type { FulfillmentEnvelopeV0 } from "./envelope.ts";

interface ReturnedStatusConservationV0 {
  requestedPlusExcess: number;
  consequencePlusResidual: number;
  holds: true;
}

interface ReturnedStatusRequirementV0 {
  requirementId: string;
  description: string;
  unit?: string;
  requestedQuantity?: number;
  confirmedReceivedQuantity: number;
  resolvedElsewhereQuantity: number;
  waivedQuantity: number;
  confirmedResidualQuantity?: number;
  excessResolvedQuantity: number;
  qualitativeResolved: boolean;
  warnings: string[];
  conservation?: ReturnedStatusConservationV0;
}

export interface HelpCaseStatusPacketV0 {
  schema: "help-case-status/v0";
  caseId: string;
  sourceEnvelopeId: string;
  sourcePayloadHash: string;
  projectedAt: string;
  projectionCut: {
    eventRefs: string[];
    occurrences: Array<{
      eventRef: string;
      type: string;
      occurredAt: string;
    }>;
  };
  requirements: ReturnedStatusRequirementV0[];
  claims: {
    projectionOnly: true;
    residualChangesOnlyThroughRecipientConsequence: true;
    quantitativeConservationChecked: true;
  };
}

export interface FulfillmentReturnProjectionV0 {
  schema: "fulfillment-return/v0";
  sourceEnvelopeId: string;
  sourcePayloadHash: string;
  caseId: string;
  projectedAt: string;
  eventRefs: string[];
  status: "unresolved" | "partially_resolved" | "resolved";
  requirements: Array<{
    requirementId: string;
    description: string;
    unit?: string;
    requestedQuantity?: number;
    confirmedReceivedQuantity: number;
    resolvedElsewhereQuantity: number;
    waivedQuantity: number;
    residualQuantity?: number;
    excessResolvedQuantity: number;
    qualitativeResolved: boolean;
    warnings: string[];
  }>;
  sourceEnvelopeUnchanged: true;
  authority: "projection-only";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function nearlyEqual(left: number, right: number): boolean {
  const scale = Math.max(1, Math.abs(left), Math.abs(right));
  return Math.abs(left - right) <= Number.EPSILON * scale * 8;
}

function parseStatusPacket(value: unknown): HelpCaseStatusPacketV0 {
  if (!isRecord(value) || value.schema !== "help-case-status/v0") {
    throw new Error("UNSUPPORTED_HELP_CASE_STATUS");
  }

  if (
    typeof value.caseId !== "string" ||
    !value.caseId ||
    typeof value.sourceEnvelopeId !== "string" ||
    !value.sourceEnvelopeId ||
    typeof value.sourcePayloadHash !== "string" ||
    !value.sourcePayloadHash ||
    typeof value.projectedAt !== "string" ||
    !value.projectedAt
  ) {
    throw new Error("INVALID_HELP_CASE_STATUS_IDENTITY");
  }

  if (!isRecord(value.projectionCut) || !Array.isArray(value.projectionCut.eventRefs)) {
    throw new Error("INVALID_HELP_CASE_STATUS_CUT");
  }

  if (
    !value.projectionCut.eventRefs.every((eventRef) => typeof eventRef === "string") ||
    !Array.isArray(value.projectionCut.occurrences)
  ) {
    throw new Error("INVALID_HELP_CASE_STATUS_CUT");
  }

  if (
    !isRecord(value.claims) ||
    value.claims.projectionOnly !== true ||
    value.claims.residualChangesOnlyThroughRecipientConsequence !== true ||
    value.claims.quantitativeConservationChecked !== true
  ) {
    throw new Error("INVALID_HELP_CASE_STATUS_CLAIMS");
  }

  if (!Array.isArray(value.requirements) || value.requirements.length === 0) {
    throw new Error("INVALID_HELP_CASE_STATUS_REQUIREMENTS");
  }

  const requirementIds = new Set<string>();
  for (const requirement of value.requirements) {
    if (!isRecord(requirement)) {
      throw new Error("INVALID_HELP_CASE_STATUS_REQUIREMENT");
    }

    if (
      typeof requirement.requirementId !== "string" ||
      !requirement.requirementId ||
      requirementIds.has(requirement.requirementId) ||
      typeof requirement.description !== "string" ||
      !requirement.description ||
      !isFiniteNonNegative(requirement.confirmedReceivedQuantity) ||
      !isFiniteNonNegative(requirement.resolvedElsewhereQuantity) ||
      !isFiniteNonNegative(requirement.waivedQuantity) ||
      !isFiniteNonNegative(requirement.excessResolvedQuantity) ||
      typeof requirement.qualitativeResolved !== "boolean" ||
      !Array.isArray(requirement.warnings)
    ) {
      throw new Error("INVALID_HELP_CASE_STATUS_REQUIREMENT");
    }
    requirementIds.add(requirement.requirementId);

    if (
      requirement.requestedQuantity !== undefined &&
      !isFiniteNonNegative(requirement.requestedQuantity)
    ) {
      throw new Error("INVALID_HELP_CASE_STATUS_QUANTITY");
    }
    if (
      requirement.confirmedResidualQuantity !== undefined &&
      !isFiniteNonNegative(requirement.confirmedResidualQuantity)
    ) {
      throw new Error("INVALID_HELP_CASE_STATUS_QUANTITY");
    }

    if (requirement.requestedQuantity !== undefined) {
      if (
        requirement.confirmedResidualQuantity === undefined ||
        !isRecord(requirement.conservation) ||
        requirement.conservation.holds !== true ||
        !isFiniteNonNegative(requirement.conservation.requestedPlusExcess) ||
        !isFiniteNonNegative(requirement.conservation.consequencePlusResidual)
      ) {
        throw new Error("HELP_CASE_STATUS_CONSERVATION_REQUIRED");
      }

      const left =
        requirement.requestedQuantity + requirement.excessResolvedQuantity;
      const right =
        requirement.confirmedReceivedQuantity +
        requirement.resolvedElsewhereQuantity +
        requirement.waivedQuantity +
        requirement.confirmedResidualQuantity;

      if (
        !nearlyEqual(left, right) ||
        !nearlyEqual(left, requirement.conservation.requestedPlusExcess) ||
        !nearlyEqual(right, requirement.conservation.consequencePlusResidual)
      ) {
        throw new Error("HELP_CASE_STATUS_CONSERVATION_BREACH");
      }
    }
  }

  return value as unknown as HelpCaseStatusPacketV0;
}

export function projectReturnedHelpStatus(
  sourceEnvelope: FulfillmentEnvelopeV0,
  statusInput: unknown,
): FulfillmentReturnProjectionV0 {
  const packet = parseStatusPacket(statusInput);

  if (packet.sourceEnvelopeId !== sourceEnvelope.envelopeId) {
    throw new Error("HELP_CASE_STATUS_ENVELOPE_MISMATCH");
  }

  const packetById = new Map(
    packet.requirements.map((requirement) => [
      requirement.requirementId,
      requirement,
    ] as const),
  );

  if (packetById.size !== sourceEnvelope.requirements.length) {
    throw new Error("HELP_CASE_STATUS_REQUIREMENT_SET_MISMATCH");
  }

  const requirements = sourceEnvelope.requirements.map((sourceRequirement) => {
    const returned = packetById.get(sourceRequirement.id);
    if (!returned) {
      throw new Error("HELP_CASE_STATUS_REQUIREMENT_SET_MISMATCH");
    }

    if (returned.description !== sourceRequirement.description) {
      throw new Error("HELP_CASE_STATUS_REQUIREMENT_DESCRIPTION_MISMATCH");
    }

    if (returned.unit !== sourceRequirement.unit) {
      throw new Error("HELP_CASE_STATUS_REQUIREMENT_UNIT_MISMATCH");
    }

    if (sourceRequirement.quantity === undefined) {
      if (
        returned.requestedQuantity !== undefined ||
        returned.confirmedResidualQuantity !== undefined
      ) {
        throw new Error("HELP_CASE_STATUS_QUALITATIVE_MISMATCH");
      }
    } else if (
      returned.requestedQuantity === undefined ||
      !nearlyEqual(returned.requestedQuantity, sourceRequirement.quantity)
    ) {
      throw new Error("HELP_CASE_STATUS_REQUESTED_QUANTITY_MISMATCH");
    }

    return {
      requirementId: sourceRequirement.id,
      description: sourceRequirement.description,
      ...(sourceRequirement.unit === undefined ? {} : { unit: sourceRequirement.unit }),
      ...(sourceRequirement.quantity === undefined
        ? {}
        : { requestedQuantity: sourceRequirement.quantity }),
      confirmedReceivedQuantity: returned.confirmedReceivedQuantity,
      resolvedElsewhereQuantity: returned.resolvedElsewhereQuantity,
      waivedQuantity: returned.waivedQuantity,
      ...(returned.confirmedResidualQuantity === undefined
        ? {}
        : { residualQuantity: returned.confirmedResidualQuantity }),
      excessResolvedQuantity: returned.excessResolvedQuantity,
      qualitativeResolved: returned.qualitativeResolved,
      warnings: [...returned.warnings],
    };
  });

  const resolved = requirements.every((requirement) =>
    requirement.requestedQuantity === undefined
      ? requirement.qualitativeResolved
      : requirement.residualQuantity === 0,
  );
  const anyConsequence = requirements.some(
    (requirement) =>
      requirement.confirmedReceivedQuantity > 0 ||
      requirement.resolvedElsewhereQuantity > 0 ||
      requirement.waivedQuantity > 0 ||
      requirement.qualitativeResolved,
  );

  return {
    schema: "fulfillment-return/v0",
    sourceEnvelopeId: sourceEnvelope.envelopeId,
    sourcePayloadHash: packet.sourcePayloadHash,
    caseId: packet.caseId,
    projectedAt: packet.projectedAt,
    eventRefs: [...packet.projectionCut.eventRefs],
    status: resolved
      ? "resolved"
      : anyConsequence
        ? "partially_resolved"
        : "unresolved",
    requirements,
    sourceEnvelopeUnchanged: true,
    authority: "projection-only",
  };
}
