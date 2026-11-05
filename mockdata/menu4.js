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
    // =========================
    // Day parts for menu plan 1
    {
      id: '1',
      menu_plan: '1',
      description: 'Afternoon tea'
    },
    {
      id: '2',
      menu_plan: '1',
      description: 'Bakery'
    },
    // {
    //   id: '3',
    //   menu_plan: '1',
    //   description: 'Breakfast smoothies'
    // },
    // {
    //   id: '4',
    //   menu_plan: '1',
    //   description: 'Coffee'
    // },
    // {
    //   id: '5',
    //   menu_plan: '1',
    //   description: 'Dinner'
    // },
    // =========================
    // Day parts for menu plan 2
    {
      id: '6',
      menu_plan: '2',
      description: 'Afternoon tea special selection'
    },
    {
      id: '7',
      menu_plan: '2',
      description: 'Breakfast'
    },
    {
      id: '8',
      menu_plan: '2',
      description: 'Brunch Specials'
    },
    // {
    //   id: '9',
    //   menu_plan: '2',
    //   description: 'Deli bar'
    // }
    // {
    //   id: '10',
    //   menu_plan: '2',
    //   description: 'Grill bar'
    // }
    // =========================
    // Day parts for menu plan 3
    // {
    //   id: '11',
    //   menu_plan: '3',
    //   description: 'Lunches'
    // },
    // {
    //   id: '12',
    //   menu_plan: '3',
    //   description: 'Specials'
    // },
    {
      id: '13',
      menu_plan: '3',
      description: 'Salad bar'
    },
    {
      id: '14',
      menu_plan: '3',
      description: 'Indian'
    },
    {
      id: '15',
      menu_plan: '3',
      description: 'Italian'
    },
    {
      id: '16',
      menu_plan: '3',
      description: 'British'
    },
    {
      id: '17',
      menu_plan: '3',
      description: 'German'
    },
    {
      id: '18',
      menu_plan: '3',
      description: 'Irish'
    },
    {
      id: '19',
      menu_plan: '3',
      description: 'Portuguese'
    },
    {
      id: '20',
      menu_plan: '3',
      description: 'Spanish'
    }
  ],
  recipes: [
    {
      id: '1',
      menu_plan: '1',
      day_part: '1',
      amount: '3.35',
      currency: 'GBP',
      name: 'Blackcurrant Jam (3)',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '2',
      menu_plan: '1',
      day_part: '1',
      amount: '1.00',
      currency: 'GBP',
      name: 'Cream cheese and chives',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'celery'],
      may_contain: []
    },
    {
      id: '3',
      menu_plan: '1',
      day_part: '1',
      amount: '4.35',
      currency: 'GBP',
      name: 'Cucumber',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '4',
      menu_plan: '1',
      day_part: '1',
      amount: '5.35',
      currency: 'GBP',
      name: 'Curried devilled eggs',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '5',
      menu_plan: '1',
      day_part: '1',
      amount: '6.35',
      currency: 'GBP',
      name: 'Dijon mustard',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['mustard'],
      may_contain: ['sesame']
    },
    {
      id: '6',
      menu_plan: '1',
      day_part: '1',
      amount: '7.00',
      currency: 'GBP',
      name: 'Earl grey tea',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '7',
      menu_plan: '1',
      day_part: '1',
      amount: '1.50',
      currency: 'GBP',
      name: 'Eggs (boiled)',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '8',
      menu_plan: '1',
      day_part: '1',
      amount: '0.75',
      currency: 'GBP',
      name: 'Egg mayonnaise',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '9',
      menu_plan: '1',
      day_part: '1',
      amount: '10.35',
      currency: 'GBP',
      name: 'French fancy cakes',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'milk'],
      may_contain: ['egg', 'milk']
    },
    {
      id: '10',
      menu_plan: '1',
      day_part: '2',
      amount: '2.00',
      currency: 'GBP',
      name: 'Blackcurrant Jam',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '11',
      menu_plan: '1',
      day_part: '2',
      amount: '1.00',
      currency: 'GBP',
      name: 'Cream cheese and chives',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'celery'],
      may_contain: []
    },
    {
      id: '12',
      menu_plan: '1',
      day_part: '2',
      amount: '4.35',
      currency: 'GBP',
      name: 'Cucumber',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '13',
      menu_plan: '1',
      day_part: '2',
      amount: '5.35',
      currency: 'GBP',
      name: 'Curried devilled eggs',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '14',
      menu_plan: '1',
      day_part: '2',
      amount: '6.35',
      currency: 'GBP',
      name: 'Dijon mustard',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['mustard'],
      may_contain: ['sesame']
    },
    {
      id: '15',
      menu_plan: '1',
      day_part: '2',
      amount: '7.00',
      currency: 'GBP',
      name: 'Earl grey tea',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '16',
      menu_plan: '1',
      day_part: '2',
      amount: '1.50',
      currency: 'GBP',
      name: 'Eggs (boiled)',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '17',
      menu_plan: '1',
      day_part: '2',
      amount: '0.75',
      currency: 'GBP',
      name: 'Egg mayonnaise',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '18',
      menu_plan: '1',
      day_part: '2',
      amount: '10.35',
      currency: 'GBP',
      name: 'French fancy cakes',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'milk'],
      may_contain: ['egg', 'milk']
    },
    {
      id: '19',
      menu_plan: '2',
      day_part: '1',
      amount: '2.00',
      currency: 'GBP',
      name: 'Blackcurrant Jam',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '20',
      menu_plan: '2',
      day_part: '1',
      amount: '1.00',
      currency: 'GBP',
      name: 'Cream cheese and chives',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'celery'],
      may_contain: []
    },
    {
      id: '21',
      menu_plan: '2',
      day_part: '1',
      amount: '4.35',
      currency: 'GBP',
      name: 'Cucumber',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '22',
      menu_plan: '2',
      day_part: '1',
      amount: '5.35',
      currency: 'GBP',
      name: 'Curried devilled eggs',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '23',
      menu_plan: '2',
      day_part: '1',
      amount: '6.35',
      currency: 'GBP',
      name: 'Dijon mustard',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['mustard'],
      may_contain: ['sesame']
    },
    {
      id: '24',
      menu_plan: '2',
      day_part: '6',
      amount: '7.00',
      currency: 'GBP',
      name: 'Earl grey tea',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '25',
      menu_plan: '2',
      day_part: '1',
      amount: '1.50',
      currency: 'GBP',
      name: 'Eggs (boiled)',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '26',
      menu_plan: '2',
      day_part: '1',
      amount: '0.75',
      currency: 'GBP',
      name: 'Egg mayonnaise',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '27',
      menu_plan: '2',
      day_part: '1',
      amount: '10.35',
      currency: 'GBP',
      name: 'French fancy cakes',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'milk'],
      may_contain: ['egg', 'milk']
    },
    {
      id: '28',
      menu_plan: '1',
      day_part: '2',
      amount: '2.00',
      currency: 'GBP',
      name: 'Blackcurrant Jam',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '29',
      menu_plan: '1',
      day_part: '2',
      amount: '1.00',
      currency: 'GBP',
      name: 'Cream cheese and chives',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'celery'],
      may_contain: []
    },
    {
      id: '30',
      menu_plan: '1',
      day_part: '2',
      amount: '4.35',
      currency: 'GBP',
      name: 'Cucumber',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '31',
      menu_plan: '1',
      day_part: '2',
      amount: '5.35',
      currency: 'GBP',
      name: 'Curried devilled eggs',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '32',
      menu_plan: '1',
      day_part: '2',
      amount: '6.35',
      currency: 'GBP',
      name: 'Dijon mustard',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['mustard'],
      may_contain: ['sesame']
    },
    {
      id: '33',
      menu_plan: '2',
      day_part: '6',
      amount: '7.00',
      currency: 'GBP',
      name: 'Earl grey tea',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: [],
      may_contain: []
    },
    {
      id: '34',
      menu_plan: '2',
      day_part: '8',
      amount: '1.50',
      currency: 'GBP',
      name: 'Eggs (boiled)',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '35',
      menu_plan: '2',
      day_part: '7',
      amount: '0.75',
      currency: 'GBP',
      name: 'Egg mayonnaise',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg'],
      may_contain: []
    },
    {
      id: '36',
      menu_plan: '2',
      day_part: '6',
      amount: '10.35',
      currency: 'GBP',
      name: 'French fancy cakes',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['egg', 'milk'],
      may_contain: ['egg', 'milk']
    },
    {
      id: '37',
      menu_plan: '1',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Walnut,Macadamia and Pecan',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['walnut', 'macadamia', 'pecan'],
      may_contain: []
    },
    {
      id: '38',
      menu_plan: '1',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Walnut and Macadamia, may contain Pecan',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['walnut', 'macadamia'],
      may_contain: ['pecan']
    },
    {
      id: '39',
      menu_plan: '1',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Celery may contain cashew',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['celery'],
      may_contain: ['cashew']
    },
    {
      id: '40',
      menu_plan: '1',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Celery and Brazil nuts',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['celery', 'brazil'],
      may_contain: []
    },
    {
      id: '41',
      menu_plan: '1',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Barley may contain cashew',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['barley'],
      may_contain: ['cashew']
    },
    {
      id: '42',
      menu_plan: '1',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Barley and Rye',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['barley', 'rye'],
      may_contain: []
    },
    {
      id: '43',
      menu_plan: '1',
      day_part: '2',
      amount: '3.35',
      currency: 'GBP',
      name: 'Contains Barley and sulphur, may contain eggs',
      image: 'https://...',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      contains: ['barley', 'sulphur'],
      may_contain: ['egg']
    },
    {
      id: '44',
      menu_plan: '3',
      day_part: '13',
      amount: '9.00',
      currency: 'GBP',
      name: 'Cesar salad',
      image: 'https://...',
      description: 'Long description',
      contains: ['egg', 'milk'],
      may_contain: []
    },
    {
      id: '45',
      menu_plan: '3',
      day_part: '14',
      amount: '10.00',
      currency: 'GBP',
      name: 'Chicken Tikka Masala',
      image: 'https://...',
      description: 'Long description',
      contains: ['egg', 'milk'],
      may_contain: []
    },
    {
      id: '46',
      menu_plan: '3',
      day_part: '15',
      amount: '10.00',
      currency: 'GBP',
      name: 'Spaghetti bolognese',
      image: 'https://...',
      description: 'Long description',
      contains: ['egg', 'milk'],
      may_contain: []
    },
    {
      id: '47',
      menu_plan: '3',
      day_part: '16',
      amount: '10.00',
      currency: 'GBP',
      name: 'Fish and Chips',
      image: 'https://...',
      description: 'Long description',
      contains: ['fish'],
      may_contain: []
    },
    {
      id: '48',
      menu_plan: '3',
      day_part: '17',
      amount: '10.00',
      currency: 'GBP',
      name: 'Pork Schnitzel',
      image: 'https://...',
      description: 'Long description',
      contains: [],
      may_contain: []
    },
    {
      id: '49',
      menu_plan: '3',
      day_part: '18',
      amount: '10.00',
      currency: 'GBP',
      name: 'Irish Stew',
      image: 'https://...',
      description: 'Long description',
      contains: [],
      may_contain: []
    },
    {
      id: '50',
      menu_plan: '3',
      day_part: '19',
      amount: '10.00',
      currency: 'GBP',
      name: 'Cozido à portuguesa',
      image: 'https://...',
      description: 'Long description',
      contains: [],
      may_contain: []
    },
    {
      id: '51',
      menu_plan: '3',
      day_part: '20',
      amount: '10.00',
      currency: 'GBP',
      name: 'Paella',
      image: 'https://...',
      description: 'Long description',
      contains: [],
      may_contain: []
    }
  ]
};
