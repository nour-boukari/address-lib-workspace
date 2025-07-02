# AddressLibWorkspace

This is an Angular workspace containing:

- **`hls-address`**: A reusable Angular Material address autocomplete component powered by the [Geoapify API](https://www.geoapify.com/).
- **`demo-app`**: A demo application showcasing the `hls-address` component.

---

## Setup

### 1. Install Dependencies

From the root of the workspace, run:

```bash
npm install
```

### 2. Build the Library
build the `hls-address` library:

```bash
ng build hls-address
```

> You can also run the library in `watch mode` to automatically rebuild on changes:
>
> ```bash
> ng build hls-address --watch
> ```
>
> Keep this running while making changes to the address library. Then serve the demo app to preview your updates live.

### 3. Add Geoapify API Key
The demo app requires a Geoapify API key. Create the following file:

```swift
projects/demo-app/src/environments/environment.ts
```
Add this content:

```ts
export const environment = {
  apiKey: 'your_geoapify_api_key'
};
```

### 3. Serve the Demo App
To run the demo app locally:

```bash
ng serve demo-app -o
```
This will open the demo application in your browser.

## Testing
### Test the Library

```bash
ng test hls-address
```

### Test the Demo App
```bash
ng test demo-app
```
