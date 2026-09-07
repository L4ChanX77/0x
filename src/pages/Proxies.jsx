import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Copy, Check, Link, Hash } from 'lucide-react';
import { PROXIES_DATA } from '@/data';
import { toast } from 'sonner';

export default function Proxies() {
  const [copiedItem, setCopiedItem] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    toast.success('Copied!');
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Group proxies by host
  const groupedProxies = PROXIES_DATA.reduce((acc, proxy) => {
    if (!acc[proxy.host]) {
      acc[proxy.host] = [];
    }
    acc[proxy.host].push(proxy);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-foreground uppercase tracking-widest flex items-center gap-3">
          <Network className="text-primary" /> Remote Proxies
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Active proxy servers and gateways.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedProxies).map(([host, proxies]) => {
          const allPorts = [...new Set(proxies.map(p => p.port))];

          return (
            <motion.div
              key={host}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(255,0,68,0.05)]"
            >
              {/* Remote Host with Copy Button */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2 min-w-0">
                  <Link size={16} className="text-muted-foreground shrink-0" />
                  <span className="font-mono text-lg font-bold text-foreground truncate">{host}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(host, `host-${host}`)}
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0 ml-2"
                  title="Copy Remote"
                >
                  {copiedItem === `host-${host}` ? (
                    <Check size={18} className="text-primary" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>

              {/* Ports List with Copy buttons */}
              <div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Ports</div>
                <div className="flex flex-wrap gap-2">
                  {allPorts.map((port) => {
                    const proxy = proxies.find(p => p.port === port);
                    const copyKey = `${host}-${port}`;
                    return (
                      <div
                        key={copyKey}
                        className="flex items-center gap-1.5 bg-black/30 border border-border/50 rounded-lg px-3 py-1.5 group hover:border-primary/40 transition-colors"
                      >
                        <Hash size={12} className="text-muted-foreground" />
                        <span className="font-mono text-sm text-foreground">{port}</span>
                        <span className="text-[10px] font-mono uppercase text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                          {proxy?.type || 'Unknown'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(String(port), `port-${copyKey}`)}
                          className="text-muted-foreground hover:text-primary transition-colors ml-1"
                          title="Copy Port"
                        >
                          {copiedItem === `port-${copyKey}` ? (
                            <Check size={14} className="text-primary" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
