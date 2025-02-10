import { useEffect, useState } from "react";
import { Calendar, Clock, Briefcase, DollarSign } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import profile from "../../images/interviewerProfile.png";
import toast from "react-hot-toast";
import { playSound } from "../../components/common/soundEffect";
import { Link } from "react-router-dom";

const CandidateInterviews: React.FC = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [visibleSlots, setVisibleSlots] = useState({});
  const itemsPerPage = 3;
  const defaultVisibleSlots = 3;

  // Fetch interviewers on component mount
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

  // Handle viewing more slots for an interviewer
  const handleViewMoreSlots = (interviewerId) => {
    setVisibleSlots((prev) => ({
      ...prev,
      [interviewerId]: (prev[interviewerId] || defaultVisibleSlots) + 3,
    }));
  };

  // Handle booking a slot
  const handleBookSlot = (interviewerId, dateId, date, from, to) => {
    setSelectedSlot({ interviewerId, dateId, date, from, to });
  };

  // Handle confirming the booking
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
        // Update the local state to remove the booked slot
        setInterviewers((prevInterviewers) =>
          prevInterviewers.map((interviewer) => {
            if (interviewer._id === selectedSlot.interviewerId) {
              return {
                ...interviewer,
                availability: {
                  ...interviewer.availability,
                  dates: interviewer.availability.dates.filter(
                    (slot) => slot._id !== selectedSlot.dateId
                  ),
                },
              };
            }
            return interviewer;
          })
        );

        toast.success("Interview scheduled successfully!", {
          duration: 4000,
          position: "top-center",
        });
        playSound();
      } else {
        throw new Error(data.message || "Failed to schedule the interview.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsConfirming(false);
      setSelectedSlot(null);
    }
  };

  // Paginate interviewers
  const paginatedInterviewers = interviewers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(interviewers.length / itemsPerPage);

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading interviewers...</p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Schedule an Interview</h2>

        {/* Interviewer List */}
        <div className="space-y-6">
          {paginatedInterviewers.map((interviewer) => {
            const visibleSlotCount =
              visibleSlots[interviewer._id] || defaultVisibleSlots;
            const hasMoreSlots =
              interviewer.availability?.dates?.length > visibleSlotCount;

            return (
              <div
                key={interviewer._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <img
                    src={interviewer.profilePhoto || profile}
                    alt={interviewer.firstName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                  />

                  {/* Interviewer Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {interviewer.firstName} {interviewer.lastName}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {interviewer.jobTitle || "Professional Interviewer"}
                        </p>
                      </div>
                      <Link
                        to={`/interviewer-profile/${interviewer._id}`}
                        className="text-[#0077B5] text-sm font-medium hover:underline"
                      >
                        View Profile
                      </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {interviewer.experience || "N/A"} years experience
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {interviewer.price || "Free"}
                      </div>
                    </div>

                    {/* Available Slots */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Available Slots
                      </h4>
                      {interviewer.availability?.dates?.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {interviewer.availability.dates
                              .slice(0, visibleSlotCount)
                              .map((date: any) => (
                                <div
                                  key={date._id}
                                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      {new Date(date.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {date.from} - {date.to}
                                  </div>
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
                                    className="mt-3 w-full text-sm px-4 py-2 bg-[#0077B5] text-white rounded-md hover:bg-[#005f8a] transition-colors"
                                  >
                                    Book Slot
                                  </button>
                                </div>
                              ))}
                          </div>
                          {hasMoreSlots && (
                            <button
                              onClick={() =>
                                handleViewMoreSlots(interviewer._id)
                              }
                              className="mt-4 text-sm text-[#0077B5] font-medium hover:underline"
                            >
                              View More Slots →
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No available slots currently
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interviewers Pagination */}
        {interviewers.length > itemsPerPage && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-[#0077B5] disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 rounded-md"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-[#0077B5] disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 rounded-md"
            >
              Next
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Interview Slot
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Interviewer:</span>{" "}
                  {
                    interviewers.find(
                      (i) => i._id === selectedSlot.interviewerId
                    )?.firstName
                  }
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(selectedSlot.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {selectedSlot.from}{" "}
                  - {selectedSlot.to}
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedSlot(null)}
                  disabled={isConfirming}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestInterview}
                  disabled={isConfirming}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0077B5] rounded-md hover:bg-[#005f8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isConfirming ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInterviews;
