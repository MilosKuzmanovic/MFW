import { GuidGenerator } from "../services/guid-generator";
import { TrainingGroup } from "./TrainingGroup";
import { APP_CONSTANTS } from "../constants/app.constants";

export interface ITrainingData {
  id?: string;
  name?: string;
  description?: string;
  breakBetweenGroups?: string;
  breakBetweenSeries?: string;
  breakBetweenExercises?: string;
  trainingGroups?: TrainingGroup[];
  totalTime?: number;
}

export class Training {
  public readonly id: string;
  public name: string;
  public description: string;
  public breakBetweenGroups: string;
  public breakBetweenSeries: string;
  public breakBetweenExercises: string;
  public trainingGroups: TrainingGroup[];
  public totalTime: number;

  constructor(trainingData: ITrainingData = {}) {
    this.id = trainingData.id ?? GuidGenerator.newGuid();
    this.name = trainingData.name ?? '';
    this.description = trainingData.description ?? '';
    this.breakBetweenExercises = trainingData.breakBetweenExercises ?? '0';
    this.breakBetweenGroups = trainingData.breakBetweenGroups ?? '0';
    this.breakBetweenSeries = trainingData.breakBetweenSeries ?? '0';
    this.trainingGroups = trainingData.trainingGroups ?? [];
    this.totalTime = trainingData.totalTime ?? 0;
  }

  /**
   * Calculates total training time including breaks
   */
  public calculateTotalTime(): void {
    if (!this.trainingGroups || this.trainingGroups.length === 0) {
      this.totalTime = 0;
      return;
    }

    this.totalTime = this.trainingGroups.reduce((totalSum, group) => {
      const groupTime = this.calculateGroupTime(group);
      return totalSum + groupTime;
    }, 0);

    // Subtract the last group break
    this.totalTime -= this.getNumericValue(this.breakBetweenGroups);
  }

  /**
   * Calculates time for a single group
   */
  private calculateGroupTime(group: TrainingGroup): number {
    const numberOfSeries = this.getNumericValue(group.numberOfSeries);
    const exerciseTime = this.getNumericValue(group.time);
    const breakBetweenExercises = this.getNumericValue(this.breakBetweenExercises);
    const breakBetweenGroups = this.getNumericValue(this.breakBetweenGroups);
    const breakBetweenSeries = this.getNumericValue(this.breakBetweenSeries);

    if (numberOfSeries <= 0 || !group.exercises || group.exercises.length === 0) {
      return breakBetweenGroups;
    }

    // Calculate exercise time for all series
    const totalExerciseTime = group.exercises.reduce((sum, exercise) => {
      const exerciseDuration = this.getNumericValue(exercise.time) || exerciseTime;
      return sum + (exerciseDuration * numberOfSeries);
    }, 0);

    // Calculate breaks between exercises within series
    const breaksBetweenExercises = group.exercises.length > 1 
      ? breakBetweenExercises * (group.exercises.length - 1) * numberOfSeries 
      : 0;

    // Calculate breaks between series
    const breaksBetweenSeries = numberOfSeries > 1 
      ? breakBetweenSeries * (numberOfSeries - 1) 
      : 0;

    return totalExerciseTime + breaksBetweenExercises + breaksBetweenSeries + breakBetweenGroups;
  }

  /**
   * Gets numeric value from string, defaults to 0
   */
  private getNumericValue(value: string | number): number {
    if (typeof value === 'number') {
      return Math.max(0, value);
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }

  /**
   * Validates training data
   */
  public isValid(): boolean {
    return this.name.trim().length >= APP_CONSTANTS.VALIDATION.MIN_NAME_LENGTH &&
           this.trainingGroups.length > 0 &&
           this.trainingGroups.every(group => group.isValid());
  }

  /**
   * Gets total number of exercises across all groups
   */
  public getTotalExerciseCount(): number {
    return this.trainingGroups.reduce((total, group) => {
      return total + (group.exercises?.length || 0);
    }, 0);
  }

  /**
   * Creates a copy of the training
   */
  public clone(): Training {
    const clonedData: ITrainingData = {
      id: GuidGenerator.newGuid(),
      name: `${this.name} (Copy)`,
      description: this.description,
      breakBetweenGroups: this.breakBetweenGroups,
      breakBetweenSeries: this.breakBetweenSeries,
      breakBetweenExercises: this.breakBetweenExercises,
      trainingGroups: this.trainingGroups.map(group => group.clone())
    };
    
    return new Training(clonedData);
  }

  /**
   * Updates training with new data
   */
  public update(data: Partial<ITrainingData>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.breakBetweenGroups !== undefined) this.breakBetweenGroups = data.breakBetweenGroups;
    if (data.breakBetweenSeries !== undefined) this.breakBetweenSeries = data.breakBetweenSeries;
    if (data.breakBetweenExercises !== undefined) this.breakBetweenExercises = data.breakBetweenExercises;
    if (data.trainingGroups !== undefined) this.trainingGroups = data.trainingGroups;
    
    this.calculateTotalTime();
  }
}