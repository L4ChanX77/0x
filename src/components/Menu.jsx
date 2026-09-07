import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  Home,
  Code2,
  Network,
  Satellite,
  Server,
  Download,
  Video,
  X,
  Github,
  Send,
  Youtube,
  Globe,
  Wifi,
  Download as DownloadIcon,
  Upload,
  RefreshCw,
  Activity,
  MessageCircle,
  Instagram
} from 'lucide-react';
import { SOCIAL } from '@/data';

const navItems = [
  { name: 'Dashboard', path: '/home', icon: Home },
  { name: 'Payloads', path: '/payloads', icon: Code2 },
  { name: 'Proxies', path: '/proxies', icon: Network },
  { name: 'SNI Hosts', path: '/sni', icon: Satellite },
  { name: 'Providers', path: '/providers', icon: Server },
  { name: 'Apps', path: '/apps', icon: Download },
  { name: 'Videos', path: '/videos', icon: Video },
];

const socialLinks = [
  { name: 'Telegram', icon: Send, url: SOCIAL.telegram, color: '#26a5e4' },
  { name: 'GitHub', icon: Github, url: SOCIAL.github, color: '#ffffff' },
  { name: 'YouTube', icon: Youtube, url: SOCIAL.youtube, color: '#ff0000' },
  { name: 'WhatsApp', icon: MessageCircle, url: SOCIAL.whatsapp, color: '#25D366' },
  { name: 'Discord', icon: MessageCircle, url: SOCIAL.discord, color: '#5865F2' },
  { name: 'Instagram', icon: Instagram, url: SOCIAL.instagram, color: '#E4405F' },
];

const Spinner = ({ size = 16, color = "text-primary" }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={`${color} inline-block`}
  >
    <RefreshCw size={size} />
  </motion.div>
);

export function Menu({ isOpen, onClose }) {
  const [location] = useLocation();
  const menuRef = useRef(null);
  const [ipAddress, setIpAddress] = useState('Loading...');
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [networkType, setNetworkType] = useState('Unknown');
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const intervalRef = useRef(null);
  const speedIntervalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const detectNetwork = () => {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      setNetworkType(conn.effectiveType || 'Unknown');
    } else {
      setNetworkType('Unavailable');
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

  const refreshSpeedData = async () => {
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

  useEffect(() => {
    if (isOpen) {
      refreshSpeedData();
      speedIntervalRef.current = setInterval(refreshSpeedData, 30000);
    } else {
      if (speedIntervalRef.current) clearInterval(speedIntervalRef.current);
    }
    return () => {
      if (speedIntervalRef.current) clearInterval(speedIntervalRef.current);
    };
  }, [isOpen]);

  const handleNavClick = (item) => {
    if (item.external) {
      window.open(item.path, '_blank');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            ref={menuRef}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-card border border-primary/40 rounded-2xl shadow-[0_0_40px_rgba(255,0,68,0.15)] overflow-hidden"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="absolute inset-[-2px] rounded-2xl z-0">
              <div className="absolute inset-[-2px] rounded-2xl border-2 border-transparent animate-[spin_4s_linear_infinite]">
                <div className="absolute inset-[-2px] rounded-2xl border-2 border-primary/50" />
              </div>
            </div>

            <div className="relative z-10 p-6 bg-card/95">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                <div className="overflow-hidden">
                  <h2 className="font-mono text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_auto] animate-shine">
                    Welcome To XitSahmX77
                  </h2>
                  <p className="text-xs font-mono text-muted-foreground mt-1">select your destination</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4 p-3 bg-black/30 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Activity size={14} />
                    <span>Network Status</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{currentTime}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-primary" />
                    <span className="text-muted-foreground">IP:</span>
                    <span className="text-foreground truncate">
                      {ipAddress === 'Loading...' ? (
                        <Spinner size={12} color="text-primary" />
                      ) : (
                        ipAddress
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi size={12} className="text-accent" />
                    <span className="text-muted-foreground">Network:</span>
                    <span className="text-foreground">{networkType.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DownloadIcon size={12} className="text-primary" />
                    <span className="text-muted-foreground">Download:</span>
                    <span className="text-primary">
                      {speedTestRunning ? (
                        <Spinner size={12} color="text-primary" />
                      ) : downloadSpeed > 0 ? (
                        `${downloadSpeed} Mbps`
                      ) : (
                        '--'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Upload size={12} className="text-accent" />
                    <span className="text-muted-foreground">Upload:</span>
                    <span className="text-accent">
                      {speedTestRunning ? (
                        <Spinner size={12} color="text-accent" />
                      ) : uploadSpeed > 0 ? (
                        `${uploadSpeed} Mbps`
                      ) : (
                        '--'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1.5 mb-6">
                {navItems.map((item) => {
                  const isActive = location === item.path || (item.path === '/home' && location === '/');
                  const Icon = item.icon;
                  const isExternal = item.external || false;
                  
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        onClick={() => handleNavClick(item)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-white/5 hover:text-primary'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeBorder"
                            className="absolute inset-0 rounded-xl border-2 border-primary"
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-4 w-full">
                          <Icon
                            size={20}
                            className="shrink-0"
                            style={{ color: isActive ? '#ff0044' : 'currentColor' }}
                          />
                          <span className="font-mono text-sm uppercase tracking-wider">
                            {item.name}
                            {isExternal && (
                              <span className="ml-1 text-[10px] opacity-50">↗</span>
                            )}
                          </span>
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto w-2 h-2 rounded-full bg-primary"
                              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            />
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-border/50 flex flex-wrap items-center justify-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-full bg-black/40 border border-border/50 hover:border-primary/50 transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,68,0.15)] group"
                    >
                      <Icon
                        size={16}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                        style={{ color: social.color }}
                      />
                    </a>
                  );
                })}
              </div>

              <div className="mt-4 text-center text-[10px] font-mono text-muted-foreground/50">
                XITSAHMX77 // SEC.OPS // MA
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
