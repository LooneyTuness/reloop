"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface SignUpFormProps extends Dialog.DialogProps {
  onSwitchToLogin?: () => void;
}

export default function SignUpForm(props: SignUpFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Removed unused user and loading from useAuth
  useAuth();
  const { t } = useLanguage();

  async function handleSignUp() {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage(t("fillAllFields"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage(t("passwordsNotMatch"));
      return;
    }

    if (formData.password.length < 8) {
      setMessage(t("passwordTooShort"));
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setMessage(""); // Clear previous messages

    try {
      // Debug: Log the email being sent
      console.log("Attempting to sign up with email:", formData.email);
      console.log("Email validation:", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
      
      // Try to create new user first
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(), // Trim whitespace and convert to lowercase
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        // Check if user already exists
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          setMessage(t("accountExists"));
        } else if (error.message.includes("Email address is invalid")) {
          setMessage("Please enter a valid email address");
        } else {
          setMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          setMessage("Account created and confirmed! You can now sign in.");
          setTimeout(() => {
            props.onOpenChange?.(false);
          }, 2000);
        } else {
          setMessage("Account created! Please check your email and click the confirmation link to complete your registration.");
          // Don't close the modal immediately - let user see the message
          setTimeout(() => {
            props.onOpenChange?.(false);
          }, 5000);
        }
      }
    } catch (error) {
      setMessage(t("errorOccurred"));
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4 bg-white p-8 z-50 border border-gray-200">
          <div className="flex items-center justify-between pb-6">
            <Dialog.Title className="text-xl font-light text-black">
              {t("createAccountTitle")}
            </Dialog.Title>

            <Dialog.Close className="px-2 py-1 hover:bg-gray-50 transition-colors">
              <span className="text-xl text-gray-400">×</span>
            </Dialog.Close>
          </div>

          <div className="pb-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder={t("enterFullName")}
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  {t("email")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t("enterEmail")}
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  {t("password")}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={t("enterPassword")}
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  {t("confirmPassword")}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder={t("confirmPasswordPlaceholder")}
                />
              </div>
            </div>

            {message && (
              <div
                className={`mt-6 p-4 text-sm font-light ${message.includes("successfully")
                    ? "bg-gray-50 text-black border border-gray-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                  }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => props.onOpenChange?.(false)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 hover:text-black hover:border-black transition-all font-light"
                disabled={isLoading}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSignUp}
                className="flex-1 px-6 py-3 bg-black text-white transition-all font-light hover:bg-gray-900"
                disabled={isLoading}
              >
                {isLoading ? t("creatingAccount") : t("createAccount")}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 font-light">
                {t("alreadyHaveAccount")}{" "}
                <button
                  onClick={props.onSwitchToLogin}
                  className="text-black hover:text-gray-600 font-light transition-colors"
                  disabled={isLoading}
                >
                  {t("logInHere")}
                </button>
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
