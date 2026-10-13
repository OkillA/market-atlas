'use strict';
const crypto = require('node:crypto');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

// Preserve the publication ledger's original content/source fingerprint. Review
// declarations and derived labels cannot approve themselves or alter that hash.
function chapterFingerprint(chapter, sources) {
  const content = JSON.parse(JSON.stringify(chapter));
  delete content.review;
  delete content.version;
  content.status = 'draft';
  const ids = [...new Set([...(content.sources || []), ...(content.evidence || []).flatMap(e => e.sourceIds)])].sort();
  return sha256(JSON.stringify({ chapter: content, sources: ids.map(id => [id, sources[id]]) }));
}
function applyReview(chapter, sources, rendererSha256) {
  const declared = chapter.review;
  const reasons = [];
  if (!declared || declared.status !== 'accepted') reasons.push('No accepted review recorded');
  if (declared && declared.contentSha256 !== chapterFingerprint(chapter, sources)) reasons.push('Chapter or linked source changed');
  if (declared && declared.rendererSha256 !== rendererSha256) reasons.push('Figure renderer changed');
  if (declared && (!chapter.version || !declared.date || !declared.reviewer || !declared.scope || !declared.evidence?.length)) reasons.push('Incomplete review declaration');
  chapter.status = reasons.length ? 'draft' : 'reviewed';
  chapter.review = { ...(declared || {}), valid: reasons.length === 0, effectiveStatus: reasons.length ? 'needs_review' : 'accepted', reasons };
  return chapter;
}
module.exports = { sha256, chapterFingerprint, applyReview };
