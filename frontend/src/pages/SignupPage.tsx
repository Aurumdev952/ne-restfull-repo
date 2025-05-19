import SignupForm from '@/components/auth/SignupForm';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

const SignupPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="w-12 h-12 mx-auto text-brand-secondary mb-3" />
          <CardTitle className="text-3xl font-bold text-slate-800">Create an Account</CardTitle>
          <CardDescription className="text-slate-600">
            Join us and start managing your items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
