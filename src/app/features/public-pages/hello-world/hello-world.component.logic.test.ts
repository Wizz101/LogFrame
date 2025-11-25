import { describe, it, expect, beforeEach } from 'vitest';
import { HelloWorldComponent } from './hello-world.component';
import { TranslationService } from '@app/core/services/utility/translation.service';
import { signal } from '@angular/core';

describe('HelloWorldComponent', () => {
  let component: HelloWorldComponent;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(() => {
    mockTranslationService = {
      translate: (key: string) => signal(`translated:${key}`),
      currentLang: signal('en'),
    };

    component = new HelloWorldComponent();
    (component as any).translationService = mockTranslationService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have labels defined', () => {
    expect(component.labels).toBeDefined();
    expect(component.labels.title).toBeDefined();
    expect(component.labels.message).toBeDefined();
  });
});

