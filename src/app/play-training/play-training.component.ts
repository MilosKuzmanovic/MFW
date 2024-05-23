import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from '../services/training.service';
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
export class PlayTrainingComponent implements OnInit {
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
  wakeLock: any;

  private resumeSubscription: Subscription;
  private pauseSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private platform: Platform
  ) {
    if ('wakeLock' in navigator) {
      console.log('wakeLock API is supported');
    } else {
      console.log('wakeLock API is not supported');
    }

    const requestWakeLock = async () => {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock acquired');
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    };

    // Pozovite ovu funkciju kada želite da sprečite uspavljivanje uređaja
    requestWakeLock();
  }

  ngOnInit() {
    this.resumeSubscription = this.platform.resume.subscribe(() => {
      console.log('Device resumed');
    });

    this.pauseSubscription = this.platform.pause.subscribe(() => {
      console.log('Device paused');
    });

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

  ngOnDestroy() {
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
    }
    if (this.pauseSubscription) {
      this.pauseSubscription.unsubscribe();
    }

    const releaseWakeLock = () => {
      if (this.wakeLock !== null) {
        this.wakeLock.release().then(() => {
          this.wakeLock = null;
          console.log('Wake Lock released');
        });
      }
    };

    // Pozovite ovu funkciju kada želite da dozvolite uspavljivanje uređaja
    releaseWakeLock();
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
    if (this.training) {
      const training = new Training(this.training);
      training.calculateTotalTime();
      var time = new Date();
      time.setSeconds(time.getSeconds() + (training.totalTime - this.getPassedTime())
        - (+this.currentTime - (this.timer?.remainingTime ?? 0)));
      return `${time.getHours()}:${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}:${time.getSeconds() < 10 ? '0' : ''}${time.getSeconds()}`;
    }

    return '';
  }

  getPassedTime(): number {
    // let passedTime = this.training.trainingGroups.reduce((sum, tg) => {
    //   const exerciseTimeSum = tg.exercises.reduce((exSum, ex) => exSum + (((+ex.time || +tg.time)) * +tg.numberOfSeries + +this.training.breakBetweenExercises * (+tg.numberOfSeries - 1)), 0);
    //   var totalSum = sum + exerciseTimeSum + +this.training.breakBetweenGroups + +this.training.breakBetweenSeries * +tg.numberOfSeries - +this.training.breakBetweenSeries;

    //   if ((+tg.numberOfSeries * tg.exercises.length) % 2 === 0) {
    //     totalSum -= +this.training.breakBetweenExercises;
    //   }

    //   return totalSum;
    // }, 0);
    // passedTime -= +this.training.breakBetweenGroups;

    let passedTime = 0;
    for (let tg of this.training.trainingGroups) {
      for (let i = 1; i <= +tg.numberOfSeries; i++) {
        for (let ex of tg.exercises) {
          if (ex.id === this.currentExercise.id && i == this.seriesIndex) {
            if (this.isBreak) return +ex.time + passedTime;

            return passedTime;
          }
          if (this.seriesIndex == +tg.numberOfSeries) {
            passedTime += +ex.time + +this.training.breakBetweenSeries;
          } else {
            passedTime += +ex.time + +this.training.breakBetweenExercises;
          }
        }
      }
      passedTime += +tg.time + +this.training.breakBetweenGroups;
    }

    return passedTime;
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
}
