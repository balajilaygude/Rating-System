import { useState } from "react";
import api from "../../services/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(form.newPassword)) {
      setError(
        "Password must be 8–16 characters and contain at least one uppercase letter and one special character."
      );
      return;
    }

    try {
      setLoading(true);

      await api.patch("/auth/password", {
        currentPassword:
          form.currentPassword,

        newPassword:
          form.newPassword,
      });

      setSuccess(
        "Password changed successfully."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Change Password
      </h1>

      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-5">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={
                form.currentPassword
              }
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              minLength={8}
              maxLength={16}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              8–16 characters, one uppercase
              letter and one special character.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={
                form.confirmPassword
              }
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg"
          >
            {loading
              ? "Updating..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}