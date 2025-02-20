import React, { useState } from "react";

const CorporateContactSupport: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>(
    {}
  );

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const newErrors: { subject?: string; message?: string } = {};
    if (!subject.trim()) newErrors.subject = "Subject is required.";
    if (!message.trim()) newErrors.message = "Message is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate form submission
    console.log("Form submitted:", { subject, message });
    alert("Message sent successfully!");
    setSubject("");
    setMessage("");
    setErrors({});
  };

  return (
    <div className="p-6 ">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Contact Support
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Reach out to us for any issues or questions.
      </p>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Field */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.subject ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-[#0A66C2]`}
            placeholder="Enter subject"
            aria-invalid={!!errors.subject}
            aria-describedby="subject-error"
          />
          {errors.subject && (
            <p id="subject-error" className="text-sm text-red-500 mt-1">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-[#0A66C2]`}
            placeholder="Enter your message"
            aria-invalid={!!errors.message}
            aria-describedby="message-error"
          ></textarea>
          {errors.message && (
            <p id="message-error" className="text-sm text-red-500 mt-1">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#0A66C2] text-white px-4 py-2 rounded-lg hover:bg-[#005885] transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default CorporateContactSupport;
