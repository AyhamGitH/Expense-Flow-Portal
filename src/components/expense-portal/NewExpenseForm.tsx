
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  Calendar,
  Plane,
  Utensils,
  Package,
  Plus,
  Save,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface NewExpenseFormProps {
  onClose: () => void;
}

const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    employeeName: 'John Doe',
    department: 'Engineering',
    costCenter: 'ENG-001',
    expenses: [] as any[],
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const categories = [
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'meals', name: 'Meals', icon: Utensils, color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'office', name: 'Office Supplies', icon: Package, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'other', name: 'Other', icon: Plus, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  ];

  const validateStep = (step: number) => {
    const errors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.employeeName.trim()) {
        errors.employeeName = 'Employee name is required';
      }
      if (!formData.department.trim()) {
        errors.department = 'Department is required';
      }
      if (!formData.costCenter.trim()) {
        errors.costCenter = 'Cost center is required';
      }
    }
    
    if (step === 2) {
      if (selectedCategories.length === 0) {
        errors.categories = 'Please select at least one expense category';
      }
    }

    if (step === 3) {
      if (formData.expenses.length === 0) {
        errors.noExpenses = 'Please add at least one expense';
      }
      
      formData.expenses.forEach((expense, index) => {
        if (!expense.date) {
          errors[`expense_${expense.id}_date`] = 'Date is required';
        }
        if (!expense.amount || expense.amount <= 0) {
          errors[`expense_${expense.id}_amount`] = 'Amount must be greater than 0';
        }
        if (!expense.description?.trim()) {
          errors[`expense_${expense.id}_description`] = 'Description is required';
        }
      });
    }

    setValidationErrors(errors);
    const hasErrors = Object.keys(errors).length > 0;
    setShowValidationAlert(hasErrors);
    return !hasErrors;
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Remove category and its expenses
        const newExpenses = formData.expenses.filter(exp => exp.category !== categoryId);
        setFormData(prev => ({ ...prev, expenses: newExpenses }));
        return prev.filter(id => id !== categoryId);
      } else {
        // Add category and create initial expense
        const newExpense = {
          id: Date.now(),
          category: categoryId,
          date: format(new Date(), 'yyyy-MM-dd'),
          amount: '',
          description: '',
          receipts: [],
        };
        setFormData(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
        return [...prev, categoryId];
      }
    });
  };

  const addExpenseToCategory = (categoryId: string) => {
    const newExpense = {
      id: Date.now(),
      category: categoryId,
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      description: '',
      receipts: [],
    };
    setFormData(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  };

  const updateExpense = (expenseId: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.map(exp =>
        exp.id === expenseId ? { ...exp, [field]: value } : exp
      )
    }));
    
    // Clear validation error for this field when user starts typing
    const errorKey = `expense_${expenseId}_${field}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const removeExpense = (expenseId: number) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(exp => exp.id !== expenseId)
    }));
  };

  const handleFileUpload = (expenseId: number, files: FileList) => {
    const newReceipts = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));
    
    updateExpense(expenseId, 'receipts', [
      ...formData.expenses.find(exp => exp.id === expenseId)?.receipts || [],
      ...newReceipts
    ]);
  };

  const removeReceipt = (expenseId: number, receiptId: number) => {
    const expense = formData.expenses.find(exp => exp.id === expenseId);
    if (expense) {
      const updatedReceipts = expense.receipts.filter((receipt: any) => receipt.id !== receiptId);
      updateExpense(expenseId, 'receipts', updatedReceipts);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setShowValidationAlert(false);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    setShowValidationAlert(false);
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      const newRequestId = `EXP-${Date.now().toString().slice(-6)}`;
      setRequestId(newRequestId);
      setIsSubmitted(true);
    }
  };

  const saveDraft = () => {
    console.log('Saving draft...', formData);
    // Implement draft saving logic
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Expense Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your expense request has been submitted for review.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Request ID</p>
              <p className="text-lg font-semibold text-gray-900">{requestId}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={onClose}>
                Back to Dashboard
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={onClose} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentStep === 1 && 'Employee Information'}
            {currentStep === 2 && 'Select Categories'}
            {currentStep === 3 && 'Expense Details'}
            {currentStep === 4 && 'Review & Submit'}
          </h1>
        </div>

        {/* Validation Alert */}
        {showValidationAlert && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required fields before proceeding.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {/* Step 1: Employee Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <p className="text-sm text-gray-600">All fields are required</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="employeeName" className="text-sm font-medium">
                    Employee Name *
                  </Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => handleInputChange('employeeName', e.target.value)}
                    className={validationErrors.employeeName ? 'border-red-500 focus:border-red-500' : ''}
                    placeholder="Enter employee name"
                  />
                  {validationErrors.employeeName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.employeeName}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department *
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={validationErrors.department ? 'border-red-500 focus:border-red-500' : ''}
                    placeholder="Enter department"
                  />
                  {validationErrors.department && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.department}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="costCenter" className="text-sm font-medium">
                    Cost Center *
                  </Label>
                  <Input
                    id="costCenter"
                    value={formData.costCenter}
                    onChange={(e) => handleInputChange('costCenter', e.target.value)}
                    className={validationErrors.costCenter ? 'border-red-500 focus:border-red-500' : ''}
                    placeholder="Enter cost center"
                  />
                  {validationErrors.costCenter && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.costCenter}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Category Selection */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Expense Categories</CardTitle>
              <p className="text-gray-600">Choose all categories that apply to your expenses *</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategories.includes(category.id);
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        isSelected 
                          ? `${category.color} border-current` 
                          : validationErrors.categories
                          ? 'border-red-500 hover:border-red-400'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-6 h-6" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {validationErrors.categories && (
                <p className="text-red-500 text-sm mt-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.categories}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Expense Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {validationErrors.noExpenses && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {validationErrors.noExpenses}
                </AlertDescription>
              </Alert>
            )}
            
            {selectedCategories.map((categoryId) => {
              const category = categories.find(c => c.id === categoryId);
              const categoryExpenses = formData.expenses.filter(exp => exp.category === categoryId);
              const IconComponent = category?.icon || Plus;
              
              return (
                <Card key={categoryId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5" />
                        <CardTitle>{category?.name} Expenses</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addExpenseToCategory(categoryId)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryExpenses.map((expense) => (
                      <div key={expense.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Expense #{categoryExpenses.indexOf(expense) + 1}</h4>
                          {categoryExpenses.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExpense(expense.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Date *</Label>
                            <Input
                              type="date"
                              value={expense.date}
                              onChange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                              className={validationErrors[`expense_${expense.id}_date`] ? 'border-red-500 focus:border-red-500' : ''}
                            />
                            {validationErrors[`expense_${expense.id}_date`] && (
                              <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {validationErrors[`expense_${expense.id}_date`]}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Amount ($) *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={expense.amount}
                              onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || '')}
                              className={validationErrors[`expense_${expense.id}_amount`] ? 'border-red-500 focus:border-red-500' : ''}
                              placeholder="0.00"
                            />
                            {validationErrors[`expense_${expense.id}_amount`] && (
                              <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {validationErrors[`expense_${expense.id}_amount`]}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Description *</Label>
                          <Textarea
                            value={expense.description}
                            onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                            placeholder="Describe the expense..."
                            className={validationErrors[`expense_${expense.id}_description`] ? 'border-red-500 focus:border-red-500' : ''}
                          />
                          {validationErrors[`expense_${expense.id}_description`] && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {validationErrors[`expense_${expense.id}_description`]}
                            </p>
                          )}
                        </div>
                        
                        {/* Receipt Upload */}
                        <div>
                          <Label className="text-sm font-medium">Receipts (Optional)</Label>
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                            onDrop={(e) => {
                              e.preventDefault();
                              handleFileUpload(expense.id, e.dataTransfer.files);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = 'image/*,.pdf';
                              input.onchange = (e) => {
                                const files = (e.target as HTMLInputElement).files;
                                if (files) handleFileUpload(expense.id, files);
                              };
                              input.click();
                            }}
                          >
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Drop files here or click to upload</p>
                            <p className="text-sm text-gray-400">Supports images and PDF files</p>
                          </div>
                          
                          {expense.receipts && expense.receipts.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              {expense.receipts.map((receipt: any) => (
                                <div key={receipt.id} className="relative">
                                  <img
                                    src={receipt.preview}
                                    alt="Receipt"
                                    className="w-full h-24 object-cover rounded border"
                                  />
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                                    onClick={() => removeReceipt(expense.id, receipt.id)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Expense Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Employee Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Employee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span> {formData.employeeName}
                  </div>
                  <div>
                    <span className="text-gray-600">Department:</span> {formData.department}
                  </div>
                  <div>
                    <span className="text-gray-600">Cost Center:</span> {formData.costCenter}
                  </div>
                </div>
              </div>
              
              {/* Expenses Summary */}
              <div>
                <h3 className="font-medium mb-4">Expense Summary</h3>
                <div className="space-y-4">
                  {selectedCategories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId);
                    const categoryExpenses = formData.expenses.filter(exp => exp.category === categoryId);
                    const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
                    
                    return (
                      <div key={categoryId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{category?.name}</h4>
                          <span className="font-semibold">${categoryTotal.toFixed(2)}</span>
                        </div>
                        {categoryExpenses.map((expense, index) => (
                          <div key={expense.id} className="flex justify-between items-center py-2 border-t first:border-t-0">
                            <div>
                              <p className="text-sm font-medium">{expense.description}</p>
                              <p className="text-xs text-gray-500">{expense.date}</p>
                            </div>
                            <span className="text-sm font-medium">${parseFloat(expense.amount || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${formData.expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          <Button variant="ghost" onClick={saveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
        
        <div className="flex space-x-3">
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewExpenseForm;
