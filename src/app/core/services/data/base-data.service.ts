import { inject, signal, computed, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Status } from '@app/shared/enums/save-state.enum';
import { LoggerService } from '../utility/logger.service';
import { firstValueFrom } from 'rxjs';

export abstract class BaseDataService {
  protected readonly logger = inject(LoggerService);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly _status = signal<Status>(Status.Idle);
  readonly status = this._status.asReadonly();

  protected readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly inProgress = computed(() =>  this._status() === Status.Requested || this._status() === Status.InProgress);
  readonly isSuccess = computed(() => this._status() === Status.Success);
  readonly isReloading = computed(() => this._status() === Status.Reloading);
  readonly isCompleted = computed(() => this._status() === Status.Success || this._status() === Status.Error);
  readonly isError = computed(() => this._status() === Status.Error);

  protected setError(message = 'Something went wrong', err: unknown): void {
    this.logger.error(message, err);
    this._error.set(message);
    this._status.set(Status.Error);
  } 
  
  protected setStatus(status: Status, error: string | null = null): void {
    this._status.set(status);
    this._error.set(error);
  } 

  public reset(): void {
    this._error.set(null);
    this._status.set(Status.Idle);
  } 

  protected async executeCommand<T>(
    action: () => Promise<T>,
    options?: {
      checkStatus?: boolean;
      onRollback?: () => void;
      errorLabel?: string;
      skipStatus?: boolean;
    }
  ): Promise<T | void> {
    if (!this.isBrowser) {
      this.logger.debug('BaseDataService: Skipping command execution - not in browser environment');
      return;
    }
  
    const {
      checkStatus = true,
      onRollback,
      errorLabel = 'Operation failed',
      skipStatus = false,
    } = options ?? {};
  
    if (checkStatus && this.inProgress()) { 
      this.logger.debug('BaseDataService: Skipping command execution - already in progress');
      return; 
    }
    
    if (!skipStatus) {
      this.setStatus(Status.InProgress);
    }
  
    try {
      const result = await action();
      if (!skipStatus) this.setStatus(Status.Success);
      return result;
    } catch (err) {
      if (onRollback) { 
        try { 
          onRollback(); 
        } catch (rollbackErr) { 
          this.logger.error('BaseDataService: Rollback failed', rollbackErr);
        } 
      }
      this.setError(errorLabel, err);
    }
  }

  protected async executeObservableCommand<T>(
    action$: () => import('rxjs').Observable<T>,
    options?: {
      checkStatus?: boolean;
      onRollback?: () => void;
      errorLabel?: string;
      skipStatus?: boolean;
    }
  ): Promise<T | void> {
    return this.executeCommand(
      () => firstValueFrom(action$()),
      options
    );
  }
}

