// logframe/src/app/shared/models/miscellaneous/app-settings.model.ts
// App-wide configuration settings interfaces and types

export type Language = 'en' | 'nl';

export interface AppSettings {
  appName: string;
  appVersion: string;
  defaultLanguage: Language;
  supportedLanguages: Language[];
  endpoints: {
    mentors: string;
    api: string;
    publicApi: string;
  };
  features: {
    oliebolTools: boolean;
    isFeedbackActive: boolean;
  };
  auth: {
    timeout: number;
    retryAttempts: number;
  };
}

