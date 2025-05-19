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
