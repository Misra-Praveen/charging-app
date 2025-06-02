import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

const Header = () => {
  const [input, setInput] = useState("");
  const { user, logout } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="text-2xl font-bold">Logo</div>
      <div>
        <h1 className="text-xl font-semibold text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Charging Station
        </h1>
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/Login"
            className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
