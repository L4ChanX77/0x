import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function AgeVerify({ onVerify }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black/90 z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-primary/50 p-8 rounded-lg shadow-[0_0_30px_rgba(255,0,68,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,68,0.5)_10px,rgba(255,0,68,0.5)_20px)]" />
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/30">
            <AlertTriangle size={32} className="text-primary drop-shadow-[0_0_8px_rgba(255,0,68,0.8)]" />
          </div>
          <h2 className="font-mono text-2xl font-bold text-foreground mb-4 uppercase tracking-wider">Access Restricted</h2>
          <p className="text-muted-foreground font-sans mb-8 leading-relaxed">
            This system contains advanced network security tools, payload configurations, and unfiltered research data.
            <br /><br />
            By proceeding, you confirm that you are at least <strong className="text-primary">18 years of age</strong> and agree to use this information for educational and research purposes only.
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onVerify}
              className="w-full py-3 bg-primary text-primary-foreground font-mono uppercase tracking-wider font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,0,68,0.3)] rounded-sm"
            >
              I AM 18+ / ACCEPT
            </button>
            <button
              onClick={() => window.location.href = 'https://google.com'}
              className="w-full py-3 bg-transparent border border-border text-muted-foreground font-mono uppercase tracking-wider hover:bg-white/5 transition-colors rounded-sm"
            >
              EXIT
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
