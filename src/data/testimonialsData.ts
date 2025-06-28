interface Testimonial {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  testimonial: string;
  services: string;
  image?: string; // ✅ Optional image field
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Tim Morris",
    jobTitle: "Marketing Manager",
    company: "Dale Hill",
    testimonial: "Working with TMA in the run up to Christmas gave us the tracking clarity we needed. Our consent management was rock-solid and the Looker dashboards made our seasonal performance crystal clear.",
    services: "Website Analytics",
    // image: "/images/testimonials/jane-doe.jpg", // ✅ Example image
  },
  {
    id: 2,
    name: "Dan Taylor",
    jobTitle: "CEO",
    // company: "XYZ Ltd",
    testimonial: "I had no idea how much data was available to me. Dave made the process so simple and I understand so much more about how my site is performing. A real game changer.",
    services: "Data Visualisation & Reporting",
  }, // ✅ No image for this testimonial
];

export default testimonialsData;
