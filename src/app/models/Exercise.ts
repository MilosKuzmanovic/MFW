import { GuidGenerator } from "../services/guid-generator";
import { APP_CONSTANTS } from "../constants/app.constants";

export interface IExerciseData {
  id?: string;
  name?: string;
  description?: string;
  order?: string;
  time?: string;
}

export class Exercise {
  public readonly id: string;
  public name: string;
  public description: string;
  public order: string;
  public time: string;

  constructor(exerciseData: IExerciseData = {}) {
    this.id = exerciseData.id ?? GuidGenerator.newGuid();
    this.name = exerciseData.name ?? '';
    this.description = exerciseData.description ?? '';
    this.order = exerciseData.order ?? '0';
    this.time = exerciseData.time ?? '0';
  }

  /**
   * Validates exercise data
   */
  public isValid(): boolean {
    return this.name.trim().length >= APP_CONSTANTS.VALIDATION.MIN_NAME_LENGTH &&
           this.getNumericValue(this.time) >= APP_CONSTANTS.VALIDATION.MIN_TIME_VALUE &&
           this.getNumericValue(this.time) <= APP_CONSTANTS.VALIDATION.MAX_TIME_VALUE;
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
   * Creates a copy of the exercise
   */
  public clone(): Exercise {
    const clonedData: IExerciseData = {
      id: GuidGenerator.newGuid(),
      name: `${this.name} (Copy)`,
      description: this.description,
      order: this.order,
      time: this.time
    };
    
    return new Exercise(clonedData);
  }

  /**
   * Updates exercise with new data
   */
  public update(data: Partial<IExerciseData>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.order !== undefined) this.order = data.order;
    if (data.time !== undefined) this.time = data.time;
  }

  /**
   * Gets a summary of the exercise
   */
  public getSummary(): string {
    const timeStr = this.getTime() > 0 ? ` (${this.getTime()}s)` : '';
    return `${this.name}${timeStr}`;
  }
}