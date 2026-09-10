import { useEffect, useState } from "react";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");

      setStats({
        totalUsers: response.data.data.totalUsers || 0,
        totalStores: response.data.data.totalStores || 0,
        totalRatings: response.data.data.totalRatings || 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of the Store Rating System
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
        />

        <StatCard
          title="Total Stores"
          value={stats.totalStores}
        />

        <StatCard
          title="Total Ratings"
          value={stats.totalRatings}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500 text-sm font-medium">
        {title}
      </p>

      <p className="text-4xl font-bold text-gray-800 mt-3">
        {value}
      </p>
    </div>
  );
}