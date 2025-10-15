-- Enhanced Analytics Schema for Corporacity
-- This extends the existing schema to support comprehensive data collection

-- User Analytics Table - Stores all user behavior and interaction data
CREATE TABLE IF NOT EXISTS corp_user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'status_update', 'app_usage', 'feedback', 'meeting', etc.
  data JSONB, -- Flexible data storage for different action types
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  device_type TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Enhanced Status Table - Extends existing corp_statuses with additional context
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS mood INTEGER CHECK (mood >= 1 AND mood <= 5);
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5);
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS workload INTEGER CHECK (workload >= 1 AND workload <= 5);
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS location JSONB;
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS device_info JSONB;
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS time_to_update INTEGER; -- milliseconds
ALTER TABLE corp_statuses ADD COLUMN IF NOT EXISTS context_data JSONB; -- Additional flexible data

-- Team Collaboration Table
CREATE TABLE IF NOT EXISTS corp_team_collaborations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  initiator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participants UUID[] NOT NULL, -- Array of user IDs
  collaboration_type TEXT NOT NULL, -- 'meeting', 'project', 'discussion', 'review'
  topic TEXT,
  duration INTEGER, -- in minutes
  effectiveness INTEGER CHECK (effectiveness >= 1 AND effectiveness <= 5),
  outcome TEXT, -- 'positive', 'negative', 'neutral', 'resolved', 'escalated'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Task Management Table
CREATE TABLE IF NOT EXISTS corp_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT, -- 'development', 'design', 'meeting', 'research', 'admin'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  complexity INTEGER CHECK (complexity >= 1 AND complexity <= 5),
  estimated_hours INTEGER,
  actual_hours INTEGER,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  blockers TEXT[],
  tags TEXT[],
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Wellness Tracking Table
CREATE TABLE IF NOT EXISTS corp_wellness_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  work_life_balance INTEGER CHECK (work_life_balance >= 1 AND work_life_balance <= 5),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  sleep_hours DECIMAL(3,1),
  exercise_minutes INTEGER,
  break_minutes INTEGER,
  overtime_hours DECIMAL(4,2),
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Learning and Development Table
CREATE TABLE IF NOT EXISTS corp_learning_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  learning_type TEXT NOT NULL, -- 'course', 'mentoring', 'practice', 'research', 'certification'
  title TEXT,
  description TEXT,
  time_spent INTEGER, -- in minutes
  proficiency_before INTEGER CHECK (proficiency_before >= 1 AND proficiency_before <= 5),
  proficiency_after INTEGER CHECK (proficiency_after >= 1 AND proficiency_after <= 5),
  resources TEXT[],
  was_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals and Objectives Table
CREATE TABLE IF NOT EXISTS corp_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL, -- 'personal', 'team', 'company', 'project'
  category TEXT, -- 'productivity', 'learning', 'wellness', 'collaboration'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  unit TEXT, -- 'hours', 'tasks', 'percentage', 'score'
  deadline TIMESTAMPTZ,
  was_achieved BOOLEAN DEFAULT FALSE,
  obstacles TEXT[],
  milestones JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  achieved_at TIMESTAMPTZ
);

