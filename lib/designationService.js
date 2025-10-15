// Designation Management Service for HR/CEO
import supabase from './supabaseClient';

class DesignationService {
  constructor() {
    this.supabase = supabase;
  }

  // Create a new designation
  async createDesignation(companyId, designationData) {
    const {
      name,
      description = '',
      level = 1,
      department = 'General',
      permissions = {},
      isActive = true
    } = designationData;

    const { data, error } = await this.supabase
      .from('corp_designations')
      .insert([{
        company_id: companyId,
        name,
        description,
        level,
        department,
        permissions,
        is_active: isActive
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all designations for a company
  async getDesignations(companyId, options = {}) {
    const { includeInactive = false } = options;

    let query = this.supabase
      .from('corp_designations')
      .select('*')
      .eq('company_id', companyId)
      .order('level', { ascending: true })
      .order('name', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Update a designation
  async updateDesignation(designationId, updates) {
    const { data, error } = await this.supabase
      .from('corp_designations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', designationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a designation (soft delete)
  async deleteDesignation(designationId) {
    // Check if any employees are using this designation
    const { data: employees, error: checkError } = await this.supabase
      .from('corp_memberships')
      .select('id')
      .eq('designation_id', designationId)
      .eq('is_active', true)
      .limit(1);

    if (checkError) throw checkError;

    if (employees && employees.length > 0) {
      throw new Error('Cannot delete designation that is assigned to active employees');
    }

    const { error } = await this.supabase
      .from('corp_designations')
      .update({ is_active: false })
      .eq('id', designationId);

    if (error) throw error;
  }

  // Assign designation to employee
  async assignDesignation(userId, companyId, designationId, additionalData = {}) {
    const {
      department = null,
      employeeId = null,
      hireDate = null,
      salaryRange = null,
      managerId = null
    } = additionalData;

    const { data, error } = await this.supabase
      .from('corp_memberships')
      .update({
        designation_id: designationId,
        department,
        employee_id: employeeId,
        hire_date: hireDate,
        salary_range: salaryRange,
        manager_id: managerId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get employees by designation
  async getEmployeesByDesignation(companyId, designationId) {
    const { data, error } = await this.supabase
      .from('corp_memberships')
      .select(`
        *,
        user:corp_profiles!corp_memberships_user_id_fkey(full_name, email),
        designation:corp_designations!corp_memberships_designation_id_fkey(name, level, department),
        manager:corp_profiles!corp_memberships_manager_id_fkey(full_name, email)
      `)
      .eq('company_id', companyId)
      .eq('designation_id', designationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get employee hierarchy
  async getEmployeeHierarchy(companyId) {
    const { data, error } = await this.supabase
      .from('corp_memberships')
      .select(`
        *,
        user:corp_profiles!corp_memberships_user_id_fkey(full_name, email),
        designation:corp_designations!corp_memberships_designation_id_fkey(name, level, department),
        manager:corp_profiles!corp_memberships_manager_id_fkey(full_name, email)
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('designation.level', { ascending: false })
      .order('user.full_name', { ascending: true });

    if (error) throw error;

    // Organize into hierarchy
    const hierarchy = {};
    const employees = data || [];

    employees.forEach(employee => {
      const designation = employee.designation?.name || 'Unassigned';
      const department = employee.department || 'General';

      if (!hierarchy[department]) {
        hierarchy[department] = {};
      }
      if (!hierarchy[department][designation]) {
        hierarchy[department][designation] = [];
      }

      hierarchy[department][designation].push(employee);
    });

    return hierarchy;
  }

  // Get departments
  async getDepartments(companyId) {
    const { data, error } = await this.supabase
      .from('corp_memberships')
      .select('department')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .not('department', 'is', null);

    if (error) throw error;

    const departments = [...new Set(data.map(item => item.department))];
    return departments.sort();
  }

  // Get designation statistics
  async getDesignationStats(companyId) {
    const { data, error } = await this.supabase
      .from('corp_memberships')
      .select(`
        designation_id,
        designation:corp_designations!corp_memberships_designation_id_fkey(name, department)
      `)
      .eq('company_id', companyId)
      .eq('is_active', true);

    if (error) throw error;

    const stats = {};
    data.forEach(membership => {
      const designation = membership.designation?.name || 'Unassigned';
      const department = membership.designation?.department || 'General';
      
      if (!stats[department]) {
        stats[department] = {};
      }
      if (!stats[department][designation]) {
        stats[department][designation] = 0;
      }
      stats[department][designation]++;
    });

    return stats;
  }

  // Bulk assign designations
  async bulkAssignDesignations(assignments) {
    const updates = assignments.map(assignment => ({
      user_id: assignment.userId,
      company_id: assignment.companyId,
      designation_id: assignment.designationId,
      department: assignment.department,
      employee_id: assignment.employeeId,
      hire_date: assignment.hireDate,
      salary_range: assignment.salaryRange,
      manager_id: assignment.managerId,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await this.supabase
      .from('corp_memberships')
      .upsert(updates, {
        onConflict: 'user_id,company_id'
      })
      .select();

    if (error) throw error;
    return data;
  }

  // Get default designations for new companies
  getDefaultDesignations() {
    return [
      {
        name: 'CEO',
        description: 'Chief Executive Officer',
        level: 10,
        department: 'Executive',
        permissions: {
          canManageAnnouncements: true,
          canManageDesignations: true,
          canViewAllData: true,
          canManageEmployees: true
        }
      },
      {
        name: 'Manager',
        description: 'Team Manager',
        level: 7,
        department: 'Management',
        permissions: {
          canManageAnnouncements: true,
          canViewTeamData: true,
          canManageTeamMembers: true
        }
      },
      {
        name: 'Senior Employee',
        description: 'Senior Level Employee',
        level: 5,
        department: 'General',
        permissions: {
          canViewTeamData: true
        }
      },
      {
        name: 'Employee',
        description: 'General Employee',
        level: 3,
        department: 'General',
        permissions: {}
      },
      {
        name: 'Intern',
        description: 'Intern or Trainee',
        level: 1,
        department: 'General',
        permissions: {}
      }
    ];
  }

  // Create default designations for a company
  async createDefaultDesignations(companyId) {
    const defaultDesignations = this.getDefaultDesignations();
    
    const designations = defaultDesignations.map(designation => ({
      ...designation,
      company_id: companyId
    }));

    const { data, error } = await this.supabase
      .from('corp_designations')
      .insert(designations)
      .select();

    if (error) throw error;
    return data;
  }

  // Get permission levels
  getPermissionLevels() {
    return [
      {
        level: 1,
        name: 'Basic',
        description: 'Basic employee permissions',
        permissions: ['view_own_data']
      },
      {
        level: 3,
        name: 'Standard',
        description: 'Standard employee permissions',
        permissions: ['view_own_data', 'update_status', 'view_team_announcements']
      },
      {
        level: 5,
        name: 'Senior',
        description: 'Senior employee permissions',
        permissions: ['view_own_data', 'update_status', 'view_team_announcements', 'view_team_data']
      },
      {
        level: 7,
        name: 'Manager',
        description: 'Manager permissions',
        permissions: ['view_own_data', 'update_status', 'view_team_announcements', 'view_team_data', 'manage_team', 'create_announcements']
      },
      {
        level: 10,
        name: 'Executive',
        description: 'Executive permissions',
        permissions: ['all_permissions']
      }
    ];
  }

  // Validate designation assignment
  async validateDesignationAssignment(userId, companyId, designationId) {
    // Check if user is member of company
    const { data: membership, error: membershipError } = await this.supabase
      .from('corp_memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .single();

    if (membershipError || !membership) {
      throw new Error('User is not a member of this company');
    }

    // Check if designation exists and is active
    const { data: designation, error: designationError } = await this.supabase
      .from('corp_designations')
      .select('id, is_active')
      .eq('id', designationId)
      .eq('company_id', companyId)
      .single();

    if (designationError || !designation) {
      throw new Error('Designation not found');
    }

    if (!designation.is_active) {
      throw new Error('Designation is not active');
    }

    return true;
  }
}

export default new DesignationService();
