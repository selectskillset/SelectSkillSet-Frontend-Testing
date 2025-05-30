import { Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../components/common/axiosConfig";

interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const FIELD_CONFIG = [
  {
    name: "bankName",
    label: "Bank Name",
    placeholder: "Enter bank name",
    validate: (value: string) =>
      value.trim() ? undefined : "Bank name is required",
  },
  {
    name: "accountHolderName",
    label: "Account Holder Name",
    placeholder: "Enter account holder name",
    validate: (value: string) =>
      value.trim() ? undefined : "Account holder name is required",
  },
  {
    name: "accountNumber",
    label: "Account Number",
    placeholder: "Enter account number",
    validate: (value: string) => {
      if (!value.trim()) return "Account number is required";
      if (!/^\d+$/.test(value)) return "Must contain only numbers";
      if (value.length < 9 || value.length > 18) return "Must be 9-18 digits";
      return undefined;
    },
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
    placeholder: "Enter IFSC code (e.g., ABCD0123456)",
    validate: (value: string) => {
      if (!value.trim()) return "IFSC code is required";
      return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
        ? undefined
        : "Invalid IFSC format (e.g., ABCD0123456)";
    },
  },
  {
    name: "branch",
    label: "Branch",
    placeholder: "Enter branch name",
    validate: (value: string) =>
      value.trim() ? undefined : "Branch is required",
  },
];

const InterviewerBankAccountSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const controller = new AbortController();

    const fetchBankDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/interviewer/bank-details", {
          signal: controller.signal,
        });
        if (response.data.success) {
          setBankDetails(response.data.details);
          setErrors({});
        }
      } catch (error: any) {
        if (!axiosInstance.isCancel(error)) {
          toast.error(
            error.response?.data?.message || "Failed to load bank details"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
    return () => controller.abort();
  }, []);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    FIELD_CONFIG.forEach(({ name, validate }) => {
      const error = validate(bankDetails[name]);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/interviewer/update-bank-details",
        bankDetails
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Bank details updated successfully"
        );
        setErrors({});
      }
    } catch (error: any) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update bank details"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === "ifscCode" ? value.toUpperCase() : value;

    setBankDetails((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (name: string) => {
    const fieldConfig = FIELD_CONFIG.find((f) => f.name === name);
    if (fieldConfig) {
      const error = fieldConfig.validate(bankDetails[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  return (
    <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div className="mb-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Lock className="text-primary" size={24} />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Bank Account Settings
            </h1>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mb-6 bg-amber-50 p-4 rounded-lg flex items-start gap-3">
          <ShieldAlert className="text-amber-600 mt-1" size={18} />
          <p className="text-sm text-amber-800">
            All bank details are encrypted with 256-bit SSL and stored securely.
            We never share your financial information with third parties.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {FIELD_CONFIG.map((field) => {
              const value = bankDetails[field.name as keyof BankDetails];
              const error = errors[field.name];

              return (
                <div key={field.name} className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={value}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field.name)}
                    placeholder={field.placeholder}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                      error
                        ? "border-error focus:ring-error-100"
                        : "border-gray-300 focus:border-primary focus:ring-primary-100"
                    } ${isLoading ? "bg-gray-50" : "bg-white"}`}
                    disabled={isLoading}
                    aria-invalid={!!error}
                    aria-describedby={`${field.name}-error`}
                  />
                  {error && (
                    <p
                      id={`${field.name}-error`}
                      className="text-error text-xs mt-1"
                    >
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center items-center px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Bank Details"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewerBankAccountSettings;
