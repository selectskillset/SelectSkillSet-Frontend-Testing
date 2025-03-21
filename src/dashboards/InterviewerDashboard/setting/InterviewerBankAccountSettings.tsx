import { Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
      if (!/^\d+$/.test(value)) return "Must contain only numbers";
      if (value.length < 9 || value.length > 18) return "Must be 9-18 digits";
      return undefined;
    },
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
    placeholder: "Enter IFSC code (e.g., ABCD0123456)",
    validate: (value: string) =>
      /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
        ? undefined
        : "Invalid IFSC format (e.g., ABCD0123456)",
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
        toast.error(error.response?.data?.message || "Update failed");
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

    // Clear error only if field becomes valid
    const fieldConfig = FIELD_CONFIG.find((f) => f.name === name);
    if (fieldConfig && !fieldConfig.validate(processedValue)) {
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
    <div className="p-6">
      <div className="rounded-xl shadow-sm p-8 ">
        <div className="mb-8 flex items-center gap-3 border-b pb-4">
          <Lock className="text-[#0A66C2]" size={24} />
          <h1 className="text-2xl font-semibold text-gray-800">
            Bank Account Settings
          </h1>
        </div>

        <div className="mb-6 bg-amber-50 p-4 rounded-lg flex items-start gap-3">
          <ShieldAlert className="text-amber-600 mt-1" size={18} />
          <p className="text-sm text-amber-800">
            All bank details are encrypted with 256-bit SSL and stored securely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FIELD_CONFIG.map((field) => {
              const value = bankDetails[field.name as keyof BankDetails];
              const error = errors[field.name];

              return (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={value}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field.name)}
                    placeholder={field.placeholder}
                    className={`w-full p-3 border rounded-lg focus:ring-2 ${
                      error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#0A66C2]"
                    } ${isLoading ? "bg-gray-100" : ""}`}
                    disabled={isLoading}
                    aria-invalid={!!error}
                    aria-describedby={`${field.name}-error`}
                  />
                  {error && (
                    <p
                      id={`${field.name}-error`}
                      className="text-red-500 text-sm mt-1"
                    >
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto ${
                isLoading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:bg-[#005885]"
              } transition-colors`}
            >
              {isLoading ? "Saving..." : "Save Bank Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewerBankAccountSettings;
