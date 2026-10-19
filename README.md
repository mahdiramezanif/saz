# SAZ Store — Frontend

A Persian-language, right-to-left storefront built with **Next.js 15** and **React 19**. It fetches a product catalog from a separate backend and includes a simple product selection and checkout flow.

> **Project status:** Learning/demo project. The payment flow and login implementation have not been verified as production-ready.

## Features
- Product cards with images, descriptions, and prices in toman
- Client-side item selection and total-price calculation
- Registration and username-based login forms
- Checkout request that redirects to a payment URL returned by the backend
- Persian RTL interface using the Vazirmatn font

## Tech stack
Next.js, React, JavaScript, CSS; backend: Express/MongoDB in [sazback](https://github.com/mahdiramezanif/sazback).

## Run locally

**Requirements:** Node.js and npm.

```bash
git clone https://github.com/mahdiramezanif/saz.git
cd saz
npm install
npm run dev
```

Open http://localhost:3000.

**Backend configuration:** API URLs are currently hard-coded in [`src/app/page.js`](src/app/page.js) to `https://sazkala.liara.run/api`. To use a local server, replace those URLs or refactor them to use a `NEXT_PUBLIC_API_URL` environment variable. The frontend will not automatically connect to your local backend.

## Known limitations
- The cart allows duplicate items but does not provide quantity or removal controls.
- Authentication is currently username-only; do not use it to protect real accounts.
- The checkout flow depends on the backend and an external payment provider; do not assume transactions work without configuring and fixing the API.
- The page metadata is placeholder text and should be customized.

## Related repository
[SAZ backend/API](https://github.com/mahdiramezanif/sazback)
