import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, DownloadCloud, ShieldAlert, Cpu } from 'lucide-react';
import { APPS_DEV, APPS_VPN, APPS_EXTRA } from '@/data';

const tabs = [
  { id: 'vpn', label: 'VPN & Tunnels', icon: ShieldAlert, data: APPS_VPN },
  { id: 'dev', label: 'Modding Tools', icon: Cpu, data: APPS_DEV },
  { id: 'extra', label: 'Extras', icon: DownloadCloud, data: APPS_EXTRA },
];

export default function Apps() {
  const [activeTab, setActiveTab] = useState('vpn');
  const currentData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-foreground uppercase tracking-widest flex items-center gap-3">
          <Download className="text-primary" /> App Downloads
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Essential APKs, mods, and tunneling clients.</p>
      </header>
      <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-6">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm uppercase transition-colors rounded-t-md ${isActive ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border-b-2 border-transparent'}`}
            >
              <tab.icon size={16} />{tab.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.map((app, i) => (
          <motion.div
            key={`${activeTab}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border p-5 rounded-lg flex flex-col h-full hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(255,0,68,0.05)]"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg font-mono text-foreground">{app.name}</h3>
              <span className="text-xs font-mono bg-white/5 border border-border px-2 py-1 rounded text-muted-foreground">{app.version}</span>
            </div>
            {app.note && (
              <p className="text-xs font-mono text-primary mb-4 p-2 bg-primary/10 border border-primary/20 rounded">Note: {app.note}</p>
            )}
            <div className="mt-auto pt-4">
              <a href={app.url} target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase tracking-wider text-sm transition-all rounded shadow-[0_0_10px_rgba(255,0,68,0.1)] hover:shadow-[0_0_20px_rgba(255,0,68,0.25)]"
              >
                <DownloadCloud size={16} /> Download
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
