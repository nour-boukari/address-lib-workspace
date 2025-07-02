export interface GeoapifyAutocompleteRequestOptions {
  limit?: number;
  countryCode?: string;
  type?: 'country' | 'state' | 'city' | 'postcode' | 'street' | 'amenity' | 'locality';
  bias?: string;
  lang?: string;
}