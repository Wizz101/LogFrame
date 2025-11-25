# Logframe

A standalone Angular 19 application based on the PrimeShift Consulting frontend architecture.

## Features

- Angular 19 with standalone components
- Signal-based reactive state management
- Translation service with language switching (English/Dutch)
- Tailwind CSS for styling
- Vitest for testing
- pnpm package manager

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (install with `npm install -g pnpm`)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm start
```

The app will be available at `http://localhost:4200`

### Build

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

## Project Structure

```
logframe/
├── src/
│   ├── app/
│   │   ├── core/              # Core services and utilities
│   │   │   ├── config/        # App configuration
│   │   │   ├── services/      # Business services
│   │   │   └── utils/         # Utility functions
│   │   ├── features/          # Feature modules
│   │   │   └── public-pages/  # Public pages
│   │   ├── routes/            # Route configurations
│   │   ├── shared/           # Shared components and models
│   │   │   ├── components/    # Reusable components
│   │   │   ├── enums/        # TypeScript enums
│   │   │   └── models/       # Data models
│   │   ├── app.component.ts  # Root component
│   │   └── app.config.ts     # App configuration
│   ├── assets/
│   │   └── i18n/             # Translation files
│   ├── environments/          # Environment configurations
│   ├── index.html            # HTML entry point
│   ├── main.ts               # Bootstrap file
│   └── styles.css            # Global styles
├── angular.json              # Angular CLI configuration
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Architecture

This project follows the same architecture patterns as the PrimeShift Consulting frontend:

- **Base Services**: `BaseDataService` for data services, `TranslationService` for i18n
- **Base Components**: `PublicPageBaseComponent` for public pages
- **Labels Pattern**: All UI text uses readonly labels with translation service
- **Standalone Components**: All components are standalone
- **Signal-Based**: Uses Angular signals for reactive state

## Language Support

The app supports English and Dutch. Users can switch languages using the language switcher component at the top of the page. Language preference is persisted in localStorage.

## License

Private project - All rights reserved

