// 🔗 Route: appRoutes
// 📁 Path: src/app/routes/app.routes.ts
// 🧠 Simple routes configuration for logframe app

import { Routes } from '@angular/router';
import { LogframeGeneratorComponent } from '../features/public-pages/logframe-generator/logframe-generator.component';

export const routes: Routes = [
  { path: '', component: LogframeGeneratorComponent },
  { path: '**', redirectTo: '' }
];

