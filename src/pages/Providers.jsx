import { motion } from 'framer-motion';
import { Server, ExternalLink } from 'lucide-react';
import { PROVIDERS_DATA } from '@/data';

export default function Providers() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-foreground uppercase tracking-widest flex items-center gap-3">
          <Server className="text-primary" /> Providers
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Recommended SSH, SSL, and V2Ray tunneling providers.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PROVIDERS_DATA.map((provider, i) => (
          <motion.a
            key={i}
            href={provider.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className="block bg-card border border-border rounded-lg p-5 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-mono font-bold text-lg text-foreground group-hover:text-primary transition-colors">{provider.name}</h3>
              <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="text-xs font-mono uppercase bg-accent/10 text-accent inline-block border border-accent/20 px-2 py-0.5 rounded">{provider.type}</div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
