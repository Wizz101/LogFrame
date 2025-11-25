// 🧩 Component: LogframeGeneratorComponent
// 📂 Location: /src/app/features/public-pages/logframe-generator/logframe-generator.component.ts
// 📝 Description: Logframe Generator component for creating logical frameworks

import { Component, inject, signal, computed, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicPageBaseComponent } from '@app/shared/components/base-class/public-page-base.component';
import { TranslationService } from '@app/core/services/utility/translation.service';
import { FormHandler } from '@app/core/services/utility/form-handler';
import { LanguageSwitcherComponent } from '@app/shared/components/basic/language-switcher/language-switcher.component';
import html2canvas from 'html2canvas';

export interface LogframeLevel {
  id: string;
  type: 'goal' | 'outcome' | 'output' | 'activity';
  description: string;
  indicators: string;
  verification: string;
  assumptions: string;
}

export interface ProjectInfo {
  title: string;
  organization: string;
  donor: string;
  duration: string;
}

export interface ProjectInfoFormType {
  title: FormControl<string>;
  organization: FormControl<string>;
  donor: FormControl<string>;
  duration: FormControl<string>;
}

function createProjectInfoForm(fb: FormBuilder, data?: Partial<ProjectInfo>): FormGroup<ProjectInfoFormType> {
  return fb.group({
    title: fb.control(data?.title ?? '', { nonNullable: true }),
    organization: fb.control(data?.organization ?? '', { nonNullable: true }),
    donor: fb.control(data?.donor ?? '', { nonNullable: true }),
    duration: fb.control(data?.duration ?? '', { nonNullable: true }),
  });
}

