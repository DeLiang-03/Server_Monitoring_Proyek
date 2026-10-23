import React, { useState } from 'react';
import {
  Bell,
  Award,
  CheckCircle2,
  Trash2,
  Check,
  Sparkles,
  ShieldCheck,
  Crown,
  Server,
  Rocket,
  ArrowUpRight,
} from 'lucide-react';
import { NotificationItem, BadgeItem, StudentProject } from '../types';
import { soundManager } from '../utils/sound';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  badges: BadgeItem[];
  projects: StudentProject[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onOpenProjectDetailById: (projectId: string) => void;
  onSimulateMilestone: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  badges,
  projects,
  onMarkAllAsRead,
  onClearNotifications,
  onOpenProjectDetailById,
  onSimulateMilestone,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'milestones'>('all');

  const filteredNotifs = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'milestones') return typeof notif.targetPercent === 'number';
    return true;
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-sky-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-purple-400" />;
      default:
        return <Award className="w-5 h-5 text-sky-400" />;
    }
  };

  // Check how many teams achieved each badge
  const getBadgeEarners = (threshold: number) => {
    return projects.filter((p) => p.totalPoints >= threshold);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pusat Notifikasi Otomatis & Lencana Prestasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Riwayat peringatan otomatis saat progres proyek siswa mencapai tonggak target (25%, 50%, 75%, 100%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateMilestone}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 rounded-lg border border-amber-800/60 transition-colors whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulasi Notifikasi Suara</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={() => {
                soundManager.playClickTick();
                onMarkAllAsRead();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tandai Dibaca</span>
            </button>
          )}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Papan Penghargaan Lencana Siswa Kelas 7</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 Tingkatan Penghargaan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const earners = getBadgeEarners(badge.threshold);
            const isUnlockedAny = earners.length > 0;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isUnlockedAny
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-slate-800/80 rounded-lg">
                      {getBadgeIcon(badge.iconName)}
                    </div>
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60 tabular-nums">
                      Target {badge.threshold}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Penerima:</span>
                  <span className="font-semibold text-slate-200">
                    {earners.length} Tim Berhasil
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Stream Feed */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white">Log Notifikasi Otomatis Terkirim</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  filter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  filter === 'unread' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-400'
                }`}
              >
                Belum Dibaca
              </button>
              <button
                onClick={() => setFilter('milestones')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  filter === 'milestones' ? 'bg-slate-800 text-purple-400 font-semibold' : 'text-slate-400'
                }`}
              >
                Target Capaian
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={() => {
                  soundManager.playClickTick();
                  onClearNotifications();
                }}
                title="Hapus riwayat notifikasi"
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filteredNotifs.length === 0 ? (
          <div className="p-10 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
            Tidak ada notifikasi dalam kategori ini.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  !notif.read
                    ? 'bg-slate-900 border-sky-500/30 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    notif.targetPercent === 100
                      ? 'bg-purple-950/80 text-purple-400 border border-purple-800/60'
                      : notif.targetPercent === 75
                      ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                      : notif.targetPercent === 50
                      ? 'bg-teal-950/80 text-teal-400 border border-teal-800/60'
                      : 'bg-sky-950/80 text-sky-400 border border-sky-800/60'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                      {!notif.read && (
                        <span className="text-[10px] font-semibold text-sky-400 bg-sky-950 px-1.5 py-0.2 rounded border border-sky-800">
                          Baru
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-2">
                      <span>Proyek: <strong className="text-slate-400">{notif.projectTitle}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{notif.timestamp}</span>
                      {notif.badgeAwarded && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-purple-400 font-semibold">Lencana: {notif.badgeAwarded}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      soundManager.playClickTick();
                      onOpenProjectDetailById(notif.projectId);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
                  >
                    <span>Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
