import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Globe,
  Network,
  Server,
  Activity,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Video,
  Wifi
} from 'lucide-react';
import { PROVIDERS_DATA, CLOUDFLARE_IPS } from '@/data';
import { toast } from 'sonner';

const Spinner = ({ size = 20, color = "text-primary" }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={`${color} inline-block`}
  >
    <RefreshCw size={size} />
  </motion.div>
);

const PulseLoader = ({ children }) => (
  <motion.div
    animate={{ opacity: [1, 0.5, 1] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 1 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  useEffect(() => {
    if (value > 0) setDisplayValue(value);
  }, [value]);
  return (
    <motion.span
      key={displayValue}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </motion.span>
  );
};

export default function Home() {
  const [networkInfo, setNetworkInfo] = useState({ type: 'Unknown', downlink: 0, rtt: 0, saveData: false });
  const [ipAddress, setIpAddress] = useState('Loading...');
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const intervalRef = useRef(null);
  const [copiedItem, setCopiedItem] = useState(null);

  const detectNetwork = () => {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      setNetworkInfo({
        type: conn.effectiveType || 'Unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0,
        saveData: conn.saveData || false
      });
    } else {
      setNetworkInfo({ type: 'Unavailable', downlink: 0, rtt: 0, saveData: false });
    }
  };

  const getPublicIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      try {
        const res = await fetch('https://icanhazip.com');
        const ip = await res.text();
        return ip.trim();
      } catch {
        return 'Unavailable';
      }
    }
  };

  const measureDownload = async () => {
    const fileUrl = 'https://cdn.jsdelivr.net/npm/axios@1.7.9/dist/axios.min.js';
    const startTime = performance.now();
    try {
      const response = await fetch(fileUrl, { cache: 'no-store' });
      const data = await response.arrayBuffer();
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      const sizeInBits = data.byteLength * 8;
      const speedMbps = (sizeInBits / duration) / 1_000_000;
      return Math.round(speedMbps * 100) / 100;
    } catch {
      return 0;
    }
  };

  const measureUpload = async () => {
    const testData = new Uint8Array(1024 * 100);
    const startTime = performance.now();
    try {
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: testData,
        headers: { 'Content-Type': 'application/octet-stream' }
      });
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      const sizeInBits = testData.length * 8;
      const speedMbps = (sizeInBits / duration) / 1_000_000;
      return Math.round(speedMbps * 100) / 100;
    } catch {
      return 0;
    }
  };

  const refreshAllData = async () => {
    setSpeedTestRunning(true);
    detectNetwork();
    const ip = await getPublicIP();
    setIpAddress(ip);
    const dl = await measureDownload();
    setDownloadSpeed(dl);
    const ul = await measureUpload();
    setUploadSpeed(ul);
    setSpeedTestRunning(false);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedItem(null), 2000);
  };

  useEffect(() => {
    refreshAllData();
    intervalRef.current = setInterval(refreshAllData, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-10">
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border border-border p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,0,68,0.05),transparent_70%)]" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-foreground uppercase tracking-widest flex items-center gap-3">
            <BookOpen className="text-primary" /> DARK ZONE
          </h1>
          <p className="text-muted-foreground mt-4 font-mono text-sm md:text-base max-w-2xl">
            Comprehensive guide to network tunneling, payload injection, and protocol obfuscation for Moroccan ISPs.
          </p>
          <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
            SEC.OPS ZONE WHITE HAT 
          </p>
        </div>
      </header>

      {/* Video Tutorial */}
      <section>
        <h2 className="text-2xl font-bold font-mono text-foreground uppercase tracking-wider flex items-center gap-2 mb-6 border-b border-border pb-4">
          <Video className="text-primary" /> VIDEO TUTORIAL
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all">
          <div className="aspect-video w-full bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/5hdikgqBz9Y"
              title="XitSahmX77 Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <h3 className="font-mono font-bold text-foreground">XitSahmX77 - Complete Tunnel Setup Guide</h3>
            <p className="text-sm text-muted-foreground mt-1">Full tutorial on configuring SSH, SSL,V2Ray tunnels.</p>
          </div>
        </div>
      </section>

      {/* Cloudflare IP Ranges */}
      <section>
        <h2 className="text-2xl font-bold font-mono text-foreground uppercase tracking-wider flex items-center gap-2 mb-6 border-b border-border pb-4">
          <Globe className="text-primary" /> CLOUDFLARE IP RANGES
        </h2>
        <p className="text-muted-foreground font-mono text-sm mb-4">
          Official Cloudflare IP ranges for IPv4 and IPv6 — useful for bypassing restrictions and configuring tunnels.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IPv4 */}
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all">
            <h3 className="font-mono font-bold text-foreground text-sm mb-3 flex items-center gap-2">
              <span className="text-primary">IPv4</span>
              <span className="text-[10px] text-muted-foreground">({CLOUDFLARE_IPS.ipv4.length} ranges)</span>
            </h3>
            <div className="space-y-0">
              {CLOUDFLARE_IPS.ipv4.map((ip, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between group py-2 px-1.5 hover:bg-white/5 rounded transition-colors">
                    <span className="font-mono text-xs text-foreground">{ip}</span>
                    <button
                      onClick={() => copyToClipboard(ip, `ipv4-${i}`)}
                      className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {copiedItem === `ipv4-${i}` ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                    </button>
                  </div>
                  {i < CLOUDFLARE_IPS.ipv4.length - 1 && (
                    <div className="h-[1.5px] w-full rounded-full animate-divider-glow my-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* IPv6 */}
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all">
            <h3 className="font-mono font-bold text-foreground text-sm mb-3 flex items-center gap-2">
              <span className="text-accent">IPv6</span>
              <span className="text-[10px] text-muted-foreground">({CLOUDFLARE_IPS.ipv6.length} ranges)</span>
            </h3>
            <div className="space-y-0">
              {CLOUDFLARE_IPS.ipv6.map((ip, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between group py-2 px-1.5 hover:bg-white/5 rounded transition-colors">
                    <span className="font-mono text-xs text-foreground">{ip}</span>
                    <button
                      onClick={() => copyToClipboard(ip, `ipv6-${i}`)}
                      className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {copiedItem === `ipv6-${i}` ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                    </button>
                  </div>
                  {i < CLOUDFLARE_IPS.ipv6.length - 1 && (
                    <div className="h-[1.5px] w-full rounded-full animate-divider-glow my-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Providers */}
      <section>
        <h2 className="text-2xl font-bold font-mono text-foreground uppercase tracking-wider flex items-center gap-2 mb-6 border-b border-border pb-4">
          <Server className="text-primary" /> RECOMMENDED PROVIDERS
        </h2>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          Verified SSH, SSL, V2Ray, and VPN service providers.
        </p>
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
      </section>

      {/* Network Status */}
      <section id="network-status">
        <h2 className="text-2xl font-bold font-mono text-foreground uppercase tracking-wider flex items-center gap-2 mb-6 border-b border-border pb-4">
          <Activity className="text-primary" /> NETWORK STATUS
        </h2>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="text-primary" size={20} />
              <span className="text-xs text-muted-foreground font-mono">Live Monitoring </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono flex items-center gap-2">
              {speedTestRunning ? (
                <>
                  <Spinner size={14} color="text-primary" />
                  Testing...
                </>
              ) : (
                `Updated: ${new Date().toLocaleTimeString()}`
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs uppercase">
                <Globe size={14} /> IP Address
              </div>
              <div className="text-sm font-mono text-foreground mt-1 truncate">
                {ipAddress === 'Loading...' ? <PulseLoader><span className="text-muted-foreground">Loading...</span></PulseLoader> : ipAddress}
              </div>
            </div>

            <div className="bg-black/30 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs uppercase">
                <Wifi size={14} /> Network
              </div>
              <div className="text-sm font-mono text-foreground mt-1">{networkInfo.type.toUpperCase()}</div>
              <div className="text-xs font-mono text-muted-foreground">RTT: {networkInfo.rtt}ms</div>
            </div>

            <div className="bg-black/30 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs uppercase">
                <Download size={14} /> Download
              </div>
              <div className="text-sm font-mono text-primary mt-1">
                {speedTestRunning ? <PulseLoader><Spinner size={16} color="text-primary" /></PulseLoader> : downloadSpeed > 0 ? <AnimatedNumber value={downloadSpeed} suffix=" Mbps" /> : '--'}
              </div>
            </div>

            <div className="bg-black/30 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs uppercase">
                <Upload size={14} /> Upload
              </div>
              <div className="text-sm font-mono text-accent mt-1">
                {speedTestRunning ? <PulseLoader><Spinner size={16} color="text-accent" /></PulseLoader> : uploadSpeed > 0 ? <AnimatedNumber value={uploadSpeed} suffix=" Mbps" /> : '--'}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={refreshAllData}
              disabled={speedTestRunning}
              className="px-6 py-2.5 bg-primary/20 border border-primary text-primary font-mono text-sm rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,68,0.05)] hover:shadow-[0_0_30px_rgba(255,0,68,0.15)]"
            >
              {speedTestRunning ? (
                <>
                  <Spinner size={16} color="text-primary" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Refresh Status
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
