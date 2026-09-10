import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import Loading from "../../components/Loading";
import RatingStars from "../../components/RatingStars";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/admin/users/${id}`);

      setUser(response.data.user || response.data);
      setStore(response.data.store );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load user"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-gray-500">
        User not found.
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/users")}
        className="text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Users
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        User Details
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem
            label="Name"
            value={user.name}
          />

          <DetailItem
            label="Email"
            value={user.email}
          />

          <DetailItem
            label="Address"
            value={user.address}
          />

          <DetailItem
            label="Role"
            value={user.role}
          />

          <DetailItem
            label="Created At"
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"
            }
          />
        </div>

        {/* Store Owner Information */}
        {user.role === "STORE_OWNER" &&
          store && (
            <div className="border-t mt-8 pt-8">
              <h2 className="text-xl font-bold mb-4">
                Store Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  label="Store Name"
                  value={store.name}
                />

                <DetailItem
                  label="Store Email"
                  value={store.email}
                />

                <DetailItem
                  label="Store Address"
                  value={store.address}
                />

                <div>
                  <p className="text-sm text-gray-500">
                    Average Rating
                  </p>

                  <div className="flex items-center gap-3 mt-1">
                    <RatingStars
                      rating={store.averageRating}
                    />

                    <span className="font-semibold">
                      {store.averageRating || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-medium text-gray-800 mt-1 break-words">
        {value || "-"}
      </p>
    </div>
  );
}