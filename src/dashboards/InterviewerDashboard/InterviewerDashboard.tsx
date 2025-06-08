import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Pencil,
  X,
  Camera,
  Trash2,
  UploadCloud,
  FileText,
  User,
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useInterviewer } from "../../context/InterviewerContext";
import { countryData } from "../../components/common/countryData";

// Function to generate the UI Avatars URL
const getAvatarUrl = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`;
};

// Custom Hooks
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const useEscapeKey = (callback) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") callback();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};

// Helper function to get company logo URLs
const getCompanyLogoUrl = (companyName) => {
  const formattedName = companyName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
  return {
    clearbit: `https://logo.clearbit.com/${formattedName}.com`,
    initials: `https://api.dicebear.com/7.x/initials/svg?seed=${companyName.charAt(0)}&size=48&backgroundType=gradientLinear&fontWeight=500`,
  };
};

// Modal Components
const ProfilePhotoModal = React.memo(({ photoUrl, onClose, onRemove, onUpload, name }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const modalRef = useRef(null);

  useOutsideClick(modalRef, onClose);
  useEscapeKey(onClose);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are allowed");
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      toast.success("Profile photo updated");
      onClose();
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onUpload, onClose]);

  const handleRemove = useCallback(async () => {
    try {
      await onRemove();
      toast.success("Profile photo removed");
      onClose();
    } catch (error) {
      toast.error("Failed to remove photo");
    }
  }, [onRemove, onClose]);

  const previewUrl = useMemo(() => {
    return selectedFile ? URL.createObjectURL(selectedFile) : photoUrl || getAvatarUrl(name);
  }, [selectedFile, photoUrl, name]);

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
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getAvatarUrl(name);
              }}
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
            onClick={handleRemove}
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
});

