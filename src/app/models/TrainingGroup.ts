import { GuidGenerator } from "../services/guid-generator";
import { Exercise } from "./Exercise";
import { APP_CONSTANTS } from "../constants/app.constants";

export interface ITrainingGroupData {
  id?: string;
  name?: string;
  description?: string;
  time?: string;
  numberOfSeries?: string;
  order?: string;
  exercises?: Exercise[];
}

export class TrainingGroup {
  public readonly id: string;
  public name: string;
  public description: string;
  public time: string;
  public numberOfSeries: string;
  public order: string;
  public exercises: Exercise[];

  constructor(trainingGroupData: ITrainingGroupData = {}) {
    this.id = trainingGroupData.id ?? GuidGenerator.newGuid();
    this.name = trainingGroupData.name ?? '';
    this.description = trainingGroupData.description ?? '';
    this.time = trainingGroupData.time ?? '0';
    this.numberOfSeries = trainingGroupData.numberOfSeries ?? '1';
    this.order = trainingGroupData.order ?? '0';
    this.exercises = trainingGroupData.exercises ?? [];
  }

  /**
   * Validates training group data
   */
  public isValid(): boolean {
    return this.name.trim().length >= APP_CONSTANTS.VALIDATION.MIN_NAME_LENGTH &&
           this.getNumericValue(this.numberOfSeries) >= APP_CONSTANTS.VALIDATION.MIN_SERIES &&
           this.getNumericValue(this.numberOfSeries) <= APP_CONSTANTS.VALIDATION.MAX_SERIES &&
           this.exercises.length > 0 &&
           this.exercises.every(exercise => exercise.isValid());
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
   * Gets the number of series as a number
   */
  public getNumberOfSeries(): number {
    return this.getNumericValue(this.numberOfSeries);
  }

  /**
   * Gets the time as a number
   */
  public getTime(): number {
    return this.getNumericValue(this.time);
  }

  /**
   * Gets the order as a number
   */
  public getOrder(): number {
    return this.getNumericValue(this.order);
  }

  /**
   * Calculates total time for this group including exercises
   */
  public calculateTotalTime(): number {
    const seriesCount = this.getNumberOfSeries();
    const groupTime = this.getTime();
    
    if (seriesCount <= 0 || this.exercises.length === 0) {
      return 0;
    }

    const totalExerciseTime = this.exercises.reduce((sum, exercise) => {
      const exerciseTime = exercise.getTime() || groupTime;
      return sum + (exerciseTime * seriesCount);
    }, 0);

    return totalExerciseTime;
  }

  /**
   * Adds an exercise to the group
   */
  public addExercise(exercise: Exercise): void {
    this.exercises.push(exercise);
    this.sortExercisesByOrder();
  }

  /**
   * Removes an exercise from the group
   */
  public removeExercise(exerciseId: string): boolean {
    const index = this.exercises.findIndex(ex => ex.id === exerciseId);
    if (index !== -1) {
      this.exercises.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Sorts exercises by order
   */
  public sortExercisesByOrder(): void {
    this.exercises.sort((a, b) => a.getOrder() - b.getOrder());
  }

  /**
   * Creates a copy of the training group
   */
  public clone(): TrainingGroup {
    const clonedData: ITrainingGroupData = {
      id: GuidGenerator.newGuid(),
      name: `${this.name} (Copy)`,
      description: this.description,
      time: this.time,
      numberOfSeries: this.numberOfSeries,
      order: this.order,
      exercises: this.exercises.map(exercise => exercise.clone())
    };
    
    return new TrainingGroup(clonedData);
  }

  /**
   * Updates training group with new data
   */
  public update(data: Partial<ITrainingGroupData>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.time !== undefined) this.time = data.time;
    if (data.numberOfSeries !== undefined) this.numberOfSeries = data.numberOfSeries;
    if (data.order !== undefined) this.order = data.order;
    if (data.exercises !== undefined) this.exercises = data.exercises;
  }
}