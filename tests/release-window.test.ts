import test from 'node:test';
import assert from 'node:assert/strict';
import { projectReleaseWindow, type Commitment } from '../src/fulfillment/releaseWindow';
const base:Commitment={id:'fixture:offer-1',resourceRef:'fixture:beans',ownerRef:'fixture:keeper',
  status:'held',declaredReviewUtc:'2026-09-20T00:00:00Z',lastWitnessRef:null};
test('review boundary proposes human actions but performs no release',()=>{
  const input=[base]; const cards=projectReleaseWindow(input,'2026-09-21T00:00:00Z');
  assert.equal(cards[0].disposition,'review_due');
  assert.equal(cards[0].observedStatus,'held');
  assert.equal(input[0].status,'held');
  assert.equal(cards[0].completionClaim,'not_established');
});
test('unknown review date does not become overdue or complete',()=>{
  const out=projectReleaseWindow([{...base,declaredReviewUtc:null,status:'uncertain'}],'2026-09-21T00:00:00Z');
  assert.equal(out[0].disposition,'review_date_unknown');assert.equal(out[0].completionClaim,'not_established');
});
test('declared completion still requires an explicit witness ref for qualified label',()=>{
 const out=projectReleaseWindow([{...base,status:'fulfilled',lastWitnessRef:'fixture:human-witness'}],'2026-09-21T00:00:00Z');
 assert.equal(out[0].completionClaim,'witness_ref_present_for_declared_fulfillment');
});
test('invalid dates and duplicate identifiers fail closed',()=>{
 assert.throws(()=>projectReleaseWindow([base,base],'2026-09-21T00:00:00Z'),/duplicate/);
 assert.throws(()=>projectReleaseWindow([base],'tomorrow'),/UTC/);
});
