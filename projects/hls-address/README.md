# Address Autocomplete Component

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Material Design](https://img.shields.io/badge/Material%20Design-757575?style=for-the-badge&logo=material-design&logoColor=white)

An Angular Material component for address autocomplete using the [Geoapify API](https://www.geoapify.com/).

---

## Features

- ✅ Angular 18+ support (standalone or module-based)
- 🎨 Material Design UI with auto-complete
- 🌍 Geoapify integration for location-based suggestions
- 📦 Reactive Forms and standalone output support

---

## Setup

### 📥 Installation

```bash
npm install hls-address
```
### ⚠️ Requirements

To properly use this library in your Angular application, ensure the following:

- ✅ You're using **Angular 18 or higher**.
- ✅ You've installed `@angular/material` and set up a theme (required for styling).
- ✅ You handle errors from the Geoapify service (e.g., API limits, network failures) using a global `HttpInterceptor`.
- ✅ You provide `HttpClient` using `provideHttpClient()`.

> **⚠️ Note for Angular 18 users:**  
> If you're using Angular 18 and encounter an animation error (e.g., `NG05105`), make sure to:
>
> - Import `BrowserAnimationsModule` in your `AppModule` (for module-based apps), or  
> - Add `provideAnimations()` to your provider list (for standalone apps).
>
> This ensures compatibility with Angular Material animations like those used in autocomplete.

---

## Basic Implementation

Provide the `ADDRESS_AUTOCOMPLETE_CONFIG` token with your Geoapify API key and optional configuration, either in your module or in `bootstrapApplication()` for standalone apps:

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

### Importing the Component

Import `AddressAutocompleteComponent` into your module or standalone component:

```ts
import { AddressAutocompleteComponent } from 'hls-address';
```

#### Module-based App

```ts
@NgModule({
  imports: [
    // ... other imports
    AddressAutocompleteComponent
  ]
})
export class YourModule {}
```

#### Standalone Component

```ts
@Component({
  imports: [
    // ... other imports
    AddressAutocompleteComponent
  ]
})
export class YourComponent {}
```

### Using with Reactive Forms (`formControlName`)
Use the component with `FormControl<Address | null>` for full type safety.

#### Component Class

```ts
import { Address } from 'hls-address';
import { FormControl, FormGroup } from '@angular/forms';

...

this.form = new FormGroup({
  address: new FormControl<Address | null>(null),
});
```

#### Template

```html
<form [formGroup]="form">
  <hls-address-autocomplete
    [label]="'Address'"
    [placeholder]="'Search for an address...'"
    formControlName="address"
  ></hls-address-autocomplete>
</form>
```

### Without Reactive Forms (`onAddressSelected` Output)
If you're not using Reactive Forms, you can handle address selections via the output event.

#### Template

```html
<hls-address-autocomplete
  [label]="'Address'"
  [placeholder]="'Search for an address...'"
  (onAddressSelected)="handleAddressSelection($event)"
></hls-address-autocomplete>
```
#### Component Class

```ts
handleAddressSelection(address: Address) {
  console.log('Selected address:', address);
}
```

### Notes:
- You can use both `formControlName` and `onAddressSelected` at the same time.
- To disable the address autocomplete field, use a disabled FormControl as follows:

```ts
new FormControl({ value: null, disabled: true })
```
Do **not** use the `` [disabled] `` template binding.

---

## ⚙️ Configuration Options

| Parameter     | Type     | Default   | Description                                                                                     |
|---------------|----------|-----------|-------------------------------------------------------------------------------------------------|
| `apiKey`      | `string` | —         | **Required.** Your [Geoapify API key](https://www.geoapify.com/api).                            |
| `countryCode` | `string` | `'us'`    | ISO 3166-1 alpha-2 country code(s). Can be a single code or multiple separated by commas.       |
| `type`        | `string` | `'street'`| Restrict results by location type. Valid values: `'country'`, `'state'`, `'city'`, `'postcode'`, `'street'`, `'amenity'`, `'locality'`. |
| `limit`       | `number` | `5`       | Maximum number of suggestions to return.                                                        |
| `lang`        | `string` | `'en'`    | 2-letter ISO 639-1 language code for localized results.                                         |
| `bias`        | `string` | —         | Bias results toward a specific location. Example: `proximity:-122.53,37.95`                     |

> 💡 **Note:** Refer to the [Geoapify Geocoding API documentation](https://apidocs.geoapify.com/) for updated usage details and advanced examples.

---

## Component API

### Inputs

| Name          | Type                     | Default             | Description                                                                         |
|---------------|--------------------------|---------------------|-------------------------------------------------------------------------------------|
| `label`       | `string`                 | `'Address'`         | Label text displayed above the input field.                                         |
| `placeholder` | `string`                 | `'Enter address...'`| Placeholder text inside the input.                                                  |
| `appearance`  | `MatFormFieldAppearance` | `'outline'`         | Material appearance style: `'fill'` or `'outline'`.     |

### Output

| Name              | Type                    | Description                                                  |
|-------------------|-------------------------|--------------------------------------------------------------|
| `addressSelected` | `EventEmitter<Address>` | Emits the full selected address object when an option is chosen. |
