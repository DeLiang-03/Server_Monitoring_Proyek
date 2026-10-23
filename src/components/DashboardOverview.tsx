import React from 'react';
import {
  Server,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Activity,
  Zap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { StudentProject, ServerNode, NotificationItem } from '../types';
import { soundManager } from '../utils/sound';

interface DashboardOverviewProps {
  projects: StudentProject[];
  serverNodes: ServerNode[];
  notifications: NotificationItem[];
  onSelectTab: (tab: 'dasbor' | 'server' | 'proyek' | 'prestasi') => void;
  onOpenProjectDetail: (project: StudentProject) => void;
  onOpenNewProject: () => void;
  onSimulateMilestone: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  serverNodes,
  notifications,
  onSelectTab,
  onOpenProjectDetail,
  onOpenNewProject,
  onSimulateMilestone,
}) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.totalPoints === 100).length;
  const avgPoints =
    totalProjects > 0
      ? Math.round(projects.reduce((acc, p) => acc + p.totalPoints, 0) / totalProjects)
      : 0;

  // Leaderboard sorted by total points
  const sortedProjects = [...projects].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-8">
      {/* Hero Visual Section */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Text Zone */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
                <span>Program Teknologi & Server SMP Kelas 7</span>
                <span aria-hidden="true">·</span>
                <span>Tahun Ajaran 2026/2027</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Monitoring Server Real-Time & Evaluasi Proyek Siswa
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Pantau kestabilan infrastruktur server sekolah, catat laporan tahapan proyek siswa secara interaktif, kumpulkan poin hingga 100%, serta nikmati notifikasi otomatis setiap kali target milestone tercapai!
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClickTick();
                  onSelectTab('proyek');
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <span>Lihat Proyek & Beri Poin</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClickTick();
                  onSelectTab('server');
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Telemetri Server</span>
              </button>

              <button
                onClick={onSimulateMilestone}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 rounded-lg border border-amber-800/60 transition-colors whitespace-nowrap"
                title="Coba notifikasi suara dan confetti perayaan 100%"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tes Notifikasi Otomatis</span>
              </button>
            </div>
          </div>

          {/* Right Image Zone with measured scrim */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_school_server_lab_1792717932150.jpg"
              alt="Siswa SMP Kelas 7 Memantau Server di Lab Komputer"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Proyek Siswa</span>
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums mt-1">
              {totalProjects} <span className="text-xs text-slate-500 font-sans">Proyek</span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">Kelas 7A, 7B, 7C</span>
          </div>
          <div className="p-2.5 bg-slate-800/80 rounded-lg text-sky-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Rata-rata Poin Kelas</span>
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums mt-1">
              {avgPoints}% <span className="text-xs text-slate-500 font-sans">/ 100%</span>
            </div>
            <span className="text-[11px] text-sky-400 mt-1 block">Akumulasi Capaian</span>
          </div>
          <div className="p-2.5 bg-slate-800/80 rounded-lg text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Proyek Tuntas (100%)</span>
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums mt-1">
              {completedProjects} <span className="text-xs text-slate-500 font-sans">Tim Juara</span>
            </div>
            <span className="text-[11px] text-purple-400 mt-1 block">Diverifikasi Penuh</span>
          </div>
          <div className="p-2.5 bg-slate-800/80 rounded-lg text-purple-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Klaster Server Aktif</span>
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums mt-1">
              {serverNodes.length} / {serverNodes.length} <span className="text-xs text-slate-500 font-sans">Node</span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">99.9% Uptime Lab</span>
          </div>
          <div className="p-2.5 bg-slate-800/80 rounded-lg text-emerald-400">
            <Server className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Server Quick Monitor & Student Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Projects by Points */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Peringkat Capaian Proyek Siswa
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Proyek dengan poin tertinggi berdasarkan verifikasi milestone dan uji coba server
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playClickTick();
                onSelectTab('proyek');
              }}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sortedProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  soundManager.playClickTick();
                  onOpenProjectDetail(project);
                }}
                className="p-3.5 bg-slate-950/70 hover:bg-slate-800/60 border border-slate-850 rounded-lg transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                    idx === 0
                      ? 'bg-amber-400 text-slate-950'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-900'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{idx + 1}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-sky-400">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{project.teamName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-400">{project.classRoom}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right shrink-0">
                  <div className="w-24 sm:w-28">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-white tabular-nums">{project.totalPoints}%</span>
                      <span className="text-[11px] text-slate-500">Poin</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          project.totalPoints === 100
                            ? 'bg-emerald-400'
                            : project.totalPoints >= 75
                            ? 'bg-sky-400'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${project.totalPoints}%` }}
                      />
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Server Cluster Health & Latest Milestone Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Server Nodes Quick Health */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                <span>Status Klaster Server Lab</span>
              </h2>
              <button
                onClick={() => onSelectTab('server')}
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                Detail Live
              </button>
            </div>

            <div className="space-y-2.5">
              {serverNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <h3 className="font-semibold text-white">{node.name}</h3>
                    <span className="text-slate-400">{node.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-medium text-slate-200 tabular-nums">
                      CPU {node.currentCpu}%
                    </span>
                    <span className="block text-[11px] text-emerald-400">Aktif Normal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Milestone Notifications */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Notifikasi Capaian Terbaru</span>
              </h2>
              <button
                onClick={() => onSelectTab('prestasi')}
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                Semua
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white line-clamp-1">{notif.title}</span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">{notif.timestamp.split(' ')[0]}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
