import { Hero } from "./Hero";
import Features from "./Features";

import CallToAction from "./CallToAction";
// import SliderCards from "./SliderCards";
import AboutUsComponent from "./AboutUsComponent";
// import CareerCloud from "./CareerCloud";

export const HomePage = () => {
  return (
    <div className="">
      <Hero />
      {/*<LandingFeature />*/}
      <AboutUsComponent />
      {/* <CareerCloud/> */}
      {/* <SliderCards /> */}
      <Features />
      {/* <Statistics /> */}
      <CallToAction />
    </div>
  );
};
