import { Hero } from "./Hero";
import Features from "./Features";

import CallToAction from "./CallToAction";
// import SliderCards from "./SliderCards";
import HeroSlider from "./HeroSlider";
import CommunitySpotlight from "./CommunitySpotlight";
import JourneyShowcase from "./JourneyShowcase";
// import CareerCloud from "./CareerCloud";

export const HomePage = () => {
  return (
    <div className="">
      <Hero />
      {/*<LandingFeature />*/}
      <HeroSlider />
      {/* <CareerCloud/> */}
      {/* <SliderCards /> */}
      <CommunitySpotlight/>
      <JourneyShowcase/>
      <Features />
      {/* <Statistics /> */}
      <CallToAction />
    </div>
  );
};
