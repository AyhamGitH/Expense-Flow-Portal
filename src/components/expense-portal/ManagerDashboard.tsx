
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Calendar,
  User,
  AlertTriangle,
  Download,
  Eye,
  MessageSquare,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  // Mock data for expense requests
  const expenseRequests = [
    {
      id: 'EXP-001',
      employeeName: 'John Doe',
      department: 'Engineering',
      date: '2024-01-15',
      category: 'Travel',
      amount: 450.00,
      status: 'pending',
      description: 'Flight to client meeting in San Francisco',
      receipts: ['/placeholder.svg', '/placeholder.svg'],
      policyViolations: [],
      submittedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'EXP-002',
      employeeName: 'Jane Smith',
      department: 'Sales',
      date: '2024-01-12',
      category: 'Meals',
      amount: 185.50,
      status: 'pending',
      description: 'Client dinner at premium restaurant',
      receipts: ['/placeholder.svg'],
      policyViolations: ['exceeds_meal_limit'],
      submittedAt: '2024-01-12T14:20:00Z',
    },
    {
      id: 'EXP-003',
      employeeName: 'Mike Johnson',
      department: 'Marketing',
      date: '2024-01-10',
      category: 'Office Supplies',
      amount: 125.00,
      status: 'approved',
      description: 'Ergonomic chair for workspace',
      receipts: ['/placeholder.svg'],
      policyViolations: [],
      submittedAt: '2024-01-10T09:15:00Z',
      approvedAt: '2024-01-11T11:30:00Z',
      approvedBy: 'Sarah Wilson',
    },
    {
      id: 'EXP-004',
      employeeName: 'Lisa Chen',
      department: 'Engineering',
      date: '2024-01-08',
      category: 'Travel',
      amount: 89.99,
      status: 'rejected',
      description: 'Uber rides during business trip',
      receipts: ['/placeholder.svg'],
      policyViolations: [],
      submittedAt: '2024-01-08T16:45:00Z',
      rejectedAt: '2024-01-09T08:20:00Z',
      rejectedBy: 'Sarah Wilson',
      rejectionReason: 'Missing pre-approval for transportation expenses over $50',
    },
  ];

  const stats = {
    pendingCount: expenseRequests.filter(r => r.status === 'pending').length,
    pendingAmount: expenseRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
    approvedCount: expenseRequests.filter(r => r.status === 'approved').length,
    rejectedCount: expenseRequests.filter(r => r.status === 'rejected').length,
  };

  const filteredRequests = expenseRequests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployee = !employeeFilter || request.employeeName.toLowerCase().includes(employeeFilter.toLowerCase());
    const matchesDate = (!dateFilter.from || request.date >= dateFilter.from) &&
                       (!dateFilter.to || request.date <= dateFilter.to);
    return matchesTab && matchesSearch && matchesEmployee && matchesDate;
  }).sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'employee':
        aValue = a.employeeName;
        bValue = b.employeeName;
        break;
      case 'date':
      default:
        aValue = a.date;
        bValue = b.date;
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(r => r.id));
    }
  };

  const handleApprove = (requestId: string) => {
    console.log('Approving request:', requestId);
    // Implement approval logic
  };

  const handleReject = (requestId: string, comment?: string) => {
    if (!comment) {
      setShowRejectModal(true);
      setSelectedRequest(expenseRequests.find(r => r.id === requestId));
      return;
    }
    console.log('Rejecting request:', requestId, 'with comment:', comment);
    setShowRejectModal(false);
    setRejectComment('');
    // Implement rejection logic
  };

  const handleBulkApprove = () => {
    console.log('Bulk approving requests:', selectedRequests);
    setSelectedRequests([]);
  };

  const handleBulkReject = () => {
    console.log('Bulk rejecting requests:', selectedRequests);
    setSelectedRequests([]);
  };

  const exportToExcel = () => {
    console.log('Exporting approved requests to Excel');
    // Implement Excel export
  };

  const exportToPDF = () => {
    console.log('Exporting approved requests to PDF');
    // Implement PDF export
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getViolationMessage = (violation: string) => {
    switch (violation) {
      case 'exceeds_meal_limit': return 'Exceeds daily meal allowance limit';
      case 'missing_receipt': return 'Receipt required for expenses over $25';
      case 'no_preapproval': return 'Pre-approval required for this expense type';
      default: return 'Policy violation detected';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingCount}</div>
            <p className="text-xs text-gray-500 mt-1">${stats.pendingAmount.toLocaleString()} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.approvedCount}</div>
            <p className="text-xs text-green-600 mt-1">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected This Month</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.rejectedCount}</div>
            <p className="text-xs text-gray-500 mt-1">2% rejection rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1.2</div>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {['pending', 'approved', 'rejected', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab} {tab === 'pending' && `(${stats.pendingCount})`}
          </button>
        ))}
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              

              

            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
                <option value="employee-asc">Employee (A-Z)</option>
                <option value="employee-desc">Employee (Z-A)</option>
              </select>
              
              {activeTab === 'approved' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportToExcel}>
                    <Download className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToPDF}>
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Bulk Actions */}
          {selectedRequests.length > 0 && activeTab === 'pending' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedRequests.length} request(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleBulkApprove} className="bg-green-600 hover:bg-green-700">
                    Approve All
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBulkReject} className="text-red-600 border-red-200 hover:bg-red-50">
                    Reject All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Expense Requests</CardTitle>
            {activeTab === 'pending' && (
              <div className="flex items-center">
                <Checkbox
                  checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="ml-2 text-sm text-gray-600">Select All</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {activeTab === 'pending' && (
                    <Checkbox
                      checked={selectedRequests.includes(request.id)}
                      onCheckedChange={() => handleSelectRequest(request.id)}
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{request.id}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        {request.policyViolations.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-amber-600">Policy Alert</span>
                          </div>
                        )}
                      </div>
                      <span className="text-lg font-semibold text-gray-900">${request.amount.toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {request.employeeName}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {request.date}
                      </div>
                      <div>
                        <span className="font-medium">{request.category}</span>
                      </div>
                      <div>
                        {request.department}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{request.description}</p>
                    
                    {request.policyViolations.length > 0 && (
                      <div className="mb-3">
                        {request.policyViolations.map((violation, index) => (
                          <div key={index} className="flex items-center space-x-2 text-amber-600 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{getViolationMessage(violation)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {request.receipts.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Receipts:</span>
                            <div className="flex space-x-1">
                              {request.receipts.slice(0, 3).map((receipt, index) => (
                                <img
                                  key={index}
                                  src={receipt}
                                  alt={`Receipt ${index + 1}`}
                                  className="w-8 h-8 object-cover rounded border"
                                />
                              ))}
                              {request.receipts.length > 3 && (
                                <span className="text-xs text-gray-500">+{request.receipts.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Expense Request Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Request Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">ID:</span> {selectedRequest.id}</div>
                    <div><span className="text-gray-600">Employee:</span> {selectedRequest.employeeName}</div>
                    <div><span className="text-gray-600">Department:</span> {selectedRequest.department}</div>
                    <div><span className="text-gray-600">Category:</span> {selectedRequest.category}</div>
                    <div><span className="text-gray-600">Date:</span> {selectedRequest.date}</div>
                    <div><span className="text-gray-600">Amount:</span> ${selectedRequest.amount.toFixed(2)}</div>
                    <div>
                      <span className="text-gray-600">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Submitted:</span> {format(new Date(selectedRequest.submittedAt), 'PPp')}</div>
                    {selectedRequest.approvedAt && (
                      <div><span className="text-gray-600">Approved:</span> {format(new Date(selectedRequest.approvedAt), 'PPp')}</div>
                    )}
                    {selectedRequest.rejectedAt && (
                      <div><span className="text-gray-600">Rejected:</span> {format(new Date(selectedRequest.rejectedAt), 'PPp')}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{selectedRequest.description}</p>
              </div>
              
              {/* Policy Violations */}
              {selectedRequest.policyViolations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 text-amber-600">Policy Violations</h3>
                  <div className="space-y-1">
                    {selectedRequest.policyViolations.map((violation: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{getViolationMessage(violation)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Receipts */}
              {selectedRequest.receipts.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Receipts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedRequest.receipts.map((receipt: string, index: number) => (
                      <img
                        key={index}
                        src={receipt}
                        alt={`Receipt ${index + 1}`}
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:shadow-lg transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Rejection Reason */}
              {selectedRequest.rejectionReason && (
                <div>
                  <h3 className="font-medium mb-2">Rejection Reason</h3>
                  <p className="text-gray-700 bg-red-50 p-3 rounded">{selectedRequest.rejectionReason}</p>
                </div>
              )}
              
              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button 
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleReject(selectedRequest.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Reject Expense Request</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this expense request. This will help the employee understand what needs to be corrected.
              </p>
              <Textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Enter rejection reason..."
                className="mb-4"
                rows={4}
              />
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (!rejectComment.trim()) {
                      if (confirm('Are you sure you want to reject without filling the comment field?')) {
                        handleReject(selectedRequest?.id, '');
                      }
                    } else {
                      handleReject(selectedRequest?.id, rejectComment);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
