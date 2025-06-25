import { GeoapifyAutocompleteResponse } from '../types/models/geoapify';

export const mockGeoapifyResponseValid: GeoapifyAutocompleteResponse = {
  results: [
    {
      country: 'Germany',
      country_code: 'de',
      state: 'Berlin',
      city: 'Berlin',
      postcode: '10178',
      street: 'Alexanderplatz',
      district: 'Mitte',
      neighbourhood: 'Scheunenviertel',
      suburb: 'Berlin-Mitte',
      datasource: {
        sourcename: 'openstreetmap',
        attribution: '© OpenStreetMap contributors',
        license: 'Open Database License',
        url: 'https://www.openstreetmap.org',
      },
      lon: 13.413215,
      lat: 52.521918,
      distance: 50,
      result_type: 'street',
      formatted: 'Alexanderplatz, 10178 Berlin, Germany',
      address_line1: 'Alexanderplatz',
      address_line2: 'Berlin, Germany',
      timezone: {
        name: 'Europe/Berlin',
        offset_STD: '+01:00',
        offset_STD_seconds: 3600,
        offset_DST: '+02:00',
        offset_DST_seconds: 7200,
        abbreviation_STD: 'CET',
        abbreviation_DST: 'CEST',
      },
      rank: {
        confidence: 1,
        confidence_street_level: 1,
        match_type: 'full',
      },
      place_id: '123456789',
      bbox: {
        lon1: 13.412,
        lat1: 52.521,
        lon2: 13.414,
        lat2: 52.522,
      },
    },
  ],
  query: {
    text: 'Alexanderplatz',
    parsed: {
      street: 'Alexanderplatz',
      expected_type: 'street',
    },
  },
};

export const mockGeoapifyResponseInvalid: GeoapifyAutocompleteResponse = {
  results: [
    {
      country: 'Germany',
      country_code: 'de',
      postcode: '10179',
      datasource: {
        sourcename: 'openstreetmap',
        attribution: '© OpenStreetMap contributors',
        license: 'Open Database License',
        url: 'https://www.openstreetmap.org',
      },
      lon: 13.417,
      lat: 52.520,
      distance: 100,
      result_type: 'street',
      formatted: 'Invalid location',
      address_line1: '',
      address_line2: '',
      timezone: {
        name: 'Europe/Berlin',
        offset_STD: '+01:00',
        offset_STD_seconds: 3600,
        offset_DST: '+02:00',
        offset_DST_seconds: 7200,
        abbreviation_STD: 'CET',
        abbreviation_DST: 'CEST',
      },
      rank: {
        confidence: 0.5,
        confidence_street_level: 0.5,
        match_type: 'partial',
      },
      place_id: '987654321',
      bbox: {
        lon1: 13.416,
        lat1: 52.519,
        lon2: 13.418,
        lat2: 52.521,
      },
    },
  ],
  query: {
    text: 'Invalid',
    parsed: {
      street: '',
      expected_type: 'street',
    },
  },
};
