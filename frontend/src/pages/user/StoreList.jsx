import { useEffect, useState } from "react";

import api from "../../services/api";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import RatingStars from "../../components/RatingStars";
import RatingForm from "../../components/RatingForm";
import Loading from "../../components/Loading";

export default function StoreList() {
  const [stores, setStores] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStores();
  }, [page, search, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/stores", {
        params: {
          page,
          limit: 9,
          search,
          sortBy,
          sortOrder,
        },
      });

      setStores(response.data.stores || []);
      setTotalPages(
        response.data.totalPages || 1
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load stores"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (e) => {
    const value = e.target.value;

    if (value === "ratingHigh") {
      setSortBy("averageRating");
      setSortOrder("desc");
    }

    if (value === "ratingLow") {
      setSortBy("averageRating");
      setSortOrder("asc");
    }

    if (value === "nameAsc") {
      setSortBy("name");
      setSortOrder("asc");
    }

    if (value === "nameDesc") {
      setSortBy("name");
      setSortOrder("desc");
    }

    if (value === "newest") {
      setSortBy("createdAt");
      setSortOrder("desc");
    }

    setPage(1);
  };

  const handleRatingSuccess = () => {
    fetchStores();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Stores
        </h1>

        <p className="text-gray-500 mt-1">
          Search stores and submit your rating
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search stores..."
          />

          <select
            onChange={handleSort}
            defaultValue="newest"
            className="border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="newest">
              Newest
            </option>

            <option value="nameAsc">
              Name A-Z
            </option>

            <option value="nameDesc">
              Name Z-A
            </option>

            <option value="ratingHigh">
              Highest Rating
            </option>

            <option value="ratingLow">
              Lowest Rating
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stores */}
      {loading ? (
        <Loading />
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-500">
            No stores found.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store._id}
                store={store}
                onRatingSuccess={
                  handleRatingSuccess
                }
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

function StoreCard({
  store,
  onRatingSuccess,
}) {
  const averageRating =
    Number(store.averageRating) || 0;

  const totalRatings =
    Number(store.totalRatings) || 0;

  const userRating =
    Number(store.userRating) || 0;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
      {/* Store Name */}
      <h2 className="text-xl font-bold text-gray-800">
        {store.name}
      </h2>

      {/* Email */}
      <p className="text-sm text-gray-500 mt-2">
        {store.email}
      </p>

      {/* Address */}
      <p className="text-sm text-gray-600 mt-3">
        📍 {store.address}
      </p>

      {/* Rating */}
      <div className="border-t mt-5 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Average Rating
            </p>

            <div className="flex items-center gap-2 mt-1">
              <RatingStars
                rating={averageRating}
                size="text-lg"
              />

              <span className="font-semibold text-gray-700">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Ratings
            </p>

            <p className="font-bold text-gray-800">
              {totalRatings}
            </p>
          </div>
        </div>
      </div>

      {/* User rating */}
      <RatingForm
        storeId={store._id}
        currentRating={userRating}
        onSuccess={onRatingSuccess}
      />
    </div>
  );
}