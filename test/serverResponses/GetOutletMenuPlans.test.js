const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {
  GetOutletMenuPlansServerResponse
} = require('../../src/services/serverResponses/GetOutletMenuPlans');

function readTestData(filePath) {
  return fs.readFileSync(path.join(__dirname, '../data/', filePath), {
    encoding: 'utf8'
  });
}

describe('GetOutletMenuPlans', () => {
  it('parses response from server', () => {
    const sampleJSON = readTestData('sampleGetOutletMenuPlan-out.json');
    const parsed = GetOutletMenuPlansServerResponse.createFromJSON(sampleJSON);
    if (!parsed.valid) {
      assert.fail(parsed.error);
    }
    assert.deepStrictEqual(parsed.valid, true);
    assert.deepStrictEqual(parsed.outlets.length, 1);
  });

  it('parses response 2 from server', () => {
    const sampleJSON = readTestData('sampleGetOutletMenuPlan-out2.json');
    const parsed = GetOutletMenuPlansServerResponse.createFromJSON(sampleJSON);
    if (!parsed.valid) {
      assert.fail(parsed.error);
    }
    assert.deepStrictEqual(parsed.valid, true);
    assert.deepStrictEqual(parsed.outlets.length, 1);
  });

  it('parses response 3 from server', () => {
    const sampleJSON = readTestData('sampleGetOutletMenuPlan-out3.json');
    const parsed = GetOutletMenuPlansServerResponse.createFromJSON(sampleJSON);
    if (!parsed.valid) {
      assert.fail(parsed.error);
    }
    assert.deepStrictEqual(parsed.valid, true);
    assert.deepStrictEqual(parsed.outlets.length, 1);
  });

  it('parses response 4 from server', () => {
    const sampleJSON = readTestData(
      'sampleGetOutletMenuPlan-oneOutletTwoMenuPlansTest.json'
    );
    const parsed = GetOutletMenuPlansServerResponse.createFromJSON(sampleJSON);
    if (!parsed.valid) {
      assert.fail(parsed.error);
    }
    assert.deepStrictEqual(parsed.valid, true);
    assert.deepStrictEqual(parsed.outlets.length, 1);
    // TODO: need to test the parsed content
  });
});
