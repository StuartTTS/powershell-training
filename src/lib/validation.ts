import { ValidationRule } from "./content";

export interface ValidationResult {
  passed: boolean;
  hint: string | null;
}

const DEFAULT_HINT = "Not quite — check your answer and try again.";

function checkRule(answer: string, rule: ValidationRule): boolean {
  switch (rule.rule) {
    case "contains":
      return rule.value
        ? answer.toLowerCase().includes(rule.value.toLowerCase())
        : false;

    case "regex":
      if (!rule.pattern) return false;
      try {
        const regex = new RegExp(rule.pattern, "i");
        return regex.test(answer);
      } catch {
        return false;
      }

    case "structure":
      switch (rule.check) {
        case "has-function":
          return /function\s+\w+/i.test(answer);
        case "has-param-block":
          return /param\s*\(/i.test(answer);
        case "has-try-catch":
          return /try\s*\{/i.test(answer) && /catch\s*\{/i.test(answer);
        case "has-pipeline":
          return answer.includes("|");
        default:
          return false;
      }

    case "order":
      if (!rule.sequence) return false;
      let lastIndex = -1;
      for (const keyword of rule.sequence) {
        const idx = answer.toLowerCase().indexOf(keyword.toLowerCase());
        if (idx === -1 || idx <= lastIndex) return false;
        lastIndex = idx;
      }
      return true;

    case "forbidden":
      return rule.value
        ? !answer.toLowerCase().includes(rule.value.toLowerCase())
        : true;

    default:
      return false;
  }
}

export function validateAnswer(
  answer: string,
  rules: ValidationRule[]
): ValidationResult {
  for (const rule of rules) {
    if (!checkRule(answer, rule)) {
      return {
        passed: false,
        hint: rule.hintOnFail || DEFAULT_HINT,
      };
    }
  }

  return { passed: true, hint: null };
}
