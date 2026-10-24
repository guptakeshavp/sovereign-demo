# Sovereign

An Indian tailoring and formalwear concept, focused on women.

- **React application:** [`sovereign-react/`](sovereign-react/)
- **Published demo:** [Sovereign](https://guptakeshavp.github.io/sovereign-demo/)

## Develop

```sh
git clone https://github.com/guptakeshavp/sovereign-demo.git
cd sovereign-demo/sovereign-react
npm ci
npm run dev
```

Run `npm run build` to type-check and create a production build in `dist/`, and `npm run lint` for lint checks. See the [application README](sovereign-react/README.md) for architecture and demo limitations.

## Publishing

The repository holds only the React source. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds `sovereign-react/` and publishes `dist/` to GitHub Pages. Build output is not committed.

Prices, garment specifications and contact information are demonstration data. Checkout does not take payment. Some imagery is AI-created concept photography; see the [asset notes](sovereign-react/docs/editorial/SOURCES.md).
