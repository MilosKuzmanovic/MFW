import { TrainingGroup } from "./TrainingGroup";

export class Training {
    id: string;
    name: string;
    description: string;
    breakBetweenGroups: string;
    breakBetweenSeries: string;
    breakBetweenExercises: string;
    trainingGroups: TrainingGroup[];

    get totalTime(): number {
        return this.trainingGroups.reduce((sum, tg) => sum + +tg.time * tg.exercises.length, 0);
    }
}