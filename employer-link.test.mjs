import {test} from 'node:test';
import assert from 'node:assert/strict';
import {employerProfileHref} from './employer-link.js';
test('uses saved profile URL or slug before company name fallback', () => {
  assert.equal(employerProfileHref({company:'NMC Healthcare'}),'/employer/nmc-healthcare');
  assert.equal(employerProfileHref({company:'School',employerSlug:'school-sips'}),'/employer/school-sips');
  assert.equal(employerProfileHref({employerUrl:'https://trikonet.com/employer/actual-profile/'}),'/employer/actual-profile/');
  assert.equal(employerProfileHref({employerUrl:'javascript:alert(1)',company:'NMC Healthcare'}),'/employer/nmc-healthcare');
});
