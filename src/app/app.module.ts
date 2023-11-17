import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { AddTrainingComponent } from './add-training/add-training.component';

@NgModule({
  declarations: [
    AppComponent,
    TrainingsComponent,
    AddTrainingComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot(), AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}