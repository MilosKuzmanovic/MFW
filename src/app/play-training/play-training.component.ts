import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/Training';
import { TrainingGroup } from '../models/TrainingGroup';
import { Exercise } from '../models/Exercise';
import { GuidGenerator } from '../services/guid-generator';
import { TrainingsComponent } from '../trainings/trainings.component';

@Component({
  selector: 'app-play-training',
  templateUrl: './play-training.component.html',
  styleUrls: ['./play-training.component.scss'],
})
export class PlayTrainingComponent implements OnInit {
  trainingId: string;
  training: Training;
  currentGroup: TrainingGroup;
  currentExercise: Exercise;
  currentTime: number;
  isBreak: boolean;
  exerciseIndex: number = 0;
  groupIndex: number = 0;
  seriesIndex: number = 1;
  isFinishedTraining: boolean;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService
  ) {}

  ngOnInit() {
    this.trainingId = this.route.snapshot.queryParams['trainingId'];

    if (this.trainingId) {
      var training = this.trainingService.getTraining(this.trainingId);
      if (training) {
        this.training = training;

        this.training.trainingGroups = this.training.trainingGroups.sort(
          (a, b) => a.order - b.order
        );
        this.training.trainingGroups.forEach((group) => {
          group.exercises = group.exercises.sort((a, b) => a.order - b.order);
        });

        this.currentGroup = this.training.trainingGroups[0];
        this.currentExercise = this.training.trainingGroups[0].exercises[0];

        this.isBreak = false;
        this.currentTime = this.training.time;
      }
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
          this.training.trainingGroups[this.groupIndex].numberOfSeries
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
      this.currentTime = this.training.time;
    } else {
      this.currentTime = this.training.break;
    }

    this.isBreak = !this.isBreak;
  }

  moveBack() {
    if (this.isFinishedTraining) {
      this.isBreak = false;
    }

    if (this.groupIndex == 0 && this.exerciseIndex == 0 && this.seriesIndex == 1 && this.isBreak) {
      this.isBreak = !this.isBreak;
    };

    if (this.groupIndex == 0 && this.exerciseIndex == 0 && this.seriesIndex == 1) return;

    console.log(this.exerciseIndex);
    console.log(this.seriesIndex);
    console.log(this.groupIndex);

    if (!this.isBreak) {
      this.exerciseIndex--;

      if (this.exerciseIndex <= 0) {
        if (this.seriesIndex == 1) {
          if (this.groupIndex > 0) {
            this.groupIndex--;
          }
        } else if (this.exerciseIndex == this.training.trainingGroups[this.groupIndex].exercises.length - 1) {
          this.seriesIndex--;
        }

        this.exerciseIndex = 0;
      }
      console.log(this.exerciseIndex)
      console.log(this.seriesIndex)
      console.log(this.groupIndex)
      if (this.isFinishedTraining) {
        this.isFinishedTraining = false;
        this.groupIndex = this.training.trainingGroups.length - 1;
        this.exerciseIndex =
          this.training.trainingGroups[this.groupIndex].exercises.length - 1;
        this.seriesIndex =
          this.training.trainingGroups[this.groupIndex].numberOfSeries;
      }
      console.log('------')
console.log(this.groupIndex)
console.log(this.exerciseIndex)
      this.currentExercise =
        this.training.trainingGroups[this.groupIndex].exercises[
          this.exerciseIndex
        ];
      this.currentGroup = this.training.trainingGroups[this.groupIndex];
      this.currentTime = this.training.time;
    } else {
      this.currentTime = this.training.break;
    }

    this.isBreak = !this.isBreak;
  }
}
