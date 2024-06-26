import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/Training';
import { TrainingGroup } from '../models/TrainingGroup';
import { ToastController } from '@ionic/angular';
import { Exercise } from '../models/Exercise';
import { GuidGenerator } from '../services/guid-generator';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
})
export class AddTrainingComponent {
  @Input() isEdit: boolean;
  @Output() trainingSaved: EventEmitter<boolean> = new EventEmitter();
  @Output() getBack: EventEmitter<boolean> = new EventEmitter();

  private _trainingDetails: Training;

  @Input()
  set trainingDetails(training: Training) {
    this._trainingDetails = training;
    this._trainingDetails?.trainingGroups?.forEach(tg => tg.exercises?.forEach(te => te.time ??= tg.time));
  }

  get trainingDetails(): Training {
    return this._trainingDetails;
  }

  public alertButtons = [
    {
      text: 'CANCEL',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'YES',
      role: 'confirm',
      handler: () => {
        this.getBack.emit(true);
      },
    },
  ];

  constructor(
    private trainingService: TrainingService,
    private toast: ToastController
  ) {
  }

  addGroup(): void {
    this.trainingDetails.trainingGroups.push({
      id: GuidGenerator.newGuid(),
      order: (this.trainingDetails.trainingGroups.length + 1).toString(),
      numberOfSeries: '',
      name: '',
      time: '',
      description: '',
      exercises: [],
    });
  }

  addExercise(group: TrainingGroup): void {
    group.exercises.push({
      id: GuidGenerator.newGuid(),
      order: (group.exercises.length + 1).toString(),
      name: '',
      description: '',
      time: group.time
    });
  }

  async saveTraining() {
    if (
      !this.trainingDetails.name ||
      !this.trainingDetails.breakBetweenGroups ||
      !this.trainingDetails.breakBetweenExercises
    ) {
      const toast = await this.toast.create({
        message: 'Popuni naziv i pauzu za trening!',
        duration: 1500,
        position: 'middle',
      });

      await toast.present();

      return;
    }

    if (
      !this.trainingDetails.trainingGroups ||
      this.trainingDetails.trainingGroups.length == 0
    ) {
      const toast = await this.toast.create({
        message: 'Dodaj grupu treninga!',
        duration: 1500,
        position: 'middle',
      });

      await toast.present();

      return;
    }

    if (this.trainingDetails.trainingGroups.some((x) => !x.name)) {
      const toast = await this.toast.create({
        message: 'Popuni naziv za grupe treninga!',
        duration: 1500,
        position: 'middle',
      });

      await toast.present();

      return;
    }

    if (
      this.trainingDetails.trainingGroups.some(
        (x) => !x.time
      )
    ) {
      const toast = await this.toast.create({
        message: 'Dodaj vreme trajanja grupe!',
        duration: 1500,
        position: 'middle',
      });

      await toast.present();

      return;
    }
    
    if (
      this.trainingDetails.trainingGroups.some(
        (x) => !x.exercises || x.exercises.length == 0
      )
    ) {
      const toast = await this.toast.create({
        message: 'Dodaj vežbe u grupu treninga!',
        duration: 1500,
        position: 'middle',
      });

      await toast.present();

      return;
    }

    if (
      this.trainingDetails.trainingGroups.some((x) =>
        x.exercises.some((y) => !y.name)
      )
    ) {
      const toast = await this.toast.create({
        message: 'Popuni naziv za vežbe!',
        duration: 1500,
        position: 'middle',
      });

      await toast.present();

      return;
    }

    if (
      this.trainingDetails.trainingGroups.some(
        (x) => x.exercises.some(ex => !ex.time)
      )
    ) {
      const toast = await this.toast.create({
        message: 'Dodaj vreme trajanja vežbe!',
        duration: 1500,
        position: 'middle',
      });

      await toast.present();

      return;
    }
    
    const training = new Training(this.trainingDetails);
    training.calculateTotalTime();

    if (this.isEdit) {
      this.trainingService.editTraining(training);
    } else {
      this.trainingService.addTraining(training);
    }

    this.trainingSaved.emit(true);
  }

  removeGroup(group: TrainingGroup) {
    this.trainingDetails.trainingGroups =
      this.trainingDetails.trainingGroups.filter((x) => x.id !== group.id);
  }

  removeExercise(exercise: Exercise) {
    this.trainingDetails.trainingGroups.forEach((group) => {
      group.exercises = group.exercises.filter((x) => x.id !== exercise.id);
    });
  }
}
