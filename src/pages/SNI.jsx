import { useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Copy, Check, Globe, Bug } from 'lucide-react';
import { SNI_DATA, BUG_HOSTS } from '@/data';
import { toast } from 'sonner';

export default function SNI() {
  const [copiedSni, setCopiedSni] = useState(null);
  const [copiedBug, setCopiedBug] = useState(null);

  const copySni = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedSni(text);
    toast.success('SNI copied');
    setTimeout(() => setCopiedSni(null), 2000);
  };

  const copyBug = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedBug(text);
    toast.success('Bug host copied');
    setTimeout(() => setCopiedBug(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-10">
      <section>
        <header className="mb-6">
          <h1 className="text-3xl font-bold font-mono text-foreground uppercase tracking-widest flex items-center gap-3">
            <Satellite className="text-primary" /> SNI Hosts
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            Server Name Indication — domains used for tunneling & spoofing.
          </p>
        </header>
        <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all">
          {SNI_DATA.map((sni, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center justify-between px-5 py-3.5 group hover:bg-primary/5 transition-colors ${i < SNI_DATA.length - 1 ? 'border-b border-border/60' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Globe size={14} className="text-muted-foreground shrink-0" />
                <span className="font-mono text-sm text-foreground group-hover:text-primary transition-colors truncate">{sni.hostname}</span>
              </div>
              <button
                onClick={() => copySni(sni.hostname)}
                className={`ml-4 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${
                  copiedSni === sni.hostname
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-black/40 text-muted-foreground hover:border-primary/50 hover:text-primary'
                }`}
              >
                {copiedSni === sni.hostname ? <Check size={12} /> : <Copy size={12} />}
                {copiedSni === sni.hostname ? 'Copied' : 'Copy'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <header className="mb-6">
          <h2 className="text-3xl font-bold font-mono text-foreground uppercase tracking-widest flex items-center gap-3">
            <Bug className="text-primary" /> SNI / Bug Hosts
          </h2>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            Bug host prefixes for HTTP injector and tunnel apps.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUG_HOSTS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">{item.bug}</div>
                  <div className="font-mono text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wider">{item.note}</div>
                </div>
                <button
                  onClick={() => copyBug(item.bug)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${
                    copiedBug === item.bug
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-black/40 text-muted-foreground hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {copiedBug === item.bug ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
