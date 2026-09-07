import { motion } from 'framer-motion';
import { Video as VideoIcon, Play } from 'lucide-react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { VIDEOS } from '@/data';

export default function Videos() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-foreground uppercase tracking-widest flex items-center gap-3">
          <VideoIcon className="text-primary" /> Video Library
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">Complete tutorials and guides for tunneling with XitSahmX77.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VIDEOS.map((video, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_25px_rgba(255,0,68,0.08)] group"
          >
            <div className="aspect-video w-full bg-black relative">
              <LiteYouTubeEmbed
                id={video.link.split('v=')[1] || 's08vB70Hd20'}
                title={video.title}
                poster="hqdefault"
                webp
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center shadow-[0_0_40px_rgba(255,0,68,0.4)]">
                  <Play size={28} className="text-white ml-1" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold font-mono text-lg text-foreground">{video.title}</h3>
              <p className="text-sm text-muted-foreground font-sans mt-2">{video.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">Tutorial</span>
                <span className="text-[10px] font-mono text-muted-foreground">{video.device}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional info */}
      <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-all">
        <p className="text-muted-foreground font-mono text-sm">
          More tutorials coming soon. Subscribe to the <a href="https://youtube.com/@xitsahmx77" target="_blank" rel="noreferrer" className="text-primary hover:underline">YouTube channel</a> for updates.
        </p>
      </div>
    </motion.div>
  );
}
