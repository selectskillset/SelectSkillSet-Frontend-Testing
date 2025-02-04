import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Linkedin, Twitter, Mail } from "lucide-react"; // Lucide icons

const Footer: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  // Reset click count after 2 seconds of inactivity
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  // Handle click logic for Easter egg
  const handleClick = () => {
    const messages = [
      "You're 5 steps ahead to login",
      "You're 4 steps ahead to login",
      "You're 3 steps ahead to login",
      "You're 2 steps ahead to login",
      "You're 1 step ahead to login",
    ];

    setClickCount((prev) => prev + 1);

    if (clickCount >= 9 && clickCount <= 13) {
      toast(messages[clickCount - 9]);
    }

    if (clickCount === 14) {
      toast("Redirecting...", { icon: "🚀" });
      setTimeout(() => navigate("/admin/login"), 1000);
    }
  };

  return (
    <footer className="bg-white text-[#0077B5] shadow-lg py-8 mt-auto ">
      <div className="container mx-auto px-8">
        {/* Logo with Easter Egg */}
        <div className="flex justify-center mb-8">
          <h1
            onClick={handleClick}
            className="text-2xl font-bold cursor-pointer relative select-none transition-transform duration-300 hover:scale-105"
          >
            SELECTSKILLSET
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white opacity-50 rounded-full ${
                clickCount > 0 ? "scale-150" : "scale-0"
              }`}
              style={{
                width: "150%",
                height: "150%",
                transition: "all 0.3s ease-in-out",
              }}
            ></span>
          </h1>
        </div>

        {/* Grid Layout for Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About Us Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">About us</h2>
            <ul className="space-y-2">
              {["Careers", "Employer home", "Sitemap", "Credits"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className=" hover:text-[#0077B5] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Help Center Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Help center</h2>
            <ul className="space-y-2">
              {["Summons/Notices", "Grievances", "Report issue"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-[#0077B5] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Policy Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Privacy policy</h2>
            <ul className="space-y-2">
              {["Terms & conditions", "Fraud alert", "Trust & safety"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-[#0077B5] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Connect with Us Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Connect with us</h2>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/selectskillset"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0077B5] transition-colors duration-300"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://twitter.com/selectskillset"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0077B5] transition-colors duration-300"
              >
                <Twitter size={24} />
              </a>
              <a
                href="mailto:support@selectskillset.com"
                className="hover:text-[#0077B5] transition-colors duration-300"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center border-t border-gray-200 pt-6">
          <p className="text-sm">
            © {new Date().getFullYear()} SELECTSKILLSET. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
