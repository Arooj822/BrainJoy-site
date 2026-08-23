import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../utils/auth";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

const ProfilePage = () => {
  const [userData, setUserData] = useState({ name: "", email: "", avatar: "" });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUserData(docSnap.data());
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updates = { name: userData.name };

    // TODO: handle avatar upload (later)
    if (avatarFile) {
      // upload avatar to Firebase Storage and get URL
      // updates.avatar = uploadedURL
    }

    await updateUserProfile(auth.currentUser.uid, updates);
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          className="w-full p-2 border mb-4 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          disabled
          className="w-full p-2 border mb-4 rounded bg-gray-200"
        />
        <input
          type="file"
          onChange={(e) => setAvatarFile(e.target.files[0])}
          className="w-full p-2 mb-4"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
