# JobsOxo Supply

A demo e-commerce store for plastering tools and materials. **This is a test site.** It has no real inventory, and it can't take real payments or process real orders.

Built with Next.js (App Router), TypeScript, and Tailwind CSS. Products live in a JSON file, the cart is saved in the browser, and checkout uses Stripe in test mode, with a mock payment form when no keys are set.

## Getting started

You need Node.js 20.9 or later.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The whole site works with no configuration, using the mock payment form.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Serves the production build |
| `npm run lint` | Runs ESLint, including the catalog import rules |

## Environment variables

All of these are optional. To set them locally, copy the example file and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Purpose | If it's not set |
| --- | --- | --- |
| `SITE_URL` | Base URL for absolute links in the feeds, such as `https://shop.example.com` | Uses Vercel's production URL, then the current deployment's URL, then `http://localhost:3000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe test publishable key (`pk_test_...`) | Uses the mock payment form |
| `STRIPE_SECRET_KEY` | Stripe test secret key (`sk_test_...`) | Uses the mock payment form |

These values are read at build time, so restart `npm run dev` or redeploy after changing them. `.env.local` is ignored by Git, so keys stay out of the repository.

## Payments

Which payment form appears depends on your keys:

- **Both keys are test keys:** the payment page uses the Stripe Payment Element.
- **Keys are missing, live, or only one is set:** the payment page uses the mock form. Its fields are locked, so it collects no card details, and it always succeeds.

Live keys are ignored on purpose, so this site can't take real money by accident.

The server calculates the charge from the catalog. The browser sends only product IDs and quantities, so it can't change the price.

Stripe test cards, which work with any future expiry date and any 3-digit CVC:

| Card number | Result |
| --- | --- |
| `4242 4242 4242 4242` | Succeeds |
| `4000 0000 0000 0002` | Declined |
| `4000 0027 6000 3184` | Asks for 3D Secure authentication |

Get test keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys).

## Deploying to Vercel

The project needs no `vercel.json` or custom build settings.

1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repository.
2. Leave the detected Next.js settings as they are.
3. Optionally, add the environment variables listed above.
4. Click **Deploy**.

To deploy from the command line instead:

```bash
npx vercel
```

```bash
npx vercel --prod
```

Good to know:

- **Redeploy after changing environment variables.** The payment form and feeds are generated at build time.
- **Set `SITE_URL` if you use a custom domain** and want an exact address in the feeds. Otherwise, the feeds use Vercel's shortest production domain from the latest build.
- **Preview URLs are protected.** Vercel's default Standard Protection covers every deployment except production domains, so services such as Meta can't fetch a feed from a preview URL.

## Project structure

```text
catalog/        Product data, schema types, and feed generators
  products.json   The single source of truth for products
  categories.json The four storefront categories
  index.ts        Public API for server code
  client.ts       Browser-safe exports
  validate.ts     Data checks that run when the catalog loads
  feeds/          One generator per feed format
app/            Pages and API routes
components/     UI components, grouped by feature
lib/            Cart storage, checkout state, and Stripe configuration
```

`/catalog` is self-contained. Lint fails if it imports app code, or if the storefront imports anything from it other than `@/catalog` and `@/catalog/client`.

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/products/[slug]` | Category page |
| `/product/[slug]` | Product detail page |
| `/cart` | Cart |
| `/checkout` | Contact and shipping form |
| `/checkout/payment` | Payment |
| `/checkout/success` | Order confirmation |
| `/api/feed/products.json` | Full JSON feed |
| `/api/feed/meta.csv` | Meta catalog CSV feed |

## Product catalog

Every page and feed reads from `catalog/products.json`, so that's the only place you edit products.

### Feed schema

These fields follow Meta's catalog format, so the data can be reused for other feeds.

