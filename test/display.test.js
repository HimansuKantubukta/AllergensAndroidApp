/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-constant-condition */
/* eslint-disable func-names */

import mockdata from '../mockdata/menu0.js';

const assert = require('assert');
const {
  filterRecipes,
  normalizeAllergen,
  onlySelectedAllergensAndSelectedSuballergens,
  shouldDisplayRecipePricesForOutlet
} = require('../src/utils/display');

it('should return true', () => {
  assert.equal(true, true);
});

it('should return empty array for no recipes', function() {
  const recipes = [];
  const result = filterRecipes(recipes);
  assert.strictEqual(result.length, 0);
});

it('should filterRecipes correctly by menu plan', function() {
  const { recipes } = mockdata;
  const menuPlansFilter = ['1'];
  const menuPlansFilter2 = ['2'];
  const menuPlansFilter3 = ['1', '2'];

  let result = filterRecipes(recipes, menuPlansFilter);
  assert.strictEqual(result.length, 6);

  result = filterRecipes(recipes, menuPlansFilter2);
  assert.strictEqual(result.length, 8);

  result = filterRecipes(recipes, menuPlansFilter3);
  assert.strictEqual(result.length, 14);
});

it('should filterRecipes correctly by day parts', function() {
  const { recipes } = mockdata;
  const dayPartsFilter = ['1'];
  const dayPartsFilter2 = ['2'];

  let result = filterRecipes(recipes, [], dayPartsFilter);
  assert.strictEqual(result.length, 12);

  result = filterRecipes(recipes, [], dayPartsFilter2);
  assert.strictEqual(result.length, 2);
});

it('should filterRecipes correctly by allergens', function() {
  const { recipes } = mockdata;
  const allergensFilter1 = ['egg'];
  const allergensFilter2 = [];
  const allergensFilter3 = ['hazelnut'];
  const allergensFilter4 = ['egg', 'celery', 'hazelnut'];
  const allergensFilter5 = ['sulphur'];

  let result = filterRecipes(recipes, [], [], allergensFilter1);
  assert.strictEqual(result.length, 12);

  result = filterRecipes(recipes, [], [], allergensFilter2);
  assert.strictEqual(result.length, 14);

  result = filterRecipes(recipes, [], [], allergensFilter3);
  assert.strictEqual(result.length, 11);

  result = filterRecipes(recipes, [], [], allergensFilter4);
  assert.strictEqual(result.length, 9);

  result = filterRecipes(recipes, [], [], allergensFilter5);
  assert.strictEqual(result.length, 14);
});

it('should filterRecipes correctly by (may_contain) allergens', function() {
  const { recipes } = mockdata;
  const allergensFilter1 = ['egg'];
  const allergensFilter2 = [];
  const allergensFilter3 = ['hazelnut'];
  const allergensFilter4 = ['egg', 'celery', 'hazelnut', 'milk'];
  const allergensFilter5 = ['sulphur'];
  const allergensFilter6 = ['sesame'];

  let result = filterRecipes(recipes, [], [], [], allergensFilter1);
  assert.strictEqual(result.length, 14);

  result = filterRecipes(recipes, [], [], [], allergensFilter2);
  assert.strictEqual(result.length, 14);

  result = filterRecipes(recipes, [], [], [], allergensFilter3);
  assert.strictEqual(result.length, 14);

  result = filterRecipes(recipes, [], [], [], allergensFilter4);
  assert.strictEqual(result.length, 12);

  result = filterRecipes(recipes, [], [], [], allergensFilter5);
  assert.strictEqual(result.length, 14);

  result = filterRecipes(recipes, [], [], [], allergensFilter6);
  assert.strictEqual(result.length, 11);
});

it('should filterRecipes correctly by contain and may contain allergens', function() {
  const { recipes } = mockdata;
  const egg = ['egg'];
  const empty = [];
  const hazelnut = ['hazelnut'];
  const eggCeleryHazelnutMilk = ['egg', 'celery', 'hazelnut', 'milk'];
  const sulphur = ['sulphur'];
  const sesame = ['sesame'];

  let result = filterRecipes(recipes, [], [], eggCeleryHazelnutMilk, egg);
  assert.strictEqual(result.length, 9);

  result = filterRecipes(recipes, [], [], hazelnut, empty);
  assert.strictEqual(result.length, 11);

  result = filterRecipes(recipes, [], [], sesame, hazelnut);
  assert.strictEqual(result.length, 14);

  result = filterRecipes(recipes, [], [], sulphur, eggCeleryHazelnutMilk);
  assert.strictEqual(result.length, 12);

  result = filterRecipes(recipes, [], [], sesame, sulphur);
  assert.strictEqual(result.length, 14);

  result = filterRecipes(recipes, [], [], sulphur, sesame);
  assert.strictEqual(result.length, 11);
});

