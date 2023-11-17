import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/Training';
import { TrainingGroup } from '../models/TrainingGroup';
import { ToastController } from '@ionic/angular';

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
    private trainingService: TrainingService,
    private toast: ToastController
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

  async saveTraining() {
    if (!this.trainingDetails.name || !this.trainingDetails.time || !this.trainingDetails.break) {
      const toast = await this.toast.create({
        message: 'Popuni naziv, vreme i pauzu za trening!',
        duration: 1500,
        position: 'middle',
      });
  
      await toast.present();

      return;
    }

    this.trainingDetails.trainingGroups.some(x => x.name)
    if (!this.trainingDetails.trainingGroups || this.trainingDetails.trainingGroups.length == 0) {
      const toast = await this.toast.create({
        message: 'Dodaj grupu treninga!',
        duration: 1500,
        position: 'middle',
      });
  
      await toast.present();

      return;
    }

    if (this.trainingDetails.trainingGroups.some(x => !x.name)) {
      const toast = await this.toast.create({
        message: 'Popuni naziv za grupe treninga!',
        duration: 1500,
        position: 'middle',
      });
  
      await toast.present();

      return;
    }

    if (this.trainingDetails.trainingGroups.some(x => !x.exercises || x.exercises.length == 0)) {
      const toast = await this.toast.create({
        message: 'Dodaj vežbe u grupu treninga!',
        duration: 1500,
        position: 'middle',
      });
  
      await toast.present();
     
      return;
    }

    if (this.trainingDetails.trainingGroups.some(x => x.exercises.some(y => !y.name))) {
      const toast = await this.toast.create({
        message: 'Popuni naziv za vežbe!',
        duration: 1500,
        position: 'middle',
      });
  
      await toast.present();
     
      return;
    }

    if (this.isEdit) {
      this.trainingService.editTraining(this.trainingDetails);
    } else {
      this.trainingService.addTraining(this.trainingDetails);
    }

    this.trainingSaved.emit(true);
  }
}
