import React, { useState, useEffect } from "react";
import { auth } from "/home/bengali0207/Desktop/Mellow/Frontend/my-app/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Home Page</h1>
        {user && (
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
