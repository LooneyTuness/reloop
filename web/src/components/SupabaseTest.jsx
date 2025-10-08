"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState("Testing...");
  const [tables, setTables] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.from('items').select('*').limit(1);
      
      if (error) {
        setConnectionStatus(`Error: ${error.message}`);
        setError(error);
        console.error("Supabase connection error:", error);
      } else {
        setConnectionStatus("✅ Connected to Supabase");
        console.log("Supabase connection successful:", data);
      }
    } catch (err) {
      setConnectionStatus(`Exception: ${err.message}`);
      setError(err);
      console.error("Supabase connection exception:", err);
    }
  };

  const testTables = async () => {
    try {
      // Test if users table exists
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);
      
      if (usersError) {
        setUsers([`Users table error: ${usersError.message}`]);
      } else {
        setUsers(usersData || []);
      }

      // Test if items table exists
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .limit(5);
      
      if (itemsError) {
        setTables([`Items table error: ${itemsError.message}`]);
      } else {
        setTables(itemsData || []);
      }

    } catch (err) {
      console.error("Table test error:", err);
      setError(err);
    }
  };

  const createTestUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      if (error) {
        setError(error);
        console.error("Sign up error:", error);
      } else {
        console.log("Sign up success:", data);
        setConnectionStatus("Test user created! Check your email for confirmation.");
      }
    } catch (err) {
      setError(err);
      console.error("Sign up exception:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Connection Status:</h3>
          <p className="text-sm text-gray-600">{connectionStatus}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700">
            <strong>Error:</strong> {error.message || error.toString()}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={testConnection}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Test Connection
          </button>

          <button
            onClick={testTables}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Test Tables
          </button>

          <button
            onClick={createTestUser}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            Create Test User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Users Table:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(users, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Items Table:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(tables, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
