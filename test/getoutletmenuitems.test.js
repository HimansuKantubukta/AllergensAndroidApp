const assert = require('assert');
const fs = require('fs');
const {
  flattenOutletMenuPlans
} = require('../src/services/serverResponses/GetOutletMenuPlans');

describe('flattenOutletMenuPlans', () => {
  xit('converts the response from getoutletmenuplans to an internal flat format', () => {
    const dummyAxiosResponse = {
      data: JSON.parse(
        fs.readFileSync('./data/sampleGetOutletMenuPlan-out.json', {
          encoding: 'utf8'
        })
      )
    };
    const parsed = flattenOutletMenuPlans(dummyAxiosResponse);
    const expectedParsed = JSON.parse(
      fs.readFileSync('./data/sampleGetOutletMenuPlanParsed.json', {
        encoding: 'utf8'
      })
    );
    assert.deepStrictEqual(parsed, expectedParsed);
  });
});
