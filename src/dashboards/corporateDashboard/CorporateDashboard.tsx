import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  X,
  Camera,
  Trash2,
  UploadCloud,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useCorporate } from "../../context/CorporateContext";
import { countryData } from "../../components/common/countryData";

// Profile Photo Modal Component
const ProfilePhotoModal = React.memo(
  ({
    photoUrl,
    onClose,
    onRemove,
    onUpload,
  }: {
    photoUrl: string;
    onClose: () => void;
    onRemove: () => Promise<void>;
    onUpload: (file: File) => Promise<void>;
  }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
          toast.error("Only JPEG, PNG, or WebP images are allowed");
          return;
        }
        setSelectedFile(file);
      },
      []
    );

    const handleUpload = useCallback(async () => {
      if (!selectedFile) return;
      setIsUploading(true);
      try {
        await onUpload(selectedFile);
        toast.success("Profile photo updated");
      } catch (error) {
        toast.error("Failed to upload photo");
      } finally {
        setIsUploading(false);
      }
    }, [selectedFile, onUpload]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onClose]);

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-xl max-w-md w-full p-6 space-y-6 shadow-xl"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : photoUrl || "/default-profile.png"
                }
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="cursor-pointer">
              <div className="flex items-center justify-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                <Camera size={16} className="mr-2" />
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </label>
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <button
              onClick={async () => {
                try {
                  await onRemove();
                  onClose();
                } catch (error) {
                  toast.error("Failed to remove photo");
                }
              }}
              disabled={!photoUrl || isUploading}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                photoUrl
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Trash2 size={16} className="mr-2" />
              Remove
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                selectedFile && !isUploading
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-primary/30 text-white cursor-not-allowed"
              }`}
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <UploadCloud size={16} className="mr-2" />
                  Upload
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
);

const EditPersonalInfoModal = React.memo(
  ({
    data,
    onClose,
    onSave,
    selectedCountry,
    onCountryChange,
  }: {
    data: {
      email: string;
      phoneNumber: string;
      location: string;
      contactName: string;
    };
    onClose: () => void;
    onSave: (updatedData: typeof data) => Promise<void>;
    selectedCountry: (typeof countryData)[0];
    onCountryChange: (countryCode: string) => void;
  }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState<Record<keyof typeof data, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      },
      []
    );

    const validate = useCallback(() => {
      const newErrors = {} as typeof errors;
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Invalid email format";

      if (!formData.contactName.trim())
        newErrors.contactName = "Contact name is required";

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else {
        const expectedLength =
          selectedCountry?.phoneLength || selectedCountry?.maxLength;
        if (formData.phoneNumber.length !== expectedLength) {
          newErrors.phoneNumber = `Phone number must be ${expectedLength} digits`;
        }
        if (!/^\d+$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = "Only digits are allowed";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData, selectedCountry]);

    const handleSubmit = useCallback(async () => {
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        await onSave(formData);
        toast.success("Personal info updated");
        onClose();
      } catch (error) {
        toast.error("Failed to update personal info");
      } finally {
        setIsSubmitting(false);
      }
    }, [formData, validate, onSave, onClose]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onClose]);

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-xl max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">
              Contact Information
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.contactName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Enter contact name"
              />
              {errors.contactName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contactName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative mt-1">
                <div className="relative flex items-center border border-gray-300 rounded-lg bg-white h-[42px]">
                  <img
                    src={`https://flagcdn.com/w40/${selectedCountry.isoCode.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-8 h-5 ml-2"
                  />
                  <select
                    value={selectedCountry.isoCode}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className="w-full pl-3 pr-6 bg-transparent outline-none appearance-none"
                  >
                    {countryData.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center mt-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
                <span className="px-3 py-2 border-r border-gray-300 bg-gray-50">
                  {selectedCountry.code}
                </span>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    if (numericValue.length <= selectedCountry.maxLength) {
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: numericValue,
                      }));
                      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                    }
                  }}
                  placeholder={`${selectedCountry.phoneLength} digits`}
                  className={`w-full px-3 py-2 border-none focus:ring-0 rounded-r-lg ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your location"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
);

const EditCompanyInfoModal = React.memo(
  ({
    data,
    onClose,
    onSave,
  }: {
    data: { companyName: string; industry: string };
    onClose: () => void;
    onSave: (updatedData: typeof data) => Promise<void>;
  }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState<Record<keyof typeof data, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      },
      []
    );

    const validate = useCallback(() => {
      const newErrors = {} as typeof errors;
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        await onSave(formData);
        toast.success("Company info updated");
        onClose();
      } catch (error) {
        toast.error("Failed to update company info");
      } finally {
        setIsSubmitting(false);
      }
    }, [formData, validate, onSave, onClose]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onClose]);

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-xl max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">
              Company Information
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter industry"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
);

const CorporateDashboard: React.FC = () => {
  const { profile, updateProfile, loading } = useCorporate();
  const [activeModal, setActiveModal] = useState<
    "photo" | "personal" | "company"
  >();
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

  const handlePhotoUpload = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("profilePhoto", file);
        await updateProfile(formData);
      } catch (error) {
        toast.error("Failed to upload photo");
      }
    },
    [updateProfile]
  );

  const handlePhotoRemove = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("removeProfilePhoto", "true");
      await updateProfile(formData);
    } catch (error) {
      toast.error("Failed to remove photo");
    }
  }, [updateProfile]);

  const handleSavePersonalInfo = useCallback(
    async (data: {
      email: string;
      phoneNumber: string;
      location: string;
      contactName: string;
    }) => {
      try {
        const payload = {
          ...data,
          countryCode: selectedCountry.code,
        };
        await updateProfile(payload);
      } catch (error) {
        toast.error("Failed to update personal info");
      }
    },
    [updateProfile, selectedCountry]
  );

  const handleSaveCompanyInfo = useCallback(
    async (data: { companyName: string; industry: string }) => {
      try {
        await updateProfile(data);
      } catch (error) {
        toast.error("Failed to update company info");
      }
    },
    [updateProfile]
  );

  const handleCountryChange = useCallback((countryCode: string) => {
    const country =
      countryData.find((c) => c.isoCode === countryCode) || countryData[0];
    setSelectedCountry(country);
  }, []);

  useEffect(() => {
    if (profile?.countryCode) {
      const country =
        countryData.find((c) => c.code === profile.countryCode) ||
        countryData[0];
      setSelectedCountry(country);
    }
  }, [profile?.countryCode]);

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6 text-center">No profile data available</div>;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {activeModal === "photo" && (
          <ProfilePhotoModal
            photoUrl={profile.profilePhoto || ""}
            onClose={() => setActiveModal(undefined)}
            onRemove={handlePhotoRemove}
            onUpload={handlePhotoUpload}
          />
        )}
        {activeModal === "personal" && (
          <EditPersonalInfoModal
            data={{
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              location: profile.location,
              contactName: profile.contactName,
            }}
            onClose={() => setActiveModal(undefined)}
            onSave={handleSavePersonalInfo}
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        )}
        {activeModal === "company" && (
          <EditCompanyInfoModal
            data={{
              companyName: profile.companyName,
              industry: profile.industry || "",
            }}
            onClose={() => setActiveModal(undefined)}
            onSave={handleSaveCompanyInfo}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div
              className="relative group"
              onClick={() => setActiveModal("photo")}
            >
              <img
                src={profile.profilePhoto || "/default-profile.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Camera className="text-white" size={20} />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.companyName}
              </h1>
              <p className="text-gray-600 mb-4">{profile.contactName}</p>
              <div className="flex items-center gap-1">
                {profile.isVerified ? (
                  <>
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-green-600 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-yellow-500" />
                    <span className="text-yellow-600 font-medium">
                      Not Verified
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Contact Information
              </h3>
              <button
                onClick={() => setActiveModal("personal")}
                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                aria-label="Edit personal information"
              >
                <Pencil size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-gray-800 font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <div className="flex items-center">
                  <img
                    src={`https://flagcdn.com/w20/${selectedCountry.isoCode.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-5 h-3.5 mr-2"
                  />
                  <span className="text-gray-800 font-medium mr-1">
                    {selectedCountry.code}
                  </span>
                  <p className="text-gray-800 font-medium">
                    {profile.phoneNumber}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-gray-800 font-medium">
                  {profile.location || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                Company Information
              </h3>
              <button
                onClick={() => setActiveModal("company")}
                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                aria-label="Edit company information"
              >
                <Pencil size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Company Name</p>
                <p className="text-gray-800 font-medium">
                  {profile.companyName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Industry</p>
                <p className="text-gray-800 font-medium">
                  {profile.industry || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CorporateDashboard;
