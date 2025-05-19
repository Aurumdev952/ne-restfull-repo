Okay, let's enhance your application with role-based access control (RBAC).

1. Define Roles (Conceptually)

For this example, let's define a few roles:

ADMIN: Can do everything.

EDITOR: Can manage items (create, update, view).

VIEWER: Can only view items.

You can expand or change these as needed.

2. Update Types

Modify src/types/index.ts to include a role for the User.

// src/types/index.ts
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'; // Define possible roles

export interface User {
  id: string;
  email: string;
  role: UserRole; // Add role here
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  signup: (token: string, user: User) => void;
}

export * from './item';


3. Update Authentication Service (Mock Roles)

Modify src/services/authService.ts to assign a mock role upon login/signup. In a real application, the role would come from your backend (e.g., included in the JWT payload or a separate API call).

// src/services/authService.ts
import apiClient from '../lib/axios';
import { LoginFormData, SignupFormData } from '../lib/zodSchemas';
import { User, UserRole } from '../types';

interface AuthResponse {
  token: string;
  // Backend might return user info including role here
}

const getMockRole = (email: string): UserRole => {
  if (email.startsWith('admin@')) return 'ADMIN';
  if (email.startsWith('editor@')) return 'EDITOR';
  return 'VIEWER';
};

export const loginUser = async (credentials: LoginFormData): Promise<{ token: string; user: User }> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  // In a real app, decode token or use API response for user details including role
  const user: User = {
    id: 'mock_user_id_from_login',
    email: credentials.email,
    role: getMockRole(credentials.email), // Assign mock role
  };
  return { token: response.data.token, user };
};

export const signupUser = async (userData: SignupFormData): Promise<{ token: string; user: User }> => {
  const { confirmPassword, ...payload } = userData; // eslint-disable-line @typescript-eslint/no-unused-vars
  const response = await apiClient.post<AuthResponse>('/auth/signup', payload);
  const user: User = {
    id: 'mock_user_id_from_signup',
    email: userData.email,
    role: getMockRole(userData.email), // Assign mock role (or default to VIEWER)
  };
  return { token: response.data.token, user };
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

4. Update AuthContext

The AuthContext should already handle the user object correctly. Just ensure the User type is imported correctly, and the user object now includes the role. The existing logic for storing/retrieving authUser from localStorage will now include the role.

5. Create RoleProtectedRoute.tsx

This new component will handle role-based authorization.

Create src/components/shared/RoleProtectedRoute.tsx:

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageSpinner from './PageSpinner';
import { UserRole } from '@/types';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

6. Create UnauthorizedPage.tsx

Create src/pages/UnauthorizedPage.tsx:

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-orange-100 text-center p-6">
      <ShieldAlert className="w-24 h-24 text-red-600 mb-8" />
      <h1 className="text-5xl font-bold text-slate-800 mb-4">Access Denied</h1>
      <p className="text-xl text-slate-700 mb-8 max-w-md">
        You do not have the necessary permissions to access this page.
      </p>
      <div className="space-x-4">
        <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-700 hover:bg-slate-100">
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

7. Update Sidebar for Role-Based Navigation (Optional but Recommended UX)

Modify src/components/dashboard/Sidebar.tsx to conditionally render navigation links based on user roles.

// src/components/dashboard/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Package, PlusSquare, Settings, LogOut, X, Menu, ShieldCheck } from 'lucide-react'; // Added ShieldCheck
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types'; // Import UserRole
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

interface NavLinkItem {
  to: string;
  icon: React.ElementType;
  label: string;
  requiredRoles?: UserRole[]; // Add requiredRoles property
}

interface NavItemProps {
  navItem: NavLinkItem;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ navItem, isActive, onClick }) => (
  <Button
    asChild
    variant={isActive ? 'secondary' : 'ghost'}
    className={cn(
      "w-full justify-start text-sm",
      isActive ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20" : "hover:bg-slate-200/50"
    )}
    onClick={onClick}
  >
    <Link to={navItem.to}>
      <navItem.icon className="mr-3 h-5 w-5" />
      {navItem.label}
    </Link>
  </Button>
);

// Define roles for clarity
const ALL_ROLES: UserRole[] = ['ADMIN', 'EDITOR', 'VIEWER'];
const EDITOR_AND_ADMIN: UserRole[] = ['ADMIN', 'EDITOR'];
const ADMIN_ONLY: UserRole[] = ['ADMIN'];

const navLinks: NavLinkItem[] = [
  { to: '/dashboard', icon: Home, label: 'Overview', requiredRoles: ALL_ROLES },
  { to: '/dashboard/items/cards', icon: Package, label: 'Items (Cards)', requiredRoles: ALL_ROLES },
  { to: '/dashboard/items/table', icon: List, label: 'Items (Table)', requiredRoles: ALL_ROLES },
  { to: '/dashboard/items/create', icon: PlusSquare, label: 'Create Item', requiredRoles: EDITOR_AND_ADMIN },
  // Example of an admin-only link (if you had admin-specific pages)
  // { to: '/dashboard/admin/users', icon: Users, label: 'Manage Users', requiredRoles: ADMIN_ONLY },
];

interface SidebarProps {
  isSheetOpen?: boolean;
  onSheetClose?: () => void;
}

