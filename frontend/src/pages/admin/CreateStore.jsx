import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

export default function CreateStore() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await api.get("/admin/users", {
        params: {
          role: "STORE_OWNER",
          limit: 100,
        },
      });

      setOwners(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load store owners"
      );
    } finally {
      setLoadingOwners(false);
    }
  };

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
      setError(
        "Store name must be between 20 and 60 characters."
      );
      return;
    }

    if (form.address.length > 400) {
      setError(
        "Address cannot exceed 400 characters."
      );
      return;
    }

    if (!form.owner) {
      setError("Please select a store owner.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/admin/stores", form);

      setSuccess("Store created successfully.");

      setForm({
        name: "",
        email: "",
        address: "",
        owner: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create store"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/admin/stores")}
        className="text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Stores
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create Store
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
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Store Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={20}
              maxLength={60}
              required
              placeholder="Enter store name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500 mt-1">
              20–60 characters
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Store Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="store@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              placeholder="Enter store address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500 mt-1">
              Maximum 400 characters
            </p>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Store Owner
            </label>

            {loadingOwners ? (
              <p className="text-gray-500 text-sm">
                Loading store owners...
              </p>
            ) : (
              <select
                name="owner"
                value={form.owner}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select Store Owner
                </option>

                {owners.map((owner) => (
                  <option
                    key={owner._id}
                    value={owner._id}
                  >
                    {owner.name} — {owner.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || loadingOwners}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg"
            >
              {loading
                ? "Creating..."
                : "Create Store"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/stores")}
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