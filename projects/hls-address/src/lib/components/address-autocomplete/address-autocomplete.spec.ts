import 'zone.js';
import 'zone.js/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { AddressAutocompleteComponent } from './address-autocomplete';
import { GeoapifyAutocomplete } from '../../services/geoapify-autocomplete';
import { Address } from '../../types/models/address.model';
import { of, throwError, delay } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';

function simulateInput(
  fixture: ComponentFixture<AddressAutocompleteComponent>,
  text: string = 'test'
): void {
  const input = fixture.debugElement.query(By.css('input'))?.nativeElement;
  if (!input) {
    throw new Error('Input element not found');
  }
  input.dispatchEvent(new Event('focusin'));
  input.value = text;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

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

  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

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
      providers: [
        { provide: GeoapifyAutocomplete, useValue: spy },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressAutocompleteComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
    geoapifyService = TestBed.inject(
      GeoapifyAutocomplete
    ) as jasmine.SpyObj<GeoapifyAutocomplete>;
  });

  afterEach(() => {
    fixture.destroy();
    overlayContainer.ngOnDestroy();
    overlayContainerElement.remove();
    geoapifyService.fetchSuggestions.calls.reset();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty value', () => {
      expect(component.searchControl.value).toBe('');
    });

    it('should have default label and placeholder', () => {
      expect(component.label).toBe('Address');
      expect(component.placeholder).toBe('Enter address...');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should call writeValue correctly', () => {
      component.writeValue(mockAddress);
      expect(component.searchControl.value).toBe(mockAddress.formatted);
      expect(component.selectedAddress).toEqual(mockAddress);
    });

    it('should clear value on null writeValue', () => {
      component.writeValue(mockAddress);
      component.writeValue(null);
      expect(component.searchControl.value).toBe('');
      expect(component.selectedAddress).toBeNull();
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy();
      component.registerOnChange(fn);
      component.onSelect(mockAddress);
      expect(fn).toHaveBeenCalledWith(mockAddress);
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy();
      component.registerOnTouched(fn);
      component.onTouched();
      expect(fn).toHaveBeenCalled();
    });

    it('should update disabled state', () => {
      component.setDisabledState(true);
      expect(component.searchControl.disabled).toBeTrue();
      component.setDisabledState(false);
      expect(component.searchControl.disabled).toBeFalse();
    });
  });

  describe('Address Selection', () => {
    it('should emit selected address', () => {
      spyOn(component.addressSelected, 'emit');
      component.onSelect(mockAddress);
      expect(component.searchControl.value).toBe(mockAddress.formatted);
      expect(component.addressSelected.emit).toHaveBeenCalledWith(mockAddress);
    });

    it('should validate selection', () => {
      component.onSelect(mockAddress);
      expect(component.searchControl.valid).toBeTrue();
    });
  });

  describe('Validation', () => {
    it('should apply autocompleteValidator to the searchControl', () => {
      const errors = component.searchControl.validator?.({} as any);
      expect(errors).toBeTruthy();
    });

    it('should mark invalid when value is not from suggestions', () => {
      component.searchControl.setValue('Manual input');
      expect(component.searchControl.hasError('invalidSelection')).toBeTrue();
    });

    it('should require value when control is required', () => {
      component.searchControl.setValue('');
      component.searchControl.markAsTouched();
      expect(component.searchControl.hasError('required')).toBeTrue();
    });
  });

  describe('API Interaction', () => {
    it('should not call API for less than 3 characters', fakeAsync(() => {
      component.searchControl.setValue('12');
      tick(300);
      expect(geoapifyService.fetchSuggestions).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    }));

    it('should fetch suggestions on valid input', fakeAsync(() => {
      geoapifyService.fetchSuggestions.and.returnValue(of([mockAddress]));

      component.searchControl.setValue('123 Test');
      tick(300);

      expect(geoapifyService.fetchSuggestions).toHaveBeenCalledWith('123 Test');
      expect(component.suggestions).toEqual([mockAddress]);
      expect(component.loading).toBeFalse();
      expect(component.noResults).toBeFalse();
    }));

    it('should handle no suggestions returned', fakeAsync(() => {
      geoapifyService.fetchSuggestions.and.returnValue(of([]));

      component.searchControl.setValue('Unknown Place');
      tick(300);

      expect(component.suggestions).toEqual([]);
      expect(component.noResults).toBeTrue();
    }));

    it('should handle API error', fakeAsync(() => {
      spyOn(console, 'error');
      geoapifyService.fetchSuggestions.and.returnValue(
        throwError(() => new Error('API error'))
      );

      component.searchControl.setValue('Error');
      tick(300);

      expect(console.error).toHaveBeenCalled();
      expect(component.suggestions).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.noResults).toBeFalse();
    }));

    it('should cancel previous request on new input', fakeAsync(() => {
      geoapifyService.fetchSuggestions.and.returnValue(
        of([mockAddress]).pipe(delay(500))
      );

      component.searchControl.setValue('slow');
      tick(100);
      component.searchControl.setValue('fast');
      tick(300);

      expect(geoapifyService.fetchSuggestions).toHaveBeenCalledTimes(1);
      expect(geoapifyService.fetchSuggestions).toHaveBeenCalledWith('fast');
    }));

    it('should reset state on component destroy during pending request', fakeAsync(() => {
      geoapifyService.fetchSuggestions.and.returnValue(
        of([mockAddress]).pipe(delay(500))
      );

      component.searchControl.setValue('test');
      tick(100);
      fixture.destroy();
      tick(500);

      expect(component.loading).toBeFalse();
    }));
  });

  describe('UI Integration', () => {
    it('should display custom label', () => {
      component.label = 'Custom Label';
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('mat-label');
      expect(label.textContent).toContain('Custom Label');
    });

    it('should show loading spinner during API calls', fakeAsync(() => {
      geoapifyService.fetchSuggestions.and.returnValue(
        of([mockAddress]).pipe(delay(300))
      );

      simulateInput(fixture);

      tick(300);
      fixture.detectChanges();

      expect(component.loading).toBeTrue();
      expect(
        overlayContainerElement.querySelector('mat-progress-spinner')
      ).toBeTruthy();

      tick(300);
      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(
        overlayContainerElement.querySelector('mat-progress-spinner')
      ).toBeNull();
    }));

    it('should display suggestions in autocomplete panel', async () => {
      geoapifyService.fetchSuggestions.and.returnValue(of([mockAddress]));

      simulateInput(fixture);

      await fixture.whenStable();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll('mat-option');
      expect(options.length).toBe(1);
      expect(options[0].textContent).toContain(mockAddress.formatted);
    });

    it('should select address from suggestions', async () => {
      geoapifyService.fetchSuggestions.and.returnValue(of([mockAddress]));
      spyOn(component.addressSelected, 'emit');

      simulateInput(fixture);

      await fixture.whenStable();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll('mat-option');
      expect(options.length).toBe(1);
      expect(options[0].textContent).toContain(mockAddress.formatted);
      options[0].dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();

      expect(component.searchControl.value).toBe(mockAddress.formatted);
      expect(component.addressSelected.emit).toHaveBeenCalledWith(mockAddress);
    });

    it('should display no results message when no suggestions found', async () => {
      geoapifyService.fetchSuggestions.and.returnValue(of([]));

      simulateInput(fixture);

      await fixture.whenStable();
      fixture.detectChanges();

      const noResults = overlayContainerElement.querySelectorAll(
        'mat-option[disabled]'
      );
      expect(noResults.length).toBe(1);
      expect(noResults[0].textContent).toContain('No address results found.');
    });
  });
});
