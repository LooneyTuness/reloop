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
        console.error("Login error details:", error);
        if (error.message === "Invalid login credentials") {
          setMessage("Invalid email or password. If you just signed up, please check your email for a confirmation link.");
        } else if (error.message === "Email not confirmed") {
          setMessage("Please check your email and click the confirmation link before logging in.");
        } else {
          setMessage(error.message);
        }
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4 bg-white p-8 z-50 border border-gray-200">
          <div className="flex items-center justify-between pb-6">
            <Dialog.Title className="text-xl font-light text-black">
              Sign In
            </Dialog.Title>

            <Dialog.Close className="px-2 py-1 hover:bg-gray-50 transition-colors">
              <span className="text-xl text-gray-400">×</span>
            </Dialog.Close>
          </div>

          <div className="pb-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
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
                className={`mt-6 p-4 text-sm font-light ${
                  message.includes("Welcome") ||
                  message.includes("successfully")
                    ? "bg-gray-50 text-black border border-gray-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => onOpenChange?.(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 hover:text-black hover:border-black transition-all font-light"
              >
                Cancel
              </button>
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-black text-white transition-all font-light hover:bg-gray-900 disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 font-light">
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-black hover:text-gray-600 font-light transition-colors"
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
