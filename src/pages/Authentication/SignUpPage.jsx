import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, provider, db } from "/home/bengali0207/Desktop/Mellow/Frontend/my-app/firebase.js";
import { signInWithPopup, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserToFirestore = async (user) => {
    const userData = {
      uid: user.uid,
      name: formData.name || "User", // Default name if not provided
      email: user.email,
      profilePic: "",
      authType: "google_signup",
      followers: [],
      following: [],
      isOnline: true,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User data saved in Firestore:", userData);
    } catch (error) {
      console.error("Firestore Error:", error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await saveUserToFirestore(userCredential.user);
      console.log("User registered successfully");
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUpWithGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      // Set session persistence
      await setPersistence(auth, browserSessionPersistence);

      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      console.log("Google sign-up successful");
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleSignUpWithGoogle}
          disabled={loading}
          className={`mt-3 w-full py-2 text-white rounded-md transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Processing..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/auth" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
