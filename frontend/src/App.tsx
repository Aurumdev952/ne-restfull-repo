import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { SWRConfig } from "swr";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage"; // Import UnauthorizedPage

import ProtectedRoute from "./components/shared/ProtectedRoute"; // General authentication
import RoleProtectedRoute from "./components/shared/RoleProtectedRoute"; // Role-based access
import type { UserRole } from "./types"; // Import UserRole
// Import UserRole

import DashboardLayout from "./components/layout/DashboardLayout";
import CreateItemPage from "./pages/dashboard/CreateItemPage";
import DashboardOverviewPage from "./pages/dashboard/DashboardOverviewPage";
import UpdateItemPage from "./pages/dashboard/UpdateItemPage";
import ViewAllItemsPage from "./pages/dashboard/ViewAllItemsPage";
import ViewItemsTablePage from "./pages/dashboard/ViewItemsTablePage";
import ViewSingleItemPage from "./pages/dashboard/ViewSingleItemPage";

// Define roles for routes (matches roles in Sidebar and UserRole type)
const ALL_AUTHENTICATED: UserRole[] = ["ADMIN", "USER"];
const USERS_ONLY: UserRole[] = ["USER"];
const ADMINS_ONLY: UserRole[] = ["ADMIN"]; // If you have admin-only routes

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Dashboard routes are generally protected by authentication first */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                {/* Overview - all authenticated users */}
                <Route
                  element={
                    <RoleProtectedRoute allowedRoles={ALL_AUTHENTICATED} />
                  }
                >
                  <Route index element={<DashboardOverviewPage />} />
                  <Route path="items/cards" element={<ViewAllItemsPage />} />
                  <Route path="items/table" element={<ViewItemsTablePage />} />
                  <Route
                    path="items/:itemId"
                    element={<ViewSingleItemPage />}
                  />
                </Route>

                {/* Create and Update items - Editors and Admins */}
                <Route
                  element={<RoleProtectedRoute allowedRoles={ALL_AUTHENTICATED} />}
                >
                  <Route path="items/create" element={<CreateItemPage />} />
                  <Route
                    path="items/update/:itemId"
                    element={<UpdateItemPage />}
                  />
                </Route>

                {/* Example for an admin-only section if you had one
                <Route element={<RoleProtectedRoute allowedRoles={ADMINS_ONLY} />}>
                  <Route path="admin/settings" element={<AdminSettingsPage />} />
                </Route>
                */}

                <Route
                  path="/dashboard/"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
