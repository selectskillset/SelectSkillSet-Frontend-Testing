import React, { useState } from "react";
import { Shield, Lock, Database, Globe, User, X } from "lucide-react";

const privacySections = [
  {
    id: "data-collection",
    title: "Data Collection",
    icon: <Database className="text-primary" size={18} />,
    content: (
      <div className="text-gray-700 space-y-2">
        <p>We collect only necessary personal data including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name and contact details</li>
          <li>Professional information</li>
          <li>Account activity data</li>
        </ul>
        <p className="pt-2">
          Collection occurs through voluntary user input and automated website
          analytics, in compliance with GDPR Article 6(1)(a) - explicit consent.
        </p>
      </div>
    ),
  },
  {
    id: "data-usage",
    title: "Data Usage",
    icon: <User className="text-primary" size={18} />,
    content: (
      <div className="text-gray-700 space-y-2">
        <p>Personal data is used exclusively for:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account management and service provision</li>
          <li>Platform communication and updates</li>
          <li>Career matching services</li>
          <li>Legal compliance requirements</li>
        </ul>
      </div>
    ),
  },
  {
    id: "data-protection",
    title: "Data Protection",
    icon: <Lock className="text-primary" size={18} />,
    content: (
      <div className="text-gray-700 space-y-2">
        <p>We implement robust security measures including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>End-to-end encryption (AES-256)</li>
          <li>Secure TLS 1.3+ protocols</li>
          <li>Regular penetration testing</li>
          <li>Multi-factor authentication</li>
          <li>Role-based access controls</li>
        </ul>
      </div>
    ),
  },
  {
    id: "gdpr-rights",
    title: "Your GDPR Rights",
    icon: <Shield className="text-primary" size={18} />,
    content: (
      <div className="text-gray-700 space-y-2">
        <p>Under GDPR Articles 15-22, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access your personal data (Article 15)</li>
          <li>Rectify inaccurate information (Article 16)</li>
          <li>Request erasure ("right to be forgotten") (Article 17)</li>
          <li>Restrict processing (Article 18)</li>
          <li>Data portability (Article 20)</li>
          <li>Object to processing (Article 21)</li>
        </ul>
      </div>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    icon: <Database className="text-primary" size={18} />,
    content: (
      <div className="text-gray-700 space-y-2">
        <p>We retain data only as necessary for its purposes:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Active accounts: Until deletion request</li>
          <li>Inactive accounts: 36 months after last activity</li>
          <li>Financial records: 7 years for tax compliance</li>
          <li>Legal holds: As required by authorities</li>
        </ul>
      </div>
    ),
  },
  {
    id: "international-transfers",
    title: "International Transfers",
    icon: <Globe className="text-primary" size={18} />,
    content: (
      <div className="text-gray-700 space-y-2">
        <p>
          Data may be transferred outside the EEA only to countries with
          EU-approved adequacy decisions or using Standard Contractual Clauses
          (SCCs) as per GDPR Chapter V requirements.
        </p>
        <p>
          All third-party processors undergo rigorous vetting for compliance
          with international data protection standards.
        </p>
      </div>
    ),
  },
];

const CandidatePrivacySettings: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className=" gap-4">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={24} />
            <h1 className="text-2xl font-semibold text-gray-800">
              Privacy Settings
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Manage your privacy preferences and data protection controls
          </p>
        </div>
      </div>

      {/* Privacy Commitment Card */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-3">
          Our Privacy Commitment
        </h2>
        <p className="text-gray-700 mb-4">
          We adhere to the highest standards of data protection, ensuring
          compliance with GDPR, CCPA, and other global privacy regulations. Your
          trust is our priority.
        </p>
        <button
          onClick={() => setShowPrivacyModal(true)}
          className="text-primary hover:text-primary-dark font-medium text-sm hover:underline"
        >
          View Complete Privacy Policy
        </button>
      </div>

      {/* Privacy Controls Accordion */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {privacySections.map((section) => (
          <div key={section.id} className="p-5">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex justify-between items-center w-full text-left group"
              aria-expanded={expandedSection === section.id}
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="text-gray-500" size={20} />
              ) : (
                <ChevronDown className="text-gray-500" size={20} />
              )}
            </button>

            {expandedSection === section.id && (
              <div className="mt-4 pl-9 animate-fadeIn">{section.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />
      )}
    </div>
  );
};

// Privacy Policy Modal Component
const PrivacyPolicyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">
              Privacy Policy & Compliance Documentation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full p-1"
            aria-label="Close privacy policy"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Data Protection Commitment
            </h2>
            <p className="text-gray-700">
              This comprehensive policy outlines our practices for collecting,
              using, and safeguarding your personal information in compliance
              with global privacy regulations including GDPR, CCPA, and other
              applicable laws.
            </p>
          </section>

          {privacySections.map((section) => (
            <section key={section.id}>
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                {section.title}
              </h3>
              <div className="text-gray-700 space-y-3">{section.content}</div>
            </section>
          ))}

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              Policy Updates
            </h3>
            <p className="text-gray-700 mb-2">
              We may periodically update this policy to reflect changes in our
              practices or regulatory requirements. Significant changes will be
              communicated through platform notifications.
            </p>
            <p className="text-gray-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};

const ChevronDown = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 20}
    height={size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 20}
    height={size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

export default CandidatePrivacySettings;
