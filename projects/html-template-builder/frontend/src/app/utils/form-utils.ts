import { FormArray, FormControl } from '@angular/forms';

/**
 * Utility type that maps each property of type `T` to a FormControl.
 * Useful for building strongly typed reactive forms.
 */
export type ToFormControls<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

/**
 * Clears all controls from a given FormArray.
 * @param formArray - The FormArray to be cleared
 */
export function clearFormArray(formArray: FormArray | undefined): void {
  if (formArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
}
