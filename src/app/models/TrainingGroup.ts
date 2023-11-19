import { Exercise } from "./Exercise";

export class TrainingGroup {
    id: string;
    order: number;
    numberOfSeries: number;
    name: string;
    description: string;
    exercises: Exercise[];
}