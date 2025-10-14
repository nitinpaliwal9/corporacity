-- Schedule and Leave Management schema
-- This creates the schedules and leave requests tables

-- Create schedules table
CREATE TABLE IF NOT EXISTS corp_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES corp_companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  type VARCHAR(50) NOT NULL CHECK (type IN ('work', 'meeting', 'holiday', 'event', 'training')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave requests table
CREATE TABLE IF NOT EXISTS corp_leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES corp_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('sick', 'vacation', 'personal', 'emergency')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_corp_schedules_company_id ON corp_schedules(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_schedules_date ON corp_schedules(date);
CREATE INDEX IF NOT EXISTS idx_corp_schedules_user_id ON corp_schedules(user_id);

CREATE INDEX IF NOT EXISTS idx_corp_leave_requests_company_id ON corp_leave_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_leave_requests_user_id ON corp_leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_leave_requests_status ON corp_leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_corp_leave_requests_dates ON corp_leave_requests(start_date, end_date);

-- Enable RLS
ALTER TABLE corp_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_leave_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schedules
CREATE POLICY "Users can view company schedules" ON corp_schedules
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create schedules for their company" ON corp_schedules
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update schedules in their company" ON corp_schedules
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete schedules in their company" ON corp_schedules
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for leave requests
CREATE POLICY "Users can view their own leave requests" ON corp_leave_requests
  FOR SELECT USING (
    user_id = auth.uid() OR
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Users can create their own leave requests" ON corp_leave_requests
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    company_id IN (
      SELECT company_id FROM corp_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update leave requests in their company" ON corp_leave_requests
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM corp_memberships 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_corp_schedules_updated_at
  BEFORE UPDATE ON corp_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_leave_requests_updated_at
  BEFORE UPDATE ON corp_leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
