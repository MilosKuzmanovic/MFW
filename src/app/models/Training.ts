import { TrainingGroup } from "./TrainingGroup";

export class Training {
    id: string;
    name: string;
    description: string;
    breakBetweenGroups: string;
    breakBetweenSeries: string;
    breakBetweenExercises: string;
    trainingGroups: TrainingGroup[];
}