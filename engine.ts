import { PatternWithScore, Rule } from './rule';

export interface Pattern {
  [key: string]: any;
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
      const nestedRules = {};
      const {pattern} = patternWithScore;
      for (const key in pattern) {
        const value = pattern[key];
        if (Array.isArray(value)) {
          this.addArrayRulesToMatrix(key, value, patternWithScore);
        } else if (typeof value === 'object') {
          Object.assign(nestedRules, Engine.flatObjectField(value, key));
        } else {
          this.addRuleToMatrix(key, value, patternWithScore);
        }
      }

      for (const key in nestedRules) {
        const value = nestedRules[key];
          if (Array.isArray(value)) {
            this.addArrayRulesToMatrix(key, value, patternWithScore);
          } else {
            this.addRuleToMatrix(key, value, patternWithScore);
          }
      }
    })
    

  }

  private static flatObjectField(obj: object, prevKey: string) {
    const result = {};
    const leftOvers = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'object') {
        Object.assign(leftOvers, Engine.flatObjectField(value, `${prevKey}.${key}`));
      } else {
        result[`${prevKey}.${key}`] = value;
      }
    }
    return Object.assign(result, leftOvers);
  }

  private addArrayRulesToMatrix(key: string, values: any[], patternWithScore: PatternWithScore): void {
    for (const value of values) {
      this.addRuleToMatrix(key, value, patternWithScore);
    }
  }

  private addRuleToMatrix(key: string, value: any, patternWithScore: PatternWithScore): void {
    const strKey = `key=${key}:value=${value}`;
    if (!this.matrix.has(strKey)) {
      this.matrix.set(strKey, new Rule(key, value));
    }
    const matcher = this.matrix.get(strKey) as Rule;
    matcher.addPattern(patternWithScore);
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
    this.resetScores();
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
      const result = this.findMatch(item);
      results.push(result);  
    })
    return results;

  }
}