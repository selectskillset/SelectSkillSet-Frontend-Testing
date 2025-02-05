import construction from "../../images/construction.gif";

const FeatureAnimation = () => {
  return (
    <div className="min-h-[90vh]  flex flex-col lg:flex-row justify-center items-center text-white">
      {/* Left Section: Message */}
      <div className="lg:w-1/2 text-center lg:text-left px-8 lg:px-16 mb-8 lg:mb-0 text-[#0077B5]">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          We're working on something amazing!
        </h1>
        <p className="text-lg sm:text-xl font-medium mb-6">
          Our team is crafting new features to enhance your experience. Stay
          tuned for updates that will take your journey to the next level.
        </p>
        <p className="text-base sm:text-lg">
          In the meantime, feel free to explore our existing features or reach
          out to us with your thoughts and ideas.
        </p>
      </div>

      {/* Right Section: Animation */}
      <div className=" w-full max-w-xl ">
        <img
          src={construction}
          alt="Under Construction"
          className="w-full h-auto rounded-lg shadow-lg animate-bounce-slow"
        />
      </div>
    </div>
  );
};

export default FeatureAnimation;
