import { TaskScore } from '../models/data-models';

const calcTotalScore = (grade: TaskScore): number => {
  type ScoreType = { score: number; comment?: string };
  const grades = Object.values(grade.items) as ScoreType[];
  type Score = { score: number; comment?: string };
  const totalScore = grades.reduce<number>((total: number, item: ScoreType) => {
    return (total + item.score) as number;
  }, 0);
  return totalScore;
};

export default calcTotalScore;
