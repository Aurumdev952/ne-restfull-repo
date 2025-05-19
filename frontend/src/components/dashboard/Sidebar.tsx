import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Home, List, LogOut, Menu, Package, PlusSquare } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive, onClick }) => (
  <Button
    asChild
    variant={isActive ? 'secondary' : 'ghost'}
    className={cn(
      "w-full justify-start text-sm",
      isActive ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20" : "hover:bg-slate-200/50"
    )}
    onClick={onClick}
  >
    <Link to={to}>
      <Icon className="mr-3 h-5 w-5" />
      {label}
    </Link>
  </Button>
);

const navLinks = [
  { to: '/dashboard', icon: Home, label: 'Overview' },
  { to: '/dashboard/items/cards', icon: Package, label: 'Items (Cards)' },
  { to: '/dashboard/items/table', icon: List, label: 'Items (Table)' },
  { to: '/dashboard/items/create', icon: PlusSquare, label: 'Create Item' },
];

interface SidebarProps {
  isSheetOpen?: boolean;
  onSheetClose?: () => void;
}

const SidebarContent: React.FC<{onLinkClick?: () => void}> = ({onLinkClick}) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Package className="h-8 w-8 text-brand-primary" />
          <span className="text-xl font-bold text-slate-700">MyApp</span>
        </Link>
      </div>
      <nav className="flex-grow p-3 space-y-1.5">
        {navLinks.map((link) => (
          <NavItem
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isActive={location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(link.to))}
            onClick={onLinkClick}
          />
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 mt-auto">
        {user && (
          <div className="mb-3 p-2 bg-emerald-50 rounded-md">
            <p className="text-sm font-medium text-slate-700">{user.email}</p>
            <p className="text-xs text-slate-500">Authenticated</p>
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
      {/* Mobile Sidebar (Sheet) */}
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

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-50 border-r border-slate-200 fixed h-full">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
