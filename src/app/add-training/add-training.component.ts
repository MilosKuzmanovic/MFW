import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/Training';
import { TrainingGroup } from '../models/TrainingGroup';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
})
export class AddTrainingComponent {
  @Input() trainingDetails: Training;
  @Input() isEdit: boolean;
  @Output() trainingSaved: EventEmitter<boolean> = new EventEmitter();
  @Output() getBack: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    private trainingService: TrainingService
  ) {}

  addGroup(): void {
    this.trainingDetails.trainingGroups.push({
      name: '',
      description: '',
      exercises: [],
    });
  }

  addExercise(group: TrainingGroup): void {
    group.exercises.push({
      name: '',
      description: ''
    });
  }

  saveTraining(): void {
    if (this.isEdit) {
      this.trainingService.editTraining(this.trainingDetails);
    } else {
      this.trainingService.addTraining(this.trainingDetails);
    }

    this.trainingSaved.emit(true);
  }
}
