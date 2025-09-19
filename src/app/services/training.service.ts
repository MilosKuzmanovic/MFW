import { Injectable } from '@angular/core';
import { Training } from '../models/Training';
import { IStorageService } from '../interfaces';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class TrainingService implements IStorageService {
  private readonly storageKey = APP_CONSTANTS.STORAGE_KEYS.TRAININGS;

  // IStorageService implementation
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Gets all trainings from storage
   */
  getTrainings(): Training[] {
    try {
      const storedTrainings = this.getItem(this.storageKey);
      return storedTrainings ? JSON.parse(storedTrainings) : [];
    } catch (error) {
      console.error('Error loading trainings:', error);
      return [];
    }
  }

  /**
   * Gets a specific training by ID
   */
  getTraining(id: string): Training | undefined {
    try {
      const trainings = this.getTrainings();
      return trainings.find(training => training.id === id);
    } catch (error) {
      console.error('Error loading training:', error);
      return undefined;
    }
  }

  /**
   * Removes a training from storage
   */
  removeTraining(training: Training): boolean {
    try {
      const trainings = this.getTrainings();
      const filteredTrainings = trainings.filter(t => t.id !== training.id);
      this.setItem(this.storageKey, JSON.stringify(filteredTrainings));
      return true;
    } catch (error) {
      console.error('Error removing training:', error);
      return false;
    }
  }

  /**
   * Adds a new training to storage
   */
  addTraining(training: Training): boolean {
    try {
      const trainings = this.getTrainings();
      trainings.push(training);
      this.setItem(this.storageKey, JSON.stringify(trainings));
      return true;
    } catch (error) {
      console.error('Error adding training:', error);
      return false;
    }
  }

  /**
   * Updates an existing training in storage
   */
  editTraining(training: Training): boolean {
    try {
      const trainings = this.getTrainings();
      const index = trainings.findIndex(t => t.id === training.id);
      
      if (index !== -1) {
        trainings[index] = training;
      } else {
        trainings.push(training);
      }
      
      this.setItem(this.storageKey, JSON.stringify(trainings));
      return true;
    } catch (error) {
      console.error('Error editing training:', error);
      return false;
    }
  }

  /**
   * Checks if a training with given name already exists
   */
  trainingExists(name: string, excludeId?: string): boolean {
    const trainings = this.getTrainings();
    return trainings.some(training => 
      training.name.toLowerCase() === name.toLowerCase() && 
      training.id !== excludeId
    );
  }

  /**
   * Gets training count
   */
  getTrainingCount(): number {
    return this.getTrainings().length;
  }

  /**
   * Clears all trainings (for testing purposes)
   */
  clearAllTrainings(): void {
    this.removeItem(this.storageKey);
  }
}
