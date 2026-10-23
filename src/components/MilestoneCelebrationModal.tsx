import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, X, Sparkles, ArrowRight, Share2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPercent: number;
  projectTitle: string;
  teamName: string;
  badgeName?: string;
  onViewProject: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  onClose,
  targetPercent,
  projectTitle,
  teamName,
  badgeName,
  onViewProject,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playCelebrationChime(targetPercent);

      // Trigger multi-angle confetti
      try {
        confetti({
          particleCount: targetPercent === 100 ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#a855f7'],
        });

        if (targetPercent === 100) {
          setTimeout(() => {
            confetti({
              particleCount: 80,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
            });
            confetti({
              particleCount: 80,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
            });
          }, 300);
        }
      } catch {
        // Confetti gracefully skipped if canvas not ready
      }
    }
  }, [isOpen, targetPercent]);

  if (!isOpen) return null;

  const getCelebrationMeta = () => {
    switch (targetPercent) {
      case 25:
        return {
          headline: 'Pencapaian Tahap Awal 25%!',
          quote: 'Pondasi sistem dan perancangan sudah berdiri kuat. Langkah pertama menuju server handal!',
          color: 'from-sky-500/20 to-blue-600/10 border-sky-500/40',
          accentText: 'text-sky-400',
        };
      case 50:
        return {
          headline: 'Separuh Perjalanan 50% Tercapai!',
          quote: 'Luar biasa! Server dan logika dasar proyek kini telah terhubung dan aktif!',
          color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/40',
          accentText: 'text-emerald-400',
        };
      case 75:
        return {
          headline: 'Tahap Lanjutan 75% Berhasil!',
          quote: 'Proyek memasuki fase pengujian performa & stabilitas beban server. Sedikit lagi menuju puncak!',
          color: 'from-amber-500/20 to-orange-600/10 border-amber-500/40',
          accentText: 'text-amber-400',
        };
      case 100:
      default:
        return {
          headline: 'Sempurna! 100% Target Maksimal!',
          quote: 'Selamat luar biasa kepada seluruh anggota tim! Seluruh tahapan tuntas dan performa server teruji prima!',
          color: 'from-purple-500/20 to-sky-600/20 border-purple-500/50',
          accentText: 'text-purple-300',
        };
    }
  };

  const meta = getCelebrationMeta();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-lg bg-slate-900 border rounded-2xl p-6 sm:p-8 shadow-2xl bg-gradient-to-b ${meta.color}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 shadow-inner mb-4">
            <Award className={`w-9 h-9 ${meta.accentText}`} />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Notifikasi Otomatis Capaian Target</span>
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
            {meta.headline}
          </h3>

          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 mb-5 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Proyek: <strong className="text-slate-200">{projectTitle}</strong></span>
              <span className="font-mono text-sky-400 font-bold tabular-nums">{targetPercent}%</span>
            </div>
            <p className="text-xs text-slate-400">Tim: <span className="text-slate-200 font-medium">{teamName}</span></p>
            <p className="mt-3 text-sm text-slate-300 italic">
              "{meta.quote}"
            </p>
          </div>

          {badgeName && (
            <div className="flex items-center justify-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left text-xs">
                <span className="text-slate-400">Lencana Kehormatan Dibuka:</span>
                <p className="text-sm font-bold text-white">{badgeName}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onViewProject();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Buka Detail Proyek</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
