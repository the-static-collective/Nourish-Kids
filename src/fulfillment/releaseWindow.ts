/** RELEASE-WINDOW-001: review-only projection of explicit commitments.
 * Does not infer fulfillment, reassign resources, revoke holds, or transmit requests.
 */
export type Commitment = {
  id: string;
  resourceRef: string;
  ownerRef: string;
  status: 'offered' | 'held' | 'attempted' | 'partial' | 'fulfilled' | 'uncertain';
  declaredReviewUtc: string | null;
  lastWitnessRef: string | null;
};
export type ReviewCard = {
  commitmentId: string;
  resourceRef: string;
  ownerRef: string;
  disposition: 'review_due' | 'no_review_due' | 'review_date_unknown';
  observedStatus: Commitment['status'];
  completionClaim: 'witness_ref_present_for_declared_fulfillment' | 'not_established';
  proposedActions: readonly ['renew', 'modify', 'release', 'reconcile'];
};
const stamp=(value:string):number=>{
  if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)) throw Error('explicit UTC timestamp required');
  const parsed=Date.parse(value);
  if(!Number.isFinite(parsed) || new Date(parsed).toISOString()!==value) throw Error('invalid UTC timestamp');
  return parsed;
};
const ref=(s:string)=>{if(typeof s!=='string'||!s.trim()||s.length>256)throw Error('bounded reference required');return s;};
export function projectReleaseWindow(commitments: readonly Commitment[], nowUtc:string):ReviewCard[] {
  const now=stamp(nowUtc);
  if(!Array.isArray(commitments)||commitments.length>1000)throw Error('bounded commitment array required');
  const ids=new Set<string>();
  return commitments.map(c=>{
    ref(c.id);ref(c.resourceRef);ref(c.ownerRef);
    if(ids.has(c.id))throw Error('duplicate commitment identity');ids.add(c.id);
    if(!['offered','held','attempted','partial','fulfilled','uncertain'].includes(c.status))throw Error('unknown status');
    const review=c.declaredReviewUtc===null ? null : stamp(c.declaredReviewUtc);
    if(c.lastWitnessRef!==null)ref(c.lastWitnessRef);
    const card:ReviewCard = {
      commitmentId:c.id,resourceRef:c.resourceRef,ownerRef:c.ownerRef,
      disposition:review===null?'review_date_unknown':review<=now?'review_due':'no_review_due',
      observedStatus:c.status,
      completionClaim:c.status==='fulfilled'&&c.lastWitnessRef!==null ?
        'witness_ref_present_for_declared_fulfillment':'not_established',
      proposedActions:['renew','modify','release','reconcile'] as const,
    };
    return card;
  });
}
