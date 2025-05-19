import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  const getInitials = (email: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 md:px-6 md:pl-72">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger is in Sidebar now, Header is simpler */}
         <h1 className="text-lg font-semibold text-slate-700 hidden md:block">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt={user.email} />
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-800">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-slate-500">
                    User
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link to="#" className="cursor-pointer"> {/* Replace # with actual profile page if needed */}
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link to="#" className="cursor-pointer"> {/* Replace # with actual settings page if needed */}
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 hover:!text-red-600 hover:!bg-red-50 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
