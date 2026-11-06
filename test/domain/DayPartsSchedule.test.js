import { DayPartsSchedule } from '../../src/domain/DayPartsSchedule';

const assert = require('assert');

const testData = {
  reqDate: [
    // first reqDate valid in June
    {
      requiredDate: '2020-06-01',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    },
    // Second "ReqDate" entry, valid from july
    {
      requiredDate: '2020-07-01',
      dayPart: [
        {
          dayPartCode: '300',
          dayPartDesc: 'desc 300',
          course: [
            {
              courseCode: '40',
              item: [
                {
                  recipeId: '4'
                },
                {
                  recipeId: '5'
                },
                {
                  recipeId: '6'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  // reqdate2 is the similar to reqdate but inverted
  // and with an entry in the past
  reqDate2: [
    // first reqDate valid in July
    {
      requiredDate: '2020-07-01',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      requiredDate: '2019-07-01',
      dayPart: [
        {
          dayPartCode: '300',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    },
    // Second "ReqDate" entry, valid from june
    {
      requiredDate: '2020-06-01',
      dayPart: [
        {
          dayPartCode: '300',
          dayPartDesc: 'desc 300',
          course: [
            {
              courseCode: '40',
              item: [
                {
                  recipeId: '4'
                },
                {
                  recipeId: '5'
                },
                {
                  recipeId: '6'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  reqDate3: [
    {
      requiredDate: '2020-11-21',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  // One date for every day of the week
  reqDate4: [
    {
      requiredDate: '2021-04-05',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      requiredDate: '2021-04-06',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      requiredDate: '2021-04-07',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      requiredDate: '2021-04-08',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      requiredDate: '2021-04-09',
      dayPart: [
        {
          dayPartCode: '100',
          dayPartDesc: 'desc 100',
          course: [
            {
              courseCode: '10',
              item: [
                {
                  recipeId: '1'
                },
                {
                  recipeId: '2'
                },
                {
                  recipeId: '3'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  expectedInternalFormat: {
    dayParts: [
      {
        id: '100',
        description: 'desc 100',
        items: [
          {
            recipeId: '1'
          },
          {
            recipeId: '2'
          },
          {
            recipeId: '3'
          }
        ]
      }
    ]
  }
};

describe('DayPartsSchedule', () => {
  // testing currentDayParts
  test('internal structure of schedule ', () => {
    const dayPartsSchedule = DayPartsSchedule.createFromReqDateArray(
      testData.reqDate
    );

    const { schedule } = dayPartsSchedule;
    assert.strictEqual(schedule[0].year, 2020);
    assert.strictEqual(schedule[0].month, 6);
    assert.strictEqual(schedule[0].day, 1);

    assert.strictEqual(schedule[1].year, 2020);
    assert.strictEqual(schedule[1].month, 7);
    assert.strictEqual(schedule[1].day, 1);
  });

  // ========================================
  test('getFutureSchedulesSorted', () => {
    const today = new Date();
    today.setDate(16);
    today.setFullYear(2020);
    today.setMonth(1); // Feb
    today.setHours(0, 0, 0, 0);

    const dayPartsSchedule = DayPartsSchedule.createFromReqDateArray(
      testData.reqDate
    );

    const futureSchedules = dayPartsSchedule.getFutureSchedulesSorted(today);
    assert.strictEqual(futureSchedules.length, 2);
    assert.strictEqual(futureSchedules[0].month, 6);
    assert.strictEqual(futureSchedules[0].year, 2020);
    assert.strictEqual(futureSchedules[0].day, 1);

    assert.strictEqual(futureSchedules[1].month, 7);
    assert.strictEqual(futureSchedules[1].year, 2020);
    assert.strictEqual(futureSchedules[1].day, 1);
  });

  // ========================================
  test('getFutureSchedulesSorted 2', () => {
    const today = new Date();
    today.setDate(16);
    today.setFullYear(2020);
    today.setMonth(1); // Feb
    today.setHours(0, 0, 0, 0);

    const dayPartsSchedule = DayPartsSchedule.createFromReqDateArray(
      testData.reqDate2
    );

    const futureSchedules = dayPartsSchedule.getFutureSchedulesSorted(today);
    assert.strictEqual(futureSchedules.length, 2);
    assert.strictEqual(futureSchedules[0].month, 6);
    assert.strictEqual(futureSchedules[0].year, 2020);
    assert.strictEqual(futureSchedules[0].day, 1);

    assert.strictEqual(futureSchedules[1].month, 7);
    assert.strictEqual(futureSchedules[1].year, 2020);
    assert.strictEqual(futureSchedules[1].day, 1);
  });

  // ========================================
  test('getFutureSchedulesSorted 3', () => {
    const today = new Date();
    today.setDate(16);
    today.setFullYear(2020);
    today.setMonth(10); // November
    today.setHours(0, 0, 0, 0);

    const dayPartsSchedule = DayPartsSchedule.createFromReqDateArray(
      testData.reqDate3 // testing date of requiredDate: '2020-11-21',
    );

    const futureSchedules = dayPartsSchedule.getFutureSchedulesSorted(today);
    assert.strictEqual(futureSchedules.length, 1);
    assert.strictEqual(futureSchedules[0].month, 11);
    assert.strictEqual(futureSchedules[0].year, 2020);
    assert.strictEqual(futureSchedules[0].day, 21);
  });

  test('discardPastSchedules', () => {
    const today = new Date();
    today.setDate(8);
    today.setFullYear(2021);
    today.setMonth(3); // April
    today.setHours(10, 0, 0, 0);

    const dayPartsSchedule = DayPartsSchedule.createFromReqDateArray(
      testData.reqDate4 // course per day for 5-9 April 2021
    );

    const futureSchedules = DayPartsSchedule.discardPastSchedules(
      today,
      dayPartsSchedule.schedule
    );
    assert.strictEqual(futureSchedules.length, 2);
    assert.strictEqual(futureSchedules[0].month, 4);
    assert.strictEqual(futureSchedules[0].year, 2021);
    assert.strictEqual(futureSchedules[0].day, 8);
  });
});
