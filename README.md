# ITX Mobile Shop

A small single-page application to browse and buy mobile devices, built for the ITX front-end test.

## Goal

- **Product List Page (PLP):** every product returned by the API, a real-time search by brand and model, and up to four items per row.
- **Product Details Page (PDP):** two columns, the image on one side and the description and actions on the other; storage and colour selectors and an _Add_ button that sends the product to the cart.
- **Header:** the app title linking home, breadcrumbs, and the cart count, persisted across views and reloads.
- **Client-side cache:** every API response is stored in the browser and revalidated after one hour.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Scripts

```bash
npm install         # install dependencies
npm start           # development mode
npm run build       # production build into dist/
npm test            # run the test suite once
npm run test:watch  # tests in watch mode
npm run lint        # ESLint and Prettier checks
npm run preview     # serve the production build locally
```

## API

Base URL: `https://itx-frontend-test.onrender.com/`

| Method | Path               | Purpose                                        |
| ------ | ------------------ | ---------------------------------------------- |
| GET    | `/api/product`     | Product list                                   |
| GET    | `/api/product/:id` | Product details                                |
| POST   | `/api/cart`        | Add to cart (`{ id, colorCode, storageCode }`) |

## Architecture

```
src/
  api/         HTTP client and the browser cache it reads through
  context/     providers for the API client and the cart count
  hooks/       data fetching (useRequest, useProducts, useProduct)
  pages/       the two views plus a not-found page
  components/  header, breadcrumbs, search, item, image, description, actions
  utils/       pure helpers: search filter, price format, product specs
  test/        fixtures, render helper and integration tests
```

- **Routing:** React Router in the browser only, no SSR. `/` is the list, `/product/:id` the details, anything else a not-found page. Both views share a layout with the header.
- **Data:** components never call `fetch`. They use hooks that go through an API client injected by context, so tests swap it for a fake without mocking globals.
- **Tests:** Vitest and Testing Library. Pure logic has unit tests; each view is tested the way a user drives it, through the real routes and providers.

## Decisions

- **Cache:** every response is stored in `localStorage` with the time it arrived. A read younger than one hour is served from storage; an older one is fetched again and stored anew. There is no background refresh: data is revalidated when it is asked for. Concurrent reads of the same key share one request, failures are never stored, and if the storage is blocked or full the cache keeps working in memory.
- **Cart count:** the API always answers `{ "count": 1 }`, the units added by that request rather than the cart total. Showing it as is would pin the header at 1, so the app adds it to the stored count, which lives in `localStorage` and follows changes made in other tabs. The cart request itself is never cached.
- **Search:** it filters in memory on every keystroke, as the brief asks. With 100 products already loaded there is no network call to save, so there is no debounce and no minimum length. Every word must appear in the brand or the model, ignoring case and accents. The query is kept in the URL (`?q=`), so it survives a reload and the way back from a product.
- **API quirks:** `displayResolution` brings the inches and `displaySize` the pixels, so each value is shown under the right label. `secondaryCmera` and `dimentions` are read as spelt by the API. Products without a price show "Price on request", and missing specs show "Not specified".
- **Selectors:** storage and colour are radio groups; a group with a single option starts selected, and _Add_ stays disabled until both are chosen.
- **Errors:** a product that does not exist gets its own page; a network failure shows a retry button instead.
- **Layout:** one to four products per row depending on the width; on the details page the image and the description sit side by side from 768 px up.
