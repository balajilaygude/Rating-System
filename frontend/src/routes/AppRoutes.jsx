import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import DashboardLayout from "../components/DashboardLayout";

import Login from "../pages/Login";
import Signup from "../pages/Signup";

import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import UserDetails from "../pages/admin/UserDetails";
import CreateUser from "../pages/admin/CreateUser";
import Stores from "../pages/admin/Stores";
import CreateStore from "../pages/admin/CreateStore";

import StoreList from "../pages/user/StoreList";
import UserChangePassword from "../pages/user/ChangePassword";

import OwnerDashboard from "../pages/owner/Dashboard";
import OwnerChangePassword from "../pages/owner/ChangePassword";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ADMIN */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route
                path="/admin/dashboard"
                element={
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                }
              />

              <Route
                path="/admin/users/:id"
                element={
                  <DashboardLayout>
                    <UserDetails />
                  </DashboardLayout>
                }
              />

              <Route
                path="/admin/users/create"
                element={
                  <DashboardLayout>
                    <CreateUser />
                  </DashboardLayout>
                }
              />

              <Route
                path="/admin/stores"
                element={
                  <DashboardLayout>
                    <Stores />
                  </DashboardLayout>
                }
              />

              <Route
                path="/admin/stores/create"
                element={
                  <DashboardLayout>
                    <CreateStore />
                  </DashboardLayout>
                }
              />
            </Route>
          </Route>

          {/* NORMAL USER */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["USER"]} />}>
              <Route
                path="/stores"
                element={
                  <DashboardLayout>
                    <StoreList />
                  </DashboardLayout>
                }
              />

              <Route
                path="/user/password"
                element={
                  <DashboardLayout>
                    <UserChangePassword />
                  </DashboardLayout>
                }
              />
            </Route>
          </Route>

          {/* STORE OWNER */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <RoleRoute allowedRoles={["STORE_OWNER"]} />
              }
            >
              <Route
                path="/owner/dashboard"
                element={
                  <DashboardLayout>
                    <OwnerDashboard />
                  </DashboardLayout>
                }
              />

              <Route
                path="/owner/password"
                element={
                  <DashboardLayout>
                    <OwnerChangePassword />
                  </DashboardLayout>
                }
              />
            </Route>
          </Route>

          {/* Default */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}