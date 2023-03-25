import { describe, expect, it } from "@jest/globals";
import { Engine, Item, Pattern } from './engine';

describe("Engine", () => {
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

    const engine = new Engine(patterns);
    const result = engine.findMatches(items);

    expect(result[0].item).toBe(item);
    expect(result[0].matchPatterns[0]).toBe(patternToBeMatched);
    
  });
});

describe('engine create a map of ruleMatchers', () => {
  it('should save two rules to map, each shoud has refference to a pattern', () => {
    let pattern: Pattern = {
      name: "Peter",
      age: 15,
    };
    let engine = new Engine([pattern]);
    expect(engine.matrix.size).toBe(2);
    const rules = engine.matrix.values();
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
    const engine = new Engine(patterns);
    expect(engine.matrix.size).toBe(3);
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
    const engine = new Engine(patterns);
    expect(engine.matrix.size).toBe(2);
  })
  /*
    * time complexity: O(K + N), where K is a total number of rules and N is a number of patterns
    */
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
  
    const engine = new Engine([pattern1, pattern2]);
    const result = engine.findMatch(item);
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
  
    const engine = new Engine([pattern1, pattern2]);
    const result = engine.findMatch(item);
    expect(result.matchPatterns.length).toEqual(0);``
  });
  it('OR values: should create matrix for rules with Array', () => {
    const pattern: Pattern = {
      rule: ['a', 'b', 'c'],
    };
    const engine = new Engine([pattern]);
    expect(engine.matrix.size).toBe(3);
    const rules = engine.matrix.values();
    for(const rule of rules) {
      expect(rule.patterns[0].pattern).toBe(pattern);
    }
  });
  it('OR values: consider it as ANY value', () => {
    const pattern: Pattern = {
      rule: ['a', 'b', 'c'],
    };
    const item1: Item = {
      rule: 'a',
    };
    const item2: Item = {
      rule: 'b',
    };
    const item3: Item = {
      rule: 'c',
    };
    const item4: Item = {
      rule: 'd',
    };
    const engine = new Engine([pattern]);
    let result = engine.findMatch(item1);
    expect(result.matchPatterns.includes(pattern)).toBeTruthy();
    result = engine.findMatch(item2);
    expect(result.matchPatterns.includes(pattern)).toBeTruthy();
    result = engine.findMatch(item3);
    expect(result.matchPatterns.includes(pattern)).toBeTruthy();
    result = engine.findMatch(item4);
    expect(result.matchPatterns.includes(pattern)).toBeFalsy();
  });
});