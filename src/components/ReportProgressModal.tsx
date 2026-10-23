import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  Send,
  AlertCircle,
  Server,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { StudentProject, ProgressReport } from '../types';
import { soundManager } from '../utils/sound';

interface ReportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: StudentProject | null;
  onSubmitReport: (
    projectId: string,
    report: Omit<ProgressReport, 'id' | 'projectId' | 'submittedAt'>,
    milestoneIdsToComplete: string[]
  ) => void;
}

export const ReportProgressModal: React.FC<ReportProgressModalProps> = ({
  isOpen,
  onClose,
  project,
  onSubmitReport,
}) => {
  if (!isOpen || !project) return null;

  const [reporterName, setReporterName] = useState(project.members[0] || '');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    project.milestones.find((m) => !m.completed)?.id || project.milestones[0].id
  );
  const [summary, setSummary] = useState('');
  const [challengesSolved, setChallengesSolved] = useState('');
  const [serverCheckStatus, setServerCheckStatus] = useState(
    'Server berjalan normal, latensi respon stabil di bawah 30ms.'
  );
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedMilestone = project.milestones.find((m) => m.id === selectedMilestoneId);

  // Projected points if this milestone is marked complete
  const currentPoints = project.totalPoints;
  const additionalPoints = selectedMilestone && !selectedMilestone.completed ? selectedMilestone.points : 0;
  const projectedTotal = Math.min(100, currentPoints + additionalPoints);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setErrorMsg('Harap isi ringkasan capaian proyek yang telah diselesaikan.');
      return;
    }
    if (!reporterName.trim()) {
      setErrorMsg('Harap masukkan nama siswa pelapor.');
      return;
    }

    soundManager.playClickTick();
    onSubmitReport(
      project.id,
      {
        submittedBy: reporterName,
        stageName: selectedMilestone ? selectedMilestone.title : 'Pembaruan Berkala',
        summary: summary.trim(),
        challengesSolved: challengesSolved.trim() || 'Tidak ada kendala kritis.',
        serverCheckStatus: serverCheckStatus.trim(),
        evidenceUrl: evidenceUrl.trim(),
        pointsEarned: additionalPoints,
      },
      selectedMilestone && !selectedMilestone.completed ? [selectedMilestone.id] : []
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-xs font-semibold text-sky-400 mb-1">
          <FileText className="w-4 h-4" />
          <span>Formulir Pelaporan Progres & Verifikasi Poin</span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Lapor Perkembangan: {project.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Tim: <strong className="text-slate-200">{project.teamName}</strong> ({project.classRoom})
        </p>

        {/* Projected Points Banner */}
        <div className="mt-4 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Poin Saat Ini:</span>
            <div className="font-mono text-base font-bold text-white tabular-nums">
              {currentPoints} Poin
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs text-slate-400">Tambahan Poin:</span>
            <div className="font-mono text-base font-bold text-sky-400 tabular-nums">
              +{additionalPoints} Poin
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Proyeksi Akhir:</span>
            <div className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              {projectedTotal}% / 100%
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/50 border border-rose-800/80 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Milestone Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Pilih Tahapan / Milestone yang Dilaporkan:
            </label>
            <select
              value={selectedMilestoneId}
              onChange={(e) => setSelectedMilestoneId(e.target.value)}
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
            >
              {project.milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.completed ? '✓ Selesai - ' : '○ Belum - '} {m.title} (+{m.points}% Poin)
                </option>
              ))}
            </select>
            {selectedMilestone && (
              <p className="mt-1 text-[11px] text-slate-400 italic">
                {selectedMilestone.description}
              </p>
            )}
          </div>

          {/* Reporter Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Nama Siswa Pelapor:
            </label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Contoh: Ahmad Fauzan"
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Ringkasan Capaian yang Berhasil Diselesaikan:
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Jelaskan apa saja yang telah dikerjakan tim Anda pada tahapan ini..."
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
              required
            />
          </div>

          {/* Challenges Solved */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Kendala yang Dihadapi & Solusinya:
            </label>
            <input
              type="text"
              value={challengesSolved}
              onChange={(e) => setChallengesSolved(e.target.value)}
              placeholder="Contoh: Memperbaiki error koneksi database dengan menyesuaikan port."
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Server check status */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-400" />
              <span>Status Pengecekan Kinerja Server:</span>
            </label>
            <input
              type="text"
              value={serverCheckStatus}
              onChange={(e) => setServerCheckStatus(e.target.value)}
              placeholder="Contoh: Latensi respon 20ms, penggunaan CPU 15%."
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Evidence URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Link Bukti Hasil Proyek / Demo Web (Opsional):</span>
            </label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Laporan & Perbarui Poin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
