# Address Autocomplete Component

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Material Design](https://img.shields.io/badge/Material%20Design-757575?style=for-the-badge&logo=material-design&logoColor=white)

An Angular Material component for address autocomplete using the [Geoapify API](https://www.geoapify.com/).

---

## 🚀 Development

### 🔧 Building

```bash
ng build hls-address
```
Build artifacts will be placed in the dist/ directory.``

### 🧪 Testing
```bash
ng test
```
Runs unit tests using the Karma test runner.

### 📦 Publishing
Navigate to the build output:

```bash
cd dist/hls-address
```

Publish to npm:
```bash
npm publish
```

## 🔌 Usage Setup

📥 Installation

```bash
npm install hls-address
```
⚠️ Requirements
To properly use this library in your application, make sure to:

✅ Provide HttpClient using provideHttpClient() (Angular standalone app setup).

✅ Handle errors (e.g., API limits, network issues) from the Geoapify service using a global HttpInterceptor.

```ts
import { provideHttpClient } from '@angular/common/http';
import { ADDRESS_AUTOCOMPLETE_CONFIG } from 'hls-address';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    {
      provide: ADDRESS_AUTOCOMPLETE_CONFIG,
      useValue: {
        apiKey: 'your_geoapify_key',  // Required
        countryCode: 'us',            // Optional
        type: 'street',               // Optional
        limit: 5,                     // Optional
        lang: 'en',                   // Optional
        bias: 'proximity:lng,lat'  // Optional
      }
    }
  ]
});
```

### Basic Implementation

```html
<hls-address-autocomplete
   [label]="'Address'"
   [placeholder]="'Search for an address...'"
   formControlName="address"
></hls-address-autocomplete>
```

### ✨ Features
✅ Typeahead suggestions (3+ characters)

✅ Configurable API parameters

✅ Built-in validations

### ⚙️ Configuration Options

| Parameter     | Type     | Default   | Description                                                                                     |
|---------------|----------|-----------|-------------------------------------------------------------------------------------------------|
| `apiKey`      | `string` | —         | **Required.** Your [Geoapify API key](https://www.geoapify.com/api).                            |
| `countryCode` | `string` | `'us'`    | ISO 3166-1 alpha-2 country code(s). Can be a single code or multiple separated by commas.       |
| `type`        | `string` | `'street'`| Restrict results by location type. Valid values: `'country'`, `'state'`, `'city'`, `'postcode'`, `'street'`, `'amenity'`, `'locality'`. |
| `limit`       | `number` | `5`       | Maximum number of suggestions to return.                                                        |
| `lang`        | `string` | `'en'`    | 2-letter ISO 639-1 language code for localized results.                                         |
| `bias`        | `string` | —         | Bias results toward a specific location. Example: `proximity:-122.53,37.95`                     |

> 💡 **Note:** Refer to the [Geoapify Geocoding API documentation](https://apidocs.geoapify.com/) for updated usage details and advanced examples.


### 🧩 Component API
Inputs
Name	Type	Default
label	string	'Address'
placeholder	string	'Enter address...'

Outputs
addressSelected — Emits the complete selected Address object.