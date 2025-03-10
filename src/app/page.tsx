import HeroSection from "@/components/HeroSection";
import ServiceSelection from "@/components/ServiceSelection";
import NavBar from "@/components/NavBar";
import ContactForm from "@/components/ContactForm";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="main-container">
      <NavBar />
      <HeroSection />

      <section className="service-section">
        <ServiceSelection />
      </section>

      <section id="testimonials" className="testimonials-section">
        <Testimonials />
      </section>

      <section id="contact" className="contact-section">
        <ContactForm />
      </section>
    </main>
  );
}
