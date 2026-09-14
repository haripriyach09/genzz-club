/** FAQ content. Edit questions and answers freely — keep answers honest. */

export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "How do I order a custom T-shirt?",
    answer:
      "Pick a product or open the Customize page, choose your colour, size and quantity, describe your design, then tap the WhatsApp button. Your selections arrive as a ready-made message. We reply with pricing and confirm everything before printing.",
  },
  {
    question: "Can I send my own design?",
    answer:
      "Yes. Send your artwork directly in the WhatsApp chat. PNG, JPG, PDF or vector files all work — the higher the resolution, the sharper the print.",
  },
  {
    question: "Can I print a photo?",
    answer:
      "Yes. Photo prints work best with a clear, high-resolution original. Send the photo on WhatsApp and we'll tell you honestly how it will look before you pay.",
  },
  {
    question: "What sizes are available?",
    answer:
      "XS to XXL on most products. If you need a size outside that range, ask on WhatsApp and we'll check availability.",
  },
  {
    question: "What T-shirt colours are available?",
    answer:
      "Commonly Black, White, Beige, Navy, Olive and Grey. Availability can vary by product and by stock, so we confirm your colour when you place the order.",
  },
  {
    question: "How long does customization take?",
    answer:
      "Timelines depend on the design, the quantity and current workload. We share an estimated timeline on WhatsApp before you confirm the order.",
  },
  {
    question: "Do you accept bulk orders?",
    answer:
      "Yes — college groups, friend groups, events, clubs, startups and companies. Use the Bulk Orders page to send us your requirements and we'll quote you.",
  },
  {
    question: "Do you deliver across India?",
    answer:
      "We currently deliver across South India, including Karnataka, Tamil Nadu, Kerala, and Andhra Pradesh. Delivery availability may vary by location — contact us on WhatsApp to confirm.",
  },
  {
    question: "How do I send my design?",
    answer:
      "Through WhatsApp. Every order starts as a chat, so you can attach files, voice notes or reference images directly in the same conversation.",
  },
  {
    question: "Can I change my order after payment?",
    answer:
      "Message us as soon as possible. If printing hasn't started, we'll do our best to make the change. Once a personalised item is in production, changes may not be possible.",
  },
  {
    question: "Can customized products be returned?",
    answer:
      "Personalised items are made for one person, so they generally can't be resold or returned for a change of mind. If there's a printing defect or we send the wrong item, message us with photos and we'll sort it out.",
  },
];
