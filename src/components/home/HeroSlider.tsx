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

  // Smoother animation variants
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
          stiffness: 250,
          damping: 25,
          mass: 0.5,
        },
        opacity: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-50%" : "50%",
      opacity: 0,
      transition: {
        x: {
          type: "spring",
          stiffness: 250,
          damping: 25,
          mass: 0.5,
        },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  return (
    <div
      className="relative w-full h-[50vh] min-h-[300px] overflow-hidden "
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
          className="absolute inset-0 flex flex-col lg:flex-row"
        >
          {/* Content (Left 60%) */}
          <div className="w-full lg:w-[60%] h-[60%] lg:h-full flex flex-col justify-center p-6 md:p-8 lg:p-12 ">
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4"
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8"
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {slides[currentSlide].description}
            </motion.p>

            <motion.button
              className="self-start px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base"
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {slides[currentSlide].cta}
            </motion.button>
          </div>

          {/* Image (Right 40%) */}
          <div className="w-full lg:w-[40%] h-[40%] lg:h-full relative">
            <motion.img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-contain object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            />
            {/* <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-black/30" /> */}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 sm:p-2 rounded-full shadow-md hover:shadow-lg z-10 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 sm:p-2 rounded-full shadow-md hover:shadow-lg z-10 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
        {slides.map((slide, index) => (
          <motion.button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-primary w-6 sm:w-8"
                : "bg-gray-300 w-2 sm:w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
