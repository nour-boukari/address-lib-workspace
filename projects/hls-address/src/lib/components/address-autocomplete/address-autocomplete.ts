import { Component, forwardRef, Inject, Injector, Input, OnInit, Optional, Self } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
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

  control: AbstractControl | null = null;
  public ngControl: NgControl | null = null;

  searchControl = new FormControl('');

  suggestions: Address[] = [];

  loading = false;
  noResults = false;

  private selectedAddress: Address | null = null;

  constructor(private geoapifyAutocomplete: GeoapifyAutocomplete, private injector: Injector) {

  }

  ngOnInit() {
        const ngControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control;
      ngControl.valueAccessor = this;
    }
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
          this.onChange(value);

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
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: Address): void {
    if (value) {
      this.searchControl.setValue(value.formatted, { emitEvent: false });
      this.selectedAddress = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value === '') {
      return { required: true };
    }
    if (
      !this.selectedAddress ||
      !control.value ||
      this.selectedAddress.formatted !== (control.value as Address).formatted
    ) {
      return { invalidSelection: true };
    }
    return null;
  }

  private resetAutocompleteState() {
    this.suggestions = [];
    this.loading = false;
    this.noResults = false;
  }
}
