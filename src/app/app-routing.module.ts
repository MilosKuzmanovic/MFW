import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingsComponent } from './trainings/trainings.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { PlayTrainingComponent } from './play-training/play-training.component';

const routes: Routes = [
  { path: '', redirectTo: '/trainings', pathMatch: 'full' },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'add-training', component: AddTrainingComponent },
  { path: 'play-training', component: PlayTrainingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}