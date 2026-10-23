import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Sparkles,
  Users,
  Server,
  FileText,
  Award,
} from 'lucide-react';
import { StudentProject, Milestone } from '../types';
import { soundManager } from '../utils/sound';

interface ProjectListProps {
  projects: StudentProject[];
  onOpenReportModal: (project: StudentProject) => void;
  onOpenDetailModal: (project: StudentProject) => void;
  onOpenNewProject: () => void;
  onToggleMilestone: (projectId: string, milestoneId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onOpenReportModal,
  onOpenDetailModal,
  onOpenNewProject,
  onToggleMilestone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'advanced' | 'completed'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.members.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      proj.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = classFilter === 'all' || proj.classRoom === classFilter;

    let matchesStatus = true;
    if (statusFilter === 'in_progress') {
      matchesStatus = proj.totalPoints < 50;
    } else if (statusFilter === 'advanced') {
      matchesStatus = proj.totalPoints >= 50 && proj.totalPoints < 100;
    } else if (statusFilter === 'completed') {
      matchesStatus = proj.totalPoints === 100;
    }

    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Daftar Proyek & Penilaian Poin Siswa Kelas 7
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Setiap laporan perkembangan dan verifikasi milestone menambahkan poin hingga 100% dan membuka lencana otomatis.
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClickTick();
            onOpenNewProject();
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul proyek, nama tim, atau siswa kelas 7..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status tabs */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => {
                soundManager.playClickTick();
                setStatusFilter('all');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({projects.length})
            </button>
            <button
              onClick={() => {
                soundManager.playClickTick();
                setStatusFilter('in_progress');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'in_progress'
                  ? 'bg-slate-800 text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              &lt; 50%
            </button>
            <button
              onClick={() => {
                soundManager.playClickTick();
                setStatusFilter('advanced');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'advanced'
                  ? 'bg-slate-800 text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              50% - 99%
            </button>
            <button
              onClick={() => {
                soundManager.playClickTick();
                setStatusFilter('completed');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'completed'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              100% Sempurna
            </button>
          </div>

          {/* Class filter dropdown */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="all">Semua Kelas</option>
            <option value="Kelas 7A">Kelas 7A</option>
            <option value="Kelas 7B">Kelas 7B</option>
            <option value="Kelas 7C">Kelas 7C</option>
            <option value="Kelas 7D">Kelas 7D</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Tidak Ada Proyek yang Cocok</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Tidak ditemukan proyek yang sesuai dengan kata kunci pencarian atau filter yang dipilih.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setClassFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-200 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProjects.map((project) => {
            const completedCount = project.milestones.filter((m) => m.completed).length;
            const isFinished = project.totalPoints === 100;

            return (
              <div
                key={project.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 shadow-sm"
              >
                {/* Header Info */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sky-400">{project.classRoom}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.category}</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono font-bold tabular-nums">
                      <span className={`text-sm ${isFinished ? 'text-emerald-400' : 'text-white'}`}>
                        {project.totalPoints}%
                      </span>
                      <span className="text-slate-500 text-xs">/ 100 Poin</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight hover:text-sky-400 transition-colors cursor-pointer"
                    onClick={() => {
                      soundManager.playClickTick();
                      onOpenDetailModal(project);
                    }}
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tim: <strong className="text-slate-300 font-medium">{project.teamName}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>{project.members.length} Siswa</span>
                  </div>
                </div>

                {/* Progress Bar & Target Milestones Icons */}
                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Capaian: <strong className="text-slate-200">{completedCount}</strong> dari {project.milestones.length} Tahap
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      {[25, 50, 75, 100].map((target) => (
                        <span
                          key={target}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            project.totalPoints >= target
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                              : 'bg-slate-950 text-slate-500 border border-slate-800'
                          }`}
                        >
                          {target}%
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFinished
                          ? 'bg-emerald-400'
                          : project.totalPoints >= 75
                          ? 'bg-sky-400'
                          : project.totalPoints >= 50
                          ? 'bg-teal-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${project.totalPoints}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Milestone Checkbox Preview */}
                <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Tahapan Milestone:</span>
                    <span className="text-[11px] text-slate-500">Centang untuk verifikasi poin</span>
                  </div>

                  <div className="space-y-1.5">
                    {project.milestones.slice(0, 3).map((milestone) => (
                      <div
                        key={milestone.id}
                        onClick={() => {
                          soundManager.playClickTick();
                          onToggleMilestone(project.id, milestone.id);
                        }}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/50 cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={() => {}} // Handled by parent div
                            className="rounded accent-sky-400 cursor-pointer w-3.5 h-3.5"
                          />
                          <span className={`line-clamp-1 ${milestone.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                            {milestone.title}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-sky-400 font-semibold tabular-nums shrink-0 ml-2">
                          +{milestone.points}%
                        </span>
                      </div>
                    ))}
                    {project.milestones.length > 3 && (
                      <p className="text-[11px] text-slate-500 pl-6">
                        + {project.milestones.length - 3} tahapan lainnya di detail proyek...
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      soundManager.playClickTick();
                      onOpenReportModal(project);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lapor Progres (+Poin)</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClickTick();
                      onOpenDetailModal(project);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
                  >
                    <span>Detail & Riwayat</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
