
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, DollarSign, Clock, CheckCircle, XCircle, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import NewExpenseForm from './NewExpenseForm';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewExpenseForm, setShowNewExpenseForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for charts
  const monthlyExpenses = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1398 },
    { month: 'Mar', amount: 9800 },
    { month: 'Apr', amount: 3908 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 3200 },
  ];

  const expensesByCategory = [
    { name: 'Travel', value: 45, color: '#3B82F6' },
    { name: 'Meals', value: 25, color: '#10B981' },
    { name: 'Office Supplies', value: 20, color: '#F59E0B' },
    { name: 'Other', value: 10, color: '#EF4444' },
  ];

  // Mock expense requests
  const expenseRequests = [
    {
      id: 'EXP-001',
      date: '2024-01-15',
      category: 'Travel',
      amount: 450.00,
      status: 'pending',
      description: 'Flight to client meeting',
      manager_comment: '',
    },
    {
      id: 'EXP-002',
      date: '2024-01-12',
      category: 'Meals',
      amount: 85.50,
      status: 'approved',
      description: 'Team lunch',
      manager_comment: 'Approved for team building',
    },
    {
      id: 'EXP-003',
      date: '2024-01-10',
      category: 'Office Supplies',
      amount: 125.00,
      status: 'rejected',
      description: 'Ergonomic chair',
      manager_comment: 'Not in budget this quarter',
    },
  ];

  const stats = {
    total: 8450.00,
    pending: 1250.00,
    approved: 6800.00,
    rejected: 400.00,
  };

  const filteredRequests = expenseRequests.filter(request => {
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.amount.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showNewExpenseForm) {
    return <NewExpenseForm onClose={() => setShowNewExpenseForm(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'dashboard' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'requests' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Requests
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'drafts' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Drafts
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <Button onClick={() => setShowNewExpenseForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Expense
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">${stats.total.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">${stats.pending.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">2 requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">${stats.approved.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">15 requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">${stats.rejected.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">1 request</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">My Expense Requests</h2>
            <Button onClick={() => setShowNewExpenseForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Expense
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by description, ID, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{request.id}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-1">{request.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{request.date}</span>
                        <span>{request.category}</span>
                        <span className="font-semibold text-gray-900">${request.amount.toFixed(2)}</span>
                      </div>
                      {request.manager_comment && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">Manager comment:</span> {request.manager_comment}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'drafts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Draft Expenses</h2>
            <Button onClick={() => setShowNewExpenseForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Expense
            </Button>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts saved</h3>
            <p className="text-gray-500 mb-6">Start creating an expense request to save drafts automatically</p>
            <Button onClick={() => setShowNewExpenseForm(true)} className="bg-blue-600 hover:bg-blue-700">
              Create New Expense
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
