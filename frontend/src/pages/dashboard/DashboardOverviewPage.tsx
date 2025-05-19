import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Package, ShoppingCart, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DashboardOverviewPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {user?.email?.split('@')[0] || 'User'}!
      </h1>
      <p className="text-slate-600">Here's a quick overview of your application.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-sky-50 border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-700">
              Total Items
            </CardTitle>
            <Package className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-800">1,234</div>
            <p className="text-xs text-sky-500">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">
              Active Users
            </CardTitle>
            <Users className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">+2350</div>
            <p className="text-xs text-emerald-500">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">
              Sales
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">+12,234</div>
            <p className="text-xs text-amber-500">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">
              Performance
            </CardTitle>
            <BarChart className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-800">92.5%</div>
            <p className="text-xs text-indigo-500">
              +2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Recent Activity (Mock)</h2>
        <ul className="space-y-3">
          <li className="text-sm text-slate-600">User 'john.doe@example.com' logged in.</li>
          <li className="text-sm text-slate-600">New item 'Super Widget' created.</li>
          <li className="text-sm text-slate-600">Item 'Old Gadget' stock updated.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
