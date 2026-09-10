import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import RatingStars from "../../components/RatingStars";
import Loading from "../../components/Loading";

export default function Stores() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchStores();
  }, [page, search, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/stores", {
        params: {
          page,
          limit: 10,
          search,
          sortBy,
          sortOrder,
        },
      });

      setStores(response.data.stores || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load stores"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Stores
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all stores in the system
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/stores/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
        >
          + Create Store
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search by store name or email..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <Table
            columns={[
              {
                key: "name",
                label: "Store Name",
                sortable: true,
              },
              {
                key: "email",
                label: "Email",
                sortable: true,
              },
              {
                key: "address",
                label: "Address",
                sortable: true,
              },
              {
                key: "owner",
                label: "Owner",
                sortable: false,
                render: (store) =>
                  store.owner?.name || "Not assigned",
              },
              {
                key: "averageRating",
                label: "Rating",
                sortable: true,
                render: (store) => (
                  <div className="flex items-center gap-2">
                    <RatingStars
                      rating={store.averageRating || 0}
                      size="text-base"
                    />

                    <span className="text-sm font-medium">
                      {Number(
                        store.averageRating || 0
                      ).toFixed(1)}
                    </span>
                  </div>
                ),
              },
              {
                key: "totalRatings",
                label: "Ratings",
                sortable: true,
              },
            ]}
            data={stores}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

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