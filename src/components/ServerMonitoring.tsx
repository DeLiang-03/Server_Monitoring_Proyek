import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Zap,
  RefreshCw,
  Play,
  Pause,
  Thermometer,
  Wifi,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ServerNode, ServerMetricPoint } from '../types';
import { soundManager } from '../utils/sound';

interface ServerMonitoringProps {
  serverNodes: ServerNode[];
  onUpdateServerStatus?: (nodeId: string, status: ServerNode['status']) => void;
}

export const ServerMonitoring: React.FC<ServerMonitoringProps> = ({ serverNodes }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(serverNodes[0]?.id || 'srv-7a');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [trafficLoadLevel, setTrafficLoadLevel] = useState<number>(35); // 0 to 100%
  const [isRestartingService, setIsRestartingService] = useState<boolean>(false);
  const [restartMessage, setRestartMessage] = useState<string | null>(null);

  const currentNode = serverNodes.find((n) => n.id === selectedNodeId) || serverNodes[0];

  // Dynamic telemetry history for live SVG charts (last 20 points)
  const [history, setHistory] = useState<ServerMetricPoint[]>(() => {
    const initial: ServerMetricPoint[] = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now - i * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      initial.push({
        timestamp: time,
        cpu: Math.max(15, Math.min(85, 28 + (Math.random() * 12 - 6))),
        memory: Math.max(20, Math.min(90, 42 + (Math.random() * 8 - 4))),
        disk: 36,
        networkIn: Math.floor(180 + Math.random() * 90),
        networkOut: Math.floor(320 + Math.random() * 140),
        latency: Math.floor(14 + Math.random() * 8),
        temperature: Math.floor(46 + Math.random() * 4),
      });
    }
    return initial;
  });

  // Current real-time dynamic values based on base load + traffic slider
  const latestMetric = history[history.length - 1] || {
    cpu: 32,
    memory: 45,
    disk: 36,
    networkIn: 220,
    networkOut: 380,
    latency: 18,
    temperature: 48,
  };

  // Streaming effect
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setHistory((prev) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        // Calculate load influence from traffic slider
        const targetCpu = Math.max(10, Math.min(98, trafficLoadLevel + (Math.random() * 12 - 6)));
        const targetMem = Math.max(15, Math.min(95, 30 + trafficLoadLevel * 0.45 + (Math.random() * 6 - 3)));
        const targetLatency = Math.max(8, Math.floor(12 + (trafficLoadLevel > 75 ? trafficLoadLevel * 0.4 : 6) + Math.random() * 5));
        const targetTemp = Math.floor(44 + trafficLoadLevel * 0.25 + Math.random() * 3);
        const netIn = Math.floor(120 + trafficLoadLevel * 14 + Math.random() * 60);
        const netOut = Math.floor(250 + trafficLoadLevel * 22 + Math.random() * 90);

        const newPoint: ServerMetricPoint = {
          timestamp: time,
          cpu: Math.round(targetCpu),
          memory: Math.round(targetMem),
          disk: Math.round((currentNode.currentDiskGb / currentNode.totalDiskGb) * 100),
          networkIn: netIn,
          networkOut: netOut,
          latency: targetLatency,
          temperature: targetTemp,
        };

        const next = [...prev.slice(1), newPoint];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, trafficLoadLevel, currentNode]);

  const handleSimulateBurst = () => {
    soundManager.playClickTick();
    setTrafficLoadLevel(88);
    setTimeout(() => {
      setTrafficLoadLevel(35);
    }, 8000);
  };

  const handleRestartService = () => {
    soundManager.playClickTick();
    setIsRestartingService(true);
    setRestartMessage('Memuat ulang proses Nginx & Node server klaster...');
    setTimeout(() => {
      setIsRestartingService(false);
      setRestartMessage('Layanan server berhasil di-refresh! Waktu respon kembali optimal.');
      setTimeout(() => setRestartMessage(null), 4000);
    }, 1800);
  };

  // SVG Line Path Generator
  const generateSvgPath = (points: number[], width: number, height: number, maxVal: number = 100) => {
    if (points.length < 2) return '';
    const stepX = width / (points.length - 1);
    return points
      .map((val, idx) => {
        const x = idx * stepX;
        const y = height - (Math.min(maxVal, Math.max(0, val)) / maxVal) * height;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const cpuPoints = history.map((h) => h.cpu);
  const memPoints = history.map((h) => h.memory);
  const latPoints = history.map((h) => h.latency);

  // Status helper
  const getStatusBadge = () => {
    if (latestMetric.cpu > 80 || latestMetric.temperature > 75) {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Beban Tinggi (High Load)</span>
        </span>
      );
    }
    if (latestMetric.cpu > 60) {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
          <Activity className="w-3.5 h-3.5" />
          <span>Beban Sedang (Moderate)</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Status Normal (Nominal)</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Node Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pemantauan Server Edukasi Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pantau beban CPU, alokasi memori RAM, jaringan, dan stabilitas server proyek siswa kelas 7 secara langsung.
          </p>
        </div>

        {/* Server Node Selector & Live Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            {serverNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => {
                  soundManager.playClickTick();
                  setSelectedNodeId(node.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedNodeId === node.id
                    ? 'bg-slate-800 text-sky-400 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {node.name.split(' ')[0]} {node.name.split(' ')[1]} {node.name.split(' ')[3] || ''}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundManager.playClickTick();
              setIsLiveStreaming(!isLiveStreaming);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              isLiveStreaming
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isLiveStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Live Streaming (2s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Jeda Pembaruan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Node Info Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800 rounded-lg text-sky-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{currentNode.name}</h3>
              {getStatusBadge()}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>IP: <strong className="font-mono text-slate-300">{currentNode.hostIp}</strong></span>
              <span aria-hidden="true">·</span>
              <span>OS: <strong className="text-slate-300">{currentNode.os}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Uptime: <strong className="font-mono text-slate-300">{currentNode.uptimeDays} hari</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestartService}
            disabled={isRestartingService}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRestartingService ? 'animate-spin' : ''}`} />
            <span>{isRestartingService ? 'Merestart...' : 'Refresh Layanan'}</span>
          </button>
          <button
            onClick={handleSimulateBurst}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 rounded-lg border border-amber-800/60 transition-colors whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tes Beban Ujian (Stress)</span>
          </button>
        </div>
      </div>

      {restartMessage && (
        <div className="p-3 bg-sky-950/40 border border-sky-800/80 rounded-lg text-xs text-sky-300 animate-fade-in flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
          <span>{restartMessage}</span>
        </div>
      )}

      {/* 4 Primary Telemetry KPI Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage Metric */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Beban CPU ({currentNode.cpuCores} Cores)</span>
            </span>
            <span className="font-mono tabular-nums text-slate-300">{latestMetric.cpu}%</span>
          </div>

          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {latestMetric.cpu}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  latestMetric.cpu > 80 ? 'bg-rose-500' : latestMetric.cpu > 60 ? 'bg-amber-500' : 'bg-sky-400'
                }`}
                style={{ width: `${latestMetric.cpu}%` }}
              />
            </div>
          </div>

          <div className="h-10 mt-2">
            <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
              <path
                d={generateSvgPath(cpuPoints, 200, 40, 100)}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* RAM Usage Metric */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Memori RAM Terpakai</span>
            </span>
            <span className="font-mono tabular-nums text-slate-300">
              {((latestMetric.memory / 100) * currentNode.totalRamGb).toFixed(1)} / {currentNode.totalRamGb} GB
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {latestMetric.memory}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  latestMetric.memory > 85 ? 'bg-rose-500' : latestMetric.memory > 70 ? 'bg-amber-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${latestMetric.memory}%` }}
              />
            </div>
          </div>

          <div className="h-10 mt-2">
            <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
              <path
                d={generateSvgPath(memPoints, 200, 40, 100)}
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Disk Storage Metric */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span>Penyimpanan Disk Proyek</span>
            </span>
            <span className="font-mono tabular-nums text-slate-300">
              {currentNode.currentDiskGb} / {currentNode.totalDiskGb} GB
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {Math.round((currentNode.currentDiskGb / currentNode.totalDiskGb) * 100)}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-400 transition-all duration-500"
                style={{ width: `${(currentNode.currentDiskGb / currentNode.totalDiskGb) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-400 mt-2 flex justify-between">
            <span>Tersedia: <strong>{currentNode.totalDiskGb - currentNode.currentDiskGb} GB</strong></span>
            <span>SSD NVMe</span>
          </div>
        </div>

        {/* Network & Temperature */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-amber-400" />
              <span>Jaringan & Respon</span>
            </span>
            <span className="font-mono tabular-nums text-slate-300">
              Ping {latestMetric.latency} ms
            </span>
          </div>

          <div className="my-2 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
                {latestMetric.latency} ms
              </div>
              <span className="text-xs text-slate-400">Latensi Respon</span>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold font-mono text-amber-300 tracking-tight tabular-nums flex items-center justify-end gap-1">
                <Thermometer className="w-4 h-4" />
                <span>{latestMetric.temperature}°C</span>
              </div>
              <span className="text-xs text-slate-400">Suhu Server</span>
            </div>
          </div>

          <div className="h-10 mt-2">
            <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
              <path
                d={generateSvgPath(latPoints, 200, 40, 50)}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Simulator Beban Trafik Siswa & Proses Server */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Load Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Simulator Beban Siswa</span>
            </h3>
            <span className="font-mono text-xs font-semibold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/80">
              {trafficLoadLevel}% Beban
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Geser tuas di bawah untuk menguji respon server saat banyak siswa kelas 7 membuka aplikasi atau melaporkan progres proyek secara bersamaan.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Beban Normal (15%)</span>
              <span>Ujian Bersama (85%)</span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={trafficLoadLevel}
              onChange={(e) => setTrafficLoadLevel(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>~30 Siswa</span>
              <span>~150 Siswa</span>
              <span>~300 Siswa</span>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Download Masuk (In):</span>
              <span className="font-mono font-medium text-slate-200 tabular-nums">{latestMetric.networkIn} KB/s</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Upload Keluar (Out):</span>
              <span className="font-mono font-medium text-slate-200 tabular-nums">{latestMetric.networkOut} KB/s</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Kapasitas Buffer:</span>
              <span className="text-emerald-400 font-medium">99.8% Siap</span>
            </div>
          </div>
        </div>

        {/* Daftar Proses Aktif (Active Processes Table) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Daftar Proses Server Aktif ({currentNode.name.split(' ')[0]})</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">5 Proses Terpantau</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-2.5 px-3">PID</th>
                  <th className="py-2.5 px-3">Nama Layanan</th>
                  <th className="py-2.5 px-3 text-right">CPU %</th>
                  <th className="py-2.5 px-3 text-right">RAM %</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {currentNode.activeProcesses.map((proc) => (
                  <tr key={proc.pid} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400">{proc.pid}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{proc.name}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                      {(proc.cpu * (trafficLoadLevel / 35)).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                      {proc.mem.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Running</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
