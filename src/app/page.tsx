import HeroSection from "@/components/HeroSection";
import PromiseSection from "@/components/PromiseSection";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/FooterSection";
import Testimonials from "@/components/Testimonials";
import BuyNow from "@/components/BuyNow"; // 👈 new import

export default function Home() {
  return (
    <main className="main-container">
      <NavBar />
      <HeroSection />

      <section className="PromiseSection">
        <PromiseSection />
      </section>
      <section id="testimonials" className="testimonials-section">
        <Testimonials/>
      </section>
      <BuyNow /> {/* 👈 New Buy Now section */}
     
      <FooterSection /> {/* 👈 Contact now stands on its own */}
      
    </main>
  );
}

