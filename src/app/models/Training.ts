import { GuidGenerator } from "../services/guid-generator";
import { TrainingGroup } from "./TrainingGroup";

export class Training {
    id: string;
    name: string;
    description: string;
    breakBetweenGroups: string;
    breakBetweenSeries: string;
    breakBetweenExercises: string;
    trainingGroups: TrainingGroup[];
    totalTime: number;

    constructor(training: Training) {
        this.id = training.id ?? GuidGenerator.newGuid();
        this.name = training.name ?? '';
        this.description = training.description ?? '';
        this.breakBetweenExercises = training.breakBetweenExercises ?? '';
        this.breakBetweenGroups = training.breakBetweenGroups ?? '';
        this.breakBetweenSeries = training.breakBetweenSeries ?? '';
        this.trainingGroups = training.trainingGroups ?? [];
    }

    public calculateTotalTime(): void {
        this.totalTime = this.trainingGroups.reduce((sum, tg) => {
            const exerciseTimeSum = tg.exercises.reduce((exSum, ex) => exSum + (((+ex.time || +tg.time)) * +tg.numberOfSeries + +this.breakBetweenExercises * (+tg.numberOfSeries - 1)), 0);
            var totalSum = sum + exerciseTimeSum + +this.breakBetweenGroups + +this.breakBetweenSeries * +tg.numberOfSeries - +this.breakBetweenSeries;
            
            if ((+tg.numberOfSeries * tg.exercises.length) % 2 === 0) {
                totalSum -= +this.breakBetweenExercises;
            }

            return totalSum;
        }, 0);
        this.totalTime -= +this.breakBetweenGroups;

        this.trainingGroups.forEach(tg => {
            for (let i = 1; i <= +tg.numberOfSeries; i++) {
                tg.exercises.forEach(ex => {
                    this.totalTime += 2;
                })                
            }
        })
    }
}