import React, { useState } from 'react';
import { X, Plus, FolderPlus, Server, Users, Layers, AlertCircle } from 'lucide-react';
import { StudentProject, ServerNode, Milestone } from '../types';
import { soundManager } from '../utils/sound';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverNodes: ServerNode[];
  onAddProject: (project: StudentProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  serverNodes,
  onAddProject,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamName, setTeamName] = useState('');
  const [classRoom, setClassRoom] = useState<'Kelas 7A' | 'Kelas 7B' | 'Kelas 7C' | 'Kelas 7D'>('Kelas 7A');
  const [membersStr, setMembersStr] = useState('');
  const [category, setCategory] = useState<StudentProject['category']>('Web App');
  const [serverNodeId, setServerNodeId] = useState(serverNodes[0]?.id || 'srv-7a');
  const [errorMsg, setErrorMsg] = useState('');

  const defaultMilestones: Milestone[] = [
    {
      id: `m-${Date.now()}-1`,
      title: 'Tahap 1: Perencanaan Konsep & Wireframe',
      description: 'Menyusun alur proyek, pembagian peran tim, dan sketsa antarmuka.',
      points: 20,
      completed: false,
    },
    {
      id: `m-${Date.now()}-2`,
      title: 'Tahap 2: Konfigurasi Lingkungan & Server',
      description: 'Menyiapkan repositori kode dan koneksi basis data atau endpoint server.',
      points: 20,
      completed: false,
    },
    {
      id: `m-${Date.now()}-3`,
      title: 'Tahap 3: Pemrograman Fitur Utama',
      description: 'Mengembangkan fungsionalitas utama aplikasi atau bot.',
      points: 25,
      completed: false,
    },
    {
      id: `m-${Date.now()}-4`,
      title: 'Tahap 4: Pengujian Beban & Monitoring Server',
      description: 'Uji kestabilan server dan optimasi konsumsi memori/CPU.',
      points: 20,
      completed: false,
    },
    {
      id: `m-${Date.now()}-5`,
      title: 'Tahap 5: Dokumentasi Akhir & Presentasi',
      description: 'Menyerahkan buku panduan teknis dan mendemokan hasil karya.',
      points: 15,
      completed: false,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Harap masukkan judul proyek.');
      return;
    }
    if (!teamName.trim()) {
      setErrorMsg('Harap masukkan nama tim siswa.');
      return;
    }
    if (!membersStr.trim()) {
      setErrorMsg('Harap masukkan setidaknya satu nama anggota tim.');
      return;
    }

    const members = membersStr
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const newProject: StudentProject = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Proyek edukasi teknologi siswa kelas 7.',
      teamName: teamName.trim(),
      classRoom,
      members,
      category,
      serverNodeId,
      totalPoints: 0,
      targetMilestonesAchieved: [],
      milestones: defaultMilestones,
      reports: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      teacherFeedback: 'Proyek baru terdaftar. Silakan mulai dengan Tahap 1.',
    };

    soundManager.playClickTick();
    onAddProject(newProject);
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

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <FolderPlus className="w-4 h-4" />
          <span>Registrasi Proyek Baru Siswa</span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Buat Proyek Komputasi Kelas 7
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Sistem akan secara otomatis menyematkan 5 tahapan standar rubrik penilaian dengan target maksimal 100%.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/50 border border-rose-800/80 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Judul Proyek:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Game Edukasi Kuis Matematika Kelas 7"
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Nama Tim:</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Contoh: Tim Inovator 7D"
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Kelas:</label>
              <select
                value={classRoom}
                onChange={(e) => setClassRoom(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="Kelas 7A">Kelas 7A</option>
                <option value="Kelas 7B">Kelas 7B</option>
                <option value="Kelas 7C">Kelas 7C</option>
                <option value="Kelas 7D">Kelas 7D</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Anggota Tim (pisahkan dengan koma):
            </label>
            <input
              type="text"
              value={membersStr}
              onChange={(e) => setMembersStr(e.target.value)}
              placeholder="Contoh: Bayu Nugraha, Anisa Rahma, Daffa Rizky"
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Kategori Proyek:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="Web App">Web App</option>
                <option value="Bot Edukasi">Bot Edukasi</option>
                <option value="IoT Lab">IoT Lab</option>
                <option value="Game Edukasi">Game Edukasi</option>
                <option value="Database Mini">Database Mini</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Server Klaster:</label>
              <select
                value={serverNodeId}
                onChange={(e) => setServerNodeId(e.target.value)}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
              >
                {serverNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Deskripsi Singkat:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan dan fungsi aplikasi yang dibangun siswa..."
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Bobot Penilaian Otomatis:</span>
            <p>Tahap 1 (20%) + Tahap 2 (20%) + Tahap 3 (25%) + Tahap 4 (20%) + Tahap 5 (15%) = <strong>100 Poin Total</strong></p>
          </div>

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
              <Plus className="w-4 h-4" />
              <span>Simpan & Aktifkan Proyek</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
