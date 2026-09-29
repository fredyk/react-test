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
npm install      # install dependencies
npm start        # development mode
npm run build    # production build into dist/
npm test         # run the test suite
npm run lint     # ESLint and Prettier checks
```

## API

Base URL: `https://itx-frontend-test.onrender.com/`

| Method | Path               | Purpose                                        |
| ------ | ------------------ | ---------------------------------------------- |
| GET    | `/api/product`     | Product list                                   |
| GET    | `/api/product/:id` | Product details                                |
| POST   | `/api/cart`        | Add to cart (`{ id, colorCode, storageCode }`) |