@Component({
  selector: 'app-logframe-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LanguageSwitcherComponent],
  templateUrl: './logframe-generator.component.html',
  styles: [`
    .header-gradient::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.1; }
    }
    
    .helper-text {
      @apply text-xs text-muted-foreground mt-1 italic;
    }
    
    @media (max-width: 768px) {
      .level-grid-mobile {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class LogframeGeneratorComponent extends PublicPageBaseComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly translationService = inject(TranslationService);
  protected override readonly platformId = inject(PLATFORM_ID);
  protected override readonly isBrowser = isPlatformBrowser(this.platformId);
  
  private levelCounter = signal(0);
  readonly levels = signal<LogframeLevel[]>([]);
  readonly formHandler = new FormHandler<ProjectInfoFormType>();
  readonly form = computed(() => this.formHandler.form() as FormGroup<ProjectInfoFormType> | null);

  readonly labels = {
    header: {
      title: this.translationService.translate('LOGFRAME.HEADER.TITLE'),
      subtitle: this.translationService.translate('LOGFRAME.HEADER.SUBTITLE'),
      features: {
        templates: this.translationService.translate('LOGFRAME.HEADER.FEATURES.TEMPLATES'),
        export: this.translationService.translate('LOGFRAME.HEADER.FEATURES.EXPORT'),
        bestPractices: this.translationService.translate('LOGFRAME.HEADER.FEATURES.BEST_PRACTICES'),
        autosave: this.translationService.translate('LOGFRAME.HEADER.FEATURES.AUTOSAVE'),
      },
    },
    projectInfo: {
      title: this.translationService.translate('LOGFRAME.PROJECT_INFO.TITLE'),
      projectTitle: this.translationService.translate('LOGFRAME.PROJECT_INFO.PROJECT_TITLE'),
      projectTitlePlaceholder: this.translationService.translate('LOGFRAME.PROJECT_INFO.PROJECT_TITLE_PLACEHOLDER'),
      organization: this.translationService.translate('LOGFRAME.PROJECT_INFO.ORGANIZATION'),
      organizationPlaceholder: this.translationService.translate('LOGFRAME.PROJECT_INFO.ORGANIZATION_PLACEHOLDER'),
      donor: this.translationService.translate('LOGFRAME.PROJECT_INFO.DONOR'),
      donorPlaceholder: this.translationService.translate('LOGFRAME.PROJECT_INFO.DONOR_PLACEHOLDER'),
      duration: this.translationService.translate('LOGFRAME.PROJECT_INFO.DURATION'),
      durationPlaceholder: this.translationService.translate('LOGFRAME.PROJECT_INFO.DURATION_PLACEHOLDER'),
    },
    logicalFramework: {
      title: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.TITLE'),
      addGoal: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.ADD_GOAL'),
      addOutcome: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.ADD_OUTCOME'),
      addOutput: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.ADD_OUTPUT'),
      addActivity: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.ADD_ACTIVITY'),
      description: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.DESCRIPTION'),
      descriptionPlaceholder: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.DESCRIPTION_PLACEHOLDER'),
      descriptionHelper: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.DESCRIPTION_HELPER'),
      indicators: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.INDICATORS'),
      indicatorsPlaceholder: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.INDICATORS_PLACEHOLDER'),
      indicatorsHelper: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.INDICATORS_HELPER'),
      verification: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.VERIFICATION'),
      verificationPlaceholder: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.VERIFICATION_PLACEHOLDER'),
      verificationHelper: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.VERIFICATION_HELPER'),
      assumptions: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.ASSUMPTIONS'),
      assumptionsPlaceholder: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.ASSUMPTIONS_PLACEHOLDER'),
      assumptionsHelper: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.ASSUMPTIONS_HELPER'),
      emptyState: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.EMPTY_STATE'),
      levelTypes: {
        goal: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.LEVEL_TYPES.GOAL'),
        outcome: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.LEVEL_TYPES.OUTCOME'),
        output: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.LEVEL_TYPES.OUTPUT'),
        activity: this.translationService.translate('LOGFRAME.LOGICAL_FRAMEWORK.LEVEL_TYPES.ACTIVITY'),
      },
    },
    export: {
      title: this.translationService.translate('LOGFRAME.EXPORT.TITLE'),
      description: this.translationService.translate('LOGFRAME.EXPORT.DESCRIPTION'),
      exportImage: this.translationService.translate('LOGFRAME.EXPORT.EXPORT_IMAGE'),
      exportWord: this.translationService.translate('LOGFRAME.EXPORT.EXPORT_WORD'),
      exportCsv: this.translationService.translate('LOGFRAME.EXPORT.EXPORT_CSV'),
      matrixTitle: this.translationService.translate('LOGFRAME.EXPORT.MATRIX_TITLE'),
      untitledProject: this.translationService.translate('LOGFRAME.EXPORT.UNTITLED_PROJECT'),
      organizationLabel: this.translationService.translate('LOGFRAME.EXPORT.ORGANIZATION_LABEL'),
      donorLabel: this.translationService.translate('LOGFRAME.EXPORT.DONOR_LABEL'),
      durationLabel: this.translationService.translate('LOGFRAME.EXPORT.DURATION_LABEL'),
      tableHeaderLevel: this.translationService.translate('LOGFRAME.EXPORT.TABLE_HEADER_LEVEL'),
      tableHeaderDescription: this.translationService.translate('LOGFRAME.EXPORT.TABLE_HEADER_DESCRIPTION'),
      tableHeaderIndicators: this.translationService.translate('LOGFRAME.EXPORT.TABLE_HEADER_INDICATORS'),
      tableHeaderVerification: this.translationService.translate('LOGFRAME.EXPORT.TABLE_HEADER_VERIFICATION'),
      tableHeaderAssumptions: this.translationService.translate('LOGFRAME.EXPORT.TABLE_HEADER_ASSUMPTIONS'),
      errorNoContent: this.translationService.translate('LOGFRAME.EXPORT.ERROR_NO_CONTENT'),
      errorNoContentImage: this.translationService.translate('LOGFRAME.EXPORT.ERROR_NO_CONTENT_IMAGE'),
      errorMatrixNotFound: this.translationService.translate('LOGFRAME.EXPORT.ERROR_MATRIX_NOT_FOUND'),
      errorExportFailed: this.translationService.translate('LOGFRAME.EXPORT.ERROR_EXPORT_FAILED'),
      confirmRemoveLevel: this.translationService.translate('LOGFRAME.EXPORT.CONFIRM_REMOVE_LEVEL'),
    },
    footer: {
      copyright: this.translationService.translate('LOGFRAME.FOOTER.COPYRIGHT'),
    },
    bestPractices: {
      title: this.translationService.translate('LOGFRAME.BEST_PRACTICES.TITLE'),
      description: this.translationService.translate('LOGFRAME.BEST_PRACTICES.DESCRIPTION'),
      structure: {
        title: this.translationService.translate('LOGFRAME.BEST_PRACTICES.STRUCTURE.TITLE'),
        items: [
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.STRUCTURE.ITEMS.0'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.STRUCTURE.ITEMS.1'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.STRUCTURE.ITEMS.2'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.STRUCTURE.ITEMS.3'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.STRUCTURE.ITEMS.4'),
        ],
      },
      smart: {
        title: this.translationService.translate('LOGFRAME.BEST_PRACTICES.SMART.TITLE'),
        items: [
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.SMART.ITEMS.0'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.SMART.ITEMS.1'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.SMART.ITEMS.2'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.SMART.ITEMS.3'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.SMART.ITEMS.4'),
        ],
      },
      verification: {
        title: this.translationService.translate('LOGFRAME.BEST_PRACTICES.VERIFICATION.TITLE'),
        items: [
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.VERIFICATION.ITEMS.0'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.VERIFICATION.ITEMS.1'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.VERIFICATION.ITEMS.2'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.VERIFICATION.ITEMS.3'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.VERIFICATION.ITEMS.4'),
        ],
      },
      assumptions: {
        title: this.translationService.translate('LOGFRAME.BEST_PRACTICES.ASSUMPTIONS.TITLE'),
        items: [
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.ASSUMPTIONS.ITEMS.0'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.ASSUMPTIONS.ITEMS.1'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.ASSUMPTIONS.ITEMS.2'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.ASSUMPTIONS.ITEMS.3'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.ASSUMPTIONS.ITEMS.4'),
        ],
      },
      quality: {
        title: this.translationService.translate('LOGFRAME.BEST_PRACTICES.QUALITY.TITLE'),
        items: [
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.QUALITY.ITEMS.0'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.QUALITY.ITEMS.1'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.QUALITY.ITEMS.2'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.QUALITY.ITEMS.3'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.QUALITY.ITEMS.4'),
        ],
      },
      mistakes: {
        title: this.translationService.translate('LOGFRAME.BEST_PRACTICES.MISTAKES.TITLE'),
        items: [
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.MISTAKES.ITEMS.0'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.MISTAKES.ITEMS.1'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.MISTAKES.ITEMS.2'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.MISTAKES.ITEMS.3'),
          this.translationService.translate('LOGFRAME.BEST_PRACTICES.MISTAKES.ITEMS.4'),
        ],
      },
    },
    remove: this.translationService.translate('GENERAL.REMOVE'),
  };

  private autoSaveInterval: any = null;

  constructor() {
    super({ loadTags: false, loadSeo: false });
    
    // Initialize form
    const projectForm = createProjectInfoForm(this.fb);
    this.formHandler.setForm(projectForm);

    // Setup auto-save interval
    if (this.isBrowser) {
      // Setup auto-save interval (every 30 seconds)
      this.autoSaveInterval = setInterval(() => {
        this.saveToLocalStorage();
      }, 30000);

      // Load from localStorage on init
      this.loadFromLocalStorage();
    }
  }

  override onDataReady(): void {
    // Component-specific initialization
  }

  addLevel(type: 'goal' | 'outcome' | 'output' | 'activity'): void {
    const newLevel: LogframeLevel = {
      id: `level-${this.levelCounter() + 1}`,
      type,
      description: '',
      indicators: '',
      verification: '',
      assumptions: '',
    };
    
    this.levelCounter.update(v => v + 1);
    this.levels.update(levels => [...levels, newLevel]);
  }

  removeLevel(levelId: string): void {
    if (confirm(this.labels.export.confirmRemoveLevel())) {
      this.levels.update(levels => levels.filter(l => l.id !== levelId));
      this.saveToLocalStorage();
    }
  }

  updateLevel(levelId: string, field: keyof Omit<LogframeLevel, 'id' | 'type'>, value: string): void {
    this.levels.update(levels =>
      levels.map(level =>
        level.id === levelId ? { ...level, [field]: value } : level
      )
    );
    // Auto-save is handled by interval, but we can save on change for better UX
    // Debouncing would be better, but interval is sufficient
  }

  getLevelTypeLabel(type: string): string {
    switch (type) {
      case 'goal':
        return this.labels.logicalFramework.levelTypes.goal();
      case 'outcome':
        return this.labels.logicalFramework.levelTypes.outcome();
      case 'output':
        return this.labels.logicalFramework.levelTypes.output();
      case 'activity':
        return this.labels.logicalFramework.levelTypes.activity();
      default:
        return type;
    }
  }

  getLevelTypeColor(type: string): string {
    switch (type) {
      case 'goal':
        return 'bg-green-600';
      case 'outcome':
        return 'bg-blue-600';
      case 'output':
        return 'bg-yellow-500 text-gray-900';
      case 'activity':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  }

  exportToWord(): void {
    if (!this.isBrowser) return;
    
    const projectInfo = this.form()?.getRawValue();
    const logframeData = this.levels();

    if (logframeData.length === 0) {
      alert(this.labels.export.errorNoContent());
      return;
    }

    let html = `
      <html>
      <head>
        <meta charset="utf-8">
        <title>Logframe - ${projectInfo?.title || this.labels.export.untitledProject()}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .project-info { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .level-goal { background-color: #d4edda; }
          .level-outcome { background-color: #cce5ff; }
          .level-output { background-color: #fff3cd; }
          .level-activity { background-color: #e2d9f3; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${this.labels.logicalFramework.title()}</h1>
          <h2>${projectInfo?.title || this.labels.export.untitledProject()}</h2>
        </div>
        <div class="project-info">
          <p><strong>${this.labels.export.organizationLabel()}:</strong> ${projectInfo?.organization || ''}</p>
          <p><strong>${this.labels.export.donorLabel()}:</strong> ${projectInfo?.donor || ''}</p>
          <p><strong>${this.labels.export.durationLabel()}:</strong> ${projectInfo?.duration || ''}</p>
        </div>
        <table>
          <tr>
            <th>${this.labels.export.tableHeaderLevel()}</th>
            <th>${this.labels.export.tableHeaderDescription()}</th>
            <th>${this.labels.export.tableHeaderIndicators()}</th>
            <th>${this.labels.export.tableHeaderVerification()}</th>
            <th>${this.labels.export.tableHeaderAssumptions()}</th>
          </tr>
    `;

    logframeData.forEach(level => {
      html += `
        <tr class="level-${level.type}">
          <td><strong>${this.getLevelTypeLabel(level.type)}</strong></td>
          <td>${level.description || ''}</td>
          <td>${level.indicators || ''}</td>
          <td>${level.verification || ''}</td>
          <td>${level.assumptions || ''}</td>
        </tr>
      `;
    });

    html += '</table></body></html>';

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logframe-${(projectInfo?.title || 'untitled').replace(/\s+/g, '-').toLowerCase()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportToCSV(): void {
    if (!this.isBrowser) return;
    
    const projectInfo = this.form()?.getRawValue();
    const logframeData = this.levels();

    let csv = `${this.labels.logicalFramework.title()} - ${projectInfo?.title || this.labels.export.untitledProject()}\n`;
    csv += `${this.labels.export.organizationLabel()}: ${projectInfo?.organization || ''}\n`;
    csv += `${this.labels.export.donorLabel()}: ${projectInfo?.donor || ''}\n`;
    csv += `${this.labels.export.durationLabel()}: ${projectInfo?.duration || ''}\n\n`;
    csv += `${this.labels.export.tableHeaderLevel()},${this.labels.export.tableHeaderDescription()},${this.labels.export.tableHeaderIndicators()},${this.labels.export.tableHeaderVerification()},${this.labels.export.tableHeaderAssumptions()}\n`;

    logframeData.forEach(level => {
      csv += `"${level.type}","${(level.description || '').replace(/"/g, '""')}","${(level.indicators || '').replace(/"/g, '""')}","${(level.verification || '').replace(/"/g, '""')}","${(level.assumptions || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logframe-${(projectInfo?.title || 'untitled').replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async exportAsImage(): Promise<void> {
    if (!this.isBrowser) return;
    
    const logframeData = this.levels();
    if (logframeData.length === 0) {
      alert(this.labels.export.errorNoContentImage());
      return;
    }

    const projectInfo = this.form()?.getRawValue();
    const matrixElement = document.getElementById('logframe-matrix') as HTMLElement;
    
    if (!matrixElement) {
      alert(this.labels.export.errorMatrixNotFound());
      return;
    }

    // Create a clone of the element for rendering (more reliable)
    const clone = matrixElement.cloneNode(true) as HTMLElement;
    clone.id = 'logframe-matrix-clone';
    clone.className = '';
    clone.style.cssText = 'position: absolute; left: -9999px; top: 0; visibility: visible; opacity: 1; display: block; width: auto; height: auto; background: white;';
    
    // Append clone to body temporarily
    document.body.appendChild(clone);
    
    try {
      // Force reflow
      void clone.offsetHeight;
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get dimensions
      const width = clone.scrollWidth || 1200;
      const height = clone.scrollHeight || 800;

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: false,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        removeContainer: false,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied in the cloned document
          const clonedElement = clonedDoc.getElementById('logframe-matrix-clone');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.cssText = 'position: relative; visibility: visible; opacity: 1; display: block; background: white;';
          }
        },
      });

      // Remove clone immediately
      document.body.removeChild(clone);

      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty or invalid');
      }

      // Convert canvas to blob for better compatibility
      canvas.toBlob((blob) => {
        if (!blob || blob.size === 0) {
          alert(this.labels.export.errorExportFailed());
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `logframe-matrix-${(projectInfo?.title || 'untitled').replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error exporting image:', error);
      
      // Ensure clone is removed even on error
      const cloneElement = document.getElementById('logframe-matrix-clone');
      if (cloneElement && cloneElement.parentNode) {
        cloneElement.parentNode.removeChild(cloneElement);
      }
      
      alert(this.labels.export.errorExportFailed());
    }
  }

  private saveToLocalStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const data = {
        projectInfo: this.form()?.getRawValue() || {},
        logframe: this.levels(),
      };
      localStorage.setItem('logframe-autosave', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const autosave = localStorage.getItem('logframe-autosave');
      if (autosave) {
        const data = JSON.parse(autosave);
        
        if (data.projectInfo) {
          const form = this.form();
          if (form) {
            form.patchValue(data.projectInfo);
          }
        }
        
        if (data.logframe && Array.isArray(data.logframe) && data.logframe.length > 0) {
          // Restore levels
          this.levels.set(data.logframe);
          // Update counter
          const maxId = Math.max(...data.logframe.map((l: LogframeLevel) => {
            const match = l.id.match(/level-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          }));
          this.levelCounter.set(maxId);
        }
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }
}
