import React, { useState, useRef } from "react";
import { Shield, ChevronDown, ChevronUp, X } from "lucide-react";

const InterviewerTermsAndConditions: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const termsSections = [
    {
      id: "welcome",
      title: "Welcome to SelectSkillset",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            By accessing or using our platform, you agree to comply with and be
            bound by the following terms and conditions. Please read them
            carefully.
          </p>
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            SelectSkillset's website, services, and applications (collectively
            the "Service").
          </p>
        </div>
      ),
    },
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            By accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree to these Terms, you may not access or use
            the Service.
          </p>
          <p>
            Our Privacy Policy explains how we collect and use your information.
            By using the Service, you agree to our collection and use of data as
            set forth in the Privacy Policy.
          </p>
        </div>
      ),
    },
    {
      id: "responsibilities",
      title: "2. User Responsibilities",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>You must be at least 18 years old to use our Service</li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials
            </li>
            <li>
              You agree to provide accurate and complete information when
              creating an account
            </li>
            <li>
              You are solely responsible for all activities that occur under
              your account
            </li>
            <li>
              You must notify us immediately of any unauthorized use of your
              account
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "conduct",
      title: "3. User Conduct",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            You agree not to engage in any of the following prohibited
            activities:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violating any applicable laws or regulations</li>
            <li>
              Posting or transmitting any unlawful, harmful, or inappropriate
              content
            </li>
            <li>Interfering with or disrupting the Service or servers</li>
            <li>
              Attempting to gain unauthorized access to any accounts or systems
            </li>
            <li>Using the Service for any fraudulent or misleading purpose</li>
          </ul>
        </div>
      ),
    },
    {
      id: "changes",
      title: "4. Changes to Terms",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            We reserve the right to modify or replace these Terms at any time at
            our sole discretion. We will provide notice of material changes by
            posting the updated Terms on our website.
          </p>
          <p>
            Your continued use of the Service after any such changes constitutes
            your acceptance of the new Terms. If you do not agree to any of
            these Terms or any future Terms, do not use or access the Service.
          </p>
        </div>
      ),
    },
    {
      id: "termination",
      title: "5. Termination",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            We may terminate or suspend your account and bar access to the
            Service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever including without
            limitation if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately
            cease. All provisions of these Terms which by their nature should
            survive termination shall survive termination, including ownership
            provisions, warranty disclaimers, and limitations of liability.
          </p>
        </div>
      ),
    },
    {
      id: "disclaimer",
      title: "6. Disclaimer of Warranties",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            The Service is provided "AS IS" and "AS AVAILABLE" without
            warranties of any kind, either express or implied, including but not
            limited to implied warranties of merchantability, fitness for a
            particular purpose, or non-infringement.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, secure, or
            error-free; nor do we make any warranty as to the results that may
            be obtained from the use of the Service.
          </p>
        </div>
      ),
    },
    {
      id: "liability",
      title: "7. Limitation of Liability",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            In no event shall SelectSkillset, its directors, employees,
            partners, or agents be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your access to or
            use of the Service.
          </p>
          <p>
            Our total liability for any claims under these Terms shall not
            exceed the amount you paid us to use the Service in the past twelve
            months, if applicable.
          </p>
        </div>
      ),
    },
    {
      id: "governing",
      title: "8. Governing Law",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of [Your Country/State], without regard to its conflict of
            law provisions.
          </p>
          <p>
            Any disputes arising under or in connection with these Terms shall
            be subject to the exclusive jurisdiction of the courts located in
            [Your Jurisdiction].
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "9. Contact Information",
      icon: <Shield className="text-primary" size={18} />,
      content: (
        <div className="text-gray-700 space-y-2">
          <p>For questions about these Terms, please contact us at:</p>
          <p>
            <a
              href="mailto:support@selectskillset.com"
              className="text-primary hover:text-primary-dark underline transition-colors"
            >
              support@selectskillset.com
            </a>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="gap-3">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={24} />
            <h1 className="text-2xl font-semibold text-gray-800">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </div>

      {/* Terms Commitment Card */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-3">
          Our Terms of Service
        </h2>
        <p className="text-gray-700 mb-4">
          These terms govern your use of the SelectSkillset platform. By
          accessing our services, you agree to be bound by these terms and all
          applicable laws and regulations.
        </p>
        <button
          onClick={() => setShowTermsModal(true)}
          className="text-primary hover:text-primary-dark font-medium text-sm hover:underline"
        >
          View Complete Terms and Conditions
        </button>
      </div>

      {/* Terms Accordion */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {termsSections.map((section) => (
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
              <div className="mt-4 pl-9 animate-fadeIn text-gray-700 text-sm">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <TermsAndConditionsModal onClose={() => setShowTermsModal(false)} />
      )}
    </div>
  );
};

// Terms Modal Component
const TermsAndConditionsModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
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
              Complete Terms & Conditions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full p-1"
            aria-label="Close terms modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Terms of Service Agreement
            </h2>
            <p className="text-gray-700">
              This Terms of Service Agreement ("Agreement") governs your use of
              the SelectSkillset platform ("Service") operated by SelectSkillset
              ("us", "we", or "our").
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              1. Acceptance of Terms
            </h3>
            <p className="text-gray-700 mb-4">
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, you may not
              access the Service.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              2. Accounts and Registration
            </h3>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">
                To access certain features, you must register for an account.
                When registering, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept all risks of unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              3. User Conduct
            </h3>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violating any laws or third-party rights</li>
                <li>Using the Service for any illegal purpose</li>
                <li>Harassing, abusing, or harming others</li>
                <li>Interfering with the Service's operation</li>
                <li>Attempting to bypass any security measures</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              4. Intellectual Property
            </h3>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality
              are and will remain our exclusive property. The Service is
              protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              5. Termination
            </h3>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach these Terms.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              6. Limitation of Liability
            </h3>
            <p className="text-gray-700 mb-4">
              In no event shall we be liable for any indirect, incidental,
              special, consequential or punitive damages resulting from your
              access to or use of the Service.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              7. Governing Law
            </h3>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Country/State], without regard to its conflict
              of law provisions.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              8. Changes to Terms
            </h3>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will
              provide notice of significant changes through the Service. Your
              continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              9. Contact Information
            </h3>
            <p className="text-gray-700">
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@selectskillset.com"
                className="text-primary underline hover:text-primary-dark"
              >
                support@selectskillset.com
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium"
          >
            Close Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewerTermsAndConditions;
