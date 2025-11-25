// 🔗 Route: appRoutes
// 📁 Path: src/app/routes/app.routes.ts
// 🧠 Simple routes configuration for logframe app

import { Routes } from '@angular/router';
import { HelloWorldComponent } from '../features/public-pages/hello-world/hello-world.component';

export const routes: Routes = [
  { path: '', component: HelloWorldComponent },
  { path: '**', redirectTo: '' }
];

