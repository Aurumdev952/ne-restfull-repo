import { Loader2 } from 'lucide-react';

const PageSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
    </div>
  );
};

export default PageSpinner;
