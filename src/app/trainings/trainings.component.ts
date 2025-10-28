import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { TimeUtilsService } from '../services/time-utils.service';
import { Training } from '../models/Training';
import { TrainingGroup } from '../models/TrainingGroup';
import { Exercise } from '../models/Exercise';
import { GuidGenerator } from '../services/guid-generator';
import { ToastController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { BackButtonService } from '../services/back-button.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent implements OnInit, OnDestroy {
  trainings: Training[] = [];
  selectedTraining: Training | null = null;
  addingTraining: boolean = false;
  isEditingTraining: boolean = false;
  reviewing: boolean = false;
  selectedTrainingForRemoval: Training | null = null;
  selectedTrainingForReview: Training | null = null;
  isImporting: boolean = false;
  importedTraining: string = '';
  isLoading: boolean = false;
  
  private backButtonSubscription: Subscription;

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
        if (this.selectedTrainingForRemoval) {
          this.removeTraining(this.selectedTrainingForRemoval);
        }
      },
    },
  ];

  constructor(
    private router: Router,
    private trainingService: TrainingService,
    private timeUtils: TimeUtilsService,
    private toast: ToastController,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private backButtonService: BackButtonService
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  ionViewDidEnter(): void {
    this.backButtonService.registerBackButton(APP_CONSTANTS.ROUTES.TRAININGS);
  }

  ngOnDestroy(): void {
    this.backButtonService.unregisterBackButton();
  }

  loadTrainings(): void {
    try {
      this.isLoading = true;
      this.trainings = this.trainingService.getTrainings();
      console.log('Loaded trainings:', this.trainings);
    } catch (error) {
      console.error('Error loading trainings:', error);
      this.showToast(APP_CONSTANTS.MESSAGES.ERROR.TRAINING_LOAD_FAILED, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  editTraining(training: Training): void {
    this.addingTraining = true;
    this.isEditingTraining = true;
    // Create a deep copy of the training to avoid modifying the original
    const trainingData = JSON.parse(JSON.stringify(training));
    
    // Properly reconstruct nested objects as class instances
    if (trainingData.trainingGroups) {
      trainingData.trainingGroups = trainingData.trainingGroups.map((group: any) => {
        const groupData = { ...group };
        if (groupData.exercises) {
          groupData.exercises = groupData.exercises.map((exercise: any) => new Exercise(exercise));
        }
        return new TrainingGroup(groupData);
      });
    }
    
    this.selectedTraining = new Training(trainingData);
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
  
      (training as any).id = GuidGenerator.newGuid();
  
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
    this.isEditingTraining = false;
    this.addingTraining = true;
  }

  convertSeconds(totalSeconds: number) {
    return this.timeUtils.formatTimeReadable(totalSeconds);
  }

  async removeTraining(training: Training): Promise<void> {
    if (!training) return;

    try {
      const success = this.trainingService.removeTraining(training);
      if (success) {
        this.loadTrainings();
        await this.showToast(APP_CONSTANTS.MESSAGES.SUCCESS.TRAINING_DELETED);
      } else {
        await this.showToast(APP_CONSTANTS.MESSAGES.ERROR.TRAINING_SAVE_FAILED, 'danger');
      }
    } catch (error) {
      console.error('Error removing training:', error);
      await this.showToast(APP_CONSTANTS.MESSAGES.ERROR.TRAINING_SAVE_FAILED, 'danger');
    }
  }

  async onFinish() {
    this.addingTraining = false;
    this.isEditingTraining = false;
    this.selectedTraining = null;
    this.loadTrainings();

    const toast = await this.toast.create({
      message: 'Uspesno sacuvan trening!',
      duration: 1500,
      position: 'middle',
    });

    await toast.present();
  }

  playTraining(training: Training): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.PLAY_TRAINING], {
      queryParams: { trainingId: training.id },
    });
  }

  getTotalExercises(training: Training): number {
    if (!training.trainingGroups) return 0;
    return training.trainingGroups.reduce((total, group) => total + (group.exercises?.length || 0), 0);
  }

  private async showToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toast.create({
      message,
      duration: APP_CONSTANTS.TIMING.TOAST_DURATION,
      position: APP_CONSTANTS.TIMING.TOAST_POSITION,
      color
    });
    await toast.present();
  }
}
