import { useState, useCallback } from 'react';
import { UserStats, Achievement, SystemLogEntry, ChatMessage, Project, TaskStatus } from '../types';
import { ALL_TITLES } from '../constants/titles';
import { getLevelFromXP } from '../constants/levels';
import { soundManager } from '../services/soundService';

export const useProgressEngine = (initialStats: UserStats) => {
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [achievements, setAchievements] = useState<Achievement[]>(ALL_TITLES);
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([]);

  const addLogEntry = useCallback((type: SystemLogEntry['type'], eventName: string, targetName: string, xpAmount?: number) => {
    const newLog: SystemLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      eventName,
      targetName,
      xpAmount,
    };
    setSystemLogs(prev => [newLog, ...prev]);
  }, []);

  const gainXP = useCallback((amount: number, reason: string, onLevelUp?: (msg: ChatMessage) => void) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevelInfo = getLevelFromXP(newXP);
      const newLevel = newLevelInfo.level;

      if (newLevel > oldLevel) {
        soundManager.playLevelUp();
        const levelUpMsg: ChatMessage = {
          id: `levelup-${Date.now()}`,
          role: 'assistant',
          content: `【等级提升】\nLv${oldLevel} → Lv${newLevel}\n新身份解锁：${newLevelInfo.identity}`,
          timestamp: Date.now(),
        };
        onLevelUp?.(levelUpMsg);
        addLogEntry('LEVEL_UP', `系统提示：等级提升至 Lv${newLevel}`, `解锁身份：${newLevelInfo.identity}`);
      }

      addLogEntry('XP_GAIN', `获得经验 +${amount}`, reason, amount);
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, [addLogEntry]);

  const checkAchievements = useCallback((updatedProjects: Project[]) => {
    if (!updatedProjects) return [];
    
    const completedRings = updatedProjects.filter(p => 
      p && p.tasks && p.tasks.length > 0 && p.tasks.every(t => t.status === TaskStatus.DONE)
    );

    const totalTasksDone = updatedProjects.reduce((acc, p) => 
      acc + (p?.tasks?.filter(t => t.status === TaskStatus.DONE).length || 0), 0
    );

    const totalTasks = updatedProjects.reduce((acc, p) => acc + (p?.tasks?.length || 0), 0);
    const progress = totalTasks > 0 ? (totalTasksDone / totalTasks) * 100 : 0;

    let newlyUnlocked: Achievement[] = [];
    
    setAchievements(prev => {
      const next = prev.map(achievement => {
        if (achievement.unlockedAt) return achievement;

        let unlocked = false;
        const now = new Date();
        const hour = now.getHours();

        // Use a functional update for stats to get the latest values if needed,
        // but for now we'll rely on the fact that we're inside setAchievements.
        // Actually, we can't easily access stats here without it being a dependency.
        // But we can pass stats as an argument or just keep it as is if it's not looping.

        switch (achievement.id) {
          case 'awakening_1': if (stats.totalRingsCreated >= 1) unlocked = true; break;
          case 'awakening_2': if (stats.totalTasksCreated >= 3) unlocked = true; break;
          case 'awakening_3': if (completedRings.length >= 1) unlocked = true; break;
          case 'awakening_4': if (stats.streakDays >= 3) unlocked = true; break;
          case 'executor_1': if (completedRings.length >= 3) unlocked = true; break;
          case 'executor_2': if (completedRings.length >= 5) unlocked = true; break;
          case 'executor_3': if (progress >= 30) unlocked = true; break;
          case 'executor_5': if (stats.streakDays >= 7) unlocked = true; break;
          case 'control_1': if (completedRings.length >= 10) unlocked = true; break;
          case 'control_2': if (updatedProjects.length >= 10) unlocked = true; break;
          case 'control_4': if (totalTasksDone >= 100) unlocked = true; break;
          case 'control_5': if (stats.streakDays >= 10) unlocked = true; break;
          case 'rule_1': if (completedRings.length >= 20) unlocked = true; break;
          case 'rule_4': if (progress >= 70) unlocked = true; break;
          case 'rule_5': if (stats.streakDays >= 30) unlocked = true; break;
          case 'hidden_1': if (hour === 4 && completedRings.length > stats.totalRingsCompleted) unlocked = true; break;
          case 'hidden_2': if (hour === 1) unlocked = true; break;
        }

        if (unlocked) {
          soundManager.playAchievement();
          const unlockedAchievement = { ...achievement, unlockedAt: Date.now() };
          newlyUnlocked.push(unlockedAchievement);
          // We'll call gainXP outside to avoid nested state updates if possible,
          // but gainXP itself is a callback.
          return unlockedAchievement;
        }
        return achievement;
      });
      return next;
    });

    // Call gainXP for each newly unlocked achievement
    newlyUnlocked.forEach(a => {
      gainXP(a.xpReward, `解锁成就：${a.title}`);
    });

    setStats(prev => ({
      ...prev,
      totalRingsCompleted: completedRings.length,
      totalTasksCompleted: totalTasksDone,
      dailyProgress: progress,
      maxDailyProgress: Math.max(prev.maxDailyProgress, progress),
    }));

    return newlyUnlocked;
  }, [gainXP, stats.totalRingsCreated, stats.totalTasksCreated, stats.streakDays, stats.totalRingsCompleted]);

  const addTimeSpent = useCallback((minutes: number) => {
    setStats(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + minutes
    }));
  }, []);

  return {
    stats,
    setStats,
    achievements,
    systemLogs,
    setSystemLogs,
    addLogEntry,
    gainXP,
    checkAchievements,
    addTimeSpent
  };
};
