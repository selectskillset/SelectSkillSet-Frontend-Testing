import { Hero } from "./Hero";
import  Features  from "./Features";

import CallToAction from "./CallToAction";
// import SliderCards from "./SliderCards";
import AboutUsComponent from "./AboutUsComponent";

export const HomePage = () => {
  return (
    <div className="bg-[#F3F2EF]">
      <Hero />
      {/*<LandingFeature />*/}
      <AboutUsComponent />
      {/* <SliderCards /> */}
      <Features />
      {/* <Statistics /> */}
      <CallToAction />
    </div>
  );
};
