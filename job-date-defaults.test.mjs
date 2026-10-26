import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newJobDates, oneYearFromToday} from './job-date-defaults.js';
test('new jobs default both dates to a year from today',()=>{
 assert.deepEqual(newJobDates({}, new Date(2026,9,26)), {deadline:'2027-10-26',expiryDate:'2027-10-26'});
});
test('existing dates and edited jobs remain unchanged',()=>{
 const job={id:'saved',deadline:'2026-11-01',expiryDate:'2026-12-01'};
 assert.equal(newJobDates(job),job);
 assert.equal(newJobDates({deadline:'2027-02-03'}).expiryDate,'2027-02-03');
});
test('leap day clamps to the last day of February',()=>{
 assert.equal(oneYearFromToday(new Date(2028,1,29)),'2029-02-28');
});
