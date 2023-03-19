import { describe, expect, it } from "@jest/globals";
import { Comparator, Item, Pattern } from './comparator';

describe("Comparator", () => {
  it("test", () => {
    const item: Item =       {
      name: "Andrew",
      age: 17,
      height: 180,
      weight: 70,
      male: true,
    };
    const items: Item[] = [
      item,
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
    const patternToBeMatched: Pattern = {
      age: 17,
      male: true,
    };
    const patterns: Pattern[] = [
      patternToBeMatched,
      {
        name: "Peter",
        age: 15,
      },
      {
        weight: 80,
        height: 180,
      },
    ];

    const comparator = new Comparator(patterns);
    const result = comparator.findMatches(items);

    expect(result[0].item).toBe(item);
    expect(result[0].matchPatterns[0]).toBe(patternToBeMatched);
    
  });
});

// describe('Comparator create a map of ruleMatchers', () => {
//   it('should create a map entry', () => {
//     const pattern: Pattern = {
//       name: "Peter",
//       age: 15,
//     };
//     const comparator = new Comparator([pattern]);
//     expect(comparator.rulesMap.size).toBe(2);
//   });
//   it('should resolve coalisions', () => {
//     const patterns: Pattern[] = [

//     ];
//   });
// });


