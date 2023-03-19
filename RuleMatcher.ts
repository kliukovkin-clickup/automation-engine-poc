/*
 * RuleMatcher exists per rule. Since multiple patterns may have the same rule.
 */

import { Pattern } from './comparator';

export interface PatternWithScore {
  pattern: Pattern;
  score: number;
}
export class RuleMatcher {
  key: string;
  value: string | number | boolean;
  patterns: PatternWithScore[];

  constructor(key: string, value: string | number | boolean) {
    this.key = key;
    this.value = value;
    this.patterns = [];
  }

  incrementScores(): void {
    this.patterns.forEach(pattern => pattern.score++);
  }

  addPattern(pattern: PatternWithScore) {
    this.patterns.push(pattern);
  }
}
