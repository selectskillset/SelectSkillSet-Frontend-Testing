import React, { useState, memo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  X,
  ChevronUp,
  Camera,
  Trash2,
  UploadCloud,
  FileText,
  User,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { useCandidate } from "../../context/CandidateContext";
import { useNavigate } from "react-router-dom";

// Custom Hooks
const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const useEscapeKey = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") callback();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};

// Profile Photo Modal Component
const ProfilePhotoModal = memo(
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

    useOutsideClick(modalRef, onClose);
    useEscapeKey(onClose);

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
      } catch (error) {
        toast.error("Failed to upload photo");
      } finally {
        setIsUploading(false);
      }
    }, [selectedFile, onUpload]);

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

const EditPersonalInfoModal = memo(
  ({
    data,
    onClose,
    onSave,
  }: {
    data: { email: string; phoneNumber: string; location: string };
    onClose: () => void;
    onSave: (updatedData: typeof data) => Promise<void>;
  }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState<Record<keyof typeof data, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useOutsideClick(modalRef, onClose);
    useEscapeKey(onClose);

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
      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = "Phone number is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData, errors]);

    const handleSubmit = useCallback(async () => {
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        toast.error("Failed to update personal information");
      } finally {
        setIsSubmitting(false);
      }
    }, [formData, validate, onSave, onClose]);

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
              Personal Information
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
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Enter your phone number"
              />
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

const EditProfessionalLinksModal = memo(
  ({
    data,
    onClose,
    onSave,
  }: {
    data: { linkedIn: string; resume: string };
    onClose: () => void;
    onSave: (updatedData: {
      linkedIn: string;
      resume?: File | null;
    }) => Promise<void>;
  }) => {
    const [linkedIn, setLinkedIn] = useState(data.linkedIn);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useOutsideClick(modalRef, onClose);
    useEscapeKey(onClose);

    const handleSubmit = useCallback(async () => {
      setIsSubmitting(true);
      try {
        await onSave({ linkedIn, resume: resumeFile });
        onClose();
      } catch (error) {
        toast.error("Failed to update professional links");
      } finally {
        setIsSubmitting(false);
      }
    }, [linkedIn, resumeFile, onSave, onClose]);

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
              Professional Links
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
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume
              </label>
              <div className="flex items-center gap-3">
                {data.resume || resumeFile ? (
                  <>
                    <FileText size={16} className="text-primary" />
                    <span className="text-sm text-gray-700">
                      {resumeFile ? resumeFile.name : "Resume uploaded"}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">
                    No resume uploaded
                  </span>
                )}
                <label className="ml-auto cursor-pointer">
                  <div className="text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                    {data.resume || resumeFile ? "Change" : "Upload"}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
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

const SkillsDisplay = memo(({ skills }: { skills: string[] }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSkills = showAll ? skills : skills.slice(0, 5);

  if (!skills.length)
    return <p className="text-gray-500">No skills added yet</p>;

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

const CandidateProfile: React.FC = () => {
  const { profile, updateProfile, fetchProfile } = useCandidate();
  const navigate = useNavigate();
  const [modals, setModals] = useState({
    photo: false,
    personalInfo: false,
    professionalLinks: false,
  });

  const toggleModal = useCallback((modal: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modal]: !prev[modal] }));
  }, []);

  const handlePhotoUpload = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("profilePhoto", file);
        await updateProfile(formData);
        toast.success("Profile photo updated");
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
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error("Failed to remove photo");
    }
  }, [updateProfile]);

  const handleSavePersonalInfo = useCallback(
    async (data: { email: string; phoneNumber: string; location: string }) => {
      try {
        await updateProfile(data);
        toast.success("Personal info updated");
      } catch (error) {
        toast.error("Failed to update personal info");
      }
    },
    [updateProfile]
  );

  const handleSaveProfessionalLinks = useCallback(
    async (data: { linkedIn: string; resume?: File | null }) => {
      try {
        const formData = new FormData();
        formData.append("linkedIn", data.linkedIn);

        if (data.resume) {
          formData.append("resume", data.resume);
        } else if (!data.resume && !profile?.resume) {
          formData.append("removeResume", "true");
        }

        await updateProfile(formData);
        toast.success("Professional links updated");
      } catch (error) {
        toast.error("Failed to update professional links");
      }
    },
    [updateProfile, profile?.resume]
  );

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {modals.photo && (
          <ProfilePhotoModal
            photoUrl={profile.profilePhoto}
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
          />
        )}
        {modals.professionalLinks && (
          <EditProfessionalLinksModal
            data={{
              linkedIn: profile.linkedIn,
              resume: profile.resume,
            }}
            onClose={() => toggleModal("professionalLinks")}
            onSave={handleSaveProfessionalLinks}
          />
        )}
      </AnimatePresence>

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
                {profile.name}
              </h1>
              <p className="text-gray-600 mb-4">{profile.jobTitle}</p>
              <SkillsDisplay skills={profile.skills} />
            </div>
            <div className="hidden sm:block">
              <button
                onClick={() => navigate("/edit-candidate-profile")}
                className="px-4 flex gap-2 py-2 items-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Edit Profile <Pencil className="text-white" size={15} />
              </button>
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
                <p className="text-gray-800 font-medium">
                  {profile.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-gray-800 font-medium">{profile.location}</p>
              </div>
            </div>
          </div>

          <div className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                Professional Links
              </h3>
              <button
                onClick={() => toggleModal("professionalLinks")}
                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                aria-label="Edit professional links"
              >
                <Pencil size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
                {profile.linkedIn ? (
                  <a
                    href={profile.linkedIn}
                    className="text-primary hover:underline font-medium inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Profile{" "}
                    <ChevronUp size={16} className="ml-1 rotate-45" />
                  </a>
                ) : (
                  <p className="text-gray-800 font-medium">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Resume</p>
                {profile.resume ? (
                  <a
                    href={profile.resume}
                    className="text-primary hover:underline font-medium inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Resume{" "}
                    <ChevronUp size={16} className="ml-1 rotate-45" />
                  </a>
                ) : (
                  <p className="text-gray-800 font-medium">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(CandidateProfile);
