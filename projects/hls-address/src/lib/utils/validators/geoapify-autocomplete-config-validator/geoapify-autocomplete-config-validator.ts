import { AddressAutocompleteConfig } from '../../../types/models/address-autocomplete-config.model';

export function validateGeoapifyAutocompleteConfig(
  config: AddressAutocompleteConfig
): void {
  if (!config?.apiKey) {
    throw new Error('Geoapify API key is required in config.');
  }

  if (config.limit !== undefined) {
    if (!Number.isInteger(config.limit) || config.limit <= 0) {
      throw new Error('`limit` must be a positive integer.');
    }
  }

  if (config.countryCode !== undefined) {
    const validSpecials = ['auto', 'none'];
    const lowerValue = config.countryCode.toLowerCase();

    if (!validSpecials.includes(lowerValue)) {
      const codes = lowerValue.split(',').map((c) => c.trim());
      const invalid = codes.filter((code) => !/^[a-z]{2}$/.test(code));

      if (invalid.length > 0) {
        throw new Error(
          '`countryCode` contains invalid codes: ' + invalid.join(', ')
        );
      }
    }
  }

  if (config.lang !== undefined) {
    if (!/^[a-z]{2}$/i.test(config.lang.trim().toLowerCase())) {
      throw new Error('`lang` must be a valid 2-letter ISO 639-1 code.');
    }
  }

  if (config.type !== undefined) {
    const allowedTypes = [
      'country',
      'state',
      'city',
      'postcode',
      'street',
      'amenity',
      'locality',
    ];
    if (!allowedTypes.includes(config.type.trim().toLowerCase())) {
      throw new Error('`type` must be one of: ' + allowedTypes.join(', '));
    }
  }

  if (config.bias !== undefined) {
    validateBias(config.bias);
  }
}

function validateBias(bias: string): void {
  const biasPatterns: Record<string, RegExp> = {
    proximity: /^proximity:-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
    circle: /^circle:-?\d+(\.\d+)?,-?\d+(\.\d+)?,\d+$/,
    rect: /^rect:-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
    countrycode: /^countrycode:(auto|none|[a-z]{2}(,[a-z]{2})*)$/,
  };

  const usedTypes = new Set<string>();
  const parts = bias.split('|').map((p) => p.trim());

  for (const part of parts) {
    const [type] = part.split(':');

    if (usedTypes.has(type)) {
      throw new Error(`Duplicate \`${type}\` bias.`);
    }

    const pattern = biasPatterns[type];
    if (!pattern || !pattern.test(part)) {
      throw new Error(`Invalid bias format: "${part}"`);
    }

    usedTypes.add(type);
  }
}
