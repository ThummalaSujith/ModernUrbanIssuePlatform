import React from "react";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex flex-col">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Urban Issue Reporter</h1>

          <div className="flex space-x-4">

            <Link to="/dashboard" className="px-3 py-1 hover:bg-blue-700 rounded">Dashboard</Link>
            <Link to="/report" className="px-3 py-1 hover:bg-blue-700 rounded">Report Issue</Link>
            <Link to="/reports" className="px-3 py-1 hover:bg-blue-700 rounded">My Reports</Link>

          </div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;
