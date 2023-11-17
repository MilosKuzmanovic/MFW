import { Exercise } from "./Exercise";

export class TrainingGroup {
    id: string;
    order: number;
    name: string;
    description: string;
    exercises: Exercise[];
}