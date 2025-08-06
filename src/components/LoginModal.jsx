import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginModal({ open, onOpenChange, onSwitchToSignUp }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user) {
        setMessage("Welcome back!");
        setTimeout(() => {
          onOpenChange?.(false);
        }, 1000);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4 bg-white p-8 rounded-xl shadow-2xl z-50 border border-gray-200">
          <div className="flex items-center justify-between p-6 pb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Sign In
            </Dialog.Title>

            <Dialog.Close className="px-2 py-1 rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-xl text-gray-400">×</span>
            </Dialog.Close>
          </div>

          <div className="px-6 pb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  message.includes("Welcome") ||
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onOpenChange?.(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-sm disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
