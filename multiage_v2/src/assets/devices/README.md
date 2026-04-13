# Device Images

Place product photography here. Recommended specs:
- Format: PNG with transparent background, or WebP
- Size: 800×800 px minimum
- Naming convention: `{brand}-{model-slug}.png`
  e.g. `apple-iphone-15-pro.png`, `samsung-galaxy-s24-ultra.png`

Once images are added, update `src/constants/index.js`:
```js
import iphone15Pro from "../assets/devices/apple-iphone-15-pro.png";

export const DEVICES = [
  { id: 1, ..., image: iphone15Pro, emoji: "📱" },
  ...
];
```

The `DeviceCard` component inside `DevicesSection.jsx` already handles
the `device.image` field — it will display the image automatically once
the path is populated.
