import 'zone.js';
import 'zone.js/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AddressAutocompleteComponent } from './address-autocomplete';
import { GeoapifyAutocomplete } from '../../services/geoapify-autocomplete';
import { Address } from '../../types/models/address.model';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('AddressAutocompleteComponent', () => {
  let component: AddressAutocompleteComponent;
  let fixture: ComponentFixture<AddressAutocompleteComponent>;
  let geoapifyService: jasmine.SpyObj<GeoapifyAutocomplete>;

  const mockAddress: Address = {
    formatted: '123 Test St, Test City',
    street: '123 Test St',
    state: 'Test State',
    city: 'Test City',
    country: 'Test Country',
    postcode: '12345',
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GeoapifyAutocomplete', [
      'fetchSuggestions',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AddressAutocompleteComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: GeoapifyAutocomplete, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressAutocompleteComponent);
    component = fixture.componentInstance;
    geoapifyService = TestBed.inject(
      GeoapifyAutocomplete
    ) as jasmine.SpyObj<GeoapifyAutocomplete>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty value', () => {
    expect(component.searchControl.value).toBe('');
  });

  it('should call writeValue correctly', () => {
    component.writeValue(mockAddress);
    expect(component.searchControl.value).toBe(mockAddress.formatted);
  });

  it('should clear value on null writeValue', () => {
    component.writeValue(null);
    expect(component.searchControl.value).toBe('');
  });

  it('should emit selected address', () => {
    spyOn(component.addressSelected, 'emit');
    component.onSelect(mockAddress);
    expect(component.searchControl.value).toBe(mockAddress.formatted);
    expect(component.addressSelected.emit).toHaveBeenCalledWith(mockAddress);
  });

  it('should update disabled state', () => {
    component.setDisabledState(true);
    expect(component.searchControl.disabled).toBeTrue();
    component.setDisabledState(false);
    expect(component.searchControl.disabled).toBeFalse();
  });

  it('should apply autocompleteValidator to the searchControl', () => {
    const validators = component.searchControl.validator?.({} as any);
    expect(validators).toBeTruthy();
  });
  it('should fetch suggestions on valid input', fakeAsync(() => {
    geoapifyService.fetchSuggestions.and.returnValue(of([mockAddress]));

    component.searchControl.setValue('123 Test');
    tick(300);
    fixture.detectChanges();

    expect(geoapifyService.fetchSuggestions).toHaveBeenCalledWith('123 Test');
    expect(component.suggestions.length).toBe(1);
    expect(component.loading).toBeFalse();
    expect(component.noResults).toBeFalse();
  }));

  it('should handle no suggestions returned', fakeAsync(() => {
    geoapifyService.fetchSuggestions.and.returnValue(of([]));

    component.searchControl.setValue('Unknown Place');
    tick(300);
    fixture.detectChanges();

    expect(component.suggestions.length).toBe(0);
    expect(component.noResults).toBeTrue();
  }));

  it('should handle API error gracefully', fakeAsync(() => {
    geoapifyService.fetchSuggestions.and.returnValue(
      throwError(() => new Error('API error'))
    );

    component.searchControl.setValue('Error Place');
    tick(300);
    fixture.detectChanges();

    expect(component.suggestions.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(component.noResults).toBeFalse();
  }));
});
