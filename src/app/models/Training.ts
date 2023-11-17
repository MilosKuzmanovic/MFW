import { TrainingGroup } from "./TrainingGroup";

export class Training {
    id: string;
    name: string;
    description: string;
    time: number;
    break: number;
    trainingGroups: TrainingGroup[];
}