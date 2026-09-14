# GEN-ZZ CLUB — Custom T-Shirt Website

A fast, mobile-first website for a customized T-shirt brand. Visitors browse
products, customize a tee, and place the order through WhatsApp.

---

## 1. What you need installed

- [Node.js](https://nodejs.org) (version 20 or newer)
- [VS Code](https://code.visualstudio.com) (or any code editor)

## 2. Run it on your computer

Open the project folder in VS Code, then open the terminal
(**Terminal → New Terminal**) and run:

```bash
npm install       # only needed the first time
npm run dev
```

The terminal prints a link like `http://localhost:8080`. Open it in your browser.
Leave the terminal running while you work — the page updates as you save files.

To stop it, press `Ctrl + C` in the terminal.

---

## 3. Change your business details

**Everything about your business lives in one file:**

```
src/config/site.ts
```

Open it and edit the values between the quote marks:

| What to change     | Line to edit       | Notes                                                    |
| ------------------ | ------------------ | -------------------------------------------------------- |
| WhatsApp number    | `whatsappNumber`   | Country code + number, digits only. India: `919876543210` |
| Email address      | `email`            | Your official business email                              |
| Instagram link     | `instagramUrl`     | Full link, e.g. `https://instagram.com/yourname`          |
| Instagram handle   | `instagramHandle`  | The `@name` shown as text                                 |
| Business hours     | `businessHours`    | Free text                                                 |
| Brand name         | `businessName`     | Appears in the logo and in WhatsApp messages              |

> The file currently contains **placeholder** values. Replace them before going
> live. Changing the number here updates every WhatsApp button on the website.

---

## 4. Add or edit products

Open:

```
src/data/products.ts
```

Copy an existing block and change the values:

```ts
{
  id: "my-new-tee",            // lowercase, no spaces — used in the web address
  name: "My New Tee",
  category: "custom",           // custom | couple | friendship | birthday | college | events
  description: "Short description shown on the card.",
  image: teeBlack,              // see "Change images" below
  imageAlt: "Description of the photo for screen readers",
  price: 499,                   // starting price in rupees
  colours: ["Black", "White"],
  sizes: defaultSizes,
  customization: "What can be customized on this tee.",
}
```

**Change a price:** edit the `price` number.
**Remove a product:** delete its whole block (from `{` to `},`).
**Change which products appear on the home page:** edit `featuredProductIds`
near the bottom of the same file.

## 5. Change images

1. Put your photo in `src/assets/` (e.g. `src/assets/my-tee.jpg`).
2. At the top of `src/data/products.ts`, add:
   ```ts
   import myTee from "@/assets/my-tee.jpg";
   ```
3. Use `image: myTee,` in the product.

Square-ish or portrait photos work best. If an image is missing, the site shows
a tidy "Image coming soon" placeholder instead of a broken picture.

## 6. Change text on the pages

| Page           | File to edit            |
| -------------- | ----------------------- |
| FAQ questions  | `src/data/faq.ts`       |
| About text     | `src/data/about.ts`     |
| How it works   | `src/data/steps.ts`     |
| Home categories| `src/data/categories.ts`|
| Sizes & colours| `src/data/products.ts` (`defaultSizes`, `defaultColours`) |

Page headings and other page-specific wording live in the matching file inside
`src/routes/` (e.g. `src/routes/about.tsx`).

---

## 7. Build for production

```bash
npm run build
```

## 8. Publishing

The fastest option is the **Publish** button in Lovable — it builds and hosts
the site, and direct page links work automatically.

To host it elsewhere, run `npm run build` and deploy the generated output
folder. This project uses TanStack Start, so the host must support a Node or
edge server runtime (Netlify, Vercel and Cloudflare all do). No extra redirect
file is needed for page links to work.

---

## 9. Things to know

- **No backend, no database, no accounts.** Orders arrive as WhatsApp messages.
- **No secret keys anywhere.** Everything in this project is safe to be public.
- **Files chosen on the Customize page are not uploaded.** The page says so
  clearly and asks the customer to attach the file in the WhatsApp chat.
- **Placeholder content** is marked in `src/config/site.ts`. No fake reviews,
  addresses, phone numbers or guarantees have been added anywhere.

## 10. Project layout

```
src/
├── assets/       product and hero photos
├── components/   reusable pieces (navbar, footer, product card, …)
├── config/       site.ts — your business details
├── data/         products, FAQ, about text, steps, categories
├── routes/       one file per page
├── utils/        WhatsApp message builders
└── styles.css    colours, fonts and shared styles
```
