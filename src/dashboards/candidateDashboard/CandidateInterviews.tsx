import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import profile from "../../images/interviewerProfile.png";
import toast from "react-hot-toast";
import { playSound } from "../../components/common/soundEffect";
import { Link } from "react-router-dom";

const CandidateInterviews: React.FC = () => {
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const itemsPerPage = 3;

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const { data } = await axiosInstance.get("/candidate/interviewers");
        if (data.success) {
          setInterviewers(data.interviewers);
        } else {
          setError("Failed to fetch interviewers.");
        }
      } catch (err) {
        setError("No interviewers found.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewers();
  }, []);

  const handleBookSlot = (
    interviewerId: string,
    dateId: string,
    date: string,
    from: string,
    to: string
  ) => {
    setSelectedSlot({ interviewerId, dateId, date, from, to });
    setModalVisible(true);
  };

  const handleRequestInterview = async () => {
    if (isConfirming || !selectedSlot) return;
    setIsConfirming(true);

    try {
      const interviewer = interviewers.find(
        (i) => i._id === selectedSlot.interviewerId
      );
      if (!interviewer) throw new Error("Interviewer not found!");

      const { data } = await axiosInstance.post("/candidate/schedule", {
        interviewerId: selectedSlot.interviewerId,
        date: selectedSlot.date,
        price: interviewer.price,
        from: selectedSlot.from,
        to: selectedSlot.to,
      });

      if (data.success) {
        toast.success("Interview scheduled successfully!", {
          duration: 4000, // Duration for the toast
          position: "top-center", // Position of the toast
        });
        playSound();
      } else {
        throw new Error(data.message || "Failed to schedule the interview.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsConfirming(false);
      setModalVisible(false);
    }
  };

  const paginatedInterviewers = interviewers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(interviewers.length / itemsPerPage);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;

  if (error)
    return <div className="text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 ">
        Schedule an Interview
      </h2>

      {/* Interviewer List */}
      {paginatedInterviewers.map((interviewer) => (
        <div
          key={interviewer._id}
          className="p-6 rounded-lg shadow border bg-white flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition"
        >
          {/* Profile Image */}
          <img
            src={interviewer.profilePhoto || profile}
            alt={interviewer.firstName}
            className="w-24 h-24 rounded-full border-2 border-gray-400 object-cover"
          />

          {/* Interviewer Details */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              {interviewer.firstName} {interviewer.lastName}
            </h3>
            <p className="text-gray-600">
              {interviewer.jobTitle || "No job title provided"}
            </p>
            <p className="text-gray-500">
              Experience: {interviewer.experience || "N/A"} years
            </p>
            <p className="text-green-600 font-semibold">
              Pricing: {interviewer.price || "Free"}
            </p>

            {/* Available Slots */}
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-700">
                Available Slots
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {interviewer.availability?.dates?.map((date: any) => (
                  <div
                    key={date._id}
                    className="p-3 rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <Calendar className="text-gray-500" />
                    <span className="block text-sm text-gray-700">
                      {new Date(date.date).toLocaleDateString()}
                    </span>
                    <p className="text-xs text-gray-500">
                      {date.from} - {date.to}
                    </p>
                    <button
                      onClick={() =>
                        handleBookSlot(
                          interviewer._id,
                          date._id,
                          date.date,
                          date.from,
                          date.to
                        )
                      }
                      className="mt-2 text-xs px-4 py-1 bg-[#0077B5] text-white rounded hover:bg-blue-600 transition"
                    >
                      Book Slot
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          <Link
            to={`/interviewer-profile/${interviewer._id}`}
            className="text-[#0077B5] text-sm font-medium underline "
          >
            View Profile
          </Link>
        </div>
      ))}

      {/* Pagination */}
      {interviewers.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalVisible && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Interview Slot
            </h3>
            <p>
              <strong>Interviewer:</strong>{" "}
              {
                interviewers.find((i) => i._id === selectedSlot.interviewerId)
                  ?.firstName
              }
            </p>
            <p>
              <strong>Slot:</strong> {selectedSlot.date} | {selectedSlot.from} -{" "}
              {selectedSlot.to}
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestInterview}
                disabled={isConfirming}
                className={`px-6 py-2 text-white rounded transition ${
                  isConfirming ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isConfirming ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInterviews;
