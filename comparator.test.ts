import { describe, expect, it } from "@jest/globals";
import { Comparator, Item, Pattern } from './comparator';

describe("Comparator", () => {
  it("test", () => {
    const items: Item[] = [
      {
        name: "Andrew",
        age: 17,
        height: 180,
        weight: 70,
        male: true,
      },
      {
        name: "Bob",
        age: 31,
        height: 200,
        weight: 100,
        male: true,
      },
      {
        name: "Sam",
        age: 50,
        height: 165,
        weight: 100,
        male: true,
      },
      {
        name: "Josh",
        age: 23,
        height: 160,
        weight: 50,
        male: true,
      },
    ];
    const patterns: Pattern[] = [
      {
        name: "Peter",
        age: 15,
      },
      {
        age: 17,
        male: true,
      },
      {
        weight: 80,
        height: 180,
      },
    ];
    console.time('my algo');
    const comparator = new Comparator(patterns);
    const result = comparator.findMatches(items);
    console.timeEnd('my algo');
    expect(result).toEqual({ '0': [ { age: 17, male: true } ], '1': [], '2': [], '3': [] });
    
  });
});


