import React from "react";
import construction from "../../images/construction.gif";
import { ArrowRight, MessageCircle } from "lucide-react";

const FeatureAnimation = () => {
  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="container mx-auto px-6 lg:px-24 py-20 flex flex-col lg:flex-row items-center justify-center">
        {/* Left Section: Message */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1
            className="text-4xl md:text-5xl font-extrabold 
                       bg-clip-text text-transparent 
                       bg-gradient-to-r from-primary to-secondary mb-6"
          >
            Building something awesome!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Our team is working tirelessly to bring you new features that will:
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Enhance your learning experience",
              "Streamline your workflow",
              "Boost your professional growth",
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <ArrowRight className="text-primary w-6 h-6" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <button
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary 
                       text-white rounded-lg hover:scale-105 transition-transform 
                       shadow-lg flex items-center space-x-2 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Share your ideas</span>
          </button>
        </div>

        {/* Right Section: Animation */}
        <div className="w-full lg:w-1/2 pl-0 lg:pl-16">
          <div className="relative max-w-lg mx-auto lg:mx-0">
            <img
              src={construction}
              alt="Under Construction"
              className="w-full rounded-lg shadow-xl"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-white/50 
                          pointer-events-none rounded-3xl"
            />
            <div className="absolute bottom-4 right-4">
              <div
                className="bg-white/80 backdrop-blur p-3 rounded-lg 
                            shadow-lg flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="text-sm text-gray-700 font-medium">
                  Active development
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAnimation;