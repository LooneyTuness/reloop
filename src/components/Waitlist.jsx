import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const interestOptions = [
    {
      id: "selling",
      label: "Selling my clothes",
      icon: "💰",
      description: "Turn your closet into cash",
    },
    {
      id: "buying",
      label: "Buying sustainable fashion",
      icon: "🛍️",
      description: "Discover unique pre-loved pieces",
    },
    {
      id: "community",
      label: "Joining eco community",
      icon: "🌱",
      description: "Connect with like-minded people",
    },
    {
      id: "impact",
      label: "Tracking my eco impact",
      icon: "📊",
      description: "See your environmental difference",
    },
  ];

  const handleInterestChange = (interestId) => {
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const { error } = await supabase.from("waitlist").insert([
        {
          email: email.trim(),
          name: name.trim() || null,
          interests: interests,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          setMessage("You're already on our waitlist! We'll be in touch soon.");
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <WaitlistSuccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-brand-100/20 to-accent-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-16 px-6">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-16">
            {/* Logo */}
            <div className="inline-flex items-center space-x-4 mb-10">
              <div className="w-20 h-20 brand-gradient rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-3xl font-bold">R</span>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  Reloop
                </h1>
                <p className="text-base text-gray-500 uppercase tracking-widest font-semibold">
                  Circular Fashion
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full mb-10 shadow-xl">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              <span className="text-lg font-bold">The Solution is Here</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-8 mb-12">
              <h2 className="text-5xl sm:text-7xl font-black text-gray-900 leading-none">
                Tired of{" "}
                <span className="relative inline-block">
                  <span className="line-through text-gray-400 decoration-red-500 decoration-4">
                    Overpriced
                  </span>
                </span>
                <br />
                <span className="text-gray-800">Fast Fashion?</span>
              </h2>

              <h3 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Welcome to Circular Style
              </h3>
            </div>

            {/* Enhanced Value Props */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-black text-gray-900 mb-2">60</div>
                <div className="text-sm text-gray-600">seconds to sell</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-black text-green-600 mb-2">
                  70%
                </div>
                <div className="text-sm text-gray-600">off retail prices</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-black text-blue-600 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600">sustainable impact</div>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10 mb-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label
                  htmlFor="name"
                  className="block text-lg font-bold text-gray-800"
                >
                  Name{" "}
                  <span className="text-gray-500 font-normal text-base">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-300 text-lg text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="block text-lg font-bold text-gray-800"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-300 text-lg text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Interests */}
              <div className="space-y-5">
                <label className="block text-lg font-bold text-gray-800">
                  What interests you most?{" "}
                  <span className="text-gray-500 font-normal text-base">
                    (select all that apply)
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {interestOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                        interests.includes(option.id)
                          ? "border-brand-500 bg-brand-50 shadow-lg scale-105"
                          : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 hover:scale-102"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={interests.includes(option.id)}
                        onChange={() => handleInterestChange(option.id)}
                        className="w-6 h-6 text-brand-600 border-2 border-gray-300 rounded-lg focus:ring-brand-500 transition-all duration-300"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {option.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-6 px-8 rounded-2xl font-black text-xl text-white transition-all duration-300 transform ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600 hover:scale-105 hover:shadow-2xl shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Joining waitlist...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Join the Waitlist</span>
                    <span className="text-2xl">🚀</span>
                  </div>
                )}
              </button>

              {/* Message */}
              {message && (
                <div
                  className={`text-center text-lg font-semibold ${
                    message.includes("already")
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              🔒 No spam, ever. Unsubscribe with one click.
            </p>
            <div className="flex justify-center space-x-8 text-xs text-gray-400">
              <span>✓ GDPR Compliant</span>
              <span>✓ Secure Data</span>
              <span>✓ Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Success Component
function WaitlistSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-6">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              You're on the list!
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Welcome to the sustainable fashion revolution! We'll notify you as
              soon as Reloop launches.
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 mb-8">
            <h3 className="font-black text-gray-900 mb-6 text-xl">
              What happens next?
            </h3>
            <div className="space-y-5 text-left">
              {[
                "You'll get early access when we launch",
                "Exclusive updates on our progress",
                "Special launch day perks and discounts",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-8 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:scale-105 transition-all duration-300 font-black text-lg shadow-xl mb-6"
          >
            Back to Home
          </button>

          <div className="text-gray-500">
            <p className="text-sm mb-3">Follow us for updates:</p>
            <div className="flex justify-center space-x-6">
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-brand-600 hover:text-brand-700 transition-colors font-semibold"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
