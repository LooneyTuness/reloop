"use client";

import { useState } from "react";

export default function EmailTestPage() {
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testEmailSending = async () => {
    if (!testEmail) {
      alert("Please enter an email address");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          subject: 'vtoraraka Email Test',
          message: 'This is a test email to verify your email configuration is working correctly.'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to send test email", details: error });
    } finally {
      setLoading(false);
    }
  };

  const checkEmailConfig = async () => {
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to check email config", details: error });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Email Configuration Test
          </h1>

          <div className="space-y-6">
            {/* Check Configuration */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Check Email Configuration
              </h2>
              <button
                onClick={checkEmailConfig}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Check Config
              </button>
            </div>

            {/* Test Email Sending */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Test Email Sending
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your-email@example.com"
                  />
                </div>
                <button
                  onClick={testEmailSending}
                  disabled={loading}
                  className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Test Email'}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Results
                </h2>
                <pre className="bg-white p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                📧 Email Setup Instructions
              </h2>
              <div className="text-yellow-700 space-y-2">
                <p><strong>1. Gmail App Password:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Go to Google Account Settings</li>
                  <li>Security → 2-Step Verification (enable if needed)</li>
                  <li>Security → App passwords</li>
                  <li>Generate password for "Mail"</li>
                  <li>Copy the 16-character password</li>
                </ul>
                
                <p className="mt-4"><strong>2. Update .env.local:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>EMAIL_USER=your-gmail@gmail.com</li>
                  <li>EMAIL_APP_PASSWORD=your_16_char_password</li>
                </ul>
                
                <p className="mt-4"><strong>3. Restart Server:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Stop development server (Ctrl+C)</li>
                  <li>Run npm run dev again</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
