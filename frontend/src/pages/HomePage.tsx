import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Package, LogIn, UserPlus } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-emerald-100 p-6">
      <div className="text-center max-w-2xl">
        <Package className="w-24 h-24 mx-auto text-brand-primary mb-6" />
        <h1 className="text-5xl font-bold text-slate-800 mb-4">
          Welcome to Your Application Template
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          A clean, modern, and functional starting point for your next React project,
          built with the latest technologies.
        </p>
        <div className="space-x-4">
          {isAuthenticated ? (
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
                <Link to="/login">
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10">
                <Link to="/signup">
                  <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <footer className="absolute bottom-6 text-slate-500 text-sm">
        Powered by React, Vite, TypeScript, Shadcn/ui, and Tailwind CSS.
      </footer>
    </div>
  );
};

export default HomePage;
