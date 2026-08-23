// src/pages/AuthPage.js
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student"); // default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        }, {
          data: { role } // optional: save role in user metadata
        });

        if (error) throw error;
        setSuccess("Account created! Please check your email to confirm.");
        setEmail("");
        setPassword("");
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setSuccess("Signed in successfully!");
        setEmail("");
        setPassword("");
        // Redirect user to dashboard if needed
        // navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-section">
        <h2>{isSignUp ? "Create New Account" : "Sign In"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Student">Student (Mastery Tracker)</option>
              <option value="Teacher">Teacher</option>
            </select>
          )}

          <button type="submit">{isSignUp ? "Create Account" : "Sign In"}</button>
        </form>

        <p
          style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account? Sign In" : "New Account? Create one"}
        </p>
      </section>
    </div>
  );
};

export default AuthPage;
