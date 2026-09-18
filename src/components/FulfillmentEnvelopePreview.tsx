import React, { useState } from "react";
import type { FulfillmentEnvelopeV0 } from "../fulfillment/envelope.ts";

interface Props {
  envelope: FulfillmentEnvelopeV0;
  onClose: () => void;
}

export const FulfillmentEnvelopePreview: React.FC<Props> = ({
  envelope,
  onClose,
}) => {
  const [copyStatus, setCopyStatus] = useState("");
  const payload = JSON.stringify(envelope, null, 2);

  const copyPayload = async () => {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(payload);
      setCopyStatus("Copied.");
    } catch {
      setCopyStatus("Copy unavailable. Select the JSON below manually.");
    }
  };

  return (
    <section
      aria-labelledby="fulfillment-preview-title"
      className="rounded-2xl border border-[#d2c2b2] bg-[#fffdfa] p-5 space-y-4 shadow-sm"
    >
      <div className="space-y-1">
        <h3 id="fulfillment-preview-title" className="font-extrabold text-[#2b2219]">
          Exact handoff preview
        </h3>
        <p className="text-xs text-[#6e5d50]">
          This is the complete payload. Your full pantry, budget, identity, and location are not included.
        </p>
      </div>

      <pre
        tabIndex={0}
        className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-[#2b2219] p-4 text-xs text-white"
      >
        {payload}
      </pre>

      {copyStatus && <p role="status" className="text-xs text-[#544538]">{copyStatus}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyPayload}
          className="rounded-xl bg-[#436a52] px-4 py-2 text-xs font-bold text-white"
        >
          Copy handoff
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl border border-[#d2c2b2] px-4 py-2 text-xs font-bold text-[#2b2219]"
        >
          Print
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[#d2c2b2] px-4 py-2 text-xs font-bold text-[#2b2219]"
        >
          Close preview
        </button>
      </div>
    </section>
  );
};
