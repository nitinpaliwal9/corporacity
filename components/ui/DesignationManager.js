import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import DesignationService from '../../lib/designationService';
import supabase from '../../lib/supabaseClient';

const DesignationManager = ({ companyId, userRole }) => {
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, [companyId]);

  const loadData = async () => {
    try {
      const [designationsData, employeesData, departmentsData, statsData] = await Promise.all([
        DesignationService.getDesignations(companyId),
        loadEmployees(),
        DesignationService.getDepartments(companyId),
        DesignationService.getDesignationStats(companyId)
      ]);

      setDesignations(designationsData);
      setEmployees(employeesData);
      setDepartments(departmentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    const { data, error } = await supabase
      .from('corp_memberships')
      .select(`
        *,
        user:corp_profiles!corp_memberships_user_id_fkey(full_name, email),
        designation:corp_designations!corp_memberships_designation_id_fkey(name, level, department),
        manager:corp_profiles!corp_memberships_manager_id_fkey(full_name, email)
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const createDesignation = async (designationData) => {
    try {
      await DesignationService.createDesignation(companyId, designationData);
      loadData();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating designation:', error);
      alert('Failed to create designation. Please try again.');
    }
  };

  const updateDesignation = async (designationId, updates) => {
    try {
      await DesignationService.updateDesignation(designationId, updates);
      loadData();
    } catch (error) {
      console.error('Error updating designation:', error);
      alert('Failed to update designation. Please try again.');
    }
  };

  const deleteDesignation = async (designationId) => {
    if (!confirm('Are you sure you want to delete this designation?')) return;

    try {
      await DesignationService.deleteDesignation(designationId);
      loadData();
    } catch (error) {
      console.error('Error deleting designation:', error);
      alert(error.message || 'Failed to delete designation. Please try again.');
    }
  };

  const assignDesignation = async (userId, designationId, additionalData) => {
    try {
      await DesignationService.assignDesignation(userId, companyId, designationId, additionalData);
      loadData();
      setShowAssignForm(false);
    } catch (error) {
      console.error('Error assigning designation:', error);
      alert('Failed to assign designation. Please try again.');
    }
  };

  const getLevelColor = (level) => {
    if (level >= 8) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (level >= 6) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (level >= 4) return 'text-green-600 bg-green-50 border-green-200';
    if (level >= 2) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (userRole !== 'owner' && userRole !== 'admin') {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only administrators can manage designations.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Designation Management</h2>
          <p className="text-gray-600">Manage employee roles and organizational structure</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Create Designation
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Designations</p>
              <p className="text-2xl font-bold text-gray-900">{designations.length}</p>
            </div>
            <div className="text-2xl">👔</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="text-2xl">🏢</div>
          </div>
        </Card>
      </div>

      {/* Designations List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Designations</h3>
          <Button
            onClick={() => setShowAssignForm(true)}
            variant="outline"
            size="small"
          >
            Assign Designations
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {designations.map((designation) => (
              <motion.div
                key={designation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{designation.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(designation.level)}`}>
                        Level {designation.level}
                      </span>
                      <span className="text-sm text-gray-500">{designation.department}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{designation.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {stats[designation.department]?.[designation.name] || 0} employees
                      </span>
                      <span>Created {new Date(designation.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setSelectedDesignation(designation)}
                      variant="outline"
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteDesignation(designation.id)}
                      variant="outline"
                      size="small"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {designations.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👔</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Designations</h3>
              <p className="text-gray-600 mb-4">Create your first designation to organize your team.</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Designation
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Employee Hierarchy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Employee Hierarchy</h3>
        <div className="space-y-4">
          {Object.entries(stats).map(([department, designations]) => (
            <div key={department} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🏢</span>
                {department}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(designations).map(([designationName, count]) => (
                  <div key={designationName} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{designationName}</span>
                      <span className="text-sm text-gray-500">{count} employees</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      {showCreateForm && (
        <CreateDesignationModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={createDesignation}
        />
      )}

      {showAssignForm && (
        <AssignDesignationModal
          employees={employees}
          designations={designations}
          departments={departments}
          onClose={() => setShowAssignForm(false)}
          onSubmit={assignDesignation}
        />
      )}

      {selectedDesignation && (
        <EditDesignationModal
          designation={selectedDesignation}
          onClose={() => setSelectedDesignation(null)}
          onSubmit={(updates) => updateDesignation(selectedDesignation.id, updates)}
        />
      )}
    </div>
  );
};

// Create Designation Modal
const CreateDesignationModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 3,
    department: 'General',
    permissions: {}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create Designation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Senior Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe this designation..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Engineering"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Assign Designation Modal
const AssignDesignationModal = ({ employees, designations, departments, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userId: '',
    designationId: '',
    department: '',
    employeeId: '',
    hireDate: '',
    salaryRange: '',
    managerId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData.userId, formData.designationId, {
      department: formData.department,
      employeeId: formData.employeeId,
      hireDate: formData.hireDate,
      salaryRange: formData.salaryRange,
      managerId: formData.managerId
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Assign Designation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
            <select
              required
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select employee</option>
              {employees.map(employee => (
                <option key={employee.user_id} value={employee.user_id}>
                  {employee.user?.full_name || employee.user?.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
            <select
              required
              value={formData.designationId}
              onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select designation</option>
              {designations.map(designation => (
                <option key={designation.id} value={designation.id}>
                  {designation.name} (Level {designation.level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., EMP001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
            <input
              type="date"
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Assign</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Edit Designation Modal
const EditDesignationModal = ({ designation, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: designation.name,
    description: designation.description,
    level: designation.level,
    department: designation.department,
    isActive: designation.is_active
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Designation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Update</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DesignationManager;
