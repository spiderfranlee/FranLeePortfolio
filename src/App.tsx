import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

import Hero from './components/Hero';
import CredentialShowcase from './components/CredentialShowcase';
import WhyWorkWithMe from './components/WhyWorkWithMe';
import BentoGrid from './components/BentoGrid';
import Projects from './components/Projects';
import TechnicalPortfolio from './components/TechnicalPortfolio';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CustomCursor from './components/CustomCursor';
import AIChatWidget from './components/AIChatWidget';

const NAV = [
  { href: '#approach', label: 'approach' },
  { href: '#projects', label: 'projects' },
  { href: '#architecture', label: 'framework' },
  { href: '#pricing', label: 'pricing' },
  { href: '#faq', label: 'faq' },
];

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [botInfo, setBotInfo] = useState<{ username: string | null; hasToken: boolean }>({ username: 'PortfolioFranLee_bot', hasToken: false });

  useEffect(() => {
    fetch('/api/bot-info')
      .then((res) => res.json())
      .then((data) => setBotInfo(data))
      .catch((err) => console.error('Failed to load bot info', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Scroll reveal observer (translateY 60px + fade triggered at 20% visibility)
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.2, // 20% visibility
    });

    reveals.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0A0A0A] font-sans text-zinc-300 antialiased selection:bg-accent/40 selection:text-white overflow-x-hidden">
      {/* Background Ambient Clinician Glows (Surgical Mint/Sage & Warm Champagne Gold on the margins to brighten up the sides) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Left Glows (Mint/Sage and Turquoise) */}
        <div className="absolute top-[10%] left-[-200px] w-[500px] h-[500px] rounded-full bg-[#2FA87A]/22 blur-[130px]" />
        <div className="absolute top-[40%] left-[-250px] w-[600px] h-[600px] rounded-full bg-[#2FA87A]/18 blur-[150px]" />
        <div className="absolute top-[75%] left-[-200px] w-[550px] h-[550px] rounded-full bg-[#299b80]/20 blur-[130px]" />

        {/* Right Glows (Champagne Gold and Warm Bronze) */}
        <div className="absolute top-[5%] right-[-200px] w-[450px] h-[450px] rounded-full bg-[#D1B280]/16 blur-[120px]" />
        <div className="absolute top-[55%] right-[-250px] w-[550px] h-[550px] rounded-full bg-[#D1B280]/14 blur-[140px]" />
        <div className="absolute top-[85%] right-[-180px] w-[500px] h-[500px] rounded-full bg-[#D1B280]/15 blur-[130px]" />
      </div>

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-sm font-black tracking-tight text-white">Fran Lee</span>
          </a>

          <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-zinc-400 transition-colors hover:text-white">
                {item.label}
              </a>
            ))}
            <a
              href="https://cal.com/fran-lee-mnjzic"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-4 py-1.5 font-bold text-black transition-transform active:scale-95 animate-pulse-subtle"
            >
              contact
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <CredentialShowcase />
        <WhyWorkWithMe />
        <Projects />
        <TechnicalPortfolio />
        <BentoGrid />
        <Pricing />
        <FAQ />
      </main>

      <footer className="border-t border-white/10 bg-black py-12 text-center text-sm text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Fran Lee · Built in Dublin
          </p>
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            <a href="https://github.com/spiderfranlee" target="_blank" rel="noreferrer" className="hover:text-white">
              github
            </a>
            <a href="#top" className="hover:text-white">
              back to top
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-white p-3 text-black shadow-lg transition-colors hover:bg-accent hover:text-white active:scale-95"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 24/7 AI Interactive On-Site Chat Assistant Widget */}
      <AIChatWidget />
      <CustomCursor />
    </div>
  );
}
