import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import { playChatSound } from "../common/soundEffect";
import axiosInstance from "../common/axiosConfig";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Close chat on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Close chat on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const sendToSlack = async (message: string) => {
    try {
      const response = await axiosInstance.post("/slack/send-message", {
        message,
      });
      if (!response.data.success)
        console.error("Slack error:", response.data.error);
    } catch (error) {
      console.error("Slack send error:", error);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { text: inputValue, isBot: false }]);
    setInputValue("");
    sendToSlack(inputValue);

    setIsBotTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      setIsBotTyping(false);
      playChatSound();
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi"))
      return "Hello! How can I assist you today?";
    if (msg.includes("help"))
      return "Sure! I'm here to help. What do you need assistance with?";
    if (msg.includes("thank")) return "You're welcome! 😊";
    return "I'm sorry, I didn't understand that. Could you clarify?";
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-[#0077B5] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#005f8d] transition-all duration-300 hover:shadow-xl"
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            className="absolute bottom-16 right-0 w-96 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0077B5] to-[#005f8d] text-white px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold tracking-tight">Chatbot</h3>
              <button
                onClick={toggleChat}
                className="hover:text-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto bg-gray-50">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start"
                >
                  <Bot size={18} className="text-[#0077B5] mr-2 mt-1" />
                  <div className="bg-white p-3 rounded-lg text-sm text-gray-900 shadow-md">
                    How can I assist you today?
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      message.isBot ? "items-start" : "justify-end"
                    }`}
                  >
                    {message.isBot && (
                      <Bot size={18} className="text-[#0077B5] mr-2 mt-1" />
                    )}
                    <div
                      className={`p-3 rounded-lg text-sm max-w-[75%] shadow-md ${
                        message.isBot
                          ? "bg-white text-gray-900"
                          : "bg-[#0077B5] text-white"
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isBotTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start"
                >
                  <Bot size={18} className="text-[#0077B5] mr-2 mt-1" />
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B5] transition-all duration-200"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#0077B5] text-white px-5 py-2 rounded-full hover:bg-[#005f8d] transition-all duration-200 shadow-md"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Chatbot;
