
const FindUserLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="relative w-full max-w-md">
        {/* First Contact Card */}
        <div className="contact-card contact-card-first">
          <div className="avatar"></div>
          <div className="text-placeholder"></div>
        </div>

        {/* Second Contact Card */}
        <div className="contact-card contact-card-second">
          <div className="avatar"></div>
          <div className="text-placeholder"></div>
        </div>

        {/* Magnifying Glass */}
        <div className="magnifying-glass">
          <div className="glass"></div>
          <div className="handle">
            <div className="handle-inner"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindUserLoader;