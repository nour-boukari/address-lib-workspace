import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Address } from '../types/models/address.model';
import {
  GeoapifyAutocompleteRequestOptions,
  GeoapifyAutocompleteResponse,
} from '../types/models/geoapify';
import { ADDRESS_AUTOCOMPLETE_CONFIG } from '../config/address-autocomplete-config';
import { AddressAutocompleteConfig } from '../types/models/address-autocomplete-config.model';

@Injectable({
  providedIn: 'root',
})
export class GeoapifyAutocomplete {
  private readonly defaultOptions: GeoapifyAutocompleteRequestOptions;
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.geoapify.com/v1/geocode';

  constructor(
    private http: HttpClient,
    @Optional()
    @Inject(ADDRESS_AUTOCOMPLETE_CONFIG)
    config: AddressAutocompleteConfig
  ) {
    if (!config?.apiKey) {
      throw new Error('Geoapify API key is required in config.');
    }

    this.apiKey = config.apiKey;
    this.defaultOptions = {
      countryCode: config.countryCode || 'us',
      limit: config.limit || 5,
      type: config.type || 'street',
      bias: config.bias,
      lang: config.lang || 'en',
    };
  }

  fetchSuggestions(
    query: string,
    options: GeoapifyAutocompleteRequestOptions = {}
  ): Observable<Address[]> {
    const merged = { ...this.defaultOptions, ...options };

    let params = new HttpParams()
      .set('text', query)
      .set('limit', String(merged.limit))
      .set('filter', `countrycode:${merged.countryCode}`)
      .set('type', merged.type || 'street')
      .set('format', 'json')
      .set('apiKey', this.apiKey);

    if (merged.bias) {
      params = params.set('bias', merged.bias);
    }

    if (merged.lang) {
      params = params.set('lang', merged.lang);
    }

    return this.http
      .get<GeoapifyAutocompleteResponse>(this.baseUrl + '/autocomplete', {
        params,
      })
      .pipe(
        map((res) =>
          res.results
            .filter(
              (address) =>
                !!address.street &&
                !!address.city &&
                !!address.postcode &&
                !!address.state
            )
            .map((address) => ({
              street: address.street!,
              city: address.city!,
              postcode: address.postcode!,
              state: address.state!,
              country: address.country,
              formatted: address.formatted,
              lat: address.lat,
              lon: address.lon,
            }))
        )
      );
  }
}
