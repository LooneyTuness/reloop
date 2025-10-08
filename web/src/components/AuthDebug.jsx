"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function AuthDebug() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const testLogin = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        console.error("Login error:", error);
      } else {
        setMessage(`Success! User: ${data.user?.email}`);
        console.log("Login success:", data);
      }
    } catch (error) {
      setMessage(`Exception: ${error.message}`);
      console.error("Login exception:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignUp = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(`SignUp Error: ${error.message}`);
        console.error("SignUp error:", error);
      } else {
        setMessage(`SignUp Success! User: ${data.user?.email}, Confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`);
        console.log("SignUp success:", data);
      }
    } catch (error) {
      setMessage(`SignUp Exception: ${error.message}`);
      console.error("SignUp exception:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(`SignOut Error: ${error.message}`);
    } else {
      setMessage("Signed out successfully");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Auth Debug</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">Current User: {user ? user.email : 'None'}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="test@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="password123"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Test Login"}
          </button>

          <button
            onClick={testSignUp}
            disabled={isLoading}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Test SignUp"}
          </button>

          <button
            onClick={testSignOut}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Test SignOut
          </button>
        </div>

        {message && (
          <div className="p-3 bg-gray-100 rounded text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
