
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, DollarSign } from 'lucide-react';
import EmployeeDashboard from '@/components/expense-portal/EmployeeDashboard';
import ManagerDashboard from '@/components/expense-portal/ManagerDashboard';

const Index = () => {
  const [currentRole, setCurrentRole] = useState<'employee' | 'manager' | null>(null);

  if (!currentRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ExpenseFlow Portal
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Streamline your expense management with our modern, intuitive portal. 
            Choose your role to get started.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer group" 
                  onClick={() => setCurrentRole('employee')}>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Employee Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Submit and track your expense requests</p>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  Submit Expenses
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg cursor-pointer group" 
                  onClick={() => setCurrentRole('manager')}>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Manager Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Review and approve expense requests</p>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                  Manage Requests
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            Demo Portal - Switch between roles to explore all features
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">ExpenseFlow Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant={currentRole === 'employee' ? 'default' : 'secondary'} 
                   className={currentRole === 'employee' ? 'bg-blue-600' : ''}>
              {currentRole === 'employee' ? 'Employee' : 'Manager'} Portal
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setCurrentRole(null)}>
              Switch Role
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {currentRole === 'employee' ? <EmployeeDashboard /> : <ManagerDashboard />}
      </main>
    </div>
  );
};

export default Index;
