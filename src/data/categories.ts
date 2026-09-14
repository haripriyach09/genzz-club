/** Home page category cards. Edit labels, blurbs and links here. */

export type CategoryCardData = {
  label: string;
  blurb: string;
  /** Either a shop filter value, or a route for Bulk Orders. */
  to: "/shop" | "/bulk-orders";
  filter?: string;
};

export const homeCategories: CategoryCardData[] = [
  { label: "CUSTOM", blurb: "Your idea, printed", to: "/shop", filter: "custom" },
  { label: "COUPLES", blurb: "Matching pairs", to: "/shop", filter: "couple" },
  { label: "FRIENDS", blurb: "Squad sets", to: "/shop", filter: "friendship" },
  { label: "BIRTHDAY", blurb: "Made for the day", to: "/shop", filter: "birthday" },
  { label: "COLLEGE", blurb: "Batch & club tees", to: "/shop", filter: "college" },
  { label: "EVENTS", blurb: "Fests & launches", to: "/shop", filter: "events" },
  { label: "BULK ORDERS", blurb: "10 pieces and up", to: "/bulk-orders" },
];
