// Enhanced Data Collection Service
// This shows how we can collect additional data for better AI insights

import supabase from './supabaseClient';

class EnhancedDataCollectionService {
  constructor() {
    this.supabase = supabase;
  }

  // Enhanced status update with additional context
  async postEnhancedStatus(userId, companyId, statusData) {
    const {
      type,
      message = '',
      mood = null, // 1-5 scale
      energyLevel = null, // 1-5 scale
      workload = null, // 1-5 scale
      location = null, // GPS coordinates or location name
      deviceInfo = null, // Mobile/Desktop, browser info
      timeToUpdate = null, // How long it took to update status
      isAutoUpdate = false
    } = statusData;

    // Insert enhanced status
    const { data, error } = await this.supabase
      .from('corp_statuses')
      .insert([{
        user_id: userId,
        company_id: companyId,
        type,
        message,
        timestamp: new Date().toISOString(),
        is_auto: isAutoUpdate,
        // Additional context data (we'd need to extend the schema)
        mood,
        energy_level: energyLevel,
        workload,
        location,
        device_info: deviceInfo,
        time_to_update: timeToUpdate
      }])
      .select()
      .single();

    if (error) throw error;

    // Log additional analytics
    await this.logUserBehavior(userId, companyId, {
      action: 'status_update',
      status_type: type,
      mood,
      energy_level: energyLevel,
      workload,
      timestamp: new Date().toISOString()
    });

    return data;
  }

  // Collect user behavior patterns
  async logUserBehavior(userId, companyId, behaviorData) {
    // This would go to a separate analytics table
    const { error } = await this.supabase
      .from('corp_user_analytics')
      .insert([{
        user_id: userId,
        company_id: companyId,
        ...behaviorData
      }]);

    if (error) console.error('Analytics logging error:', error);
  }

  // Collect app usage patterns
  async logAppUsage(userId, companyId, usageData) {
    const {
      page,
      timeSpent,
      actions = [],
      deviceType,
      sessionId
    } = usageData;

    await this.logUserBehavior(userId, companyId, {
      action: 'app_usage',
      page,
      time_spent: timeSpent,
      actions: JSON.stringify(actions),
      device_type: deviceType,
      session_id: sessionId,
      timestamp: new Date().toISOString()
    });
  }

  // Collect feedback and sentiment
  async collectFeedback(userId, companyId, feedbackData) {
    const {
      type, // 'suggestion', 'complaint', 'praise', 'question'
      content,
      rating, // 1-5 scale
      category, // 'workload', 'schedule', 'team', 'tools', etc.
      isAnonymous = false
    } = feedbackData;

    await this.logUserBehavior(userId, companyId, {
      action: 'feedback',
      feedback_type: type,
      content,
      rating,
      category,
      is_anonymous: isAnonymous,
      timestamp: new Date().toISOString()
    });
  }

  // Collect meeting and collaboration data
  async logMeetingData(userId, companyId, meetingData) {
    const {
      meetingId,
      duration,
      participants,
      meetingType, // 'standup', 'planning', 'review', '1on1', etc.
      effectiveness, // 1-5 scale
      wasProductive // boolean
    } = meetingData;

    await this.logUserBehavior(userId, companyId, {
      action: 'meeting',
      meeting_id: meetingId,
      duration,
      participants: JSON.stringify(participants),
      meeting_type: meetingType,
      effectiveness,
      was_productive: wasProductive,
      timestamp: new Date().toISOString()
    });
  }

  // Collect task completion data
  async logTaskCompletion(userId, companyId, taskData) {
    const {
      taskId,
      taskType,
      complexity, // 1-5 scale
      timeSpent,
      wasCompleted,
      quality, // 1-5 scale
      blockers = []
    } = taskData;

    await this.logUserBehavior(userId, companyId, {
      action: 'task_completion',
      task_id: taskId,
      task_type: taskType,
      complexity,
      time_spent: timeSpent,
      was_completed: wasCompleted,
      quality,
      blockers: JSON.stringify(blockers),
      timestamp: new Date().toISOString()
    });
  }

  // Collect wellness and work-life balance data
  async logWellnessData(userId, companyId, wellnessData) {
    const {
      stressLevel, // 1-5 scale
      workLifeBalance, // 1-5 scale
      sleepQuality, // 1-5 scale
      exerciseMinutes,
      breakMinutes,
      overtimeHours
    } = wellnessData;

    await this.logUserBehavior(userId, companyId, {
      action: 'wellness',
      stress_level: stressLevel,
      work_life_balance: workLifeBalance,
      sleep_quality: sleepQuality,
      exercise_minutes: exerciseMinutes,
      break_minutes: breakMinutes,
      overtime_hours: overtimeHours,
      timestamp: new Date().toISOString()
    });
  }

  // Collect environmental factors
  async logEnvironmentalData(userId, companyId, envData) {
    const {
      weather,
      temperature,
      noiseLevel, // 1-5 scale
      lighting, // 1-5 scale
      distractions, // array of distraction types
      workLocation // 'office', 'home', 'cafe', 'co-working', etc.
    } = envData;

    await this.logUserBehavior(userId, companyId, {
      action: 'environment',
      weather,
      temperature,
      noise_level: noiseLevel,
      lighting,
      distractions: JSON.stringify(distractions),
      work_location: workLocation,
      timestamp: new Date().toISOString()
    });
  }

  // Collect team interaction data
  async logTeamInteraction(userId, companyId, interactionData) {
    const {
      interactionType, // 'collaboration', 'conflict', 'support', 'feedback'
      participants,
      duration,
      outcome, // 'positive', 'negative', 'neutral'
      topic,
      wasResolved
    } = interactionData;

    await this.logUserBehavior(userId, companyId, {
      action: 'team_interaction',
      interaction_type: interactionType,
      participants: JSON.stringify(participants),
      duration,
      outcome,
      topic,
      was_resolved: wasResolved,
      timestamp: new Date().toISOString()
    });
  }

  // Collect learning and development data
  async logLearningData(userId, companyId, learningData) {
    const {
      skill,
      learningType, // 'course', 'mentoring', 'practice', 'research'
      timeSpent,
      proficiency, // 1-5 scale
      wasCompleted,
      resources = []
    } = learningData;

    await this.logUserBehavior(userId, companyId, {
      action: 'learning',
      skill,
      learning_type: learningType,
      time_spent: timeSpent,
      proficiency,
      was_completed: wasCompleted,
      resources: JSON.stringify(resources),
      timestamp: new Date().toISOString()
    });
  }

  // Collect goal and objective data
  async logGoalData(userId, companyId, goalData) {
    const {
      goalId,
      goalType, // 'personal', 'team', 'company'
      progress, // 0-100 percentage
      difficulty, // 1-5 scale
      deadline,
      wasAchieved,
      obstacles = []
    } = goalData;

    await this.logUserBehavior(userId, companyId, {
      action: 'goal',
      goal_id: goalId,
      goal_type: goalType,
      progress,
      difficulty,
      deadline,
      was_achieved: wasAchieved,
      obstacles: JSON.stringify(obstacles),
      timestamp: new Date().toISOString()
    });
  }
}

export default new EnhancedDataCollectionService();
