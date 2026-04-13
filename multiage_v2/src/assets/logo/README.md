# Logo Assets

Place the official Multiage Technologies logo files here.

Expected files:
- `multiage-logo.png`       — full colour logo (PNG, transparent background)
- `multiage-logo.svg`       — SVG version for crispness at any size
- `multiage-logo-white.svg` — white/monochrome variant for dark backgrounds
- `multiage-logo-dark.svg`  — dark variant for light mode

Usage in components:
```jsx
import logoSrc from "../assets/logo/multiage-logo.svg";
// Then replace the <LogoMark /> placeholder:
<img src={logoSrc} alt="Multiage Technologies" style={{ height: 36 }} />
```
