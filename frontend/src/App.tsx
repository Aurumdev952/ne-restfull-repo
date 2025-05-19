import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SWRConfig } from 'swr';
import { Toaster } from '@/components/ui/sonner'; // Using sonner directly

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

import ProtectedRoute from './components/shared/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import ViewAllItemsPage from './pages/dashboard/ViewAllItemsPage';
import ViewItemsTablePage from './pages/dashboard/ViewItemsTablePage';
import ViewSingleItemPage from './pages/dashboard/ViewSingleItemPage';
import CreateItemPage from './pages/dashboard/CreateItemPage';
import UpdateItemPage from './pages/dashboard/UpdateItemPage';

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverviewPage />} />
                <Route path="items/cards" element={<ViewAllItemsPage />} />
                <Route path="items/table" element={<ViewItemsTablePage />} />
                <Route path="items/create" element={<CreateItemPage />} />
                <Route path="items/:itemId" element={<ViewSingleItemPage />} />
                <Route path="items/update/:itemId" element={<UpdateItemPage />} />
                 {/* Redirect /dashboard/ to /dashboard/overview or first valid page */}
                <Route path="/dashboard/" element={<Navigate to="/dashboard" replace />} />
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
