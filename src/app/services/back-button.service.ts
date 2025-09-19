import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {
  private backButtonSubscription: Subscription | null = null;
  private isAppExitConfirmationShown = false;
  private readonly EXIT_CONFIRMATION_DELAY = APP_CONSTANTS.TIMING.PAUSE_RESET_DELAY;

  constructor(
    private platform: Platform,
    private router: Router
  ) {}

  /**
   * Registers custom back button behavior for a component
   * @param currentRoute - current route of the component
   * @param onBack - callback function called when back button is pressed
   */
  registerBackButton(currentRoute: string, onBack?: () => void): void {
    this.unregisterBackButton();

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
   * Unregisters back button subscription
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
    if (this.isHomeRoute(currentRoute)) {
      this.showExitConfirmation();
    } else {
      this.navigateToHome();
    }
  }

  /**
   * Checks if current route is home route
   */
  private isHomeRoute(route: string): boolean {
    return route === APP_CONSTANTS.ROUTES.TRAININGS || 
           route === APP_CONSTANTS.ROUTES.HOME || 
           route === '';
  }

  /**
   * Navigates to home route
   */
  private navigateToHome(): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.TRAININGS]);
  }

  /**
   * Shows exit confirmation dialog
   */
  private showExitConfirmation(): void {
    if (this.isAppExitConfirmationShown) {
      return;
    }

    this.isAppExitConfirmationShown = true;

    if (confirm(APP_CONSTANTS.MESSAGES.CONFIRMATION.EXIT_APP)) {
      this.exitApp();
    }

    this.resetExitConfirmationFlag();
  }

  /**
   * Exits the application
   */
  private exitApp(): void {
    try {
      (navigator as any)['app']?.exitApp();
    } catch (error) {
      console.warn('Could not exit app:', error);
    }
  }

  /**
   * Resets exit confirmation flag after delay
   */
  private resetExitConfirmationFlag(): void {
    setTimeout(() => {
      this.isAppExitConfirmationShown = false;
    }, this.EXIT_CONFIRMATION_DELAY);
  }

  /**
   * Checks if back button is currently registered
   */
  isBackButtonRegistered(): boolean {
    return this.backButtonSubscription !== null;
  }
}
