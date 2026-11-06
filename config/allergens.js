/* eslint-disable global-require */
// Change this file to configure which allergens and suballergens are used.
// All alergens should be in lowercase and singular.
module.exports = {
  // Configure allergens that appear on the top row to the allergens section
  allergensInRow1: [
    'celery',
    'crustaceans',
    'egg',
    'fish',
    'gluten',
    'lupin',
    'milk'
  ],
  // Configure allergens that appear on the bottom row of the allergens section
  allergensInRow2: [
    'mollusc',
    'mustard',
    'nut',
    'peanut',
    'sesame',
    'soybean',
    'sulphur'
  ],
  // Define which subtypes exists for some allergen types
  allergensSubtypes: {
    gluten: ['wheat', 'rye', 'barley', 'oats', 'kamut', 'spelt'],
    nut: [
      'almond',
      'hazelnut',
      'walnut',
      'brazil',
      'cashew',
      'pecan',
      'pistachio',
      'macadamia'
    ]
  },
  // Configure where the icon images are found for every allergen.
  // Requires to images need to be static! If they are dynamic
  // it will fail on the device (but works on web).
  allergenIconImgSrc: {
    celery: require('../assets/icons/celery.png'),
    crustaceans: require('../assets/icons/crustaceans.png'),
    egg: require('../assets/icons/egg.png'),
    fish: require('../assets/icons/fish.png'),
    gluten: require('../assets/icons/gluten.png'),
    lupin: require('../assets/icons/lupin.png'),
    milk: require('../assets/icons/milk.png'),
    mollusc: require('../assets/icons/mollusc.png'),
    mustard: require('../assets/icons/mustard.png'),
    nut: require('../assets/icons/nuts.png'),
    peanut: require('../assets/icons/peanuts.png'),
    sesame: require('../assets/icons/sesame.png'),
    sulphur: require('../assets/icons/sulphur.png'),
    soybean: require('../assets/icons/soybean.png'),
    almond: require('../assets/icons/nuts.png'),
    hazelnut: require('../assets/icons/nuts.png'),
    walnut: require('../assets/icons/nuts.png'),
    brazil: require('../assets/icons/nuts.png'),
    cashew: require('../assets/icons/nuts.png'),
    pecan: require('../assets/icons/nuts.png'),
    pistachio: require('../assets/icons/nuts.png'),
    macadamia: require('../assets/icons/nuts.png'),
    wheat: require('../assets/icons/gluten.png'),
    rye: require('../assets/icons/gluten.png'),
    barley: require('../assets/icons/gluten.png'),
    oats: require('../assets/icons/gluten.png'),
    kamut: require('../assets/icons/gluten.png'),
    spelt: require('../assets/icons/gluten.png'),
    "GF Wheat": require('../assets/icons/gluten.png'),
    "GF Rye": require('../assets/icons/gluten.png'),
    "GF Barley": require('../assets/icons/gluten.png'),
    "GF Oats": require('../assets/icons/gluten.png'),
    "GF Kamut": require('../assets/icons/gluten.png'),
    "GF Spelt": require('../assets/icons/gluten.png'),
  },
  // Configure the text that appears for every allergen
  allergenText: {
    egg: 'Eggs',
    fish: 'Fish',
    nut: 'Tree nuts',
    mollusc: 'Molluscs',
    mustard: 'Mustard',
    peanut: 'Peanuts',
    sesame: 'Sesame',
    soybean: 'Soybean',
    sulphur: 'Sulphur',
    milk: 'Milk',
    lupin: 'Lupin',
    gluten: 'Gluten',
    crustaceans: 'Crustaceans',
    celery: 'Celery',
    wheat: 'Wheat',
    rye: 'Rye',
    barley: 'Barley',
    oats: 'Oats',
    almond: 'Almonds',
    hazelnut: 'Hazelnut',
    walnut: 'Walnuts',
    brazil: 'Brazil nuts',
    cashew: 'Cashew',
    pecan: 'Pecan',
    pistachio: 'Pistachio',
    macadamia: 'Macadamia',
    kamut: 'Kamut',
    spelt: 'Spelt',
    "GF Wheat": "GF Wheat",
    "GF Rye": "GF Rye",
    "GF Barley": "GF Barley",
    "GF Oats": "GF Oats",
    "GF Kamut": "GF Kamut",
    "GF Spelt": "GF Spelt",
  }
};
