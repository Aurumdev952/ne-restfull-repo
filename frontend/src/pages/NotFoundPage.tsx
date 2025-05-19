import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-emerald-100 text-center p-6">
      <AlertTriangle className="w-24 h-24 text-red-500 mb-8" />
      <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-slate-700 mb-6">Page Not Found</h2>
      <p className="text-xl text-slate-600 mb-8 max-w-md">
        Oops! The page you're looking for doesn't seem to exist.
        It might have been moved, deleted, or maybe you just mistyped the URL.
      </p>
      <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
        <Link to="/">Go to Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
