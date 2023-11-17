import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { PlayTrainingComponent } from './play-training/play-training.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';

@NgModule({
  declarations: [
    AppComponent,
    TrainingsComponent,
    AddTrainingComponent,
    PlayTrainingComponent,
    CountdownTimerComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot(), AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}