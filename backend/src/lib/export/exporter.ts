import db from '../database';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface ExportOptions {
  includeSessions: boolean;
  includeDevLogs: boolean;
  includeStats: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ExportData {
  metadata: {
    exportId: string;
    exportedAt: string;
    version: string;
    userId: string;
    options: ExportOptions;
  };
  sessions?: any[];
  devLogs?: any[];
  dailyStats?: any[];
  user?: any;
}

export class DataExporter {
  static async exportUserData(userId: string, options: ExportOptions): Promise<ExportData> {
    const exportId = uuidv4();
    const exportedAt = new Date().toISOString();
    const version = '1.0.0';

    const exportData: ExportData = {
      metadata: {
        exportId,
        exportedAt,
        version,
        userId,
        options
      }
    };

    // Get user data
    const user = db.prepare(`
      SELECT id, email, username, daily_goal as dailyGoal, weekly_goal as weeklyGoal, 
             datetime(created_at) as createdAt
      FROM users WHERE id = ?
    `).get(userId);

    if (user) {
      exportData.user = user;
    }

    // Get sessions if requested
    if (options.includeSessions) {
      let sessionQuery = `
        SELECT 
          id, user_id as userId,
          datetime(start_time) as startTime,
          datetime(end_time) as endTime,
          duration, project, tags, notes, is_active as isActive
        FROM sessions 
        WHERE user_id = ?
      `;
      
      const params: any[] = [userId];
      
      if (options.dateRange) {
        sessionQuery += ` AND date(start_time) BETWEEN date(?) AND date(?)`;
        params.push(options.dateRange.start, options.dateRange.end);
      }
      
      sessionQuery += ` ORDER BY start_time`;
      
      const sessions = db.prepare(sessionQuery).all(...params);
      
      // Parse JSON tags
      exportData.sessions = sessions.map(session => ({
        ...session,
        tags: JSON.parse(session.tags),
        startTime: session.startTime,
        endTime: session.endTime || undefined
      }));
    }

    // Get dev logs if requested
    if (options.includeDevLogs) {
      let logsQuery = `
        SELECT 
          id, user_id as userId,
          datetime(date) as date,
          content, tags, mood
        FROM dev_logs 
        WHERE user_id = ?
      `;
      
      const params: any[] = [userId];
      
      if (options.dateRange) {
        logsQuery += ` AND date(date) BETWEEN date(?) AND date(?)`;
        params.push(options.dateRange.start, options.dateRange.end);
      }
      
      logsQuery += ` ORDER BY date`;
      
      const devLogs = db.prepare(logsQuery).all(...params);
      
      // Parse JSON tags
      exportData.devLogs = devLogs.map(log => ({
        ...log,
        tags: JSON.parse(log.tags),
        date: log.date
      }));
    }

    // Get daily stats if requested
    if (options.includeStats) {
      let statsQuery = `
        SELECT 
          id, user_id as userId, date,
          total_sessions as totalSessions,
          total_focus_time as totalFocusTime,
          projects, tags
        FROM daily_stats 
        WHERE user_id = ?
      `;
      
      const params: any[] = [userId];
      
      if (options.dateRange) {
        statsQuery += ` AND date BETWEEN date(?) AND date(?)`;
        params.push(options.dateRange.start, options.dateRange.end);
      }
      
      statsQuery += ` ORDER BY date`;
      
      const dailyStats = db.prepare(statsQuery).all(...params);
      
      // Parse JSON arrays
      exportData.dailyStats = dailyStats.map(stat => ({
        ...stat,
        projects: JSON.parse(stat.projects || '[]'),
        tags: JSON.parse(stat.tags || '[]')
      }));
    }

    return exportData;
  }

  static async exportToFile(userId: string, options: ExportOptions, filePath: string): Promise<string> {
    const data = await this.exportUserData(userId, options);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return filePath;
  }

  static async importUserData(userId: string, importData: ExportData): Promise<{
    sessionsImported: number;
    devLogsImported: number;
    statsImported: number;
  }> {
    const results = {
      sessionsImported: 0,
      devLogsImported: 0,
      statsImported: 0
    };

    // Import sessions
    if (importData.sessions && importData.sessions.length > 0) {
      const insertSession = db.prepare(`
        INSERT OR REPLACE INTO sessions (id, user_id, start_time, end_time, duration, project, tags, notes, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const session of importData.sessions) {
        try {
          insertSession.run(
            session.id,
            userId,
            session.startTime,
            session.endTime || null,
            session.duration || null,
            session.project,
            JSON.stringify(session.tags || []),
            session.notes || null,
            session.isActive ? 1 : 0
          );
          results.sessionsImported++;
        } catch (error) {
          console.error('Failed to import session:', error);
        }
      }
    }

    // Import dev logs
    if (importData.devLogs && importData.devLogs.length > 0) {
      const insertDevLog = db.prepare(`
        INSERT OR REPLACE INTO dev_logs (id, user_id, date, content, tags, mood)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const log of importData.devLogs) {
        try {
          insertDevLog.run(
            log.id,
            userId,
            log.date,
            log.content,
            JSON.stringify(log.tags || []),
            log.mood || 3
          );
          results.devLogsImported++;
        } catch (error) {
          console.error('Failed to import dev log:', error);
        }
      }
    }

    // Import daily stats
    if (importData.dailyStats && importData.dailyStats.length > 0) {
      const insertStat = db.prepare(`
        INSERT OR REPLACE INTO daily_stats (id, user_id, date, total_sessions, total_focus_time, projects, tags)
        VALUES (?, ?, date(?), ?, ?, ?, ?)
      `);

      for (const stat of importData.dailyStats) {
        try {
          insertStat.run(
            stat.id,
            userId,
            stat.date,
            stat.totalSessions || 0,
            stat.totalFocusTime || 0,
            JSON.stringify(stat.projects || []),
            JSON.stringify(stat.tags || [])
          );
          results.statsImported++;
        } catch (error) {
          console.error('Failed to import daily stat:', error);
        }
      }
    }

    return results;
  }

  static async importFromFile(userId: string, filePath: string): Promise<any> {
    if (!fs.existsSync(filePath)) {
      throw new Error('Import file not found');
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const importData: ExportData = JSON.parse(fileContent);

    // Verify export format
    if (!importData.metadata || importData.metadata.version !== '1.0.0') {
      throw new Error('Invalid export format');
    }

    return this.importUserData(userId, importData);
  }

  static getExportHistory(userId: string): any[] {
    const exportsDir = path.join(__dirname, '../../../exports');
    
    if (!fs.existsSync(exportsDir)) {
      return [];
    }

    const userExports = [];
    const files = fs.readdirSync(exportsDir);

    for (const file of files) {
      if (file.startsWith(`export_${userId}_`)) {
        const filePath = path.join(exportsDir, file);
        try {
          const stats = fs.statSync(filePath);
          userExports.push({
            filename: file,
            path: filePath,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          });
        } catch (error) {
          console.error('Error reading export file:', error);
        }
      }
    }

    return userExports.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
  }
}
