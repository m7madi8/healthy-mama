import { QUIZ_CONFIG, type QuizKey } from "../data/quizConfig";

export type QuizRange = (typeof QUIZ_CONFIG)[QuizKey]["ranges"][number];

export function isQuizKey(value: string | null | undefined): value is QuizKey {
  return value === "postnatal" || value === "prep" || value === "pregnancy";
}

export function getTotalScore(
  answers: Array<number | null | undefined>,
  questions: { options: { value?: number }[] }[],
): number {
  let sum = 0;
  for (let i = 0; i < questions.length; i++) {
    const o = answers[i];
    if (o == null) continue;
    const opt = questions[i]?.options[o];
    if (opt && typeof opt.value === "number") sum += opt.value;
  }
  return sum;
}

export function getRangeForScore(quizKey: QuizKey, score: number): QuizRange {
  const config = QUIZ_CONFIG[quizKey];
  const ranges = config.ranges;
  for (let i = 0; i < ranges.length; i++) {
    if (score <= ranges[i].max) return ranges[i];
  }
  return ranges[ranges.length - 1];
}
