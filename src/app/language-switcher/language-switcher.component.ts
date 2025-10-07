import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <ion-button fill="clear" (click)="toggleDropdown()">
      <ion-icon name="globe-outline"></ion-icon>
    </ion-button>
    
    <ion-popover [isOpen]="isDropdownOpen" (didDismiss)="closeDropdown()">
      <ng-template>
        <ion-content>
          <ion-list>
            <ion-item button (click)="selectLanguage('sr')">
              <ion-label>🇷🇸 Srpski</ion-label>
            </ion-item>
            <ion-item button (click)="selectLanguage('en')">
              <ion-label>🇺🇸 English</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ng-template>
    </ion-popover>
  `,
  styles: []
})
export class LanguageSwitcherComponent implements OnInit {
  isDropdownOpen = false;
  currentLanguage = 'sr';

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.closeDropdown();
  }
}
