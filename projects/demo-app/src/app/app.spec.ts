import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import {
  AddressAutocompleteComponent,
  ADDRESS_AUTOCOMPLETE_CONFIG,
  Address,
} from 'hls-address';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideHttpClient } from '@angular/common/http';
import {
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  const mockAddress: Address = {
    country: 'Germany',
    state: 'Berlin',
    city: 'Berlin',
    postcode: '10178',
    street: 'Alexanderplatz',
    formatted: 'Alexanderplatz, 10178 Berlin, Germany',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        AddressAutocompleteComponent,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        {
          provide: ADDRESS_AUTOCOMPLETE_CONFIG,
          useValue: {
            apiKey: 'demo-key',
            countryCode: 'de',
            type: 'street',
            limit: 5,
            bias: 'proximity:13.4050,52.5200',
            lang: 'en',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.get('accept')).toBeTruthy();
    expect(component.form.get('address')).toBeTruthy();
  });

  it('should have an invalid form when address is null', () => {
     component.form.get('address')?.setValue(null);
    fixture.detectChanges();

    expect(component.form.valid).toBeFalse();
    expect(component.form.get('address')?.valid).toBeFalse();
  });

  it('should update address value and make the form valid', () => {
    component.form.get('address')?.setValue(mockAddress);
    fixture.detectChanges();

    expect(component.form.get('address')?.value).toEqual(mockAddress);
    expect(component.form.get('address')?.valid).toBeTrue();
    console.log(component.form.get('address')?.errors)
    expect(component.form.valid).toBeTrue();
  });

  it('should return null when address control is not set', () => {
    component.form.get('address')?.setValue(null);
    fixture.detectChanges();

    expect(component.address).toBeNull();
  });

  it('should return correct address from getter', () => {
    component.form.get('address')?.setValue(mockAddress);
    fixture.detectChanges();

    expect(component.address).toEqual(mockAddress);
  });

  it('should render formatted address value in the DOM when address is set', () => {
    component.form.get('address')?.setValue(mockAddress);
    fixture.detectChanges();

    const domText = fixture.nativeElement.textContent;

    expect(domText).toContain(mockAddress.formatted);
    expect(domText).toContain(mockAddress.street);
    expect(domText).toContain(mockAddress.city);
    expect(domText).toContain(mockAddress.state);
    expect(domText).toContain(mockAddress.country);
    expect(domText).toContain(mockAddress.postcode);
  });

  it('should render "--" in the DOM when address fields are missing', () => {
    component.form.get('address')?.setValue(null);
    fixture.detectChanges();

    const spans = fixture.debugElement.queryAll(
      By.css('.grid span:nth-child(even)')
    );
    spans.forEach((span) => {
      expect(span.nativeElement.textContent.trim()).toBe('--');
    });
  });
});
