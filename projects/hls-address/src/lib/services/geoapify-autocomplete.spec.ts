import { TestBed } from '@angular/core/testing';
import { GeoapifyAutocomplete } from './geoapify-autocomplete';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ADDRESS_AUTOCOMPLETE_CONFIG } from '../config/address-autocomplete-config';
import {
  mockGeoapifyResponseValid,
  mockGeoapifyResponseInvalid,
} from './geoapify-autocomplete.mock';

describe('GeoapifyAutocomplete', () => {
  let service: GeoapifyAutocomplete;
  let httpMock: HttpTestingController;

  const config = {
    apiKey: 'test-api-key',
    countryCode: 'de',
    limit: 5,
    type: 'street',
    lang: 'en',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeoapifyAutocomplete,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ADDRESS_AUTOCOMPLETE_CONFIG,
          useValue: config,
        },
      ],
    });

    service = TestBed.inject(GeoapifyAutocomplete);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return formatted address suggestions when valid data is returned', (done) => {
    service.fetchSuggestions('alexanderplatz').subscribe((result) => {
      expect(result.length).toBe(1);
      expect(result[0].street).toBe('Alexanderplatz');
      expect(result[0].city).toBe('Berlin');
      expect(result[0].postcode).toBe('10178');
      expect(result[0].state).toBe('Berlin');
      expect(result[0].formatted).toContain('Germany');
      done();
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url.includes('/autocomplete') &&
        r.params.get('text') === 'alexanderplatz'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockGeoapifyResponseValid);
  });

  it('should filter out results missing required fields (invalid response)', (done) => {
    service.fetchSuggestions('invalid').subscribe((result) => {
      expect(result.length).toBe(0);
      done();
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url.includes('/autocomplete') && r.params.get('text') === 'invalid'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockGeoapifyResponseInvalid);
  });

  it('should include bias and lang in the request if provided', (done) => {
    service
      .fetchSuggestions('berlin', { bias: 'proximity:13.4,52.5', lang: 'de' })
      .subscribe(() => {
        done();
      });

    const req = httpMock.expectOne(
      (r) =>
        r.url.includes('/autocomplete') &&
        r.params.get('bias') === 'proximity:13.4,52.5' &&
        r.params.get('lang') === 'de'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      results: [],
      query: {
        text: 'berlin',
        parsed: { street: '', expected_type: 'street' },
      },
    });
  });
});
