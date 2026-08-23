import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";

// Register user
export const registerUser = async (email, password, name, role) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  // Store role in localStorage for simplicity
  localStorage.setItem("userRole", role);
  return userCredential.user;
};

// Login user
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout user
export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem("userRole");
};

// Get current user role
export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

// Update user profile (name, avatar)
export const updateUserProfile = async (displayName, photoURL) => {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName, photoURL });
  }
};


