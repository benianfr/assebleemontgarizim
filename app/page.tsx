import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Events from "@/components/Events";
import Sermons from "@/components/Sermons";
import Testimonials from "@/components/Testimonials";
import Cta from "@/components/Cta";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <div className="ridge-divider">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "70px", display: "block" }}
          >
            <path
              d="M0 90 L0 55 L200 20 L360 60 L520 10 L700 55 L880 25 L1060 60 L1220 15 L1440 45 L1440 90 Z"
              fill="#EAF2FB"
            />
          </svg>
        </div>
        <Events />
        <Sermons />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
