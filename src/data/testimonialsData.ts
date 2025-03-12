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
    name: "Jane Doe",
    jobTitle: "Marketing Manager",
    company: "ABC Corp",
    testimonial: "The analytics service transformed our marketing strategy.",
    services: "Website Analytics",
    image: "/images/testimonials/jane-doe.jpg", // ✅ Example image
  },
  {
    id: 2,
    name: "John Smith",
    jobTitle: "CEO",
    company: "XYZ Ltd",
    testimonial: "Data visualization provided clear insights for our business.",
    services: "Data Visualisation & Reporting",
  }, // ✅ No image for this testimonial
];

export default testimonialsData;