it('should filterRecipes correctly by all parameters', function() {
  const { recipes } = mockdata;
  const egg = ['egg'];
  const empty = [];
  const hazelnut = ['hazelnut'];
  const eggCeleryHazelnutMilk = ['egg', 'celery', 'hazelnut', 'milk'];
  const sulphur = ['sulphur'];
  const sesame = ['sesame'];

  let result = filterRecipes(recipes, ['1'], ['1'], eggCeleryHazelnutMilk, egg);
  assert.strictEqual(result.length, 4);

  result = filterRecipes(recipes, ['1'], ['1'], hazelnut, empty);
  assert.strictEqual(result.length, 5);

  result = filterRecipes(recipes, ['1'], ['1'], sesame, hazelnut);
  assert.strictEqual(result.length, 6);

  result = filterRecipes(recipes, ['1'], ['1'], sulphur, eggCeleryHazelnutMilk);
  assert.strictEqual(result.length, 5);

  result = filterRecipes(recipes, ['1'], ['1'], sesame, sulphur);
  assert.strictEqual(result.length, 6);

  result = filterRecipes(recipes, ['1'], ['1'], sulphur, sesame);
  assert.strictEqual(result.length, 5);
});

describe('DietaryRequirements function tests', () => {
  test('onlySelectedAllergensAndSelectedSuballergens', () => {
    const data = [
      {
        allergen: 'celery',
        selected: false,
        subtypes: []
      },
      {
        allergen: 'mustard',
        selected: true,
        subtypes: []
      },
      {
        allergen: 'nut',
        selected: true,
        subtypes: [
          {
            allergen: 'macadamia',
            selected: true,
            subtypes: [],
            subtype: true
          },
          { allergen: 'walnut', selected: false, subtypes: [], subtype: true },
          {
            allergen: 'pecan',
            subtypes: [],
            selected: true,
            selectable: true,
            tooltipOpen: false,
            subtype: true
          }
        ]
      }
    ];
    const selected = onlySelectedAllergensAndSelectedSuballergens(data);

    assert.strictEqual(selected.length, 2); // "mustard" and "nut" (with subtypes)
    assert.notStrictEqual(data, selected);
    assert.strictEqual(false, data === selected);

    // mustard
    assert.strictEqual(selected[0].allergen, 'mustard');
    assert.strictEqual(selected[0].subtypes.length, 0);
    assert.strictEqual(selected[0].selected, true);

    // nut
    assert.strictEqual(selected[1].allergen, 'nut');
    assert.strictEqual(
      JSON.stringify(selected[1].subtypes),
      JSON.stringify([
        {
          allergen: 'macadamia',
          selected: true,
          subtypes: [],
          subtype: true
        },
        {
          allergen: 'pecan',
          subtypes: [],
          selected: true,
          selectable: true,
          tooltipOpen: false,
          subtype: true
        }
      ])
    );
    assert.strictEqual(selected[1].selected, true);
  });
});

test('shouldDisplayRecipePricesForOutlet', function() {
  const outlets = [
    { id: '1', name: 'outlet1', hidePrices: 'X' },
    { id: '2', name: 'outlet2', hidePrices: '' },
    { id: '3', name: 'outlet3', hidePrices: '' },
    { id: '4', name: 'outlet4' }
  ];

  assert.strictEqual(shouldDisplayRecipePricesForOutlet('1', outlets), false);
  assert.strictEqual(shouldDisplayRecipePricesForOutlet('2', outlets), true);
  assert.strictEqual(shouldDisplayRecipePricesForOutlet('3', outlets), true);
  assert.strictEqual(shouldDisplayRecipePricesForOutlet('4', outlets), true);
  assert.strictEqual(shouldDisplayRecipePricesForOutlet('5', outlets), true); // 5 doesn't even exist. assume true
});
