import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/Training';
import { TrainingGroup } from '../models/TrainingGroup';
import { Exercise } from '../models/Exercise';

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
      }
    }
  }

  moveNext() {
    let done = false;
    this.training.trainingGroups.forEach((group, groupIndex) => {
      if (group.id === this.currentGroup.id) {
        group.exercises.forEach((exercise, exerciseIndex) => {
          if (exercise.id == this.currentExercise.id) {
            if (this.currentGroup.exercises.length == exerciseIndex + 1) {
              this.currentGroup = this.training.trainingGroups[groupIndex + 1];
              this.currentExercise = this.currentGroup.exercises[0];
              done = true;
              return;
            } else {
              this.currentExercise =
                this.currentGroup.exercises[exerciseIndex + 1];
              done = true;
              return;
            }
          }
        });
      }

      if (done) return;
    });
  }
}
