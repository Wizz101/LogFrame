// app.component.ts
// This is the main component for the app.

import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { TranslationService } from './core/services/utility/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    this.initializeApp();
    
    if (this.isBrowser) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.translationService.applyStoredLanguage();
        });
    }
  }

  private async initializeApp(): Promise<void> {
    // Initialize translation service first
    await this.translationService.init();
  }
}

