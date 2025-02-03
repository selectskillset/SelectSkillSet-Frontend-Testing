import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";

const Footer: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 2000);

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

    setClickCount((prev) => prev + 1);

    if (clickCount >= 9 && clickCount <= 13) {
      const messageIndex = clickCount - 9;
      toast(messages[messageIndex]);
      console.log(messages[messageIndex]);
    }

    if (clickCount === 14) {
      toast("Redirecting...", { icon: "🚀" });

      setTimeout(() => {
        navigate("/admin/login");
      }, 1000);
    }
  };

  return (
    <footer className="bg-[#0073b1] text-white py-6">
      <div className="container mx-auto flex flex-col items-center space-y-4">
        <h1
          onClick={handleClick}
          className="text-2xl font-bold cursor-pointer relative select-none"
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
        <p className="text-center text-sm">
          © {new Date().getFullYear()} SELECTSKILLSET. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
