import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types"; // Import UserRole
// Import UserRole
import {
  Home,
  List,
  LogOut,
  Menu,
  Package,
  PlusSquare,
  ShieldCheck,
} from "lucide-react"; // Added ShieldCheck
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
    variant={isActive ? "secondary" : "ghost"}
    className={cn(
      "w-full justify-start text-sm",
      isActive
        ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
        : "hover:bg-slate-200/50"
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
const ALL_ROLES: UserRole[] = ["ADMIN", "USER"];
const USER_ONLY: UserRole[] = ["USER"];
const ADMIN_ONLY: UserRole[] = ["ADMIN"];

const navLinks: NavLinkItem[] = [
  { to: "/dashboard", icon: Home, label: "Overview", requiredRoles: ALL_ROLES },
  {
    to: "/dashboard/items/cards",
    icon: Package,
    label: "Items (Cards)",
    requiredRoles: ALL_ROLES,
  },
  {
    to: "/dashboard/items/table",
    icon: List,
    label: "Items (Table)",
    requiredRoles: ALL_ROLES,
  },
  {
    to: "/dashboard/items/create",
    icon: PlusSquare,
    label: "Create Item",
    requiredRoles: ALL_ROLES,
    // requiredRoles: ADMIN_ONLY,
  },
  // Example of an admin-only link (if you had admin-specific pages)
  // { to: '/dashboard/admin/users', icon: Users, label: 'Manage Users', requiredRoles: ADMIN_ONLY },
];

interface SidebarProps {
  isSheetOpen?: boolean;
  onSheetClose?: () => void;
}

const SidebarContent: React.FC<{ onLinkClick?: () => void }> = ({
  onLinkClick,
}) => {
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
        {navLinks.map(
          (link) =>
            canAccess(link.requiredRoles) && ( // Conditionally render NavItem
              <NavItem
                key={link.to}
                navItem={link}
                isActive={
                  location.pathname === link.to ||
                  (link.to !== "/dashboard" &&
                    location.pathname.startsWith(link.to))
                }
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
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
              Role: <span className="font-semibold ml-1">{user.role}</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:bg-red-100 hover:text-red-600"
          onClick={logout}
        >
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
