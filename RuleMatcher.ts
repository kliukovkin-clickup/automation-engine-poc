/*
 * RuleMatcher exists per rule. Since multiple patterns may have same rule.
 */
export class RuleMatcher {
  key: string;
  value: string | number | boolean;
  patternMatches: { [key: number]: number } = {};

  constructor(key: string, value: string | number | boolean) {
    this.key = key;
    this.value = value;
  }

  setMatch(index: number, score: number): void {
    this.patternMatches[index] = score;
  }

  getMatch(index: number): number {
    return this.patternMatches[index];
  }

  resetMatchScores(): void {
    for (const index in this.patternMatches) {
      this.patternMatches[index] = 0;
    }
  }

  incrementScores(): void {
    for (const patternIndex in this.patternMatches) {
      this.patternMatches[patternIndex]++;
    }
  }

  addPattern(index: number) {
    this.patternMatches[index] = 0;
  }
}
