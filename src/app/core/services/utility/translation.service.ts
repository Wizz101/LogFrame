// 🧩 Service: TranslationService 
// 📂 Location: /src/app/core/services/utility/translation.service.ts
// 📝 Description: Signal-based translation service with language persistence

import { Injectable, Inject, PLATFORM_ID, effect, signal, computed, DestroyRef, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { APP_SETTINGS } from '../../config/app.settings';
import { Language } from '@app/shared/models/miscellaneous/app-settings.model';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly isBrowser: boolean;
  private readonly destroyRef = inject(DestroyRef);

  private readonly _currentLang = signal<Language>(APP_SETTINGS.defaultLanguage);
  readonly currentLang = computed(() => this._currentLang());

  constructor(
    private readonly translateService: TranslateService,
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Setup default langs
    this.translateService.addLangs(APP_SETTINGS.supportedLanguages);
    this.translateService.setDefaultLang(APP_SETTINGS.defaultLanguage);

    // Reactively change lang with cleanup
    const effectRef = effect(() => {
      this.translateService.use(this._currentLang());
    });

    // Cleanup effect on destroy
    this.destroyRef.onDestroy(() => {
      effectRef.destroy();
    });
  }

  /** Initialize language setting on app start */
  async init(): Promise<void> {
    const lang = this.detectInitialLanguage();
    this.setLanguage(lang);
  }

  /** Manually set language and persist */
  setLanguage(lang: Language): void {
    if (!APP_SETTINGS.supportedLanguages.includes(lang)) {
      lang = APP_SETTINGS.defaultLanguage;
    }
  
    this._currentLang.set(lang);
    this.persistLanguage(lang);
  }

  /** Reactive translation signal for a key */
  translate(key: string) {
    return toSignal(this.translateService.stream(key), {
      initialValue: this.translateService.instant(key)
    });
  }

  /** Apply stored language */
  applyStoredLanguage(): void {
    if (!this.isBrowser) return;
    
    const stored = this.getStoredLanguage();
    if (stored && APP_SETTINGS.supportedLanguages.includes(stored)) {
      this._currentLang.set(stored);
    }
  }

  /** Detect preferred language */
  private detectInitialLanguage(): Language {
    if (!this.isBrowser) return APP_SETTINGS.defaultLanguage;

    const saved = this.getStoredLanguage();
    if (saved && APP_SETTINGS.supportedLanguages.includes(saved)) {
      return saved;
    }
    
    return APP_SETTINGS.defaultLanguage;
  }

  /** Persist language to localStorage */
  private persistLanguage(lang: Language): void {
    if (!this.isBrowser) return;
    
    try {
      const storageAvailable = typeof localStorage !== 'undefined';
      if (storageAvailable) {
        localStorage.setItem('preferredLanguage', lang);
      }
    } catch (e) {
      console.warn('Cannot access localStorage', e);
    }
  }

  /** Get stored language from localStorage */
  private getStoredLanguage(): Language | null {
    if (!this.isBrowser) return null;
    
    try {
      const storageAvailable = typeof localStorage !== 'undefined';
      if (storageAvailable) {
        return localStorage.getItem('preferredLanguage') as Language;
      }
    } catch {
      // ignore errors
    }
    
    return null;
  }
}

