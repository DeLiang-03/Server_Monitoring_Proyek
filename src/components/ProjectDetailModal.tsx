import React, { useState } from 'react';
import {
  X,
  Award,
  Users,
  Server,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { StudentProject, ServerNode } from '../types';
import { soundManager } from '../utils/sound';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: StudentProject | null;
  serverNodes: ServerNode[];
  onToggleMilestone: (projectId: string, milestoneId: string) => void;
  onSaveTeacherFeedback: (projectId: string, feedback: string) => void;
  onOpenReportModal: (project: StudentProject) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  serverNodes,
  onToggleMilestone,
  onSaveTeacherFeedback,
  onOpenReportModal,
}) => {
  if (!isOpen || !project) return null;

  const [feedbackInput, setFeedbackInput] = useState(project.teacherFeedback || '');
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const assignedNode = serverNodes.find((n) => n.id === project.serverNodeId);
  const isComplete = project.totalPoints === 100;

  const handleSaveFeedback = () => {
    soundManager.playClickTick();
    onSaveTeacherFeedback(project.id, feedbackInput);
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2500);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate View for 100% Projects */}
        {showCertificate ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Sertifikat Kelulusan Proyek Komputasi Kelas 7</span>
              </h3>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                &larr; Kembali ke Detail
              </button>
            </div>

            {/* Printable Certificate Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-4 border-purple-500/30 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
              <div className="text-xs uppercase tracking-widest font-semibold text-purple-400 mb-2">
                SMP Negeri Edukasi Digital
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                SERTIFIKAT PENCAPAIAN PROYEK 100%
              </h2>
              <p className="text-xs text-slate-400 mt-1">Nomor Penghargaan: SERT-7-{project.id.toUpperCase()}-2026</p>

              <div className="my-6 py-4 border-y border-slate-800">
                <p className="text-xs text-slate-400">Diberikan secara terhormat kepada:</p>
                <div className="text-xl font-bold text-sky-400 mt-1">{project.teamName}</div>
                <div className="text-xs text-slate-300 mt-1">
                  Anggota: {project.members.join(' · ')}
                </div>
                <div className="text-xs text-slate-400 mt-1">{project.classRoom}</div>
              </div>

              <div className="max-w-md mx-auto text-xs text-slate-300">
                Atas keberhasilan luar biasa menyelesaikan seluruh 5 tahapan pengembangan dan pengujian performa server pada proyek:
                <p className="text-base font-bold text-white mt-1">"{project.title}"</p>
                dengan perolehan poin sempurna <span className="font-mono font-bold text-emerald-400">100 / 100 Poin</span>.
              </div>

              <div className="mt-8 flex items-center justify-around text-xs text-slate-400 pt-6 border-t border-slate-800">
                <div>
                  <div className="font-semibold text-white">Guru Pembimbing IT</div>
                  <div className="text-[11px] text-slate-500 mt-8">Salman, S.Pd., M.Kom.</div>
                </div>
                <div>
                  <div className="font-semibold text-white">Lencana Diberikan</div>
                  <div className="text-[11px] text-purple-400 font-bold mt-8">👑 Juara Digital Kelas 7</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handlePrintCertificate}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Project View */
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="font-semibold text-sky-400">{project.classRoom}</span>
                <span aria-hidden="true">·</span>
                <span>{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>Dibuat: <strong className="text-slate-300 font-mono">{project.createdAt}</strong></span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Total Akumulasi Poin:</span>
                  <div className="font-mono text-2xl font-extrabold text-white tabular-nums">
                    <span className={isComplete ? 'text-emerald-400' : 'text-sky-400'}>
                      {project.totalPoints}%
                    </span>
                    <span className="text-xs text-slate-500 font-normal"> / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team and Server Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tim: {project.teamName}</span>
                </div>
                <p className="text-slate-300">{project.members.join(', ')}</p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Klaster Server Terhubung</span>
                </div>
                <p className="text-slate-300">
                  {assignedNode ? `${assignedNode.name} (${assignedNode.hostIp})` : 'Server Edukasi'}
                </p>
              </div>
            </div>

            {isComplete && (
              <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Target 100% Selesai & Terverifikasi!</h3>
                    <p className="text-xs text-purple-300">Proyek ini telah memenuhi seluruh kriteria kelulusan program sekolah.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-purple-300 hover:bg-purple-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Lihat Sertifikat
                </button>
              </div>
            )}

            {/* Milestones Checklist (0 to 100%) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Tahapan Milestone & Pembagian Poin</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {project.milestones.filter((m) => m.completed).length} / {project.milestones.length} Selesai
                </span>
              </div>

              <div className="space-y-2">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      m.completed
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => {
                          soundManager.playClickTick();
                          onToggleMilestone(project.id, m.id);
                        }}
                        className="mt-0.5 rounded accent-sky-400 cursor-pointer w-4 h-4"
                        id={`check-${m.id}`}
                      />
                      <label htmlFor={`check-${m.id}`} className="cursor-pointer">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className={m.completed ? 'text-white' : 'text-slate-300'}>
                            {m.title}
                          </span>
                          {m.completed && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
                              Terverifikasi Guru
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
                      </label>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-sky-400 tabular-nums">
                        +{m.points}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports History */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Riwayat Laporan Progres Siswa ({project.reports.length})</span>
                </h3>
                <button
                  onClick={() => {
                    soundManager.playClickTick();
                    onOpenReportModal(project);
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  + Tambah Laporan Baru
                </button>
              </div>

              {project.reports.length === 0 ? (
                <div className="p-4 bg-slate-950/60 rounded-xl text-center text-xs text-slate-500 border border-slate-850">
                  Belum ada laporan progres yang dikirimkan. Siswa dapat mengirim laporan untuk menambah poin.
                </div>
              ) : (
                <div className="space-y-3">
                  {project.reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rep.stageName}</span>
                          <span aria-hidden="true">·</span>
                          <span>Pelapor: <strong className="text-slate-300">{rep.submittedBy}</strong></span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                          {rep.submittedAt}
                        </span>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{rep.summary}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                        <div>
                          <strong className="text-slate-300">Kendala & Solusi:</strong> {rep.challengesSolved}
                        </div>
                        <div>
                          <strong className="text-slate-300">Pengecekan Server:</strong> {rep.serverCheckStatus}
                        </div>
                      </div>

                      {rep.evidenceUrl && (
                        <div className="pt-1">
                          <a
                            href={rep.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka Tautan Bukti Karya: {rep.evidenceUrl}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Teacher Feedback Section */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Catatan & Masukan Guru Pembimbing IT</span>
              </h3>
              <textarea
                rows={2}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Tuliskan catatan evaluasi, pujian, atau instruksi perbaikan untuk siswa..."
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
              />
              <div className="flex items-center justify-between text-xs">
                {feedbackSaved ? (
                  <span className="text-emerald-400 font-medium">Catatan berhasil disimpan!</span>
                ) : (
                  <span className="text-slate-500">Catatan dapat dibaca langsung oleh anggota tim.</span>
                )}
                <button
                  onClick={handleSaveFeedback}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-md transition-colors"
                >
                  Simpan Catatan Guru
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
