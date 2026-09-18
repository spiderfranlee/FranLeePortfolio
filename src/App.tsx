import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Linkedin, Github, Menu, X } from 'lucide-react';

import Hero from './components/Hero';
import CredentialShowcase from './components/CredentialShowcase';
import WhyWorkWithMe from './components/WhyWorkWithMe';
import BentoGrid from './components/BentoGrid';
import Projects from './components/Projects';
import TechnicalPortfolio from './components/TechnicalPortfolio';
import Pricing from './components/Pricing';
import ContactSection from './components/ContactSection';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

      {/* Full-Width Straight-Line Menu Bar Across The Whole Page */}
      <header className="fixed inset-x-0 top-0 z-50 w-full straight-glass-bar">
        {/* Subtle Liquid Top Light Accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] w-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent liquid-light-beam" />
        </div>

        <div className="mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Brand Logo & Name */}
          <a href="#top" className="group flex items-center gap-3 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white uppercase group-hover:text-accent transition-colors">
              Fran Lee
            </span>
          </a>

          {/* Desktop Navigation Links with Bigger Typography */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative group px-3.5 lg:px-4 py-2 font-display text-sm lg:text-[15px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 inset-x-3.5 lg:inset-x-4 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left" />
              </a>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center border border-accent bg-accent px-5 sm:px-6 py-2 sm:py-2.5 font-display text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-transparent hover:text-accent active:scale-95 shadow-[0_0_20px_rgba(209,178,128,0.25)]"
            >
              Contact
            </a>

            {/* Sharp Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center h-10 w-10 border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Straight-Line Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full straight-glass-drawer border-t border-white/10 md:hidden overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col divide-y divide-white/10">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-lg font-black uppercase tracking-wider text-zinc-100 hover:text-accent hover:pl-2 transition-all active:text-accent"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-sm text-accent">→</span>
                  </a>
                ))}

                <div className="pt-6">
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center border border-accent bg-accent py-3.5 font-display text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-transparent hover:text-accent"
                  >
                    Start A Project
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Hero />
        <CredentialShowcase />
        <WhyWorkWithMe />
        <Projects />
        <TechnicalPortfolio />
        <BentoGrid />
        <Pricing />
        <ContactSection />
        <FAQ />
      </main>

      <footer className="border-t border-white/10 bg-black py-12 text-center text-sm text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Fran Lee · Built in Dublin
          </p>
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            <a
              href="https://www.linkedin.com/in/franleeprofile/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Linkedin className="h-3 w-3" />
              linkedin
            </a>
            <a
              href="https://github.com/spiderfranlee"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github className="h-3 w-3" />
              github
            </a>
            <a href="#top" className="hover:text-white transition-colors">
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
