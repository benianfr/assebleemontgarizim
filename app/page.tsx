import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Events from "@/components/Events";
import Sermons from "@/components/Sermons";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Events />
        <Sermons />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
