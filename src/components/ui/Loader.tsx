import { RefreshCw } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex flex-col items-center gap-2 text-primary"
      >
        <RefreshCw className="animate-spin w-8 h-8" />
        <span>Loading...</span>
      </motion.div>
    </div>
  );
};

export default Loader;
