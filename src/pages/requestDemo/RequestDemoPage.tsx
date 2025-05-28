import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Building, Send } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import requestDemo from "../../images/demo.svg";
import axiosInstance from "../../components/common/axiosConfig";

// Animation constants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

const buttonVariants = {
  hover: { scale: 1.02, boxShadow: "0 4px 20px var(--primary-shadow)" },
  tap: { scale: 0.98 },
};

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name is required"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const RequestDemoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/demo/add-request-demo",
        formData
      );

      if (response.data.success) {
        toast.success("Demo request submitted successfully!");
        setFormData({ name: "", email: "", company: "", message: "" });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const FormInput = ({
    id,
    icon: Icon,
    placeholder,
    type = "text",
  }: {
    id: keyof FormData;
    icon: React.ElementType;
    placeholder: string;
    type?: string;
  }) => (
    <motion.div variants={itemVariants} className="space-y-1">
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/80" />
        <input
          type={type}
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          className={`w-full pl-12 pr-4 py-3 text-sm border ${
            errors[id] ? "border-destructive" : "border-muted"
          } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 bg-background`}
          placeholder={placeholder}
          aria-describedby={`${id}-error`}
        />
      </div>
      {errors[id] && (
        <p id={`${id}-error`} className="text-destructive text-xs pl-2">
          {errors[id]}
        </p>
      )}
    </motion.div>
  );

  const FormTextarea = () => (
    <motion.div variants={itemVariants} className="space-y-1">
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={4}
        className="w-full px-4 py-3 text-sm border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-none bg-background"
        placeholder="Additional details about your needs..."
        aria-describedby="message-error"
      />
      {errors.message && (
        <p id="message-error" className="text-destructive text-xs pl-2">
          {errors.message}
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Visual Section */}
          <motion.div
            className="flex items-center justify-center p-4 lg:p-8"
            variants={itemVariants}
          >
            <img
              src={requestDemo}
              alt="Request Demo"
              className="w-full max-w-xl object-contain"
              loading="lazy"
              width={600}
              height={400}
            />
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="bg-card rounded-2xl p-6 sm:p-8 shadow-xl border border-muted"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Schedule Your Personalized Demo
              </h1>
              <p className="text-muted-foreground">
                Discover how our platform can transform your workflow
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput id="name" icon={User} placeholder="Full Name" />
              <FormInput
                id="email"
                icon={Mail}
                placeholder="Work Email"
                type="email"
              />
              <FormInput
                id="company"
                icon={Building}
                placeholder="Company Name"
              />
              <FormTextarea />

              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover={!isLoading ? "hover" : {}}
                whileTap={!isLoading ? "tap" : {}}
                className={`w-full py-3.5 text-sm font-medium rounded-xl transition-all ${
                  isLoading
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="block w-4 h-4 border-2 border-t-transparent border-current rounded-full"
                    />
                    Submitting...
                  </div>
                ) : (
                  <span className="flex items-center text-white justify-center gap-2">
                    Request Demo <Send className="w-4 h-4" />
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestDemoPage;
