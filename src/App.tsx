/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ServerMonitoring } from './components/ServerMonitoring';
import { ProjectList } from './components/ProjectList';
import { NotificationCenter } from './components/NotificationCenter';
import { ReportProgressModal } from './components/ReportProgressModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { NewProjectModal } from './components/NewProjectModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVER_NODES,
  INITIAL_NOTIFICATIONS,
  AVAILABLE_BADGES,
} from './data/initialData';
import { StudentProject, ServerNode, NotificationItem, ProgressReport } from './types';
import { soundManager } from './utils/sound';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dasbor' | 'server' | 'proyek' | 'prestasi'>('dasbor');

  // Load from localStorage or fallback to initial data
  const [projects, setProjects] = useState<StudentProject[]>(() => {
    try {
      const saved = localStorage.getItem('serverjunior_projects');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_PROJECTS;
  });

  const [serverNodes, setServerNodes] = useState<ServerNode[]>(() => {
    try {
      const saved = localStorage.getItem('serverjunior_nodes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_SERVER_NODES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('serverjunior_notifs');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return soundManager.enabled;
  });

  // Modals state
  const [selectedProjectForReport, setSelectedProjectForReport] = useState<StudentProject | null>(null);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<StudentProject | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);

  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    targetPercent: number;
    projectTitle: string;
    teamName: string;
    badgeName?: string;
  }>({
    isOpen: false,
    targetPercent: 100,
    projectTitle: '',
    teamName: '',
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('serverjunior_projects', JSON.stringify(projects));
    } catch {
      // Ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('serverjunior_nodes', JSON.stringify(serverNodes));
    } catch {
      // Ignore
    }
  }, [serverNodes]);

  useEffect(() => {
    try {
      localStorage.setItem('serverjunior_notifs', JSON.stringify(notifications));
    } catch {
      // Ignore
    }
  }, [notifications]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundManager.enabled = next;
    setSoundEnabled(next);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Milestone Threshold Evaluator
  const checkMilestoneThresholds = (
    updatedProject: StudentProject,
    oldPoints: number,
    newPoints: number
  ) => {
    const thresholds: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];
    const achievedNow = thresholds.filter(
      (th) => newPoints >= th && (!updatedProject.targetMilestonesAchieved.includes(th) || oldPoints < th)
    );

    if (achievedNow.length > 0) {
      // Find the highest newly achieved threshold
      const highestAchieved = Math.max(...achievedNow) as 25 | 50 | 75 | 100;
      const badge = AVAILABLE_BADGES.find((b) => b.threshold === highestAchieved);

      // Create new notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        projectId: updatedProject.id,
        projectTitle: updatedProject.title,
        targetPercent: highestAchieved,
        title:
          highestAchieved === 100
            ? '🏆 Target Maksimal 100% Tercapai!'
            : highestAchieved === 75
            ? '🛡️ Target 75% Tercapai - Siap Evaluasi Akhir!'
            : highestAchieved === 50
            ? '⚡ Target 50% Tercapai - Separuh Jalan!'
            : '🚀 Target 25% Tercapai - Pondasi Kokoh!',
        message:
          highestAchieved === 100
            ? `Selamat untuk ${updatedProject.teamName}! Seluruh tahapan proyek telah diselesaikan dan sistem berjalan optimal.`
            : `Kerja bagus untuk ${updatedProject.teamName}! Progres berhasil mencapai ${highestAchieved}% poin. Terus jaga kestabilan server!`,
        timestamp: new Date().toLocaleString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        read: false,
        badgeAwarded: badge ? badge.title : undefined,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Trigger Celebration popup
      setCelebrationData({
        isOpen: true,
        targetPercent: highestAchieved,
        projectTitle: updatedProject.title,
        teamName: updatedProject.teamName,
        badgeName: badge?.title,
      });

      // Update achieved markers in project
      updatedProject.targetMilestonesAchieved = Array.from(
        new Set([...updatedProject.targetMilestonesAchieved, ...achievedNow])
      );
    }
  };

  // Toggle milestone directly
  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        const oldPoints = proj.totalPoints;
        const updatedMilestones = proj.milestones.map((m) => {
          if (m.id === milestoneId) {
            const nextCompleted = !m.completed;
            return {
              ...m,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
              verifiedByTeacher: nextCompleted,
            };
          }
          return m;
        });

        const newPoints = updatedMilestones
          .filter((m) => m.completed)
          .reduce((sum, m) => sum + m.points, 0);

        const updatedProj: StudentProject = {
          ...proj,
          milestones: updatedMilestones,
          totalPoints: Math.min(100, newPoints),
          lastUpdated: new Date().toISOString().split('T')[0],
        };

        checkMilestoneThresholds(updatedProj, oldPoints, newPoints);

        // Update active detail modal if viewing the same project
        if (selectedProjectForDetail && selectedProjectForDetail.id === projectId) {
          setSelectedProjectForDetail(updatedProj);
        }

        return updatedProj;
      })
    );
  };

  // Submit progress report
  const handleSubmitReport = (
    projectId: string,
    reportData: Omit<ProgressReport, 'id' | 'projectId' | 'submittedAt'>,
    milestoneIdsToComplete: string[]
  ) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        const oldPoints = proj.totalPoints;
        const newReport: ProgressReport = {
          ...reportData,
          id: `rep-${Date.now()}`,
          projectId,
          submittedAt: new Date().toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        const updatedMilestones = proj.milestones.map((m) => {
          if (milestoneIdsToComplete.includes(m.id)) {
            return {
              ...m,
              completed: true,
              completedAt: new Date().toISOString().split('T')[0],
              verifiedByTeacher: true,
            };
          }
          return m;
        });

        const newPoints = updatedMilestones
          .filter((m) => m.completed)
          .reduce((sum, m) => sum + m.points, 0);

        const updatedProj: StudentProject = {
          ...proj,
          reports: [newReport, ...proj.reports],
          milestones: updatedMilestones,
          totalPoints: Math.min(100, newPoints),
          lastUpdated: new Date().toISOString().split('T')[0],
        };

        checkMilestoneThresholds(updatedProj, oldPoints, newPoints);

        if (selectedProjectForDetail && selectedProjectForDetail.id === projectId) {
          setSelectedProjectForDetail(updatedProj);
        }

        return updatedProj;
      })
    );
  };

  // Save teacher feedback
  const handleSaveTeacherFeedback = (projectId: string, feedback: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updated = { ...proj, teacherFeedback: feedback };
        if (selectedProjectForDetail && selectedProjectForDetail.id === projectId) {
          setSelectedProjectForDetail(updated);
        }
        return updated;
      })
    );
  };

  // Add new project
  const handleAddProject = (newProject: StudentProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setCurrentTab('proyek');
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Clear notifications
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Quick simulation trigger for testing
  const handleSimulateMilestone = () => {
    const demoProject = projects[0] || INITIAL_PROJECTS[0];
    soundManager.playCelebrationChime(100);
    setCelebrationData({
      isOpen: true,
      targetPercent: 100,
      projectTitle: demoProject.title,
      teamName: demoProject.teamName,
      badgeName: '👑 Juara Digital Kelas 7',
    });
  };

  const handleOpenProjectDetailById = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (target) {
      setSelectedProjectForDetail(target);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Strict Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        unreadNotifsCount={unreadNotifsCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dasbor' && (
          <DashboardOverview
            projects={projects}
            serverNodes={serverNodes}
            notifications={notifications}
            onSelectTab={setCurrentTab}
            onOpenProjectDetail={(p) => setSelectedProjectForDetail(p)}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onSimulateMilestone={handleSimulateMilestone}
          />
        )}

        {currentTab === 'server' && (
          <ServerMonitoring serverNodes={serverNodes} />
        )}

        {currentTab === 'proyek' && (
          <ProjectList
            projects={projects}
            onOpenReportModal={(p) => setSelectedProjectForReport(p)}
            onOpenDetailModal={(p) => setSelectedProjectForDetail(p)}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onToggleMilestone={handleToggleMilestone}
          />
        )}

        {currentTab === 'prestasi' && (
          <NotificationCenter
            notifications={notifications}
            badges={AVAILABLE_BADGES}
            projects={projects}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearNotifications={handleClearNotifications}
            onOpenProjectDetailById={handleOpenProjectDetailById}
            onSimulateMilestone={handleSimulateMilestone}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ServerJunior</span>
            <span aria-hidden="true">·</span>
            <span>Platform Monitoring & Evaluasi Proyek Siswa SMP Kelas 7</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Infrastruktur Lab Komputer Sekolah</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">2026/2027</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ReportProgressModal
        isOpen={Boolean(selectedProjectForReport)}
        onClose={() => setSelectedProjectForReport(null)}
        project={selectedProjectForReport}
        onSubmitReport={handleSubmitReport}
      />

      <ProjectDetailModal
        isOpen={Boolean(selectedProjectForDetail)}
        onClose={() => setSelectedProjectForDetail(null)}
        project={selectedProjectForDetail}
        serverNodes={serverNodes}
        onToggleMilestone={handleToggleMilestone}
        onSaveTeacherFeedback={handleSaveTeacherFeedback}
        onOpenReportModal={(p) => {
          setSelectedProjectForDetail(null);
          setSelectedProjectForReport(p);
        }}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        serverNodes={serverNodes}
        onAddProject={handleAddProject}
      />

      <MilestoneCelebrationModal
        isOpen={celebrationData.isOpen}
        onClose={() => setCelebrationData((prev) => ({ ...prev, isOpen: false }))}
        targetPercent={celebrationData.targetPercent}
        projectTitle={celebrationData.projectTitle}
        teamName={celebrationData.teamName}
        badgeName={celebrationData.badgeName}
        onViewProject={() => {
          const p = projects.find((x) => x.title === celebrationData.projectTitle);
          if (p) setSelectedProjectForDetail(p);
        }}
      />
    </div>
  );
}
