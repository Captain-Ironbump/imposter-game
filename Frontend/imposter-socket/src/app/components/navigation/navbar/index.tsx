import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-20 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-full relative">
        {/* Not Connected Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-sm">Not Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
