export interface ServerMetricPoint {
  timestamp: string;
  cpu: number; // 0 - 100
  memory: number; // 0 - 100
  disk: number; // 0 - 100
  networkIn: number; // KB/s
  networkOut: number; // KB/s
  latency: number; // ms
  temperature: number; // °C
}

export interface ServerNode {
  id: string;
  name: string;
  role: string;
  hostIp: string;
  os: string;
  status: 'nominal' | 'warning' | 'high_load';
  cpuCores: number;
  totalRamGb: number;
  totalDiskGb: number;
  currentCpu: number;
  currentRamGb: number;
  currentDiskGb: number;
  uptimeDays: number;
  activeProcesses: {
    pid: number;
    name: string;
    cpu: number;
    mem: number;
    status: 'running' | 'idle';
  }[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  points: number; // weight in % (e.g. 20, 25)
  completed: boolean;
  completedAt?: string;
  verifiedByTeacher?: boolean;
}

export interface ProgressReport {
  id: string;
  projectId: string;
  submittedBy: string;
  submittedAt: string;
  stageName: string;
  summary: string;
  challengesSolved: string;
  serverCheckStatus: string;
  evidenceUrl?: string;
  pointsEarned: number;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  teamName: string;
  classRoom: 'Kelas 7A' | 'Kelas 7B' | 'Kelas 7C' | 'Kelas 7D';
  members: string[];
  serverNodeId: string;
  category: 'Web App' | 'Bot Edukasi' | 'IoT Lab' | 'Game Edukasi' | 'Database Mini';
  milestones: Milestone[];
  totalPoints: number; // 0 - 100
  targetMilestonesAchieved: number[]; // e.g. [25, 50, 75, 100]
  reports: ProgressReport[];
  teacherFeedback?: string;
  lastUpdated: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  projectId: string;
  projectTitle: string;
  targetPercent: 25 | 50 | 75 | 100 | 'custom';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  badgeAwarded?: string;
}

export interface BadgeItem {
  id: string;
  code: string;
  title: string;
  description: string;
  threshold: number;
  iconName: string;
  unlockedAt?: string;
}
