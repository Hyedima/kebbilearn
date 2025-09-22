"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    newsletter: true,
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
    // 🔧 Replace this with your actual API call
  };

  return (
    <main className="pt-24 px-4 min-h-screen bg-white text-gray-800">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 border p-6 rounded-lg shadow-sm bg-gray-50"
        >
          {/* Profile Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Subscribe to newsletter</span>
            </label>
          </div>

          {/* Password */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
