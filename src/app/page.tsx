import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CookieChestSection from "@/components/CookieChestSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <ServicesSection />
      <CookieChestSection />
      <Testimonials />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
