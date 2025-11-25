// 🧩 Language Switcher Component
// 📂 Location: /src/app/shared/components/basic/language-switcher/language-switcher.component.ts
// 📝 Description: Component for switching between supported languages

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@app/core/services/utility/translation.service';
import { APP_SETTINGS } from '@app/core/config/app.settings';
import { Language } from '@app/shared/models/miscellaneous/app-settings.model';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  private readonly translationService = inject(TranslationService);

  readonly currentLang = this.translationService.currentLang;
  readonly supportedLanguages = APP_SETTINGS.supportedLanguages;

  readonly labels = {
    language: this.translationService.translate('GENERAL.LANGUAGE'),
    english: this.translationService.translate('GENERAL.ENGLISH'),
    thai: this.translationService.translate('GENERAL.THAI'),
  };

  switchLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
  }

  isCurrentLanguage(lang: Language): boolean {
    return this.currentLang() === lang;
  }
}

