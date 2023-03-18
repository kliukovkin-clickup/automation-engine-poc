import { RuleMatcher } from './RuleMatcher';

export interface Pattern {
  [key: string]: string | number | boolean;
}

export interface Item {
  [key: string]: string | number | boolean;
}





export class Comparator {
  public rulesMap: Map<string, RuleMatcher> = new Map();
  constructor(private patterns: Pattern[]) {
    this.createPatternsMap(patterns);
  }

  private createPatternsMap(patterns: Pattern[]): void {
    patterns.forEach((pattern, index) => {
      for (const key in pattern) {
        const value = pattern[key];
        const strKey = `key=${key}:value=${value}`;
        if (!this.rulesMap.has(strKey)) {
          this.rulesMap.set(strKey, new RuleMatcher(key, value));
        }
        const matcher = this.rulesMap.get(strKey) as RuleMatcher;
        matcher.addPattern(index);
      }
    })
  }

  private resetMatchers() {
    const matchers = this.rulesMap.values();
    for (const matcher of matchers) matcher.resetMatchScores();
  }

  public fillMatchers(item) {
    for (const key in item) {
      const value = item[key];
      const strKey = `key=${key}:value=${value}`;
      if (!this.rulesMap.has(strKey)) continue;
      const matcher = this.rulesMap.get(strKey) as RuleMatcher;
      matcher.incrementScores();
    }
  }

  public getResults() {
    

  }

  public getNumOfMatches(patternIndex: number): number {
    const matchers = this.rulesMap.values();
    let count = 0;
    for (const matcher of matchers) {
      if (matcher.patternMatches[patternIndex] && matcher.patternMatches[patternIndex] > 0) count++;
    }
    return count;
  }

  public findMatches(items: Item[]) {
    const result = {};
    items.forEach((item, itemIndex) => {
      result[itemIndex] = [];
      this.resetMatchers();
      this.fillMatchers(item);
      this.patterns.forEach((pattern, patternIndex) => {
        const numOfMatches = this.getNumOfMatches(patternIndex);
        if (Object.keys(pattern).length == numOfMatches) {
          result[itemIndex].push(pattern);
        }
      });

        
      
    })
    return result;

  }
}

//TODO reduce scope by using references