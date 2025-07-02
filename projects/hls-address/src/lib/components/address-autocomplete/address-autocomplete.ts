import {
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { autocompleteValidator } from '../../utils/validators/autocomplete-validator/autocomplete-validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    MatProgressSpinnerModule,
  ],
})
export class AddressAutocompleteComponent
  implements OnInit, ControlValueAccessor
{
  @Input() placeholder: string = 'Enter address...';
  @Input() label: string = 'Address';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Output() addressSelected = new EventEmitter<Address>();

  searchControl = new FormControl('', this.autocompleteValidator());

  suggestions: Address[] = [];

  loading = false;
  noResults = false;

  selectedAddress: Address | null = null;
  private destroyRef = inject(DestroyRef);

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
        }),
        takeUntilDestroyed(this.destroyRef)
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
    this.searchControl.updateValueAndValidity({ emitEvent: false });
    this.onChange(address);
    this.onTouched();
    this.addressSelected.emit(address);
  }

  onChange = (_: Address) => {};
  onTouched = () => {};

  writeValue(value: Address | null): void {
    if (value) {
      this.selectedAddress = value;
      this.searchControl.setValue(value.formatted, { emitEvent: false });
    } else {
      this.selectedAddress = null;
      this.searchControl.setValue('', { emitEvent: false });
    }
    this.searchControl.updateValueAndValidity({ emitEvent: false });
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

  private autocompleteValidator(): ValidatorFn {
    return autocompleteValidator(() => this.selectedAddress);
  }
}
