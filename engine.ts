import { PatternWithScore, Rule } from './rule';

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





export class Engine {
  public matrix: Map<string, Rule> = new Map();
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
        if (!this.matrix.has(strKey)) {
          this.matrix.set(strKey, new Rule(key, value));
        }
        const matcher = this.matrix.get(strKey) as Rule;
        matcher.addPattern(patternWithScore);
      }
    })
  }

  private resetScores() {
    this.patternsWithScore.forEach(pattern => pattern.score = 0);
  }

  /* 
  time complexity O(N), where N is a number of patterns
  */
  private getMatchedPatterns(): Pattern[] {
    return this.patternsWithScore.reduce((matchPatterns, {pattern, score}) => {
      if (Object.keys(pattern).length === score) {
        matchPatterns.push(pattern);
      }
      return matchPatterns;
    }, [] as Pattern[]);
  }
  
  /* 
  time complexity O(K), where K is a total number of rules
  */
  public findMatch(item: Item): MatchResult {
    const result: MatchResult = {
      item,
      matchPatterns: []
    };
    for (const key in item) {
      const value = item[key];
      const strKey = `key=${key}:value=${value}`;
      if (!this.matrix.has(strKey)) continue;
      const rule = this.matrix.get(strKey) as Rule;
      rule.incrementScores();
    }

    result.matchPatterns = this.getMatchedPatterns();

    return result;
  }

  public findMatches(items: Item[]): MatchResult[] {
    const results: MatchResult[] = [];
    items.forEach((item) => {
      this.resetScores();
      const result = this.findMatch(item);
      results.push(result);  
    })
    return results;

  }
}