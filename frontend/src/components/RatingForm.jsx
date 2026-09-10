import { useState } from "react";
import api from "../services/api";

export default function RatingForm({
  storeId,
  currentRating = 0,
  onSuccess,
}) {
  const [rating, setRating] = useState(currentRating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasExistingRating = currentRating > 0;

  const submitRating = async () => {
    if (rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response;

      if (hasExistingRating) {
        response = await api.patch(
          `/ratings/stores/${storeId}/ratings`,
          {
            rating,
          }
        );
      } else {
        response = await api.post(
          `/ratings/stores/${storeId}/ratings`,
          {
            rating,
          }
        );
      }

      if (onSuccess) {
        onSuccess(
          response.data.store ||
            response.data
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save rating"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 border-t pt-4">
      <p className="text-sm font-semibold text-gray-700 mb-2">
        {hasExistingRating
          ? "Your Rating"
          : "Rate this store"}
      </p>

      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`text-3xl transition ${
              value <= rating
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-3">
          {error}
        </p>
      )}

      <button
        onClick={submitRating}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm"
      >
        {loading
          ? "Saving..."
          : hasExistingRating
          ? "Update Rating"
          : "Submit Rating"}
      </button>
    </div>
  );
}