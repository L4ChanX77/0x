import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Star, Check, Wifi, Server, Link2, Hash } from 'lucide-react';
import { PAYLOADS_DATA } from '@/data';
import { toast } from 'sonner';

function getProtocol(title) {
  if (title.startsWith('HTTPS')) return 'HTTPS';
  return 'HTTP';
}

function getProtocolColor(proto) {
  if (proto === 'HTTPS') return 'text-cyan-400 drop-shadow-[0_0_6px_rgba(0,212,255,0.7)]';
  return 'text-primary drop-shadow-[0_0_6px_rgba(255,0,68,0.7)]';
}

export default function Payloads() {
  const [copied, setCopied] = useState({});

  const filteredPayloads = useMemo(() => PAYLOADS_DATA, []);

  const copy = (text, key, id, label) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [key]: id }));
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: undefined })), 2000);
  };

  const extractHostAndPort = (proxyString) => {
    const parts = proxyString.split(':');
    if (parts.length === 2) {
      return { host: parts[0], port: parts[1] };
    }
    return { host: proxyString, port: '' };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-mono uppercase tracking-widest flex items-center gap-3 text-foreground">
              <Code2 className="text-primary" /> Payload Library
            </h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              {filteredPayloads.length} payloads — injection strings & tunnel configs
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredPayloads.map((item, index) => {
          const proto = getProtocol(item.title);
          const protoColor = getProtocolColor(proto);
          const isCopiedPayload = copied.payload === item.id;
          const isCopiedProxy = copied.proxy === item.id;
          const isCopiedSni = copied.sni === item.id;
          const isCopiedRemote = copied.remote === item.id;
          const isCopiedPort = copied.port === item.id;

          const { host, port } = extractHostAndPort(item.proxy);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-card border border-border rounded-xl flex flex-col overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_25px_rgba(255,0,68,0.08)]"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-2xl font-black tracking-wider ${protoColor}`}>{proto}</span>
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} fill={i < item.stars ? 'currentColor' : 'none'} className={i >= item.stars ? 'text-border' : ''} />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => copy(item.payload, 'payload', item.id, 'Payload')}
                  title="Copy Payload"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs uppercase transition-all border ${
                    isCopiedPayload
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-black/40 text-muted-foreground hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {isCopiedPayload ? <Check size={13} /> : <Copy size={13} />}
                  Payload
                </button>
              </div>

              <div className="mx-5 bg-black border border-border/60 rounded-lg px-4 py-3 overflow-x-auto">
                <pre className="text-xs font-mono text-green-400/80 whitespace-pre-wrap break-all leading-relaxed">
                  {item.payload}
                </pre>
              </div>

              <div className="mx-5 mt-3 px-3 py-2 bg-primary/5 border border-primary/15 rounded-lg">
                <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest block mb-1">SNI / Bug Host</span>
                <span className="font-mono text-sm text-primary break-all">{item.sni}</span>
              </div>

              {/* Remote Proxy with separate Remote and Port buttons */}
              <div className="mx-5 mt-3">
                <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest block mb-1.5">Remote Proxy</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => copy(host, 'remote', item.id, 'Remote')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-md font-mono text-xs uppercase border transition-all ${
                      isCopiedRemote
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-border bg-black/40 text-muted-foreground hover:border-cyan-400/40 hover:text-cyan-400'
                    }`}
                  >
                    {isCopiedRemote ? <Check size={13} /> : <Link2 size={13} />}
                    <span className="truncate">{host}</span>
                  </button>
                  <button
                    onClick={() => copy(port, 'port', item.id, 'Port')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-md font-mono text-xs uppercase border transition-all ${
                      isCopiedPort
                        ? 'border-purple-400 bg-purple-400/10 text-purple-400'
                        : 'border-border bg-black/40 text-muted-foreground hover:border-purple-400/40 hover:text-purple-400'
                    }`}
                  >
                    {isCopiedPort ? <Check size={13} /> : <Hash size={13} />}
                    <span className="truncate">{port || '--'}</span>
                  </button>
                </div>
              </div>

              {/* Full proxy copy button */}
              <div className="grid grid-cols-2 gap-2 mx-5 mt-2 mb-5">
                <button
                  onClick={() => copy(item.proxy, 'proxy', item.id, 'Proxy')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md font-mono text-xs uppercase border transition-all ${
                    isCopiedProxy
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-black/40 text-muted-foreground hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {isCopiedProxy ? <Check size={13} /> : <Server size={13} />}
                  Full Proxy
                </button>
                <button
                  onClick={() => copy(item.sni, 'sni', item.id, 'SNI')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md font-mono text-xs uppercase border transition-all ${
                    isCopiedSni
                      ? 'border-purple-400 bg-purple-400/10 text-purple-400'
                      : 'border-border bg-black/40 text-muted-foreground hover:border-purple-400/40 hover:text-purple-400'
                  }`}
                >
                  {isCopiedSni ? <Check size={13} /> : <Wifi size={13} />}
                  SNI
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
