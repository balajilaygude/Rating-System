import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Create User", path: "/admin/users/create" },
    { name: "Stores", path: "/admin/stores" },
    { name: "Create Store", path: "/admin/stores/create" },
  ];

  const userLinks = [
    { name: "Stores", path: "/stores" },
    { name: "Change Password", path: "/user/password" },
  ];

  const ownerLinks = [
    { name: "Dashboard", path: "/owner/dashboard" },
    { name: "Change Password", path: "/owner/password" },
  ];

  let links = [];

  if (user?.role === "ADMIN") {
    links = adminLinks;
  } else if (user?.role === "USER") {
    links = userLinks;
  } else if (user?.role === "STORE_OWNER") {
    links = ownerLinks;
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}