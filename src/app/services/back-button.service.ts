import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {
  private backButtonSubscription: Subscription | null = null;
  private isAppExitConfirmationShown = false;

  constructor(
    private platform: Platform,
    private router: Router
  ) {}

  /**
   * Registruje custom back button behavior za komponentu
   * @param currentRoute - trenutna ruta komponente
   * @param onBack - callback funkcija koja se poziva kada se pritisne back
   */
  registerBackButton(currentRoute: string, onBack?: () => void): void {
    this.unregisterBackButton();

    // Sačekaj da platforma bude spremna
    this.platform.ready().then(() => {
      this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
        if (onBack) {
          onBack();
        } else {
          this.handleDefaultBack(currentRoute);
        }
      });
    });
  }

  /**
   * Uklanja registraciju back button-a
   */
  unregisterBackButton(): void {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
      this.backButtonSubscription = null;
    }
  }

  /**
   * Default back button behavior
   */
  private handleDefaultBack(currentRoute: string): void {
    // Ako smo na glavnoj stranici, prikaži potvrdu za izlazak
    if (currentRoute === '/trainings' || currentRoute === '') {
      this.showExitConfirmation();
    } else {
      // Inače, idi na prethodnu stranicu u aplikaciji
      this.router.navigate(['/trainings']);
    }
  }

  /**
   * Prikazuje potvrdu za izlazak iz aplikacije
   */
  private showExitConfirmation(): void {
    if (this.isAppExitConfirmationShown) {
      return;
    }

    this.isAppExitConfirmationShown = true;

    // Koristimo browser API za potvrdu
    if (confirm('Da li stvarno želiš da izađeš iz aplikacije?')) {
      // Ako korisnik potvrdi, izađi iz aplikacije
      (navigator as any)['app']?.exitApp();
    }

    // Resetuj flag nakon kratke pauze
    setTimeout(() => {
      this.isAppExitConfirmationShown = false;
    }, 1000);
  }
}
