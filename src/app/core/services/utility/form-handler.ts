// 🧩 Class: FormHandler
// 📂 Location: /src/app/core/services/utility/form-handler.ts
// 📝 Description: Utility class for managing Angular forms, including state, validation, and file uploads

import { signal, computed } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormControl } from '@angular/forms';

export class FormHandler<TForm extends { [K in keyof TForm]: AbstractControl }> {
  private readonly _form = signal<FormGroup | FormArray | null>(null);
  private readonly _submitted = signal(false);
  
  /** Readonly signal for the current form */
  readonly form = this._form.asReadonly();
  
  /** Readonly signal for submission state */
  readonly submitted = this._submitted.asReadonly();
  
  /** File upload properties */
  uploadedFile: File | null = null;
  uploadedImage: File | null = null;

  /** Original form values for reset functionality */
  public originalValue: any = null;

  /** Computed property to check if form is valid */
  readonly isValid = computed(() => {
    const form = this._form();
    return form ? form.valid : false;
  });

  /** Computed property to check if form is invalid */
  readonly isFormInvalid = computed(() => {
    const form = this._form();
    return form ? form.invalid : true;
  });

  /** Computed property to check if form is dirty */
  readonly isDirty = computed(() => {
    const form = this._form();
    return form ? form.dirty : false;
  });

  /** Computed property to check if form is pristine */
  readonly isPristine = computed(() => {
    const form = this._form();
    return form ? form.pristine : true;
  });

  /** Computed property to check if form is touched */
  readonly isTouched = computed(() => {
    const form = this._form();
    return form ? form.touched : false;
  });

  /** Computed property to check if form is untouched */
  readonly isUntouched = computed(() => {
    const form = this._form();
    return form ? form.untouched : true;
  });

  /** Computed property to check if form has pending changes */
  readonly hasPendingChanges = computed(() => {
    return this.isDirty() && !this._submitted();
  });

  /**
   * Set the form and store original values
   * @param form - The form to manage
   */
  setForm(form: FormGroup | FormArray): void {
    this._form.set(form);
    this.originalValue = form.getRawValue();
  }

  /**
   * Get the current form
   * @returns The current form or null
   */
  getForm(): FormGroup | FormArray | null {
    return this._form();
  }

  /**
   * Reset uploaded files
   */
  resetFiles(): void {
    this.uploadedFile = null;
    this.uploadedImage = null;
  }

  /**
   * Check if form is invalid (legacy method for backward compatibility)
   * @deprecated Use isFormInvalid computed property instead
   */
  isInvalid(): boolean {
    const form = this._form();
    return !form || form.invalid;
  }

  /**
   * Mark form as submitted
   */
  markAsSubmitted(): void {
    this._submitted.set(true);
  }

  /**
   * Reset submission state
   */
  resetSubmission(): void {
    this._submitted.set(false);
  }

  /**
   * Mark all form controls as touched and dirty
   */
  markTouchedAndDirty(): void {
    const form = this._form();
    if (!form || !(form instanceof FormGroup || form instanceof FormArray)) return;

    try {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    } catch (error) {
      console.error('Error marking form as touched and dirty:', error);
    }
  }

  /**
   * Mark all form controls as untouched and pristine
   */
  markUntouchedAndPristine(): void {
    const form = this._form();
    if (!form || !(form instanceof FormGroup || form instanceof FormArray)) return;

    try {
      Object.values(form.controls).forEach((control) => {
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity({ onlySelf: true });
      });
    } catch (error) {
      console.error('Error marking form as untouched and pristine:', error);
    }
  }

  /**
   * Get the typed form group
   * @returns The typed form group or null
   */
  get typedForm(): FormGroup<TForm> | null {
    const f = this._form();
    return f instanceof FormGroup ? (f as FormGroup<TForm>) : null;
  }
  
  /**
   * Get the form array
   * @returns The form array or null
   */
  get formArray(): FormArray | null {
    const f = this._form();
    return f instanceof FormArray ? f : null;
  }
}

