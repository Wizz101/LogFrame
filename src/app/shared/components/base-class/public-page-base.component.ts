// 🧩 Service: PublicPageBaseComponent
// 📁 Location: src/app/shared/components/base-class/public-page-base.component.ts
// 📝 Description: Base component for public pages

import { Directive, inject, PLATFORM_ID, computed, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PublicBaseComponentConfig } from '@app/shared/models/miscellaneous/base-component-config.model';

@Directive()
export abstract class PublicPageBaseComponent {
  protected readonly config: PublicBaseComponentConfig;
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  
  private _dataReadyCalled = false;

  readonly isLoading = computed(() => false);

  constructor(config: PublicBaseComponentConfig) {
    this.config = config;
    if (!this.isBrowser) return;
   
    effect(() => {
      // Always call onDataReady immediately for public pages
      if (this._dataReadyCalled) {
        return;
      }

      this._dataReadyCalled = true;
      this.onDataReady();
    });
  }

  protected onDataReady(): void {}
}

