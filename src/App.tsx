import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowUpRight, Linkedin, Github, Menu, X } from 'lucide-react';

import Hero from './components/Hero';
import CredentialShowcase from './components/CredentialShowcase';
import WhyWorkWithMe from './components/WhyWorkWithMe';

// Below-the-fold sections dynamically imported to maximize First Contentful Paint & minimize TBT
const Projects = lazy(() => import('./components/Projects'));
const TechnicalPortfolio = lazy(() => import('./components/TechnicalPortfolio'));
const BentoGrid = lazy(() => import('./components/BentoGrid'));
const Pricing = lazy(() => import('./components/Pricing'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const FAQ = lazy(() => import('./components/FAQ'));
const AIChatWidget = lazy(() => import('./components/AIChatWidget'));
const OrganicGrowthBackground = lazy(() => import('./components/OrganicGrowthBackground'));

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
      {/* Dynamic Botanical Growth: Seeds Sprouting Into Trees & Floating Spores */}
      <Suspense fallback={null}>
        <OrganicGrowthBackground />
      </Suspense>

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

      {/* Full-Width Menu Bar in the Verified Expertise Technical Boxes Aesthetic */}
      <header className="fixed inset-x-0 top-0 z-50 w-full straight-glass-bar font-display">
        {/* Ambient Top Glows matching Verified Expertise card lighting */}
        <div className="pointer-events-none absolute -top-10 right-8 w-72 h-28 rounded-full filter blur-[70px] opacity-20 bg-[#2FA87A]" />
        <div className="pointer-events-none absolute -top-10 left-8 w-56 h-28 rounded-full filter blur-[70px] opacity-15 bg-[#D1B280]" />
        
        {/* Subtle background technical grid from Verified Expertise */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Brand & Status Box (Mirrors the Certificate Inner Framing of Verified Expertise) */}
          <a
            href="#top"
            className="group flex items-center gap-3 border border-white/10 bg-[#0d0d0d] px-3.5 py-1.5 sm:px-4 sm:py-2 hover:border-accent/40 transition-all duration-300 shadow-lg shrink-0 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-[#2FA87A] opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-[#2FA87A]" />
              </span>
              {/* Micro Sensory Equalizer Bars directly from Verified Expertise */}
              <div className="flex gap-[1.5px] items-end h-2.5">
                <div className="w-[1px] bg-emerald-500 transition-all duration-300 h-1 opacity-30 group-hover:opacity-100 group-hover:animate-equalizer-one" />
                <div className="w-[1px] bg-emerald-500 transition-all duration-300 h-2.5 opacity-50 group-hover:opacity-100 group-hover:animate-equalizer-two" />
                <div className="w-[1px] bg-emerald-500 transition-all duration-300 h-1.5 opacity-40 group-hover:opacity-100 group-hover:animate-equalizer-three" />
              </div>
            </div>

            <span className="font-display text-base sm:text-lg font-black tracking-tight text-white uppercase group-hover:text-accent transition-colors leading-none">
              Fran Lee
            </span>

            <div className="hidden sm:inline-flex items-center gap-1.5 border border-white/5 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
              // TECHNICAL PARTNER
            </div>
          </a>

          {/* Desktop Navigation Links — Modular Segmented Boxed Rail */}
          <nav className="hidden md:flex items-center border border-white/10 bg-[#0d0d0d] p-1 divide-x divide-white/5 shadow-lg">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative group px-3.5 lg:px-4 py-1.5 font-display text-xs lg:text-[13px] font-black uppercase tracking-tight text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-accent text-[11px] font-black opacity-0 group-hover:opacity-100 transition-opacity">↳</span>
                  <span>{item.label}</span>
                </span>
                <span className="absolute bottom-0 inset-x-2 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </a>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Micro record status indicator directly from Verified Expertise */}
            <div className="hidden lg:flex items-center gap-2 border border-white/5 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400">
              <span className="text-zinc-500">SYS:</span>
              <span className="text-emerald-400 font-bold tracking-wider">ONLINE</span>
            </div>

            {/* Contact Button styled in the VERIFY CREDENTIAL button aesthetic */}
            <a
              href="#contact"
              className="group/btn relative inline-flex items-center justify-between gap-2.5 bg-[#0a0a0a] overflow-hidden hover:bg-white text-white hover:text-black border border-white/15 hover:border-white px-4 py-2 sm:px-5 sm:py-2.5 transition-all duration-300 shadow-md cursor-pointer"
            >
              <span className="font-mono text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5 z-10">
                CONTACT
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-accent group-hover/btn:text-black z-10" />
              <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
            </a>

            {/* Sharp Mobile Menu Toggle Box */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center h-9 w-9 border border-white/15 bg-[#0a0a0a] text-zinc-200 hover:text-accent hover:border-accent active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Boxed Drawer matching Verified Expertise structure */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full straight-glass-drawer border-t border-white/10 md:hidden overflow-hidden font-display relative"
            >
              {/* Subtle ambient drawer glow */}
              <div className="pointer-events-none absolute -right-12 top-0 w-48 h-48 rounded-full bg-[#2FA87A]/15 blur-[60px]" />

              <div className="px-5 py-6 flex flex-col gap-4 relative z-10">
                {/* Subtitle tag matching // CORE CAPABILITIES EVALUATED */}
                <div className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold px-1">
                  // NAVIGATION INDEX
                </div>

                <div className="border border-white/10 bg-[#0d0d0d] divide-y divide-white/5 shadow-md">
                  {NAV.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 font-display text-sm font-black uppercase tracking-tight text-zinc-200 hover:text-white hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-accent font-black text-xs">↳</span>
                        <span>{item.label}</span>
                      </div>
                      <span className="font-mono text-xs text-accent/60 group-hover:text-accent group-hover:translate-x-0.5 transition-all">→</span>
                    </a>
                  ))}
                </div>

                {/* Grade and Timeline Metrics Row */}
                <div className="flex items-center justify-between border border-white/5 bg-black/40 px-3 py-2 font-mono text-[10px] text-zinc-400">
                  <span className="text-zinc-500">PARTNER STATUS:</span>
                  <span className="text-emerald-400 font-bold tracking-wider">DUBLIN · VERIFIED DIRECT</span>
                </div>

                <div className="pt-1">
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group/btn relative flex w-full items-center justify-between gap-3 bg-[#0a0a0a] hover:bg-white text-white hover:text-black border border-white/15 hover:border-white px-4 py-3 transition-all duration-300 font-mono text-[11px] font-black tracking-widest uppercase shadow-md"
                  >
                    <span className="z-10 flex items-center gap-2">START A PROJECT</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-accent group-hover/btn:text-black z-10 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
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
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <Projects />
          <TechnicalPortfolio />
          <BentoGrid />
          <Pricing />
          <ContactSection />
          <FAQ />
        </Suspense>
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
      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </div>
  );
}
