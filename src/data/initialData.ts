import { ServerNode, StudentProject, NotificationItem, BadgeItem } from '../types';

export const INITIAL_SERVER_NODES: ServerNode[] = [
  {
    id: 'srv-7a',
    name: 'Server Klaster Edu 7A (Web & DB)',
    role: 'Aplikasi Web & Basis Data Proyek Siswa',
    hostIp: '192.168.10.71',
    os: 'Ubuntu Server 24.04 LTS Edu',
    status: 'nominal',
    cpuCores: 4,
    totalRamGb: 16,
    totalDiskGb: 500,
    currentCpu: 28,
    currentRamGb: 6.8,
    currentDiskGb: 182,
    uptimeDays: 19,
    activeProcesses: [
      { pid: 1042, name: 'nginx-reverse-proxy', cpu: 3.4, mem: 4.2, status: 'running' },
      { pid: 1488, name: 'node-web-api-7a', cpu: 12.8, mem: 14.5, status: 'running' },
      { pid: 2011, name: 'postgres-edu-db', cpu: 8.5, mem: 18.2, status: 'running' },
      { pid: 3104, name: 'redis-session-cache', cpu: 1.2, mem: 5.6, status: 'running' },
      { pid: 4210, name: 'telemetry-collector', cpu: 2.1, mem: 3.1, status: 'running' }
    ]
  },
  {
    id: 'srv-7b',
    name: 'Server Klaster Edu 7B (Bot & AI)',
    role: 'Layanan Bot Chat & Microservices Edukasi',
    hostIp: '192.168.10.72',
    os: 'Debian 12 Bookworm Edu',
    status: 'nominal',
    cpuCores: 4,
    totalRamGb: 16,
    totalDiskGb: 500,
    currentCpu: 42,
    currentRamGb: 9.4,
    currentDiskGb: 215,
    uptimeDays: 24,
    activeProcesses: [
      { pid: 1089, name: 'python-bot-worker', cpu: 18.6, mem: 21.0, status: 'running' },
      { pid: 1340, name: 'fastapi-inference', cpu: 14.2, mem: 19.8, status: 'running' },
      { pid: 2210, name: 'sqlite-project-store', cpu: 4.8, mem: 8.1, status: 'running' },
      { pid: 3412, name: 'cron-schedule-backup', cpu: 1.1, mem: 2.3, status: 'idle' }
    ]
  },
  {
    id: 'srv-lab',
    name: 'Server Lab Komputer SMP (IoT & Game)',
    role: 'Pengujian IoT Sensor & Server Minecraft Edukasi',
    hostIp: '192.168.10.70',
    os: 'Alpine Linux High-Perf',
    status: 'warning',
    cpuCores: 8,
    totalRamGb: 32,
    totalDiskGb: 1000,
    currentCpu: 68,
    currentRamGb: 22.5,
    currentDiskGb: 610,
    uptimeDays: 41,
    activeProcesses: [
      { pid: 890, name: 'minecraft-edu-server', cpu: 38.4, mem: 34.2, status: 'running' },
      { pid: 1102, name: 'mqtt-iot-broker', cpu: 11.2, mem: 12.0, status: 'running' },
      { pid: 1782, name: 'grafana-telemetry', cpu: 8.6, mem: 9.4, status: 'running' },
      { pid: 2450, name: 'influxdb-timeseries', cpu: 9.8, mem: 14.8, status: 'running' }
    ]
  }
];

