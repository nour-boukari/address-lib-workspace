import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Address } from '../../types/models/address.model';

export function autocompleteValidator(
  selectedAddressGetter: () => Address | null
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedAddress = selectedAddressGetter();
    if (!control.value || control.value === '') {
      return { required: true };
    }
    if (control.value.length < 3) {
      return { minlength: { requiredLength: 3 } };
    }
    if (!selectedAddress || selectedAddress.formatted !== control.value) {
      return { invalidSelection: true };
    }
    return null;
  };
}
