import { useEffect, useState } from "react";

import api from "../../services/api";
import Loading from "../../components/Loading";
import RatingStars from "../../components/RatingStars";
import Table from "../../components/Table";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/ratings/owner/dashboard"
      );
      setDashboard(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
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

  if (!dashboard) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        No dashboard data available.
      </div>
    );
  }

  const store = dashboard.store;
  const ratings = dashboard.ratings || [];

  const sortedRatings = [...ratings].sort(
  (a, b) => {
    let first;
    let second;

    if (sortBy === "user") {
      first = a.user?.name || "";
      second = b.user?.name || "";
    } else if (sortBy === "email") {
      first = a.user?.email || "";
      second = b.user?.email || "";
    } else if (sortBy === "rating") {
      first = a.rating;
      second = b.rating;
    } else {
      first = new Date(
        a.createdAt
      ).getTime();

      second = new Date(
        b.createdAt
      ).getTime();
    }

    if (
      typeof first === "string"
    ) {
      return sortOrder === "asc"
        ? first.localeCompare(second)
        : second.localeCompare(first);
    }

    return sortOrder === "asc"
      ? first - second
      : second - first;
  }
);
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Store Owner Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Monitor ratings and customer feedback
        </p>
      </div>

      {/* Store information */}
      {store && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {store.name}
          </h2>

          <p className="text-gray-500 mt-2">
            {store.email}
          </p>

          <p className="text-gray-600 mt-1">
            📍 {store.address}
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Average Rating */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">
            Average Rating
          </p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-4xl font-bold text-gray-800">
              {Number(
                store?.averageRating || 0
              ).toFixed(1)}
            </span>

            <RatingStars
              rating={
                Number(
                  store?.averageRating || 0
                )
              }
              size="text-2xl"
            />
          </div>
        </div>

        {/* Total Ratings */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">
            Total Ratings
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">
            {store?.totalRatings || 0}
          </p>
        </div>
      </div>

      {/* Rating Users */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Customer Ratings
          </h2>

          <p className="text-gray-500 mt-1">
            Users who have rated your store
          </p>
        </div>

        <Table
          columns={[
            {
              key: "user",
              label: "User",
              sortable: true,
              render: (item) =>
                item.user?.name || "-",
            },
            {
              key: "email",
              label: "Email",
              sortable: true,
              render: (item) =>
                item.user?.email || "-",
            },
            {
              key: "rating",
              label: "Rating",
              sortable: true,
              render: (item) => (
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={item.rating}
                    size="text-base"
                  />

                  <span className="font-semibold">
                    {item.rating}/5
                  </span>
                </div>
              ),
            },
            {
              key: "createdAt",
              label: "Date",
              sortable: true,
              render: (item) =>
                item.createdAt
                  ? new Date(
                      item.createdAt
                    ).toLocaleDateString()
                  : "-",
            },
          ]}
          data={sortedRatings}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}