export const INITIAL_PROJECTS: StudentProject[] = [
  {
    id: 'proj-1',
    title: 'Portal Mading Digital & Info Kelas 7A',
    description: 'Aplikasi web interaktif untuk membagikan pengumuman kelas, jadwal piket, karya cerpen siswa, dan jadwal ujian dengan autentikasi aman.',
    teamName: 'Tim Cyber Garuda 7A',
    classRoom: 'Kelas 7A',
    members: ['Ahmad Fauzan (Ketua)', 'Siti Nurhaliza (Frontend)', 'Bagas Pratama (Backend)'],
    serverNodeId: 'srv-7a',
    category: 'Web App',
    totalPoints: 85,
    targetMilestonesAchieved: [25, 50, 75],
    lastUpdated: '2026-10-22',
    createdAt: '2026-10-01',
    teacherFeedback: 'Sangat rapi! Struktur HTML semantic dan responsif di tablet. Tinggal sempurnakan dokumentasi arsitektur untuk meraih 100%.',
    milestones: [
      {
        id: 'm1-1',
        title: 'Tahap 1: Perencanaan Ide & Wireframe Antarmuka',
        description: 'Menyusun use-case, sketsa layout antarmuka, dan struktur navigasi mading.',
        points: 20,
        completed: true,
        completedAt: '2026-10-05',
        verifiedByTeacher: true
      },
      {
        id: 'm1-2',
        title: 'Tahap 2: Setup Server & Konfigurasi Basis Data',
        description: 'Deploy Nginx web server di srv-7a dan inisialisasi tabel artikel mading.',
        points: 20,
        completed: true,
        completedAt: '2026-10-12',
        verifiedByTeacher: true
      },
      {
        id: 'm1-3',
        title: 'Tahap 3: Pemrograman Fitur Utama & Tampilan',
        description: 'Membangun form posting mading, galeri foto karya, dan sistem like sederhana.',
        points: 25,
        completed: true,
        completedAt: '2026-10-18',
        verifiedByTeacher: true
      },
      {
        id: 'm1-4',
        title: 'Tahap 4: Uji Beban & Monitoring Respon Server',
        description: 'Melakukan stress test 50 permintaan simulasi serentak dan mencatat latensi server.',
        points: 20,
        completed: true,
        completedAt: '2026-10-21',
        verifiedByTeacher: true
      },
      {
        id: 'm1-5',
        title: 'Tahap 5: Dokumentasi Lengkap & Video Presentasi',
        description: 'Menyusun laporan panduan pengguna (PDF) dan slide presentasi untuk evaluasi guru.',
        points: 15,
        completed: false
      }
    ],
    reports: [
      {
        id: 'rep-1',
        projectId: 'proj-1',
        submittedBy: 'Ahmad Fauzan',
        submittedAt: '2026-10-21 14:30',
        stageName: 'Uji Beban & Monitoring Respon',
        summary: 'Kami berhasil menguji halaman mading dengan 50 pengguna serentak. Latensi rata-rata stabil pada 24ms tanpa ada halaman error 500.',
        challengesSolved: 'Awalnya gambar artikel lambat dimuat, kami mengatasinya dengan kompresi webp dan caching.',
        serverCheckStatus: 'CPU server naik ke 35% saat uji beban dan kembali ke 8% dalam 10 detik.',
        evidenceUrl: 'https://edu-7a.smp.sch.id/mading',
        pointsEarned: 20
      },
      {
        id: 'rep-2',
        projectId: 'proj-1',
        submittedBy: 'Siti Nurhaliza',
        submittedAt: '2026-10-18 10:15',
        stageName: 'Pemrograman Fitur Interaktif',
        summary: 'Menyelesaikan modul form unggah pengumuman dan desain antarmuka mobile-friendly.',
        challengesSolved: 'Memperbaiki tampilan tabel jadwal piket agar tidak terpotong pada layar HP.',
        serverCheckStatus: 'Database Postgres merespon query dalam 4ms.',
        pointsEarned: 25
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Bot Asisten Belajar IPA & Pengingat Tugas',
    description: 'Bot chat interaktif yang dapat menjawab istilah biologi dan fisika dasar SMP kelas 7 serta mengirimkan rekap tugas mingguan.',
    teamName: 'Tim Inovasi 7B',
    classRoom: 'Kelas 7B',
    members: ['Rania Zahra (Ketua)', 'Kenzo Aditya (Data & Logic)', 'Fadhil Pratama (Server Bot)'],
    serverNodeId: 'srv-7b',
    category: 'Bot Edukasi',
    totalPoints: 100,
    targetMilestonesAchieved: [25, 50, 75, 100],
    lastUpdated: '2026-10-22',
    createdAt: '2026-09-28',
    teacherFeedback: 'Luar biasa! Proyek pertama yang mencapai 100%. Respon bot sangat akurat dan penggunaan memori server sangat efisien.',
    milestones: [
      {
        id: 'm2-1',
        title: 'Tahap 1: Kurasi Data Materi & Kuis IPA',
        description: 'Mengumpulkan 120 tanya-jawab seputar klasifikasi makhluk hidup dan tata surya.',
        points: 20,
        completed: true,
        completedAt: '2026-10-03',
        verifiedByTeacher: true
      },
      {
        id: 'm2-2',
        title: 'Tahap 2: Konfigurasi Service Bot di Server 7B',
        description: 'Memasang environment Python 3.12, systemd service, dan koneksi API.',
        points: 20,
        completed: true,
        completedAt: '2026-10-09',
        verifiedByTeacher: true
      },
      {
        id: 'm2-3',
        title: 'Tahap 3: Logika Pencarian Jawaban & Kuis Interaktif',
        description: 'Memprogram algoritma pencocokan kata kunci dan sistem skor kuis otomatis.',
        points: 25,
        completed: true,
        completedAt: '2026-10-15',
        verifiedByTeacher: true
      },
      {
        id: 'm2-4',
        title: 'Tahap 4: Pengujian Akurasi & Pengawasan Memori Server',
        description: 'Uji coba interaksi dari 30 siswa kelas 7B sekaligus, memastikan memory leak tidak terjadi.',
        points: 20,
        completed: true,
        completedAt: '2026-10-19',
        verifiedByTeacher: true
      },
      {
        id: 'm2-5',
        title: 'Tahap 5: Dokumentasi Lengkap & Demo Presentasi',
        description: 'Demo langsung di depan kelas dan penyerahan buku panduan guru.',
        points: 15,
        completed: true,
        completedAt: '2026-10-22',
        verifiedByTeacher: true
      }
    ],
    reports: [
      {
        id: 'rep-3',
        projectId: 'proj-2',
        submittedBy: 'Rania Zahra',
        submittedAt: '2026-10-22 09:00',
        stageName: 'Dokumentasi & Demo Akhir 100%',
        summary: 'Kami telah melakukan presentasi akhir dengan nilai 100%! Bot berhasil melayani lebih dari 150 kueri belajar hari ini tanpa restart.',
        challengesSolved: 'Mengatur cron job pembersihan cache agar konsumsi RAM bot tidak melebihi 250MB.',
        serverCheckStatus: 'Penggunaan RAM bot stabil di 180MB, latensi respon bot < 120ms.',
        evidenceUrl: 'https://github.com/smp-edu/bot-ipa-7b',
        pointsEarned: 15
      }
    ]
  },
  {
    id: 'proj-3',
    title: 'Sistem Monitoring Suhu & Kelembapan Green House Sekolah',
    description: 'Proyek IoT sains dengan mikrokontroler ESP32 mengirimkan data suhu & kelembapan tanah ke server untuk memantau tanaman hidroponik.',
    teamName: 'Tim Eco-Tech 7C',
    classRoom: 'Kelas 7C',
    members: ['Dewi Lestari (Ketua)', 'Gilang Ramadhan (Hardware)', 'Nadia Safitri (Dashboard)'],
    serverNodeId: 'srv-lab',
    category: 'IoT Lab',
    totalPoints: 50,
    targetMilestonesAchieved: [25, 50],
    lastUpdated: '2026-10-17',
    createdAt: '2026-10-04',
    teacherFeedback: 'Integrasi sensor ke broker MQTT sudah berhasil. Selanjutnya lanjutkan visualisasi grafik suhu di web.',
    milestones: [
      {
        id: 'm3-1',
        title: 'Tahap 1: Perakitan Sensor DHT22 & Mikrokontroler',
        description: 'Kabel sensor, kalibrasi kelembapan tanah, dan pengujian serial monitor.',
        points: 20,
        completed: true,
        completedAt: '2026-10-08',
        verifiedByTeacher: true
      },
      {
        id: 'm3-2',
        title: 'Tahap 2: Setup MQTT Broker di Server Lab',
        description: 'Menyiapkan Mosquitto broker dan autentikasi token untuk perangkat ESP32.',
        points: 20,
        completed: true,
        completedAt: '2026-10-15',
        verifiedByTeacher: true
      },
      {
        id: 'm3-3',
        title: 'Tahap 3: Pembuatan Dashboard Web Real-time',
        description: 'Menampilkan gauge suhu saat ini dan riwayat data 24 jam terakhir.',
        points: 25,
        completed: false
      },
      {
        id: 'm3-4',
        title: 'Tahap 4: Sistem Peringatan Notifikasi Otomatis',
        description: 'Kirim notifikasi otomatis jika suhu melebihi 33°C atau tanah terlalu kering.',
        points: 20,
        completed: false
      },
      {
        id: 'm3-5',
        title: 'Tahap 5: Laporan Hasil Analisis Pertumbuhan Tanaman',
        description: 'Analisis korelasi kelembapan tanah dengan laju pertumbuhan daun selada.',
        points: 15,
        completed: false
      }
    ],
    reports: [
      {
        id: 'rep-4',
        projectId: 'proj-3',
        submittedBy: 'Gilang Ramadhan',
        submittedAt: '2026-10-15 11:20',
        stageName: 'Setup Broker MQTT Server',
        summary: 'Sensor berhasil memancarkan data suhu 28.4°C setiap 5 detik ke server MQTT di IP 192.168.10.70.',
        challengesSolved: 'Sinyal Wi-Fi di greenhouse sempat lemah, kami menambahkan antena eksternal.',
        serverCheckStatus: 'Broker MQTT menggunakan CPU < 2% dan RAM 24MB.',
        pointsEarned: 20
      }
    ]
  },
  {
    id: 'proj-4',
    title: 'Katalog Perpustakaan Mini & Peminjaman Barcode',
    description: 'Sistem pencatatan sirkulasi peminjaman komik sains dan novel perpustakaan kelas dengan scanner barcode kamera HP.',
    teamName: 'Tim Literasi Digital 7A',
    classRoom: 'Kelas 7A',
    members: ['Kevin Sanjaya', 'Melati Kusuma', 'Rizky Firmansyah'],
    serverNodeId: 'srv-7a',
    category: 'Database Mini',
    totalPoints: 25,
    targetMilestonesAchieved: [25],
    lastUpdated: '2026-10-14',
    createdAt: '2026-10-08',
    teacherFeedback: 'Bagus untuk tahap awal. Skema database buku sudah memadai. Lanjutkan ke tahap koneksi API server.',
    milestones: [
      {
        id: 'm4-1',
        title: 'Tahap 1: Inventaris 100 Buku & Desain Basis Data',
        description: 'Mendata ISBN, judul, penulis, dan membuat tabel relasi peminjaman.',
        points: 20,
        completed: true,
        completedAt: '2026-10-14',
        verifiedByTeacher: true
      },
      {
        id: 'm4-2',
        title: 'Tahap 2: Konfigurasi Server API & Endpoint',
        description: 'Membangun route POST /pinjam dan GET /buku pada server 7A.',
        points: 20,
        completed: false
      },
      {
        id: 'm4-3',
        title: 'Tahap 3: Pemrograman Scanner Barcode Kamera',
        description: 'Integrasi modul library scanner barcode melalui browser HP siswa.',
        points: 25,
        completed: false
      },
      {
        id: 'm4-4',
        title: 'Tahap 4: Pengujian Transaksi & Log Server',
        description: 'Simulasi peminjaman serentak dan pencatatan history peminjaman.',
        points: 20,
        completed: false
      },
      {
        id: 'm4-5',
        title: 'Tahap 5: Panduan Operator Siswa & Presentasi',
        description: 'Membuat video tutorial 2 menit untuk petugas perpustakaan kelas.',
        points: 15,
        completed: false
      }
    ],
    reports: [
      {
        id: 'rep-5',
        projectId: 'proj-4',
        submittedBy: 'Melati Kusuma',
        submittedAt: '2026-10-14 15:45',
        stageName: 'Desain Skema Database',
        summary: 'Kami menyelesaikan perancangan tabel buku, siswa, dan transaksi peminjaman di database Postgres.',
        challengesSolved: 'Menentukan format kode unik buku agar mudah dicetak di stiker barcode.',
        serverCheckStatus: 'Database terhubung normal.',
        pointsEarned: 20
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    projectId: 'proj-2',
    projectTitle: 'Bot Asisten Belajar IPA & Pengingat Tugas',
    targetPercent: 100,
    title: '🏆 Target Maksimal 100% Tercapai!',
    message: 'Selamat untuk Tim Inovasi 7B! Seluruh 5 tahapan proyek telah diselesaikan dan diverifikasi guru. Lencana "Juara Digital Kelas 7" resmi diraih!',
    timestamp: '2026-10-22 09:05',
    read: false,
    badgeAwarded: 'Juara Digital Kelas 7'
  },
  {
    id: 'notif-2',
    projectId: 'proj-1',
    projectTitle: 'Portal Mading Digital & Info Kelas 7A',
    targetPercent: 75,
    title: '🛡️ Target 75% Tercapai - Siap Evaluasi Akhir!',
    message: 'Tim Cyber Garuda 7A berhasil melewati 75 poin setelah menuntaskan Uji Beban Server. Selesaikan 1 tahap lagi untuk mencapai 100%!',
    timestamp: '2026-10-21 14:35',
    read: false,
    badgeAwarded: 'Master Uji Ketahanan'
  },
  {
    id: 'notif-3',
    projectId: 'proj-3',
    projectTitle: 'Sistem Monitoring Suhu Green House',
    targetPercent: 50,
    title: '⚡ Target 50% Tercapai - Separuh Jalan!',
    message: 'Tim Eco-Tech 7C sukses menyambungkan broker MQTT ke server lab. Progres proyek kini resmi mencapai 50%!',
    timestamp: '2026-10-15 11:25',
    read: true,
    badgeAwarded: 'Penjaga Server Aktif'
  },
  {
    id: 'notif-4',
    projectId: 'proj-4',
    projectTitle: 'Katalog Perpustakaan Mini & Peminjaman Barcode',
    targetPercent: 25,
    title: '🚀 Target 25% Tercapai - Pondasi Kokoh!',
    message: 'Tim Literasi Digital 7A berhasil menyelesaikan tahap perancangan database! Poin pertama berhasil dikantongi.',
    timestamp: '2026-10-14 15:50',
    read: true,
    badgeAwarded: 'Arsitek Pemula'
  }
];

export const AVAILABLE_BADGES: BadgeItem[] = [
  {
    id: 'b-25',
    code: 'BADGE_25',
    title: '🚀 Arsitek Pemula',
    description: 'Diberikan kepada tim yang berhasil menyelesaikan perencanaan awal dan mencapai progres 25%.',
    threshold: 25,
    iconName: 'Rocket'
  },
  {
    id: 'b-50',
    code: 'BADGE_50',
    title: '⚡ Penjaga Server Aktif',
    description: 'Diberikan saat proyek menyentuh 50%, membuktikan konektivitas server dan backend berjalan stabil.',
    threshold: 50,
    iconName: 'Server'
  },
  {
    id: 'b-75',
    code: 'BADGE_75',
    title: '🛡️ Master Uji Ketahanan',
    description: 'Diberikan ketika proyek mencapai 75% setelah melalui fase pengujian beban dan optimasi resource.',
    threshold: 75,
    iconName: 'ShieldCheck'
  },
  {
    id: 'b-100',
    code: 'BADGE_100',
    title: '👑 Juara Digital Kelas 7',
    description: 'Penghargaan tertinggi 100% untuk proyek yang tuntas lengkap dengan dokumentasi dan server stabil.',
    threshold: 100,
    iconName: 'Crown'
  }
];
