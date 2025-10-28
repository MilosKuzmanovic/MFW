import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { Training, ITrainingData } from '../models/Training';
import { TrainingGroup, ITrainingGroupData } from '../models/TrainingGroup';
import { ToastController, Platform } from '@ionic/angular';
import { Exercise, IExerciseData } from '../models/Exercise';
import { GuidGenerator } from '../services/guid-generator';
import { BackButtonService } from '../services/back-button.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import { IValidationResult, IToastOptions } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
})
export class AddTrainingComponent implements OnInit, OnDestroy {
  @Input() isEdit: boolean = false;
  @Output() trainingSaved: EventEmitter<boolean> = new EventEmitter();
  @Output() getBack: EventEmitter<boolean> = new EventEmitter();

  private backButtonSubscription: Subscription;
  private _trainingDetails: Training;
  public validationErrors: { [key: string]: string } = {};
  public isSubmitting: boolean = false;

  @Input()
  set trainingDetails(training: Training) {
    this._trainingDetails = training;
    this.initializeExerciseTimes();
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
    private toast: ToastController,
    private router: Router,
    private platform: Platform,
    private backButtonService: BackButtonService
  ) {
  }

  ngOnInit() {
    this.initializeTraining();
  }

  ionViewDidEnter(): void {
    this.backButtonService.registerBackButton('/add-training', () => {
      this.handleBackButton();
    });
  }

  ngOnDestroy() {
    this.backButtonService.unregisterBackButton();
  }

  private initializeTraining(): void {
    if (!this.trainingDetails) {
      this.trainingDetails = new Training();
    }
  }

  private initializeExerciseTimes(): void {
    this.trainingDetails?.trainingGroups?.forEach(group => {
      group.exercises?.forEach(exercise => {
        if (!exercise.time) {
          exercise.time = group.time;
        }
      });
    });
  }

  private handleBackButton(): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.TRAININGS]);
  }

  addGroup(): void {
    const groupData: ITrainingGroupData = {
      id: GuidGenerator.newGuid(),
      order: (this.trainingDetails.trainingGroups.length + 1).toString(),
      numberOfSeries: '1',
      name: '',
      time: '0',
      description: '',
      exercises: [],
    };
    
    this.trainingDetails.trainingGroups.push(new TrainingGroup(groupData));
  }

  addExercise(group: TrainingGroup): void {
    const exerciseData: IExerciseData = {
      id: GuidGenerator.newGuid(),
      order: (group.exercises.length + 1).toString(),
      name: '',
      description: '',
      time: group.time || '0'
    };
    
    group.exercises.push(new Exercise(exerciseData));
  }

  async saveTraining(): Promise<void> {
    console.log('saveTraining called');
    this.isSubmitting = true;
    this.validationErrors = {};

    const validationResult = this.validateForm();
    console.log('Validation result:', validationResult);
    
    if (!validationResult.isValid) {
      console.log('Validation errors:', validationResult.errors);
      this.validationErrors = validationResult.errors;
      this.isSubmitting = false;
      
      // Show all errors in toast
      const errorMessages = Object.values(validationResult.errors).join('\n');
      await this.showToast(errorMessages, 'danger');
      return;
    }

    try {
      console.log('Calculating total time and saving...');
      this.trainingDetails.calculateTotalTime();
      
      const success = this.isEdit 
        ? this.trainingService.editTraining(this.trainingDetails)
        : this.trainingService.addTraining(this.trainingDetails);

      console.log('Save result:', success);
      
      if (success) {
        await this.showToast(
          this.isEdit 
            ? APP_CONSTANTS.MESSAGES.SUCCESS.TRAINING_UPDATED 
            : APP_CONSTANTS.MESSAGES.SUCCESS.TRAINING_SAVED
        );
        this.trainingSaved.emit(true);
      } else {
        await this.showToast(APP_CONSTANTS.MESSAGES.ERROR.TRAINING_SAVE_FAILED, 'danger');
      }
    } catch (error) {
      console.error('Error saving training:', error);
      await this.showToast(APP_CONSTANTS.MESSAGES.ERROR.TRAINING_SAVE_FAILED, 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  private validateForm(): IValidationResult {
    const errors: { [key: string]: string } = {};

    // Validate training name
    if (!this.trainingDetails.name?.trim()) {
      errors['trainingName'] = APP_CONSTANTS.MESSAGES.ERROR.REQUIRED_FIELD;
    }

    // Validate breaks (convert to string first since they can be numbers)
    if (!String(this.trainingDetails.breakBetweenGroups || '').trim()) {
      errors['breakBetweenGroups'] = APP_CONSTANTS.MESSAGES.ERROR.REQUIRED_FIELD;
    }

    if (!String(this.trainingDetails.breakBetweenExercises || '').trim()) {
      errors['breakBetweenExercises'] = APP_CONSTANTS.MESSAGES.ERROR.REQUIRED_FIELD;
    }

    // Validate groups
    if (!this.trainingDetails.trainingGroups?.length) {
      errors['trainingGroups'] = 'Dodaj grupu treninga!';
    } else {
      this.trainingDetails.trainingGroups.forEach((group, groupIndex) => {
        if (!group.name?.trim()) {
          errors[`groupName_${groupIndex}`] = 'Popuni naziv za grupe treninga!';
        }

        if (!String(group.numberOfSeries || '').trim()) {
          errors[`groupSeries_${groupIndex}`] = 'Popuni broj ponavljanja za grupe treninga!';
        }

        if (!String(group.time || '').trim()) {
          errors[`groupTime_${groupIndex}`] = 'Popuni vreme za grupe treninga!';
        }

        if (!group.exercises?.length) {
          errors[`groupExercises_${groupIndex}`] = 'Dodaj vežbe za grupe treninga!';
        } else {
          group.exercises.forEach((exercise, exerciseIndex) => {
            if (!exercise.name?.trim()) {
              errors[`exerciseName_${groupIndex}_${exerciseIndex}`] = 'Popuni naziv za vežbe!';
            }
          });
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  public getValidationError(field: string): string {
    return this.validationErrors[field] || '';
  }

  public hasValidationError(field: string): boolean {
    return !!this.validationErrors[field];
  }

  removeGroup(group: TrainingGroup): void {
    const index = this.trainingDetails.trainingGroups.indexOf(group);
    if (index > -1) {
      this.trainingDetails.trainingGroups.splice(index, 1);
    }
  }

  removeExercise(exercise: Exercise, group: TrainingGroup): void {
    const index = group.exercises.indexOf(exercise);
    if (index > -1) {
      group.exercises.splice(index, 1);
    }
  }

  private async showToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toast.create({
      message,
      duration: color === 'danger' ? 4000 : APP_CONSTANTS.TIMING.TOAST_DURATION, // Longer duration for errors
      position: APP_CONSTANTS.TIMING.TOAST_POSITION,
      color
    });
    await toast.present();
  }
}