-- Feedback and Sentiment Table
CREATE TABLE IF NOT EXISTS corp_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL, -- 'suggestion', 'complaint', 'praise', 'question', 'concern'
  category TEXT, -- 'workload', 'schedule', 'team', 'tools', 'environment', 'management'
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  sentiment TEXT, -- 'positive', 'negative', 'neutral' (AI-analyzed)
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  response TEXT,
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Environmental Factors Table
CREATE TABLE IF NOT EXISTS corp_environmental_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  work_location TEXT, -- 'office', 'home', 'cafe', 'co-working', 'client-site'
  weather TEXT,
  temperature DECIMAL(4,1),
  noise_level INTEGER CHECK (noise_level >= 1 AND noise_level <= 5),
  lighting INTEGER CHECK (lighting >= 1 AND lighting <= 5),
  distractions TEXT[],
  equipment_issues TEXT[],
  internet_quality INTEGER CHECK (internet_quality >= 1 AND internet_quality <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- AI Insights Cache Table
CREATE TABLE IF NOT EXISTS corp_ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES corp_companies(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'productivity', 'engagement', 'burnout', 'collaboration'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 100),
  impact_level TEXT, -- 'low', 'medium', 'high', 'critical'
  affected_users UUID[],
  data_points JSONB,
  recommendations JSONB,
  is_actionable BOOLEAN DEFAULT TRUE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_corp_user_analytics_user_id_timestamp ON corp_user_analytics (user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_corp_user_analytics_company_id_action ON corp_user_analytics (company_id, action);
CREATE INDEX IF NOT EXISTS idx_corp_user_analytics_timestamp ON corp_user_analytics (timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_corp_team_collaborations_company_id ON corp_team_collaborations (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_team_collaborations_participants ON corp_team_collaborations USING GIN (participants);
CREATE INDEX IF NOT EXISTS idx_corp_team_collaborations_created_at ON corp_team_collaborations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_corp_tasks_company_id ON corp_tasks (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_tasks_assigned_to ON corp_tasks (assigned_to);
CREATE INDEX IF NOT EXISTS idx_corp_tasks_status ON corp_tasks (status);
CREATE INDEX IF NOT EXISTS idx_corp_tasks_due_date ON corp_tasks (due_date);

CREATE INDEX IF NOT EXISTS idx_corp_wellness_tracking_user_id_date ON corp_wellness_tracking (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_corp_wellness_tracking_company_id ON corp_wellness_tracking (company_id);

CREATE INDEX IF NOT EXISTS idx_corp_learning_tracking_user_id ON corp_learning_tracking (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_learning_tracking_company_id ON corp_learning_tracking (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_learning_tracking_skill ON corp_learning_tracking (skill);

CREATE INDEX IF NOT EXISTS idx_corp_goals_user_id ON corp_goals (user_id);
CREATE INDEX IF NOT EXISTS idx_corp_goals_company_id ON corp_goals (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_goals_goal_type ON corp_goals (goal_type);
CREATE INDEX IF NOT EXISTS idx_corp_goals_deadline ON corp_goals (deadline);

CREATE INDEX IF NOT EXISTS idx_corp_feedback_company_id ON corp_feedback (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_feedback_feedback_type ON corp_feedback (feedback_type);
CREATE INDEX IF NOT EXISTS idx_corp_feedback_created_at ON corp_feedback (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_corp_environmental_data_user_id_date ON corp_environmental_data (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_corp_environmental_data_company_id ON corp_environmental_data (company_id);

CREATE INDEX IF NOT EXISTS idx_corp_ai_insights_company_id ON corp_ai_insights (company_id);
CREATE INDEX IF NOT EXISTS idx_corp_ai_insights_insight_type ON corp_ai_insights (insight_type);
CREATE INDEX IF NOT EXISTS idx_corp_ai_insights_created_at ON corp_ai_insights (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corp_ai_insights_expires_at ON corp_ai_insights (expires_at);

-- Row Level Security Policies
ALTER TABLE corp_user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_team_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_wellness_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_learning_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE corp_ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for corp_user_analytics
CREATE POLICY "Users can view their own analytics" ON corp_user_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" ON corp_user_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Company members can view company analytics" ON corp_user_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM corp_memberships 
      WHERE user_id = auth.uid() AND company_id = corp_user_analytics.company_id
    )
  );

-- RLS Policies for other tables (similar pattern)
-- [Additional RLS policies would follow the same pattern for each table]

-- Functions for AI Analysis
CREATE OR REPLACE FUNCTION calculate_productivity_score(company_id_param UUID, days_back INTEGER DEFAULT 30)
RETURNS DECIMAL AS $$
DECLARE
  present_count INTEGER;
  total_count INTEGER;
  productivity_score DECIMAL;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE type = 'present'),
    COUNT(*)
  INTO present_count, total_count
  FROM corp_statuses 
  WHERE corp_statuses.company_id = company_id_param 
    AND timestamp >= NOW() - INTERVAL '1 day' * days_back;
  
  IF total_count = 0 THEN
    RETURN 0;
  END IF;
  
  productivity_score := (present_count::DECIMAL / total_count::DECIMAL) * 100;
  RETURN ROUND(productivity_score, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_engagement_score(company_id_param UUID, days_back INTEGER DEFAULT 30)
RETURNS DECIMAL AS $$
DECLARE
  avg_updates_per_user DECIMAL;
  expected_updates_per_user DECIMAL;
  engagement_score DECIMAL;
BEGIN
  WITH user_updates AS (
    SELECT 
      user_id,
      COUNT(*) as update_count,
      COUNT(DISTINCT DATE(timestamp)) as active_days
    FROM corp_statuses 
    WHERE company_id = company_id_param 
      AND timestamp >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY user_id
  )
  SELECT 
    AVG(update_count::DECIMAL / GREATEST(active_days, 1)),
    days_back
  INTO avg_updates_per_user, expected_updates_per_user
  FROM user_updates;
  
  engagement_score := LEAST((avg_updates_per_user / expected_updates_per_user) * 100, 100);
  RETURN ROUND(engagement_score, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_corp_tasks_updated_at 
  BEFORE UPDATE ON corp_tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corp_goals_updated_at 
  BEFORE UPDATE ON corp_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
