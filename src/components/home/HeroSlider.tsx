import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import team from "../../images/team.svg";
import career from "../../images/career.svg";
import skills from "../../images/Soft skills-amico.svg";
import tech from "../../images/Digital transformation-bro.svg";

const slides = [
  {
    id: 1,
    title: "Empowering Tech Careers Through Expert Guidance",
    description:
      "Join professionals mastering in-demand skills with industry-proven methodologies",
    image: team,
    cta: "Learn More",
  },
  {
    id: 2,
    title: "Transform Your Career Journey",
    description:
      "Comprehensive tools for every stage of your professional development",
    image: career,
    cta: "Get Started",
  },
  {
    id: 3,
    title: "Skill Development",
    description: "Expert-curated learning paths tailored to your career goals",
    image: skills,
    cta: "Explore Paths",
  },
  {
    id: 4,
    title: "Tailored Solutions for Tech Ecosystem",
    description:
      "Connecting talent with opportunity through specialized platforms",
    image: tech,
    cta: "Discover Solutions",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slides with pause on hover
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isHovered]);

  const goToNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Enhanced animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.7,
        },
        opacity: { duration: 0.5 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-40%" : "40%",
      opacity: 0,
      transition: {
        x: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.7,
        },
        opacity: { duration: 0.4 },
      },
    }),
  };

  const contentVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15 + 0.2,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div
      className="relative w-full h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slides[currentSlide].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex flex-col lg:flex-row px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
        >
          {/* Content (Left 60%) */}
          <div className="w-full lg:w-[55%] h-[55%] lg:h-full flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 space-y-4 md:space-y-6">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {slides[currentSlide].title}
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl"
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {slides[currentSlide].description}
            </motion.p>

            {/* <motion.div
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="pt-2"
            >
              <button
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium group"
              >
                <span className="flex items-center gap-2">
                  {slides[currentSlide].cta}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div> */}
          </div>

          {/* Image (Right 45%) - Adjusted for better proportions */}
          <div className="w-full lg:w-[45%] h-[45%] lg:h-full relative flex items-center justify-center">
            <motion.div
              className="relative w-full h-full max-w-xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.33, 1, 0.68, 1],
                delay: 0.3,
              }}
            >
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-contain object-center"
                loading="lazy"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 mix-blend-lighten" /> */}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl z-10 transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl z-10 transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
        {slides.map((slide, index) => (
          <motion.button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-primary w-8 sm:w-10"
                : "bg-gray-300 w-3 sm:w-4 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            whileHover={{ scaleY: 1.5 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
