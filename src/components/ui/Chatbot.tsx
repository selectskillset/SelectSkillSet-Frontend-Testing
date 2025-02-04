import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import { playChatSound } from "../common/soundEffect";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    setMessages((prev) => [...prev, { text: inputValue, isBot: false }]);
    setInputValue("");

    setIsBotTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      setIsBotTyping(false);
      playChatSound();
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I assist you today?";
    } else if (lowerCaseMessage.includes("help")) {
      return "Sure! I'm here to help. What do you need assistance with?";
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! 😊";
    } else {
      return "I'm sorry, I didn't understand that. Could you clarify?";
    }
  };

  return (
    <motion.div
      className="fixed bottom-20 right-10 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={toggleChat}
        className="bg-gradient-to-br from-[#0077B5] to-[#005f99] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
      >
        <Bot size={35} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0077B5] to-[#005f99] text-white px-4 py-3 flex justify-between items-center">
              <h3 className="text-sm font-semibold">Chatbot</h3>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition"
              >
                <X />
              </button>
            </div>

            {/* Chat Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Initial Greeting */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start"
                >
                  <Bot size={20} className="text-[#0077B5] mr-2" />
                  <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
                    How can I help you?
                  </div>
                </motion.div>
              )}

              {/* Chat Messages */}
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.isBot ? "items-start" : "items-end justify-end"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot size={20} className="text-[#0077B5] mr-2" />
                    ) : null}
                    <div
                      className={`${
                        message.isBot
                          ? "bg-gray-100 text-gray-700"
                          : "bg-[#0077B5] text-white"
                      } p-3 rounded-lg text-sm max-w-[70%]`}
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
                  transition={{ duration: 0.3 }}
                  className="flex items-start"
                >
                  <Bot size={20} className="text-[#0077B5] mr-2" />
                  <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Field */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-br from-[#0077B5] to-[#005f99] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
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