const SidebarContent: React.FC<{onLinkClick?: () => void}> = ({onLinkClick}) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const canAccess = (requiredRoles?: UserRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true; // No specific roles required
    if (!user) return false; // Not authenticated
    return requiredRoles.includes(user.role);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Package className="h-8 w-8 text-brand-primary" />
          <span className="text-xl font-bold text-slate-700">MyApp</span>
        </Link>
      </div>
      <nav className="flex-grow p-3 space-y-1.5">
        {navLinks.map((link) =>
          canAccess(link.requiredRoles) && ( // Conditionally render NavItem
            <NavItem
              key={link.to}
              navItem={link}
              isActive={location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(link.to))}
              onClick={onLinkClick}
            />
          )
        )}
      </nav>
      <div className="p-4 border-t border-slate-200 mt-auto">
        {user && (
          <div className="mb-3 p-3 bg-emerald-50 rounded-md border border-emerald-200">
            <p className="text-sm font-medium text-slate-700">{user.email}</p>
            <div className="flex items-center text-xs text-emerald-700 mt-1">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5"/>
              Role: <span className="font-semibold ml-1">{user.role}</span>
            </div>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-red-100 hover:text-red-600" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};


const Sidebar: React.FC<SidebarProps> = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div className="md:hidden p-2 fixed top-0 left-0 z-50">
         <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-slate-50">
             <SidebarContent onLinkClick={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-50 border-r border-slate-200 fixed h-full">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

8. Update Routing in App.tsx

Now, use RoleProtectedRoute for routes that need role restrictions.

// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SWRConfig } from 'swr';
import { Toaster } from '@/components/ui/sonner';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage'; // Import UnauthorizedPage

import ProtectedRoute from './components/shared/ProtectedRoute'; // General authentication
import RoleProtectedRoute from './components/shared/RoleProtectedRoute'; // Role-based access
import { UserRole } from './types'; // Import UserRole

import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import ViewAllItemsPage from './pages/dashboard/ViewAllItemsPage';
import ViewItemsTablePage from './pages/dashboard/ViewItemsTablePage';
import ViewSingleItemPage from './pages/dashboard/ViewSingleItemPage';
import CreateItemPage from './pages/dashboard/CreateItemPage';
import UpdateItemPage from './pages/dashboard/UpdateItemPage';

// Define roles for routes (matches roles in Sidebar and UserRole type)
const ALL_AUTHENTICATED: UserRole[] = ['ADMIN', 'EDITOR', 'VIEWER'];
const EDITORS_AND_ADMINS: UserRole[] = ['ADMIN', 'EDITOR'];
// const ADMINS_ONLY: UserRole[] = ['ADMIN']; // If you have admin-only routes

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
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Dashboard routes are generally protected by authentication first */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                {/* Overview - all authenticated users */}
                <Route element={<RoleProtectedRoute allowedRoles={ALL_AUTHENTICATED} />}>
                  <Route index element={<DashboardOverviewPage />} />
                  <Route path="items/cards" element={<ViewAllItemsPage />} />
                  <Route path="items/table" element={<ViewItemsTablePage />} />
                  <Route path="items/:itemId" element={<ViewSingleItemPage />} />
                </Route>

                {/* Create and Update items - Editors and Admins */}
                <Route element={<RoleProtectedRoute allowedRoles={EDITORS_AND_ADMINS} />}>
                  <Route path="items/create" element={<CreateItemPage />} />
                  <Route path="items/update/:itemId" element={<UpdateItemPage />} />
                </Route>

                {/* Example for an admin-only section if you had one
                <Route element={<RoleProtectedRoute allowedRoles={ADMINS_ONLY} />}>
                  <Route path="admin/settings" element={<AdminSettingsPage />} />
                </Route>
                */}

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
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Explanation of Changes:

UserRole Type: Defined in src/types/index.ts for consistency.

Mock Roles: authService.ts now assigns roles based on email for demonstration.

RoleProtectedRoute.tsx: This new component checks if the authenticated user's role is present in the allowedRoles prop. If not, it redirects to /unauthorized.

UnauthorizedPage.tsx: A simple page to inform users they lack permission.

Sidebar Update: The sidebar now checks user.role against requiredRoles for each navigation link, hiding links the user shouldn't access. This is a UX improvement; the route protection is the actual security.

App.tsx Routing:

The general /dashboard routes are still wrapped in ProtectedRoute to ensure authentication.

Specific groups of routes within the dashboard are then wrapped with RoleProtectedRoute and an allowedRoles array.

For example, viewing items might be allowed for ALL_AUTHENTICATED, while creating/updating items is restricted to EDITORS_AND_ADMINS.

To Test:

Sign up/Log in with different emails to get different roles:

admin@example.com (ADMIN)

editor@example.com (EDITOR)

viewer@example.com (VIEWER)

Check if the sidebar links are displayed correctly based on the role.

Try to navigate directly to URLs that the current role shouldn't access (e.g., a VIEWER trying to go to /dashboard/items/create). You should be redirected to the /unauthorized page.

Verify that users with appropriate roles can access the features.

This setup provides a solid foundation for RBAC in your application. Remember that for true security, role enforcement must also happen on your backend API. The frontend RBAC improves UX and provides a first line of defense.
