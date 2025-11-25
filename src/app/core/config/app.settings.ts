// logframe/src/app/core/config/app.settings.ts
// This file contains app-wide configuration settings

import { AppSettings } from '@app/shared/models/miscellaneous/app-settings.model';

export const APP_SETTINGS: AppSettings = {
  appName: 'Logframe',
  appVersion: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'nl'],
  endpoints: {
    mentors: '',
    api: '',
    publicApi: '',
  },
  features: {
    oliebolTools: false,
    isFeedbackActive: false,
  },
  auth: {
    timeout: 30000,
    retryAttempts: 3,
  },
};

