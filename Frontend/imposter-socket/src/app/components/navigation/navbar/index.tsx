import React from "react";
import ConnectionIndicator from "./ConnectionIndicator";

const Navbar = () => {
  console.log("Socket URL:", process.env.NEXT_PUBLIC_SOCKET_URL);

  return (
    <div className="w-full h-15 sticky top-0 z-50 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 h-full relative">
        {/* Not Connected Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white">
          <ConnectionIndicator />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
