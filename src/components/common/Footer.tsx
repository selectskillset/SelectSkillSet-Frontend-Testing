import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Linkedin, Twitter, Mail } from "lucide-react";
import logo from "../../images/selectskillset_logo_test5-removebg-preview.png";

const Footer: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleClick = () => {
    const messages = [
      "You're 5 steps ahead to login",
      "You're 4 steps ahead to login",
      "You're 3 steps ahead to login",
      "You're 2 steps ahead to login",
      "You're 1 step ahead to login",
    ];

    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 10 && newCount <= 14) {
        toast(messages[newCount - 10]);
      }
      if (newCount === 15) {
        toast("Redirecting...", { icon: "🚀" });
        setTimeout(() => navigate("/admin/login"), 1000);
      }
      return newCount;
    });
  };

  return (
    <footer className="bg-white text-[#0077B5] border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-around items-center mb-12">
          <div
            onClick={handleClick}
            className="cursor-pointer mb-8 md:mb-0 relative group"
          >
            <img
              src={logo}
              alt="SelectSkillset Logo"
              className="w-auto h-24 transition-transform duration-300 
                group-hover:scale-105 group-active:scale-95"
            />
            <div
              className={`absolute inset-0 bg-white/30 rounded-full 
                transition-all duration-300 ${
                  clickCount > 0 ? "scale-150 opacity-100" : "scale-0 opacity-0"
                }`}
            />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            <div>
              <h3 className="font-medium text-lg mb-4">About Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-[#004182] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/report-issue"
                    className="hover:text-[#004182] transition-colors"
                  >
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/terms-and-conditions"
                    className="hover:text-[#004182] transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/login"
                    className="hover:text-[#004182] transition-colors"
                  >
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Link
                  to="https://www.linkedin.com/company/selectskillset"
                  target="_blank"
                  className="hover:text-[#004182] transition-colors"
                >
                  <Linkedin size={24} />
                </Link>
                <Link
                  to="https://twitter.com/selectskillset"
                  target="_blank"
                  className="hover:text-[#004182] transition-colors"
                >
                  <Twitter size={24} />
                </Link>
                <Link
                  to="mailto:support@selectskillset.com"
                  className="hover:text-[#004182] transition-colors"
                >
                  <Mail size={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} SELECTSKILLSET. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
