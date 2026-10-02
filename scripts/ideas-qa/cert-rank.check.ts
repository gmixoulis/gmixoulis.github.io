// Run: bun scripts/ideas-qa/cert-rank.check.ts
import assert from 'node:assert';
import { certScore, rankCerts } from '../../src/lib/certRank';
const c = (file: string, title: string, by = '') => ({ file, title, by });
const msc = c('1Master-Degree_X.jpg', 'MSc', 'Aristotle University');
const harvardAtt = c('Certificate-Of-Attendance_AI.jpg', 'AI talk', 'Harvard University, 2024');
const localAtt = c('Certificate-Of-Attendance_Meetup.jpg', 'Local meetup', 'Some meetup, 2024');
const ccna = c('Certificate-Of-Completion_CCNA.jpg', 'Accelerated CCNA, 132 hours', 'University of Thessaly, 2020');
const webinar = c('Certificate-Of-Participation_Webinar.jpg', 'A webinar', 'Block.co, 2020');
const r = rankCerts([webinar, localAtt, harvardAtt, ccna, msc]);
assert.ok(r[0] === msc, 'degree first');
assert.ok(certScore(harvardAtt) > certScore(localAtt) + 25, 'Harvard attendance far above a local one');
assert.ok(certScore(ccna) > certScore(webinar), 'a 132-hour course beats a webinar');
assert.ok(certScore(harvardAtt) > certScore(webinar), 'big-name attendance beats an ordinary webinar');
console.log('cert-rank ok:', r.map((x) => x.title).join(' > '));
