import { X } from "lucide-react";
import React, { useRef } from "react";

interface TermsAndConditionsModalProps {
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Handle clicks outside the modal to close it
  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside} // Close modal when clicking outside
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Terms and Conditions</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition duration-300 focus:outline-none"
          >
           <X/>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            User Consent for Terms and Conditions & Data Processing
          </h2>
          <p className="text-gray-700 mb-4">
            By clicking "Accept" or continuing to use this website, you confirm that you have read,
            understood, and agreed to our Terms and Conditions and Privacy Policy.
          </p>
          <p className="text-gray-700 mb-4">
            In accordance with the General Data Protection Regulation (GDPR), you consent to the
            collection, processing, and storage of your personal data as outlined in our Privacy
            Policy. This may include, but is not limited to, your name, email address, IP address,
            and website usage data.
          </p>
          <p className="text-gray-700 mb-4">
            You have the right to withdraw your consent at any time by contacting us at{" "}
            <a
              href="mailto:contact@selectskillset.com"
              className="text-primary underline hover:text-primary transition duration-300"
            >
              contact@selectskillset.com
            </a>{" "}
            or adjusting your privacy settings in your account. For more details on how we handle
            your data, please refer to our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;