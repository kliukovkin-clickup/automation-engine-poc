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

describe('Comparator create a map of ruleMatchers', () => {
  it('should save two rules to map, each shoud has refference to a pattern', () => {
    let pattern: Pattern = {
      name: "Peter",
      age: 15,
    };
    let comparator = new Comparator([pattern]);
    expect(comparator.rulesMap.size).toBe(2);
    const rules = comparator.rulesMap.values();
    for(const rule of rules) {
      expect(rule.patterns.length).toEqual(1);
      expect(rule.patterns[0].pattern).toBe(pattern);
    }
  });
  it('should resolve collisions(two patterns, one collision rule)', () => {
    const patterns: Pattern[] = [
      {
        rule1: true,
        rule2: false,
      },
      {
        rule1: true,
        rule3: true,
      }
    ];
    const comparator = new Comparator(patterns);
    expect(comparator.rulesMap.size).toBe(3);
  });
  it('should resolve collisions(two patterns with exact same set of rules)', () => {
    const patterns: Pattern[] = [
      {
        rule1: true,
        rule2: false,
      },
      {
        rule1: true,
        rule2: false,
      }
    ];
    const comparator = new Comparator(patterns);
    expect(comparator.rulesMap.size).toBe(2);
  })
});

describe('find match for item', () => {
  it('should find matches, item is applicable to all patterns', () => {
    const pattern1: Pattern = {
      rule1: 'a',
      rule2: false,
    };
    const pattern2: Pattern = {
      rule3: 'b',
      rule4: true,
    };
    const item: Item = {
      rule1: 'a',
      rule2: false,
      rule3: 'b',
      rule4: true,
    }
  
    const comparator = new Comparator([pattern1, pattern2]);
    const result = comparator.findMatch(item);
    expect(result.matchPatterns.includes(pattern1)).toBeTruthy();
    expect(result.matchPatterns.includes(pattern2)).toBeTruthy();
  });
  it('should not find any matches, no applicable patterns for the item', () => {
    const pattern1: Pattern = {
      rule1: 'a',
      rule2: false,
    };
    const pattern2: Pattern = {
      rule3: 'b',
      rule4: true,
    };
    const item: Item = {
      rule1: 'b',
      rule2: false,
      rule3: 'a',
      rule4: true,
    }
  
    const comparator = new Comparator([pattern1, pattern2]);
    const result = comparator.findMatch(item);
    expect(result.matchPatterns.length).toEqual(0);``
  });
});