import db from '../database';

export interface TimeStats {
  totalFocusTime: number;
  averageDailyTime: number;
  longestSession: number;
  currentStreak: number;
  bestStreak: number;
}

export interface ProjectStats {
  project: string;
  totalSessions: number;
  totalTime: number;
  averageSessionLength: number;
}

export interface DailyProgress {
  date: string;
  focusTime: number;
  sessions: number;
  goal: number;
  goalAchieved: boolean;
}

export class StatsCalculator {
  static getUserStats(userId: string): TimeStats {
    // Total focus time
    const totalResult = db.prepare(`
      SELECT COALESCE(SUM(duration), 0) as total
      FROM sessions 
      WHERE user_id = ? AND duration IS NOT NULL
    `).get(userId);

    // Average daily time (last 30 days)
    const avgResult = db.prepare(`
      SELECT COALESCE(AVG(daily.total), 0) as average
      FROM (
        SELECT SUM(duration) as total
        FROM sessions 
        WHERE user_id = ? 
          AND duration IS NOT NULL
          AND date(start_time) >= date('now', '-30 days')
        GROUP BY date(start_time)
      ) daily
    `).get(userId);

    // Longest session
    const longestResult = db.prepare(`
      SELECT MAX(duration) as longest
      FROM sessions 
      WHERE user_id = ? AND duration IS NOT NULL
    `).get(userId);

    // Current streak (days with at least 1 session)
    const streakResult = db.prepare(`
      WITH RECURSIVE dates AS (
        SELECT date('now') as day
        UNION ALL
        SELECT date(day, '-1 day')
        FROM dates
        WHERE day > date('now', '-90 days')
      ),
      session_days AS (
        SELECT DISTINCT date(start_time) as day
        FROM sessions 
        WHERE user_id = ? AND date(start_time) >= date('now', '-90 days')
      ),
      streaks AS (
        SELECT 
          day,
          CASE 
            WHEN session_days.day IS NOT NULL THEN 1
            ELSE 0
          END as has_session,
          CASE 
            WHEN session_days.day IS NOT NULL AND date(day, '-1 day') IN session_days THEN 1
            ELSE 0
          END as continues_streak
        FROM dates
        LEFT JOIN session_days ON dates.day = session_days.day
        ORDER BY dates.day DESC
      )
      SELECT 
        (SELECT COUNT(*) FROM streaks WHERE has_session = 1 AND continues_streak = 1) as current_streak,
        (SELECT MAX(streak) FROM (
          SELECT 
            SUM(has_session) OVER (ORDER BY day DESC) as streak
          FROM streaks
        )) as best_streak
    `).get(userId);

    return {
      totalFocusTime: totalResult.total || 0,
      averageDailyTime: Math.round(avgResult.average || 0),
      longestSession: longestResult.longest || 0,
      currentStreak: streakResult.current_streak || 0,
      bestStreak: streakResult.best_streak || 0
    };
  }

  static getProjectStats(userId: string): ProjectStats[] {
    const projects = db.prepare(`
      SELECT 
        project,
        COUNT(*) as total_sessions,
        SUM(duration) as total_time,
        AVG(duration) as avg_length
      FROM sessions 
      WHERE user_id = ? AND duration IS NOT NULL
      GROUP BY project
      ORDER BY total_time DESC
      LIMIT 10
    `).all(userId);

    return projects.map(p => ({
      project: p.project,
      totalSessions: p.total_sessions,
      totalTime: p.total_time || 0,
      averageSessionLength: Math.round(p.avg_length || 0)
    }));
  }

  static getDailyProgress(userId: string, days: number = 14): DailyProgress[] {
    const user = db.prepare('SELECT daily_goal FROM users WHERE id = ?').get(userId);
    const dailyGoal = user?.daily_goal || 120;

    const progress = db.prepare(`
      WITH RECURSIVE dates AS (
        SELECT date('now', ? || ' days') as day
        UNION ALL
        SELECT date(day, '+1 day')
        FROM dates
        WHERE day < date('now')
      )
      SELECT 
        dates.day as date,
        COALESCE(SUM(sessions.duration), 0) as focus_time,
        COALESCE(COUNT(sessions.id), 0) as sessions
      FROM dates
      LEFT JOIN sessions ON date(sessions.start_time) = dates.day 
        AND sessions.user_id = ? 
        AND sessions.duration IS NOT NULL
      GROUP BY dates.day
      ORDER BY dates.day DESC
    `).all(`-${days - 1}`, userId);

    return progress.map(p => ({
      date: p.date,
      focusTime: p.focus_time || 0,
      sessions: p.sessions || 0,
      goal: dailyGoal,
      goalAchieved: p.focus_time >= dailyGoal
    }));
  }

  static getWeeklySummary(userId: string) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
    
    const weekStats = db.prepare(`
      SELECT 
        COUNT(*) as sessions,
        COALESCE(SUM(duration), 0) as focus_time,
        COUNT(DISTINCT date(start_time)) as active_days
      FROM sessions 
      WHERE user_id = ? 
        AND date(start_time) >= date(?)
        AND duration IS NOT NULL
    `).get(userId, weekStart.toISOString().split('T')[0]);

    const user = db.prepare('SELECT weekly_goal FROM users WHERE id = ?').get(userId);
    const weeklyGoal = user?.weekly_goal || 600;

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      sessions: weekStats.sessions || 0,
      focusTime: weekStats.focus_time || 0,
      activeDays: weekStats.active_days || 0,
      weeklyGoal,
      goalProgress: Math.min(Math.round((weekStats.focus_time || 0) / weeklyGoal * 100), 100)
    };
  }
}
