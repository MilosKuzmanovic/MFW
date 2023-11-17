import { Injectable } from '@angular/core';
import { Training } from '../models/Training';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private readonly STORAGE_KEY = 'trainings';

  getTrainings(): Training[] {
    const storedTrainings = localStorage.getItem(this.STORAGE_KEY);
    return storedTrainings ? JSON.parse(storedTrainings) : [];
  }

  removeTraining(training: Training): void {
    
    const storedTrainings = localStorage.getItem(this.STORAGE_KEY) || '[]';
    let trainings: Training[] = JSON.parse(storedTrainings);
    trainings = trainings.filter(x => x.id !== training.id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trainings));
  }

  addTraining(training: Training): void {
    const storedTrainings = localStorage.getItem(this.STORAGE_KEY) || '[]';
    const trainings: Training[] = JSON.parse(storedTrainings);
    trainings.push(training);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trainings));
  }

  editTraining(training: Training): void {
    const storedTrainings = localStorage.getItem(this.STORAGE_KEY) || '[]';
    let trainings: Training[] = JSON.parse(storedTrainings);
    trainings = trainings.filter(x => x.id !== training.id);
    trainings.push(training);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trainings));
  }
}
