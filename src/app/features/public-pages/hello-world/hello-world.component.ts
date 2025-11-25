// 🧩 Hello World Component
// 📂 Location: /src/app/features/public-pages/hello-world/hello-world.component.ts
// 📝 Description: Simple hello world page with language switcher

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicPageBaseComponent } from '@app/shared/components/base-class/public-page-base.component';
import { TranslationService } from '@app/core/services/utility/translation.service';
import { LanguageSwitcherComponent } from '@app/shared/components/basic/language-switcher/language-switcher.component';

@Component({
  selector: 'app-hello-world',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent],
  templateUrl: './hello-world.component.html',
})
export class HelloWorldComponent extends PublicPageBaseComponent {
  private readonly translationService = inject(TranslationService);

  readonly labels = {
    title: this.translationService.translate('HELLO_WORLD.TITLE'),
    message: this.translationService.translate('HELLO_WORLD.MESSAGE'),
  };

  constructor() {
    super({ loadTags: false, loadSeo: false });
  }

  override onDataReady(): void {
    // Component-specific initialization if needed
  }
}

