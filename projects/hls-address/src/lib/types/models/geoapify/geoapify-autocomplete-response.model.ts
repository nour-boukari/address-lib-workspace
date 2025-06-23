export interface GeoapifyAutocompleteResponse {
  results: LocationResult[];
    query: {
        text: string;
        parsed: {
            street: string;
            expected_type: string;
        };
    };
}

export interface LocationResult {
    country: string;
    country_code: string;
    state?: string;
    county?: string;
    city?: string;
    postcode: string;
    district?: string;
    neighbourhood?: string;
    suburb?: string;
    street?: string;
    datasource: {
        sourcename: string;
        attribution: string;
        license: string;
        url: string;
    };
    state_code?: string;
    lon: number;
    lat: number;
    distance: number;
    result_type: string;
    formatted: string;
    address_line1: string;
    address_line2: string;
    timezone: {
        name: string;
        offset_STD: string;
        offset_STD_seconds: number;
        offset_DST: string;
        offset_DST_seconds: number;
        abbreviation_STD: string;
        abbreviation_DST: string;
    };
    plus_code?: string;
    plus_code_short?: string;
    iso3166_2?: string;
    rank: {
        confidence: number;
        confidence_street_level: number;
        match_type: string;
    };
    place_id: string;
    bbox: {
        lon1: number;
        lat1: number;
        lon2: number;
        lat2: number;
    };
    municipality?: string;
}
