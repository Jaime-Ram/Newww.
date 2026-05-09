import { LanguageProvider } from "@/lib/LanguageContext";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <div data-theme="light">
        <CustomCursor />
        <Navigation />
        <Hero />
        <Marquee />
        <Work />
        <Comparison />
        <Testimonials />
        <Services />
        <Process />
        <Pricing />
        <About />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
