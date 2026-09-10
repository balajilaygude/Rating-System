import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchUsers();
  }, [page, search, role, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users", {
        params: {
          page,
          limit: 10,
          search,
          role,
          sortBy,
          sortOrder,
        },
      });

      const data = response.data;

      setUsers(data.data || []);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load users"
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
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all registered users
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/users/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
        >
          + Create User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search by name or email..."
          />

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">
              Store Owner
            </option>
          </select>
        </div>
      </div>

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
                label: "Name",
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
                key: "role",
                label: "Role",
                sortable: true,
                render: (user) => (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    {user.role}
                  </span>
                ),
              },
            ]}
            data={users}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            renderActions={(user) => (
              <button
                onClick={() =>
                  navigate(`/admin/users/${user._id}`)
                }
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View
              </button>
            )}
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