// Mock menu data.
// This data is tied to tests. Do not change it without changing
// the corresponding tests.

module.exports = {
  outlet: '1',
  date: '2012-04-23T00:00:00.000Z',
  menu_plans: [
    {
      id: '1',
      description: 'Menu plan 1',
      valid_from: '2012-04-23T00:00:00.000Z',
      valid_to: '2012-04-23T00:00:00.000Z'
    },
    {
      id: '2',
      description: 'Menu plan 2',
      valid_from: '2012-04-23T00:00:00.000Z',
      valid_to: '2012-04-23T00:00:00.000Z'
    },
    {
      id: '3',
      description: 'Menu plan 3',
      valid_from: '2012-04-23T00:00:00.000Z',
      valid_to: '2012-04-23T00:00:00.000Z'
    }
  ],
  day_parts: [
    {
      id: '1',
      menu_plan: '1',
      description: '1 - Afternoon tea (choose this)'
    },
    {
      id: '2',
      menu_plan: '1',
      description: '2 - Bakery'
    },
    {
      id: '3',
      menu_plan: '1',
      description: '3 - Breakfast smoothie'
    },
    {
      id: '4',
      menu_plan: '1',
      description: '4 - Morning tea'
    },
    {
      id: '5',
      menu_plan: '1',
      description: '5 - Bakery'
    },
    {
      id: '6',
      menu_plan: '3',
      description: '6 - Breakfast smoothie'
    },
    {
      id: '7',
      menu_plan: '3',
      description: '7 - Afternoon tea (choose this)'
    },
    {
      id: '8',
      menu_plan: '3',
      description: '8 - Bakery'
    },
    {
      id: '9',
      menu_plan: '3',
      description: '9 - Breakfast smoothie'
    },
    {
      id: '10',
      menu_plan: '2',
      description: '10 - Morning tea'
    },
    {
      id: '11',
      menu_plan: '2',
      description: '11 - Bakery'
    },
    {
      id: '12',
      menu_plan: '2',
      description: '12 - Breakfast smoothie'
    },
    {
      id: '13',
      menu_plan: '2',
      description: '13 - Breakfast smoothie'
    }
  ],
  recipes: [
    {
      id: '1',
      menu_plan: '1',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains egg, celery may contain milk',
      description: '',
      contains: ['egg', 'celery'],
      may_contain: ['milk']
    },
    {
      id: '2',
      menu_plan: '1',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'No allergens',
      description: '',
      contains: [],
      may_contain: []
    },
    {
      id: '3',
      menu_plan: '1',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains fish may contain mustard',
      description: '',
      contains: ['fish'],
      may_contain: ['mustard']
    },
    {
      id: '4',
      menu_plan: '1',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: '4 - No allergens',
      description: '',
      contains: [],
      may_contain: []
    },
    {
      id: '5',
      menu_plan: '1',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'May contain sesame',
      description: '',
      contains: [],
      may_contain: ['sesame']
    },
    {
      id: '6',
      menu_plan: '1',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Hazelnut',
      description: '',
      contains: ['hazelnut'],
      may_contain: []
    },
    {
      id: '7',
      menu_plan: '2',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains egg, celery may contain milk (2)',
      description: '',
      contains: ['egg', 'celery'],
      may_contain: ['milk']
    },
    {
      id: '8',
      menu_plan: '2',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'No allergens (2)',
      description: '',
      contains: [],
      may_contain: []
    },
    {
      id: '9',
      menu_plan: '2',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains fish may contain mustard (2)',
      description: '',
      contains: ['fish'],
      may_contain: ['mustard']
    },
    {
      id: '10',
      menu_plan: '2',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: '4 - No allergens (2)',
      description: '',
      contains: [],
      may_contain: []
    },
    {
      id: '11',
      menu_plan: '2',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'May contain sesame (2)',
      description: '',
      contains: [],
      may_contain: ['sesame']
    },
    {
      id: '12',
      menu_plan: '2',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Hazelnut (2)',
      description: '',
      contains: ['hazelnut'],
      may_contain: []
    },
    {
      id: '13',
      menu_plan: '2',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'May contain sesame (2)',
      description: '',
      contains: [],
      may_contain: ['sesame']
    },
    {
      id: '14',
      menu_plan: '2',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Hazelnut (2)',
      description: '',
      contains: ['hazelnut'],
      may_contain: []
    }
  ]
};
