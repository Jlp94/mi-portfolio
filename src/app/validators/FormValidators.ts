import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class FormValidators {

  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
    if ((control.value != null) && (control.value.trim().length == 0)) {
      return {notOnlyWhiteSpace: true};
    }
    return null;
  }

  static strictEmail(control: FormControl): ValidationErrors | null {
    if (!control.value) return null;
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const isValid = emailPattern.test(control.value);

    return isValid ? null : { 'strictEmail': true };
  }

  static maxBase64Size(maxBytes: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      const sizeInBytes = (value.length * 3) / 4;

      return sizeInBytes > maxBytes ? { 'maxBase64Size': true } : null;
    };
  }

  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