| Field | Required | Format |
| --- | --- | --- |
| `id` | Yes | Unique SKU, such as `JOX-TRW-001` |
| `title` | Yes | Product name. Meta recommends under 65 characters |
| `description` | Yes | Plain text, no HTML |
| `availability` | Yes | `in stock` or `out of stock`. Must agree with `inventory` |
| `condition` | Yes | `new` |
| `price` | Yes | Amount with two decimals and currency, such as `24.99 USD`. USD only |
| `sale_price` | No | Same format, and lower than `price` |
| `link` | Generated | **Don't store this.** It's built as `SITE_URL` + `/product/[slug]` |
| `image_link` | Yes | Site-relative path or full URL. Served as an absolute URL |
| `additional_image_link` | No | Array of paths or URLs |
| `brand` | Yes | `JobsOxo Supply` |
| `product_type` | Yes | Category path, such as `Plastering Tools > Trowels` |
| `google_product_category` | Yes | An entry from [Google's product taxonomy](https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt) |
| `item_group_id` | No | Shared by variants of one product. Must differ from every `id` |
| `inventory` | Yes | Whole number, 0 or higher |

Storefront-only fields sit under `custom`, which is left out of the CSV feed:

| Field | Format |
| --- | --- |
| `slug` | Lowercase words joined by hyphens. Must be unique |
| `category_slug` | A `slug` from `categories.json` |
| `short_description` | One line for product cards |
| `specs` | Key-value pairs shown in the specs table |

### Adding or editing a product

1. Open `catalog/products.json`.
2. Edit an entry, or copy one and give it a new `id` and `custom.slug`.
3. Set `image_link`. Use `/placeholder/<id>.png` to get a generated placeholder, a file you've added to `public/`, or a full image URL.
4. Run `npm run build`, or just save if `npm run dev` is running.
5. Commit and deploy.

A mistake such as a malformed price or duplicate ID stops the build with a message naming the product and the problem.

### Variants

Give products the same `item_group_id` to link them, as with the three finishing trowel sizes. Each variant keeps its own `id`, `slug`, and page. The size picker labels each one using the first spec that differs across the group.

## Feeds

Both feeds are generated from `/catalog` at build time, so changes appear after the next build or deploy.

- **`/api/feed/products.json`** has every field, including `custom`, with absolute URLs.
- **`/api/feed/meta.csv`** has one row per product and no `custom` data. The `inventory` field is exported as `quantity_to_sell_on_facebook`, the name Meta now recommends.

### Connecting Meta Commerce Manager

First deploy to production, and open your feed URL in a browser to confirm it loads. Use your production domain, not a preview URL:

```text
https://your-production-domain/api/feed/meta.csv
```

Then, in [Commerce Manager](https://www.facebook.com/commerce_manager):

1. Select your catalog.
2. Open the **Catalog** tab and go to **Data sources**.
3. Click **+ Add** and select **Data file**.
4. Keep **Commerce Manager** selected as the file format.
5. Choose **Use a URL or Google Sheets** and enter your feed URL.
6. Click **Next**. The columns should match without any changes.
7. Name the feed and choose USD as the default currency.
8. Choose an hourly, daily, or weekly upload schedule.
9. Click **Upload**, then check the summary in **Data sources** for errors.

Good to know:

- **Replacing an image needs a new URL.** Meta won't fetch a new image from an address it already knows.
- **Placeholder images are for testing only.** Meta advises against placeholders, so use real product photos before running ads.
- **Meta Shops needs your own domain.** Product links must be on a domain owned by your business, so a `vercel.app` address may not qualify.
- **Images must be JPEG or PNG,** at least 500 x 500 pixels and under 8 MB. The generated placeholders meet this. SVG isn't accepted.

### Adding another feed

Add a generator to `catalog/feeds/`, export it from `catalog/index.ts`, and add a route under `app/api/feed/`. Use `catalog/feeds/meta-csv.ts` as the model. The catalog already includes `google_product_category`, so a Google Merchant Center feed needs no new product data.

## Limitations

This is a demo, so some things are deliberately simple:

- There's no database. Orders aren't saved anywhere, and stock doesn't go down after a purchase.
- Order totals have no shipping or tax.
- Checkout supports US addresses and USD only.
- Checkout details are kept in the browser tab and clear when it closes.
