import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingsComponent } from './trainings/trainings.component';
import { AddTrainingComponent } from './add-training/add-training.component';

const routes: Routes = [
  { path: '', redirectTo: '/trainings', pathMatch: 'full' },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'add-training', component: AddTrainingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}