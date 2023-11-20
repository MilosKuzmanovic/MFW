import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/Training';
import { GuidGenerator } from '../services/guid-generator';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent implements OnInit {
  trainings: Training[] = [];
  selectedTraining: Training;
  addingTraining: boolean;
  reviewing: boolean;
  selectedTrainingForRemoval: Training;
  selectedTrainingForReview: Training | undefined;

  public alertButtons = [
    {
      text: 'CANCEL',
      cssClass: 'alert-button-cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'YES',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.removeTraining(this.selectedTrainingForRemoval);
      },
    },
  ];

  constructor(
    private router: Router,
    private trainingService: TrainingService,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings() {
    this.trainings = this.trainingService.getTrainings();
  }

  editTraining(training: Training): void {
    this.addingTraining = true;
    this.selectedTraining = training;
  }

  review(training: Training) {
    this.reviewing = true;
    this.selectedTrainingForReview = training;
  }

  addTraining(): void {
    this.selectedTraining = {
      id: GuidGenerator.newGuid(),
      name: '',
      description: '',
      breakBetweenExercises: '',
      breakBetweenGroups: '',
      breakBetweenSeries: '',
      time: '',
      trainingGroups: [],
    };

    this.addingTraining = true;
  }

  async removeTraining(training: Training) {
    this.trainingService.removeTraining(training);
    this.loadTrainings();

    const toast = await this.toast.create({
      message: 'Uspesno obrisan trening!',
      duration: 1500,
      position: 'middle',
    });

    await toast.present();
  }

  async onFinish() {
    this.addingTraining = false;
    this.loadTrainings();

    const toast = await this.toast.create({
      message: 'Uspesno sacuvan trening!',
      duration: 1500,
      position: 'middle',
    });

    await toast.present();
  }

  playTraining(training: Training) {
    this.router.navigate(['play-training'], {
      queryParams: { trainingId: training.id },
    });
  }
}
