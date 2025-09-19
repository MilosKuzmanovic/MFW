import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TrainingService } from '../services/training.service';
import { TimeUtilsService } from '../services/time-utils.service';
import { Training } from '../models/Training';
import { TrainingGroup } from '../models/TrainingGroup';
import { Exercise } from '../models/Exercise';
import { GuidGenerator } from '../services/guid-generator';
import { TrainingsComponent } from '../trainings/trainings.component';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';

@Component({
  selector: 'app-play-training',
  templateUrl: './play-training.component.html',
  styleUrls: ['./play-training.component.scss'],
})
export class PlayTrainingComponent implements OnInit, OnDestroy {
  @ViewChild(CountdownTimerComponent) timer: CountdownTimerComponent;

  trainingId: string;
  training: Training;
  currentGroup: TrainingGroup;
  currentExercise: Exercise;
  currentTime: string;
  isBreak: boolean;
  exerciseIndex: number = 0;
  groupIndex: number = 0;
  seriesIndex: number = 1;
  isFinishedTraining: boolean;
  isPaused: boolean = false;
  pauseStartTime: Date | null = null;
  totalPauseTime: number = 0; // Total paused time in seconds
  wakeLock: any;

  private resumeSubscription: Subscription;
  private pauseSubscription: Subscription;
  private backButtonSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private trainingService: TrainingService,
    private timeUtils: TimeUtilsService,
    private platform: Platform
  ) {
    this.initializeWakeLock();
  }

  private async initializeWakeLock() {
    if ('wakeLock' in navigator) {
      console.log('Wake Lock API is supported');
      
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock acquired successfully');
        
        this.wakeLock.addEventListener('release', () => {
          console.log('Wake Lock was released');
        });
        
      } catch (err: any) {
        console.error('Wake Lock failed:', err.name, err.message);
      }
    } else {
      console.log('Wake Lock API is not supported');
    }
  }

  ngOnInit() {
    this.resumeSubscription = this.platform.resume.subscribe(() => {
      console.log('Device resumed');
      // Re-acquire wake lock when device resumes
      this.initializeWakeLock();
    });

    this.pauseSubscription = this.platform.pause.subscribe(() => {
      console.log('Device paused');
    });

    // Back button će se registrovati u ionViewDidEnter

    this.trainingId = this.route.snapshot.queryParams['trainingId'];

    if (this.trainingId) {
      var training = this.trainingService.getTraining(this.trainingId);
      if (training) {
        this.training = training;

        this.training.trainingGroups = this.training.trainingGroups.sort(
          (a, b) => +a.order - +b.order
        );
        this.training.trainingGroups.forEach((group) => {
          group.exercises = group.exercises.sort((a, b) => +a.order - +b.order);
        });

        this.currentGroup = this.training.trainingGroups[0];
        this.currentExercise = this.training.trainingGroups[0].exercises[0];

        this.isBreak = false;
        this.currentTime = this.currentExercise.time ?? this.currentGroup.time;
      }
    }
  }

  ionViewDidEnter(): void {
    // Registruj back button behavior kada se stranica učita
    this.platform.ready().then(() => {
      this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
        this.handleBackButton();
      });
    });
  }

  ngOnDestroy() {
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
    }
    if (this.pauseSubscription) {
      this.pauseSubscription.unsubscribe();
    }
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }

    this.releaseWakeLock();
  }

  private releaseWakeLock() {
    if (this.wakeLock !== null) {
      this.wakeLock.release().then(() => {
        this.wakeLock = null;
        console.log('Wake Lock released');
      });
    }
  }

  moveNext() {
    if (this.isFinishedTraining) return;

    if (this.isBreak) {
      this.exerciseIndex++;

      if (
        this.exerciseIndex ==
        this.training.trainingGroups[this.groupIndex].exercises.length
      ) {
        if (
          this.seriesIndex ==
          +this.training.trainingGroups[this.groupIndex].numberOfSeries
        ) {
          this.groupIndex++;
          this.seriesIndex = 1;
        } else {
          this.seriesIndex++;
        }
        this.exerciseIndex = 0;
      }

      if (this.groupIndex == this.training.trainingGroups.length) {
        this.isFinishedTraining = true;
        return;
      }

      this.currentExercise =
        this.training.trainingGroups[this.groupIndex].exercises[
        this.exerciseIndex
        ];
      this.currentGroup = this.training.trainingGroups[this.groupIndex];
      this.currentTime = this.currentExercise.time ?? this.currentGroup.time;
    } else {
      if (
        this.training.trainingGroups[this.groupIndex].exercises.length ==
        this.exerciseIndex + 1 &&
        +this.training.trainingGroups[this.groupIndex].numberOfSeries ==
        this.seriesIndex
      ) {
        this.currentTime = this.training.breakBetweenGroups;
      } else if (
        this.training.trainingGroups[this.groupIndex].exercises.length ==
        this.exerciseIndex + 1 &&
        +this.training.trainingGroups[this.groupIndex].numberOfSeries >
        this.seriesIndex
      ) {
        this.currentTime = this.training.breakBetweenSeries;
      } else {
        this.currentTime = this.training.breakBetweenExercises;
      }
    }

    this.isBreak = !this.isBreak;

    if (this.isBreak && !this.nextExercise) {
      this.isFinishedTraining = true;
    }
  }

  get nextExercise(): Exercise | undefined {
    if (this.isFinishedTraining) return undefined;

    let exerciseIndex = this.exerciseIndex;
    let groupIndex = this.groupIndex;

    exerciseIndex++;

    if (
      exerciseIndex ==
      this.training.trainingGroups[groupIndex].exercises.length
    ) {
      if (
        this.seriesIndex ==
        +this.training.trainingGroups[groupIndex].numberOfSeries
      ) {
        groupIndex++;
      }
      exerciseIndex = 0;
    }

    return this.training.trainingGroups[groupIndex]?.exercises[exerciseIndex];
  }

  moveBack() {
    if (this.isFinishedTraining) {
      this.isBreak = false;
    }

    if (
      this.groupIndex == 0 &&
      this.exerciseIndex == 0 &&
      this.seriesIndex == 1 &&
      this.isBreak
    ) {
      this.isBreak = !this.isBreak;
    }

    if (
      this.groupIndex == 0 &&
      this.exerciseIndex == 0 &&
      this.seriesIndex == 1
    ) {
      this.currentTime = this.currentExercise.time ?? this.currentGroup.time;
      return;
    }

    if (!this.isBreak) {
      this.exerciseIndex--;

      if (this.exerciseIndex < 0) {
        if (this.seriesIndex == 1) {
          this.exerciseIndex = 0;

          if (this.groupIndex > 0) {
            this.groupIndex--;
            this.seriesIndex =
              +this.training.trainingGroups[this.groupIndex].numberOfSeries;
            this.exerciseIndex =
              +this.training.trainingGroups[this.groupIndex].exercises.length -
              1;
          }
        } else {
          this.seriesIndex--;
          this.exerciseIndex =
            +this.training.trainingGroups[this.groupIndex].exercises.length - 1;
        }
      } else {
      }

      if (this.isFinishedTraining) {
        this.groupIndex = this.training.trainingGroups.length - 1;
        this.exerciseIndex =
          this.training.trainingGroups[this.groupIndex].exercises.length - 1;
        this.seriesIndex =
          +this.training.trainingGroups[this.groupIndex].numberOfSeries;
      }

      this.currentExercise =
        this.training.trainingGroups[this.groupIndex].exercises[
        this.exerciseIndex
        ];
      this.currentGroup = this.training.trainingGroups[this.groupIndex];

      if (this.isFinishedTraining) {
        this.currentTime = this.currentExercise.time ?? this.currentGroup.time;
      } else if (
        this.training.trainingGroups[this.groupIndex].exercises.length ==
        this.exerciseIndex + 1 &&
        +this.training.trainingGroups[this.groupIndex].numberOfSeries ==
        this.seriesIndex
      ) {
        this.currentTime = this.training.breakBetweenGroups;
      } else if (
        this.training.trainingGroups[this.groupIndex].exercises.length ==
        this.exerciseIndex + 1 &&
        +this.training.trainingGroups[this.groupIndex].numberOfSeries >
        this.seriesIndex
      ) {
        this.currentTime = this.training.breakBetweenSeries;
      } else {
        this.currentTime = this.training.breakBetweenExercises;
      }
    } else {
      this.currentTime = this.currentExercise.time ?? this.currentGroup.time;
    }

    if (this.isFinishedTraining) {
      this.isFinishedTraining = false;
    } else {
      this.isBreak = !this.isBreak;
    }
  }

  get goalTime(): string {
    if (!this.training) return '';

    const training = new Training(this.training);
    training.calculateTotalTime();
    
    // Get current remaining time from timer
    const currentRemainingTime = this.timer?.remainingTime ?? this.timeUtils.timeStringToSeconds(this.currentTime);
    
    // Calculate total remaining time
    const totalRemainingTime = this.calculateTotalRemainingTime() + this.totalPauseTime;
    
    return this.timeUtils.getTimePlusSeconds(totalRemainingTime);
  }

  private calculateTotalRemainingTime(): number {
    if (!this.training) return 0;

    let remainingTime = 0;
    
    // Add remaining time for current exercise/break
    const currentRemainingTime = this.timer?.remainingTime ?? this.timeUtils.timeStringToSeconds(this.currentTime);
    remainingTime += currentRemainingTime;
    
    // Add time for all remaining exercises and breaks
    for (let groupIndex = this.groupIndex; groupIndex < this.training.trainingGroups.length; groupIndex++) {
      const group = this.training.trainingGroups[groupIndex];
      
      for (let seriesIndex = (groupIndex === this.groupIndex ? this.seriesIndex : 1); 
           seriesIndex <= +group.numberOfSeries; seriesIndex++) {
        
        for (let exerciseIndex = (groupIndex === this.groupIndex && seriesIndex === this.seriesIndex ? this.exerciseIndex : 0); 
             exerciseIndex < group.exercises.length; exerciseIndex++) {
          
          // Skip current exercise if we're in the middle of it
          if (groupIndex === this.groupIndex && seriesIndex === this.seriesIndex && exerciseIndex === this.exerciseIndex) {
            continue;
          }
          
          const exercise = group.exercises[exerciseIndex];
          const exerciseTime = this.timeUtils.timeStringToSeconds(exercise.time || group.time);
          remainingTime += exerciseTime;
          
          // Add break between exercises (except for last exercise in last series)
          if (!(exerciseIndex === group.exercises.length - 1 && seriesIndex === +group.numberOfSeries)) {
            remainingTime += this.timeUtils.timeStringToSeconds(this.training.breakBetweenExercises);
          }
        }
        
        // Add break between series (except for last series)
        if (seriesIndex < +group.numberOfSeries) {
          remainingTime += this.timeUtils.timeStringToSeconds(this.training.breakBetweenSeries);
        }
      }
      
      // Add break between groups (except for last group)
      if (groupIndex < this.training.trainingGroups.length - 1) {
        remainingTime += this.timeUtils.timeStringToSeconds(this.training.breakBetweenGroups);
      }
    }
    
    return remainingTime;
  }

  getPassedTime(): number {
    if (!this.training) return 0;

    const training = new Training(this.training);
    training.calculateTotalTime();
    
    const totalRemainingTime = this.calculateTotalRemainingTime();
    return training.totalTime - totalRemainingTime;
  }

  convertSeconds(totalSeconds: number) {
    return this.timeUtils.formatTimeReadable(totalSeconds);
  }

  togglePause() {
    if (this.isPaused) {
      // Resume training
      this.isPaused = false;
      if (this.pauseStartTime) {
        const pauseDuration = Math.floor((new Date().getTime() - this.pauseStartTime.getTime()) / 1000);
        this.totalPauseTime += pauseDuration;
        this.pauseStartTime = null;
        console.log(`Resumed after ${pauseDuration}s pause. Total pause time: ${this.totalPauseTime}s`);
      }
    } else {
      // Pause training
      this.isPaused = true;
      this.pauseStartTime = new Date();
      console.log('Training paused');
    }
  }

  private handleBackButton() {
    // Navigate back to trainings list instead of browser history
    this.router.navigate(['/trainings']);
  }
}
