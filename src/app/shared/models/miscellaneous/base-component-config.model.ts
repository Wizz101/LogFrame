// logframe/src/app/shared/models/miscellaneous/base-component-config.model.ts
// Configuration interfaces for base components

export interface PublicBaseComponentConfig {
  loadTags?: boolean;
  loadSeo?: boolean;
  waitForTags?: boolean; // If true, blocks UI until tags are loaded
}

