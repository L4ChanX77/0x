import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import Entry from '@/pages/Entry';
import AgeVerify from '@/pages/AgeVerify';
import { Layout } from '@/components/Layout';
import { Menu } from '@/components/Menu';
import { ParticleCanvas } from '@/components/ParticleCanvas';

const Home = lazy(() => import('@/pages/Home'));
const Payloads = lazy(() => import('@/pages/Payloads'));
const Proxies = lazy(() => import('@/pages/Proxies'));
const SNI = lazy(() => import('@/pages/SNI'));
const Providers = lazy(() => import('@/pages/Providers'));
const Apps = lazy(() => import('@/pages/Apps'));
const Videos = lazy(() => import('@/pages/Videos'));

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function MainRouter() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={() => <PageWrapper><Home /></PageWrapper>} />
          <Route path="/home" component={() => <PageWrapper><Home /></PageWrapper>} />
          <Route path="/payloads" component={() => <PageWrapper><Payloads /></PageWrapper>} />
          <Route path="/proxies" component={() => <PageWrapper><Proxies /></PageWrapper>} />
          <Route path="/sni" component={() => <PageWrapper><SNI /></PageWrapper>} />
          <Route path="/providers" component={() => <PageWrapper><Providers /></PageWrapper>} />
          <Route path="/apps" component={() => <PageWrapper><Apps /></PageWrapper>} />
          <Route path="/videos" component={() => <PageWrapper><Videos /></PageWrapper>} />
          <Route path="*"><Redirect to="/" /></Route>
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  const [entryState, setEntryState] = useState('splash');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (entryState === 'splash') {
      const timer = setTimeout(() => {
        setEntryState('verify');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [entryState]);

  const handleAgeVerify = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.warn('Audio play failed'));
    }
    setEntryState('app');
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <ParticleCanvas />

      {/* Head */}
      <audio ref={audioRef} src="/audio/welcome1.mp3" preload="auto" />

      {entryState === 'splash' && <Entry onComplete={() => setEntryState('verify')} />}
      {entryState === 'verify' && <AgeVerify onVerify={handleAgeVerify} />}
      {entryState === 'app' && (
        <Layout onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <MainRouter />
        </Layout>
      )}
    </>
  );
}

export default App;
