import { Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

const InterviewerBankAccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
  });

  // Fetch existing bank details on component mount
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        setIsLoading(true);
        //   const response = await axiosInstance.get('/interviewer/bank-details');
        //   if (response.data.success) {
        //     setBankDetails(response.data.details);
        //   }
      } catch (error) {
        toast.error("Failed to load bank details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/interviewer/update-bank-details",
        bankDetails
      );

      if (response.data.success) {
        toast.success("Bank details updated securely");
        navigate("/settings"); // Redirect after successful update
      }
    } catch (error) {
      toast.error("Failed to update bank details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Enhanced validation
    switch (name) {
      case "accountNumber":
        if (!/^\d*$/.test(value)) return;
        break;
      case "ifscCode":
        if (!/^[A-Z0-9]{0,11}$/.test(value)) return;
        break;
    }

    setBankDetails((prev) => ({
      ...prev,
      [name]: name === "ifscCode" ? value.toUpperCase() : value,
    }));
  };

  return (
    <div className=" p-6">
      <div className=" rounded-xl shadow-sm p-8">
        <div className="mb-8 flex items-center gap-3 border-b pb-4">
          <Lock className="text-[#0A66C2]" size={24} />
          <h1 className="text-2xl font-semibold text-gray-800">
            Bank Account Settings
          </h1>
        </div>

        <div className="mb-6 bg-amber-50 p-4 rounded-lg flex items-start gap-3">
          <ShieldAlert className="text-amber-600 mt-1" size={18} />
          <p className="text-sm text-amber-800">
            All bank details are encrypted and stored securely. We use 256-bit
            SSL encryption to protect your financial information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={bankDetails.bankName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
                required
                disabled={isLoading}
              />
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={bankDetails.accountHolderName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
                required
                disabled={isLoading}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
                pattern="\d{9,18}"
                title="9-18 digit account number"
                required
                disabled={isLoading}
              />
            </div>

            {/* IFSC Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={bankDetails.ifscCode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] uppercase"
                pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                title="Valid IFSC format: ABCD0123456"
                required
                disabled={isLoading}
              />
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <input
                type="text"
                name="branch"
                value={bankDetails.branch}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2]"
                required
                disabled={isLoading}
              />
            </div>
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
