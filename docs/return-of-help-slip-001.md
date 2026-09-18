# RETURN-OF-THE-HELP-SLIP-001 — Nourish return

Nourish can now accept a `help-case-status/v0` projection produced downstream
of a held help case and turn it into a local `fulfillment-return/v0` view.

The source `fulfillment-envelope/v0` remains unchanged.

## Admission checks

The return membrane refuses:

- the wrong source envelope id;
- a changed requirement set;
- changed requirement descriptions, units, or requested quantities;
- malformed consequence quantities;
- a quantitative status without the conservation witness;
- any conservation drift.

For a quantitative requirement the returned packet must satisfy:

```text
requested + excess
=
confirmed_received + resolved_elsewhere + waived + residual
```

## Authority

The resulting view is explicitly `projection-only`.

It may tell the originating user what the downstream history currently supports.
It does not rewrite the original request, assert that a report was a receipt,
create a new request, or compile a Book of Acts record.
