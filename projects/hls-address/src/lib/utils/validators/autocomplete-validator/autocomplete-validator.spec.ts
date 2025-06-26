import { FormControl } from '@angular/forms';
import { autocompleteValidator } from './autocomplete-validator';
import { Address } from '../../../types/models/address.model';

describe('autocompleteValidator', () => {
  let mockGetter: () => Address | null;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl();
  });

  it('should return required error when value is empty', () => {
    mockGetter = () => null;
    const validator = autocompleteValidator(mockGetter);
    control.setValue('');
    expect(validator(control)).toEqual({ required: true });
  });

  it('should return minlength error if input is too short', () => {
    mockGetter = () => null;
    const validator = autocompleteValidator(mockGetter);
    control.setValue('ab');
    expect(validator(control)).toEqual({ minlength: { requiredLength: 3 } });
  });

  it('should return invalidSelection if value does not match selectedAddress', () => {
    mockGetter = () => ({
      formatted: 'Correct Address',
      country: '', state: '', city: '', postcode: '', street: '',
    });
    const validator = autocompleteValidator(mockGetter);
    control.setValue('Wrong Address');
    expect(validator(control)).toEqual({ invalidSelection: true });
  });

  it('should return null if value is valid and matches selectedAddress', () => {
    const address: Address = {
      formatted: 'Correct Address',
      country: '', state: '', city: '', postcode: '', street: '',
    };
    mockGetter = () => address;
    const validator = autocompleteValidator(mockGetter);
    control.setValue('Correct Address');
    expect(validator(control)).toBeNull();
  });
});
