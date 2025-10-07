import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translation {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('sr');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [lang: string]: Translation } = {
    sr: {
      'app.title': 'Ionic Training App',
      'trainings.title': 'Treninzi',
      'trainings.noTrainings': 'Nema dodatih treninga. Kreiraj ih!',
      'trainings.adding': 'Dodavanje treninga',
      'trainings.reviewing': 'Pregled treninga',
      'training.description': 'Opis treninga:',
      'training.duration': 'Trajanje treninga:',
      'training.name': 'Naziv treninga:',
      'training.breakBetweenGroups': 'Pauza između grupa:',
      'training.breakBetweenExercises': 'Pauza između vežbi:',
      'training.breakBetweenSeries': 'Pauza između serija:',
      'button.train': 'Treniraj',
      'button.review': 'Pregled',
      'button.export': 'Izvezi',
      'button.exportAll': 'Izvezi sve',
      'button.import': 'Uvezi',
      'button.finish': 'Završi',
      'button.addTraining': 'Dodaj Trening',
      'button.back': 'Nazad',
      'button.cancel': 'Odustani',
      'button.save': 'Sačuvaj',
      'button.addGroup': 'Dodaj grupu',
      'button.addExercise': 'Dodaj vežbu',
      'play.back': 'NAZAD',
      'play.next': 'NAPRED',
      'play.break': 'PAUZA',
      'play.nextExercise': 'Sledi:',
      'play.group': 'Grupa',
      'play.exercise': 'Vežba',
      'play.series': 'Serija',
      'play.end': 'KRAJ',
      'group.name': 'Naziv grupe:',
      'group.description': 'Opis grupe:',
      'group.exerciseDuration': 'Vreme trajanja vežbe:',
      'group.order': 'Redni broj grupe:',
      'group.numberOfSeries': 'Broj ponavljanja:',
      'exercise.name': 'Naziv vežbe:',
      'exercise.description': 'Opis vežbe:',
      'exercise.order': 'Redni broj vežbe:',
      'exercise.duration': 'Vreme trajanja vežbe:',
      'placeholder.trainingName': 'Naziv treninga',
      'placeholder.trainingDescription': 'Opis treninga',
      'placeholder.breakBetweenGroups': 'Trajanje pauze između grupa',
      'placeholder.breakBetweenSeries': 'Trajanje pauze između serija',
      'placeholder.breakBetweenExercises': 'Trajanje pauza između vežbi',
      'placeholder.groupName': 'Naziv grupe',
      'placeholder.groupDescription': 'Opis grupe',
      'placeholder.exerciseDuration': 'Vreme trajanja vežbe',
      'placeholder.numberOfSeries': 'Broj ponavljanja',
      'placeholder.groupOrder': 'Redni broj grupe',
      'placeholder.exerciseName': 'Naziv vežbe',
      'placeholder.exerciseDescription': 'Opis vežbe',
      'placeholder.exerciseOrder': 'Redni broj vežbe',
      'placeholder.importJson': 'Ubaci JSON',
      'alert.deleteTraining': 'Da li si siguran da želiš da obrišeš trening?',
      'alert.cancelChanges': 'Da li si siguran da želiš da odustaneš?',
      'language.serbian': 'Srpski',
      'language.english': 'English',
      'text.completed': 'Završeno',
      'text.group': 'Grupa',
      'text.exercise': 'Vežba',
      'text.training': 'Trening',
      'text.time': 'Vreme',
      'text.goalTime': 'Ciljno vreme',
      'text.pause': 'Pauza',
      'text.play': 'Reprodukuj',
      'text.stop': 'Zaustavi'
    },
    en: {
      'app.title': 'Ionic Training App',
      'trainings.title': 'Trainings',
      'trainings.noTrainings': 'No trainings added. Create them!',
      'trainings.adding': 'Adding Training',
      'trainings.reviewing': 'Review Training',
      'training.description': 'Training description:',
      'training.duration': 'Training duration:',
      'training.name': 'Training name:',
      'training.breakBetweenGroups': 'Break between groups:',
      'training.breakBetweenExercises': 'Break between exercises:',
      'training.breakBetweenSeries': 'Break between series:',
      'button.train': 'Train',
      'button.review': 'Review',
      'button.export': 'Export',
      'button.exportAll': 'Export All',
      'button.import': 'Import',
      'button.finish': 'Finish',
      'button.addTraining': 'Add Training',
      'button.back': 'Back',
      'button.cancel': 'Cancel',
      'button.save': 'Save',
      'button.addGroup': 'Add Group',
      'button.addExercise': 'Add Exercise',
      'play.back': 'BACK',
      'play.next': 'NEXT',
      'play.break': 'BREAK',
      'play.nextExercise': 'Next:',
      'play.group': 'Group',
      'play.exercise': 'Exercise',
      'play.series': 'Series',
      'play.end': 'END',
      'group.name': 'Group name:',
      'group.description': 'Group description:',
      'group.exerciseDuration': 'Exercise duration:',
      'group.order': 'Group order:',
      'group.numberOfSeries': 'Number of series:',
      'exercise.name': 'Exercise name:',
      'exercise.description': 'Exercise description:',
      'exercise.order': 'Exercise order:',
      'exercise.duration': 'Exercise duration:',
      'placeholder.trainingName': 'Training name',
      'placeholder.trainingDescription': 'Training description',
      'placeholder.breakBetweenGroups': 'Break duration between groups',
      'placeholder.breakBetweenSeries': 'Break duration between series',
      'placeholder.breakBetweenExercises': 'Break duration between exercises',
      'placeholder.groupName': 'Group name',
      'placeholder.groupDescription': 'Group description',
      'placeholder.exerciseDuration': 'Exercise duration',
      'placeholder.numberOfSeries': 'Number of series',
      'placeholder.groupOrder': 'Group order',
      'placeholder.exerciseName': 'Exercise name',
      'placeholder.exerciseDescription': 'Exercise description',
      'placeholder.exerciseOrder': 'Exercise order',
      'placeholder.importJson': 'Paste JSON',
      'alert.deleteTraining': 'Are you sure you want to delete the training?',
      'alert.cancelChanges': 'Are you sure you want to cancel?',
      'language.serbian': 'Srpski',
      'language.english': 'English',
      'text.completed': 'Completed',
      'text.group': 'Group',
      'text.exercise': 'Exercise',
      'text.training': 'Training',
      'text.time': 'Time',
      'text.goalTime': 'Goal Time',
      'text.pause': 'Pause',
      'text.play': 'Play',
      'text.stop': 'Stop'
    }
  };

  constructor() {
    // Load language from localStorage or default to Serbian
    const savedLang = localStorage.getItem('language') || 'sr';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('language', lang);
  }

  translate(key: string): string {
    const currentLang = this.currentLanguageSubject.value;
    return this.translations[currentLang]?.[key] || key;
  }
}
