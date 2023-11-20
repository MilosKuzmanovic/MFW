import { Exercise } from "./Exercise";

export class TrainingGroup {
    id: string;
    order: string;
    numberOfSeries: string;
    name: string;
    description: string;
    exercises: Exercise[];
}