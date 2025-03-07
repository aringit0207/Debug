import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "/home/bengali0207/Desktop/Mellow/Frontend/my-app/firebase.js";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function AuthenticationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication state persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(currentUser);
          navigate("/home"); // Redirect to home if user is already logged in
        } else {
          console.log("User data missing in Firestore");
          alert("User data not found. Please sign up first.");
          signOut(auth); // Sign out if Firestore entry doesn't exist
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Store user in Firestore
  const storeUserData = async (user, authType) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "No Name",
          email: user.email,
          profilePic: user.photoURL || "",
          authType: authType,
          bio: "Hey there! I am using this app.",
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
          isOnline: true,
          followers: [],
          following: [],
        });
      } else {
        // Update lastSeen and isOnline status
        await setDoc(
          userRef,
          { lastSeen: serverTimestamp(), isOnline: true },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error storing user data:", error.message);
    }
  };

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user document using UID
      const userDocRef = doc(db, "users", user.uid); 
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        console.log("Login Error: User does not exist in Firestore.");
        alert("User does not exist. Please sign up first.");
        return;
      }

      // Update lastSeen and isOnline status
      await setDoc(userDocRef, { lastSeen: serverTimestamp(), isOnline: true }, { merge: true });

      console.log("Login Successful!");
      navigate("/home"); // Redirect after login
    } catch (error) {
      console.log("Login Error:", error.message);
      alert(error.message);
    }
  };

  // Handle Google login
  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await storeUserData(result.user, "google");
      console.log("Google login successful");
      navigate("/home"); // Redirect after Google login
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleLoginWithGoogle}
          className="mt-3 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Continue with Google
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
