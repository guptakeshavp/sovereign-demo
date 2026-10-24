# Sovereign

An Indian tailoring and formalwear concept, focused on women.

- **Editable React application:** [`sovereign-react/`](sovereign-react/)
- **Published demo:** [Sovereign](https://guptakeshavp.github.io/sovereign-demo/)
- **Earlier static approach:** [`classic/`](classic/) · [live preview](https://guptakeshavp.github.io/sovereign-demo/classic/)

## Develop

```sh
git clone https://github.com/guptakeshavp/sovereign-demo.git
cd sovereign-demo/sovereign-react
npm ci
npm run dev
```

Run `npm run build` to type-check and create a production build in `dist/`, and `npm run lint` for lint checks. See the [application README](sovereign-react/README.md) for architecture and demo limitations.

## Source and publishing

The repository root holds the previously published website files. The `sovereign-react/` directory holds the editable React, TypeScript and Vite source, lockfile, design documentation and media assets. Source backups and publishing are separate: updating the source directory does not replace the files served by the existing homepage. Publishing a new build requires separate approval.

Prices, garment specifications and contact information are demonstration data. Checkout does not take payment. Some imagery is AI-created concept photography; see the [asset notes](sovereign-react/docs/editorial/SOURCES.md).
