import { PatternWithScore, RuleMatcher } from './ruleMatcher';

export interface Pattern {
  [key: string]: string | number | boolean;
}

export interface Item {
  [key: string]: string | number | boolean;
}

export interface MatchResult {
  item: Item;
  matchPatterns: Pattern[];
}





export class Comparator {
  public rulesMap: Map<string, RuleMatcher> = new Map();
  private patternsWithScore: PatternWithScore[];
  constructor(patterns: Pattern[]) {
    this.patternsWithScore = patterns.map(pattern => ({pattern, score: 0}));
    this.createPatternsMap();
  }

  private createPatternsMap(): void {
    this.patternsWithScore.forEach((patternWithScore) => {
      const {pattern} = patternWithScore;
      for (const key in pattern) {
        const value = pattern[key];
        const strKey = `key=${key}:value=${value}`;
        if (!this.rulesMap.has(strKey)) {
          this.rulesMap.set(strKey, new RuleMatcher(key, value));
        }
        const matcher = this.rulesMap.get(strKey) as RuleMatcher;
        matcher.addPattern(patternWithScore);
      }
    })
  }

  private resetScores() {
    this.patternsWithScore.forEach(pattern => pattern.score = 0);
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

  public findMatches(items: Item[]) {
    const results: MatchResult[] = [];
    items.forEach((item, itemIndex) => {
      this.resetScores();
      this.fillMatchers(item);

      const result: MatchResult = {
        item,
        matchPatterns: []
      };

      this.patternsWithScore.forEach(({pattern, score}) => {
        if (Object.keys(pattern).length === score) {
          result.matchPatterns.push(pattern);
        }
      })

      results.push(result);  
      
    })
    return results;

  }
}