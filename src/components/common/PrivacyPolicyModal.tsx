import { X } from "lucide-react";
import React, { useRef } from "react";

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Privacy Policy & GDPR Compliance</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition duration-300 focus:outline-none"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Data Protection and Privacy Commitment
          </h2>

          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">1. Data Collection</h3>
            <p className="text-gray-700 mb-4">
              We collect only necessary personal data including name, email address, contact details, 
              and professional information. Collection occurs through voluntary user input and automated 
              website analytics, in compliance with GDPR Article 6(1)(a) - explicit consent.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">2. Data Usage</h3>
            <p className="text-gray-700 mb-4">
              Personal data is used exclusively for: 
              <ul className="list-disc pl-6 mt-2">
                <li>Account management and service provision</li>
                <li>Communication regarding platform updates</li>
                <li>Job matching and career services</li>
                <li>Legal compliance and security measures</li>
              </ul>
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">3. Data Protection</h3>
            <p className="text-gray-700 mb-4">
              We implement technical and organizational measures including:
              <br />
              • AES-256 encryption for data at rest
              <br />
              • TLS 1.3+ for data in transit
              <br />
              • Regular security audits
              <br />
              • Access controls and authentication protocols
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">4. Your GDPR Rights</h3>
            <p className="text-gray-700 mb-4">
              Under GDPR Articles 15-22, you have the right to:
              <ul className="list-disc pl-6 mt-2">
                <li>Access your personal data (Article 15)</li>
                <li>Rectify inaccurate information (Article 16)</li>
                <li>Request erasure (Article 17)</li>
                <li>Restrict processing (Article 18)</li>
                <li>Data portability (Article 20)</li>
                <li>Object to processing (Article 21)</li>
              </ul>
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">5. Data Retention</h3>
            <p className="text-gray-700 mb-4">
              Personal data is retained only as long as necessary for the purposes collected:
              <br />
              • Active accounts: Until deletion request
              <br />
              • Inactive accounts: 3 years post-last activity
              <br />
              • Legal requirements: Up to 7 years where mandated
            </p>
          </section>

          <section className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">6. International Transfers</h3>
            <p className="text-gray-700 mb-4">
              Data may be transferred outside the EEA only to countries with adequate protection 
              measures as per GDPR Chapter V. We use EU Standard Contractual Clauses for all 
              third-country data transfers.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
            <p className="text-gray-700">
              Data Protection Officer:{" "}
              <a
                href="mailto:dpo@selectskillset.com"
                className="text-[#0A66C2] underline hover:text-[#005885] transition duration-300"
              >
                dpo@selectskillset.com
              </a>
              <br />
              EU Representative:{" "}
              <a
                href="mailto:eu-rep@selectskillset.com"
                className="text-[#0A66C2] underline hover:text-[#005885] transition duration-300"
              >
                eu-rep@selectskillset.com
              </a>
            </p>
            <p className="text-gray-700 mt-4 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;