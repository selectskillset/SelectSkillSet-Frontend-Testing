import React from "react";

const InterviewerTermsAndConditions: React.FC = () => {
  return (
    <div className="p-6 ">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Terms & Conditions
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Last Updated: January 1, 2024
      </p>

      {/* Terms Content */}
      <article className="space-y-6">
        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Welcome to Selectskillset!
          </h4>
          <p className="text-sm text-gray-700">
            By accessing or using our platform, you agree to comply with and be
            bound by the following terms and conditions. Please read them
            carefully.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            1. Acceptance of Terms
          </h4>
          <p className="text-sm text-gray-700">
            By using our services, you agree to abide by these terms. If you do
            not agree, please discontinue use of the platform.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            2. User Responsibilities
          </h4>
          <p className="text-sm text-gray-700">
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to notify us immediately of any
            unauthorized use of your account.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            3. Changes to Terms
          </h4>
          <p className="text-sm text-gray-700">
            We reserve the right to update or modify these terms at any time
            without prior notice. It is your responsibility to review these
            terms periodically for changes.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            4. Contact Us
          </h4>
          <p className="text-sm text-gray-700">
            For further details or questions regarding these terms, please
            contact our support team at{" "}
            <a
              href="mailto:support@selectskillset.com"
              className="text-[#0A66C2] hover:text-[#005885] transition duration-300"
            >
              support@selectskillset.com
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
};

export default InterviewerTermsAndConditions;
