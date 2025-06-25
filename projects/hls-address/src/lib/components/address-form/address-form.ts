import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Address } from '../../types/models/address.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddressAutocompleteComponent } from '../address-autocomplete/address-autocomplete';

@Component({
  selector: 'hls-address-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    AddressAutocompleteComponent,
  ],
  templateUrl: './address-form.html',
  styleUrl: './address-form.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressForm),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressForm),
      multi: true,
    },
  ],
})
export class AddressForm implements OnInit, ControlValueAccessor {
  form!: FormGroup;
  autocompleteControl: FormControl = new FormControl('');

  useAutocomplete: boolean = true;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postcode: ['', Validators.required],
      country: ['', Validators.required],
    });

    if (this.useAutocomplete) {
      this.form.disable({ emitEvent: false });
    }
  }

  ngOnInit(): void {

    this.autocompleteControl.valueChanges.subscribe((value: Address) => {
      if (this.useAutocomplete && value) {
        this.writeValue(value);
        this.onChange(value);
      } else {
        this.writeValue(null);
        this.onChange(null);
      }
    });
  }

  toggleAutocomplete(checked: boolean): void {
    this.useAutocomplete = checked;

    if (checked) {
      this.form.disable({ emitEvent: false });
      this.autocompleteControl.enable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
      this.autocompleteControl.disable({ emitEvent: false });
    }
  }

  writeValue(value: Address | null): void {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    } else {
      this.form.reset(null, { emitEvent: false });
    }
    if (this.useAutocomplete) {
      this.form.disable({ emitEvent: false });
    }
  }

  onChange!: (address: Address | null) => void;
  onTouched!: () => void;

  registerOnChange(fn: (address: Address | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(): ValidationErrors | null {
    if (this.form.invalid) {
      return { invalid: true };
    }
    return null;
  }

  get street(): AbstractControl | null {
    return this.form.get('street');
  }

  get city(): AbstractControl | null {
    return this.form.get('city');
  }

  get state(): AbstractControl | null {
    return this.form.get('state');
  }

  get postcode(): AbstractControl | null {
    return this.form.get('postcode');
  }

  get country(): AbstractControl | null {
    return this.form.get('country');
  }
}
