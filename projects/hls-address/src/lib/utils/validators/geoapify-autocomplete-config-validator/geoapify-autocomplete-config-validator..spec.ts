import { AddressAutocompleteConfig } from '../../../types/models/address-autocomplete-config.model';
import { validateGeoapifyAutocompleteConfig } from './geoapify-autocomplete-config-validator';

describe('validateGeoapifyAutocompleteConfig', () => {
  it('should pass for a valid config', () => {
    const config: AddressAutocompleteConfig = {
      apiKey: 'test-key',
      limit: 5,
      countryCode: 'de,fr',
      lang: 'en',
      type: 'city',
      bias: 'proximity:10.1,50.2|countrycode:de',
    };

    expect(() => validateGeoapifyAutocompleteConfig(config)).not.toThrow();
  });

  it('should fail if apiKey is missing', () => {
    expect(() =>
      validateGeoapifyAutocompleteConfig({} as AddressAutocompleteConfig)
    ).toThrowError('Geoapify API key is required in config.');
  });

  it('should fail for invalid limit (negative)', () => {
    expect(() =>
      validateGeoapifyAutocompleteConfig({
        apiKey: 'key',
        limit: -1,
      })
    ).toThrowError('`limit` must be a positive integer.');
  });

  it('should fail for non-integer limit', () => {
    expect(() =>
      validateGeoapifyAutocompleteConfig({
        apiKey: 'key',
        limit: 2.5,
      })
    ).toThrowError('`limit` must be a positive integer.');
  });

  it('should fail for invalid country codes', () => {
    expect(() =>
      validateGeoapifyAutocompleteConfig({
        apiKey: 'key',
        countryCode: 'us,xyz',
      })
    ).toThrowError('`countryCode` contains invalid codes: xyz');
  });

  it('should pass for countryCode with auto/none', () => {
    expect(() =>
      validateGeoapifyAutocompleteConfig({
        apiKey: 'key',
        countryCode: 'auto',
      })
    ).not.toThrow();

    expect(() =>
      validateGeoapifyAutocompleteConfig({
        apiKey: 'key',
        countryCode: 'none',
      })
    ).not.toThrow();
  });

  it('should fail for invalid lang', () => {
    expect(() =>
      validateGeoapifyAutocompleteConfig({
        apiKey: 'key',
        lang: 'english',
      })
    ).toThrowError('`lang` must be a valid 2-letter ISO 639-1 code.');
  });

  it('should fail for invalid type', () => {
    expect(() =>
      validateGeoapifyAutocompleteConfig({
        apiKey: 'key',
        type: 'continent',
      } as any)
    ).toThrowError('`type` must be one of: country, state, city, postcode, street, amenity, locality');
  });

  describe('bias validation', () => {
    it('should fail for invalid bias format', () => {
      expect(() =>
        validateGeoapifyAutocompleteConfig({
          apiKey: 'key',
          bias: 'proximity:abc,def',
        })
      ).toThrowError('Invalid bias format: "proximity:abc,def"');
    });

    it('should fail for duplicate bias types', () => {
      expect(() =>
        validateGeoapifyAutocompleteConfig({
          apiKey: 'key',
          bias: 'proximity:10.1,50.2|proximity:9.9,44.2',
        })
      ).toThrowError('Duplicate `proximity` bias.');
    });

    it('should pass for valid combined biases', () => {
      expect(() =>
        validateGeoapifyAutocompleteConfig({
          apiKey: 'key',
          bias: 'circle:10.1,50.2,2000|countrycode:de,fr|proximity:-73.99,40.73|rect:-80.0,35.0,-70.0,45.0',
        })
      ).not.toThrow();
    });
  });
});