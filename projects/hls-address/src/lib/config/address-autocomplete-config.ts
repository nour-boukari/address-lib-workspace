import { InjectionToken } from '@angular/core';
import { AddressAutocompleteConfig } from '../types/models/address-autocomplete-config.model';

export const ADDRESS_AUTOCOMPLETE_CONFIG = new InjectionToken<AddressAutocompleteConfig>(
  'AddressAutocompleteConfig'
);