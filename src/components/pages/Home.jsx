import ExplifiedCTA from "../sections/ExplifiedCTA";
import ExplifiedSection from "../sections/ExplifiedSection";
import Hero from "../sections/Hero";
// import IntegrationScroller from "../sections/IntegrationScroller";
import PerformanceSection from "../sections/performanceSection";
import ProductShowcase from "../sections/Tools";
import WhyChooseExplified from "../sections/WhyChoose";
import ContentLabs from "./ContentLabs";
import IndustriesPage from "./Industries";


export default function Home() {
  return (
    <>
      <Hero />
      <IndustriesPage/>
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[100px] bg-primary/20 blur-[60px]" />
      </div>
     <ProductShowcase/>
      <ContentLabs/>
      <ExplifiedCTA />
      
    </>
  );
}