const EditPersonalInfoModal = React.memo(({ 
  data, 
  onClose, 
  onSave, 
  selectedCountry, 
  onCountryChange, 
  onPhoneChange 
}) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  useOutsideClick(modalRef, onClose);
  useEscapeKey(onClose);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const expectedLength = selectedCountry?.phoneLength || selectedCountry?.maxLength;
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

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast.success("Personal info updated");
      onClose();
    } catch (error) {
      toast.error("Failed to update personal information");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, onSave, onClose]);

  const countryOptions = useMemo(() => {
    return countryData.map((country) => (
      <option key={country.isoCode} value={country.isoCode}>
        {country.name} ({country.code})
      </option>
    ));
  }, []);

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
          <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              required
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
                  {countryOptions}
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
                value={formData.phoneNumber}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  if (numericValue.length <= selectedCountry.maxLength) {
                    onPhoneChange(numericValue);
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: numericValue,
                    }));
                  }
                }}
                placeholder={`${selectedCountry.maxLength} digits`}
                className={`w-full px-3 py-2 border-none focus:ring-0 rounded-r-lg ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
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

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
});

const EditSummaryModal = React.memo(({ summary, onClose, onSave }) => {
  const [formData, setFormData] = useState(summary);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  useOutsideClick(modalRef, onClose);
  useEscapeKey(onClose);

  const handleChange = useCallback((e) => {
    setFormData(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast.success("Summary updated");
      onClose();
    } catch (error) {
      toast.error("Failed to update summary");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSave, onClose]);

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
          <h3 className="text-lg font-bold text-gray-900">Edit Summary</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your summary"
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
});

const SkillsDisplay = React.memo(({ skills }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSkills = showAll ? skills : skills.slice(0, 5);

  if (!skills?.length) return <p className="text-gray-500">No skills added yet</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedSkills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
        >
          {skill}
        </span>
      ))}
      {skills.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {showAll ? "View Less" : `+${skills.length - 5} more`}
        </button>
      )}
    </div>
  );
});

const ExperienceCard = React.memo(({ experience }) => {
  const [logoError, setLogoError] = useState(false);
  const logoUrls = useMemo(() => getCompanyLogoUrl(experience.company), [experience.company]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
            {logoError ? (
              <img
                src={logoUrls.initials}
                alt={`${experience.company} initials`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={logoUrls.clearbit}
                alt={`${experience.company} logo`}
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium text-gray-800">
                {experience.position}
              </h4>
              <p className="text-sm text-gray-600">{experience.company}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {experience.startDate} -{" "}
                {experience.current ? "Present" : experience.endDate}
              </p>
              <p className="text-xs text-gray-500">
                {experience.totalExperience}
              </p>
            </div>
          </div>
          {experience.description && (
            <p className="mt-2 text-sm text-gray-600">
              {experience.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

const InterviewerDashboard = () => {
  const { profile, fetchProfile, updateProfile } = useInterviewer();
  const [modals, setModals] = useState({
    photo: false,
    personalInfo: false,
    summary: false,
  });
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

  const toggleModal = useCallback((modal) => {
    setModals((prev) => ({ ...prev, [modal]: !prev[modal] }));
  }, []);

  useEffect(() => {
    if (profile?.countryCode) {
      const country =
        countryData.find((c) => c.code === profile.countryCode) ||
        countryData[0];
      setSelectedCountry(country);
    }
  }, [profile?.countryCode]);

  const handleCountryChange = useCallback((countryCode) => {
    const country =
      countryData.find((c) => c.isoCode === countryCode) || countryData[0];
    setSelectedCountry(country);
  }, []);

  const handlePhotoUpload = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      await updateProfile(formData);
    },
    [updateProfile]
  );

  const handlePhotoRemove = useCallback(async () => {
    await updateProfile({ profilePhoto: "" });
  }, [updateProfile]);

  const handleSavePersonalInfo = useCallback(
    async (data) => {
      const payload = { ...data, countryCode: selectedCountry.code };
      await updateProfile(payload);
    },
    [updateProfile, selectedCountry]
  );

  const handleSaveSummary = useCallback(
    async (summary) => {
      await updateProfile({ summary });
    },
    [updateProfile]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <AnimatePresence>
        {modals.photo && (
          <ProfilePhotoModal
            photoUrl={profile.profilePhoto}
            name={profile.name}
            onClose={() => toggleModal("photo")}
            onRemove={handlePhotoRemove}
            onUpload={handlePhotoUpload}
          />
        )}
        {modals.personalInfo && (
          <EditPersonalInfoModal
            data={{
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              location: profile.location,
            }}
            onClose={() => toggleModal("personalInfo")}
            onSave={handleSavePersonalInfo}
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            onPhoneChange={(phone) => {
              // Update phone number in form state
            }}
          />
        )}
        {modals.summary && (
          <EditSummaryModal
            summary={profile.summary}
            onClose={() => toggleModal("summary")}
            onSave={handleSaveSummary}
          />
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div
              className="relative group"
              onClick={() => toggleModal("photo")}
            >
              <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md cursor-pointer hover:opacity-90 transition-opacity">
                <img
                  src={
                    profile.profilePhoto || getAvatarUrl(profile.name)
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = getAvatarUrl(profile.name);
                  }}
                />
                {profile.isVerified ? (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <BadgeCheck
                      className="text-blue-500 fill-blue-100"
                      size={20}
                    />
                  </div>
                ) : (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <AlertTriangle
                      className="text-yellow-500 fill-blue-100"
                      size={20}
                    />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="text-white" size={20} />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold capitalize text-gray-900">
                    {profile.name}
                  </h2>
                </div>
                <p className="text-gray-600 mb-1">{profile.jobTitle}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{profile.location}</span>
                </div>
                <SkillsDisplay skills={profile.skills || []} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Personal Information
              </h3>
              <button
                onClick={() => toggleModal("personalInfo")}
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
                    {profile.countryCode}
                  </span>
                  <p className="text-gray-800 font-medium">
                    {profile.phoneNumber}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-gray-800 font-medium">{profile.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Verification Status
                </p>
                <div className="flex items-center gap-1">
                  {profile.isVerified ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-green-600 font-medium">
                        Verified
                      </span>
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

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                Professional Summary
              </h3>
              <button
                onClick={() => toggleModal("summary")}
                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                aria-label="Edit summary"
              >
                <Pencil size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-800 whitespace-pre-line">
                {profile.summary || "No summary provided"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Experience */}
      {profile.experiences?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-primary" />
            Work Experience
          </h3>
          <div className="space-y-3">
            {profile.experiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewerDashboard;