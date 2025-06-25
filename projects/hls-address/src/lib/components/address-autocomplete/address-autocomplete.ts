import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';

import { Address } from './../../types/models/address.model';
import { GeoapifyAutocomplete } from '../../services/geoapify-autocomplete';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'hls-address-autocomplete',
  templateUrl: './address-autocomplete.html',
  styleUrl: './address-autocomplete.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressAutocompleteComponent),
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
})
export class AddressAutocompleteComponent
  implements OnInit, ControlValueAccessor
{
  @Input() placeholder: string = 'Enter address...';
  @Input() label: string = 'Address';
  @Output() addressSelected = new EventEmitter<Address>();

  searchControl = new FormControl(
    '',
    this.invalidSelectionValidator.bind(this)
  );

  suggestions: Address[] = [];

  loading = false;
  noResults = false;

  private selectedAddress: Address | null = null;

  constructor(private geoapifyAutocomplete: GeoapifyAutocomplete) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (typeof value !== 'string' || value.length < 3) {
            this.resetAutocompleteState();
            return of(null);
          }
          this.loading = true;
          this.noResults = false;

          return this.geoapifyAutocomplete.fetchSuggestions(value).pipe(
            catchError((error) => {
              console.error(error);
              this.resetAutocompleteState();
              return of(null);
            })
          );
        })
      )
      .subscribe((results) => {
        this.loading = false;
        if (!results) {
          return;
        }
        this.suggestions = results;
        this.noResults = results.length === 0;
      });
  }

  onSelect(address: Address) {
    this.selectedAddress = address;
    this.searchControl.setValue(address.formatted, { emitEvent: false });
    this.onChange(address);
    this.onTouched();
    this.addressSelected.emit(address);
  }

  onChange!: (address: Address) => void;
  onTouched!: () => void;

  writeValue(value: Address | null): void {
    if (value) {
      this.searchControl.setValue(value.formatted, { emitEvent: false });
      this.selectedAddress = value;
    } else {
      this.searchControl.setValue('', { emitEvent: false });
      this.selectedAddress = null;
    }
  }

  registerOnChange(fn: (address: Address) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }

  validate(): ValidationErrors | null {
    return this.searchControl.errors;
  }

  private resetAutocompleteState() {
    this.selectedAddress = null;
    this.suggestions = [];
    this.loading = false;
    this.noResults = false;
  }

  private invalidSelectionValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value || control.value === '') {
      return { required: true };
    }
    if (
      !this.selectedAddress ||
      this.selectedAddress.formatted !== control.value
    ) {
      return { invalidSelection: true };
    }
    return null;
  }
}
