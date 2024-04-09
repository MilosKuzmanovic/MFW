import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/Training';
import { GuidGenerator } from '../services/guid-generator';
import { ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

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
  isImporting: boolean;
  importedTraining: string;

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
    private toast: ToastController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings() {
    this.trainings = this.trainingService.getTrainings();
    console.log(this.trainings)
  }

  editTraining(training: Training): void {
    this.addingTraining = true;
    this.selectedTraining = training;
  }

  review(training: Training) {
    this.reviewing = true;
    this.selectedTrainingForReview = training;
  }

  importTraining() {
    this.isImporting = true;
    this.importedTraining = '';
  }

  async importTrainingFinish() {
    let trainings: Training[] = [];

    try {
      trainings = JSON.parse(this.importedTraining) as Training[];
      trainings.forEach(t => console.log(' '));
    } catch {
      trainings = [];
      try {
        const training = JSON.parse(this.importedTraining) as Training;
        trainings.push(training);
      } catch {
        const toast = await this.toast.create({
          message: 'Neispravan JSON!',
          duration: 1500,
          position: 'middle',
        });
  
        await toast.present();
  
        return;
      }
    }

    this.isImporting = false;

    trainings.forEach(training => {
      if (this.trainings.some((x) => x.name == training.name)) {
        training.name = `${training.name}_COPY`;
      }
  
      training.id = GuidGenerator.newGuid();
  
      this.trainingService.addTraining(training);
      this.trainings = this.trainingService.getTrainings();
    })
  }

  export(training: Training) {
    var uri = 'data:text/txt;charset=utf-8,' + JSON.stringify(training);

    var downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = `${training.name}.txt`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  exportAll() {
    var uri = 'data:text/txt;charset=utf-8,' + JSON.stringify(this.trainings);

    var downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = `all_trainings.txt`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  addTraining(): void {
    this.selectedTraining = new Training({} as Training);

    this.addingTraining = true;
  }

  convertSeconds(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSecondsAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const seconds = remainingSecondsAfterHours % 60;

    let formattedTime = '';

    if (hours > 0) {
        formattedTime += `${hours}h `;
    }

    if (minutes > 0) {
        formattedTime += `${minutes}min `;
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        formattedTime += `${seconds}s`;
    }

    return formattedTime;
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
