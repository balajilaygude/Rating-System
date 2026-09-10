import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

export default function CreateUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
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

    if (form.name.length < 20 || form.name.length > 60) {
      setError("Name must be between 20 and 60 characters.");
      return;
    }

    if (form.address.length > 400) {
      setError("Address cannot exceed 400 characters.");
      return;
    }

    if (
      form.password.length < 8 ||
      form.password.length > 16
    ) {
      setError("Password must be between 8 and 16 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/admin/users", form);

      setSuccess("User created successfully.");

      setForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/admin/users")}
        className="text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Users
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create User
      </h1>

      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={20}
              maxLength={60}
              required
              placeholder="Enter full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              20–60 characters
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="user@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              maxLength={16}
              required
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              8–16 characters, at least one uppercase letter
              and one special character.
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              maxLength={400}
              required
              rows={4}
              placeholder="Enter address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />

            <p className="text-xs text-gray-500 mt-1">
              Maximum 400 characters
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            >
              <option value="USER">
                Normal User
              </option>

              <option value="STORE_OWNER">
                Store Owner
              </option>

              <option value="ADMIN">
                System Administrator
              </option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg"
            >
              {loading ? "Creating..." : "Create User"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="border border-gray-300 hover:bg-gray-100 px-6 py-2.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}