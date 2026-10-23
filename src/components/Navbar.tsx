import React from 'react';
import { Plus, Bell, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  currentTab: 'dasbor' | 'server' | 'proyek' | 'prestasi';
  onSelectTab: (tab: 'dasbor' | 'server' | 'proyek' | 'prestasi') => void;
  onOpenNewProject: () => void;
  unreadNotifsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewProject,
  unreadNotifsCount,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark as single text element */}
        <button
          onClick={() => {
            soundManager.playClickTick();
            onSelectTab('dasbor');
          }}
          className="text-xl font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="text-sky-400">⚡</span>
          <span>ServerJunior</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              soundManager.playClickTick();
              onSelectTab('dasbor');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'dasbor'
                ? 'text-sky-400 border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Dasbor Utama
          </button>
          <button
            onClick={() => {
              soundManager.playClickTick();
              onSelectTab('server');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'server'
                ? 'text-sky-400 border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Monitor Server
          </button>
          <button
            onClick={() => {
              soundManager.playClickTick();
              onSelectTab('proyek');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'proyek'
                ? 'text-sky-400 border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Proyek & Poin
          </button>
          <button
            onClick={() => {
              soundManager.playClickTick();
              onSelectTab('prestasi');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'prestasi'
                ? 'text-sky-400 border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <span>Prestasi & Notifikasi</span>
            {unreadNotifsCount > 0 && (
              <span className="bg-sky-500 text-slate-950 text-xs font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Matikan Suara Notifikasi' : 'Nyalakan Suara Notifikasi'}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          
          <button
            onClick={() => {
              soundManager.playClickTick();
              onSelectTab('prestasi');
            }}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors md:hidden"
            title="Lihat Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playClickTick();
              onOpenNewProject();
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Proyek Baru</span>
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800 bg-slate-900/95 text-xs font-medium text-slate-300">
        <button
          onClick={() => onSelectTab('dasbor')}
          className={`py-1 px-2 whitespace-nowrap ${currentTab === 'dasbor' ? 'text-sky-400 font-semibold' : ''}`}
        >
          Dasbor
        </button>
        <button
          onClick={() => onSelectTab('server')}
          className={`py-1 px-2 whitespace-nowrap ${currentTab === 'server' ? 'text-sky-400 font-semibold' : ''}`}
        >
          Server
        </button>
        <button
          onClick={() => onSelectTab('proyek')}
          className={`py-1 px-2 whitespace-nowrap ${currentTab === 'proyek' ? 'text-sky-400 font-semibold' : ''}`}
        >
          Proyek Siswa
        </button>
        <button
          onClick={() => onSelectTab('prestasi')}
          className={`py-1 px-2 whitespace-nowrap ${currentTab === 'prestasi' ? 'text-sky-400 font-semibold' : ''}`}
        >
          Prestasi ({unreadNotifsCount})
        </button>
      </div>
    </header>
  );
};
