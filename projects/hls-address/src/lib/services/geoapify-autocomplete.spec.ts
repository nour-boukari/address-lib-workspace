import { TestBed } from '@angular/core/testing';

import { GeoapifyAutocomplete } from './geoapify-autocomplete';

describe('GeoapifyAutocomplete', () => {
  let service: GeoapifyAutocomplete;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoapifyAutocomplete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
