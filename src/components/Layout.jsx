import { useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { Menu } from './Menu';

export function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full relative">
      {/* Topbar with Menu button only */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="font-mono text-xl font-bold tracking-wider text-primary drop-shadow-[0_0_12px_rgba(255,0,68,0.7)]">
          XITSAHMX77
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 text-foreground hover:text-primary transition-colors hover:bg-primary/10 rounded-full"
        >
          <MenuIcon size={24} />
        </button>
      </header>

      {/* Menu overlay */}
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 w-full min-w-0 pt-16">
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
