import React, { useEffect, useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  Github,
  Linkedin,
  Menu,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import EngineConfigurator from './components/EngineConfigurator';
import WhyWorkWithMe from './components/WhyWorkWithMe';
import TechnicalPortfolio from './components/TechnicalPortfolio';
import CredentialShowcase from './components/CredentialShowcase';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import { playHoverChime } from './utils/audio';
import type { InquiryBrief } from './types';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Configurator', href: '#configurator' },
  { label: 'Process', href: '#process' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Pricing', href: '#pricing' },
];

export default function App() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [inquiryBrief, setInquiryBrief] = useState<InquiryBrief | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 560);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      const next = !prev;
      if (next) {
        playHoverChime('toggle', true);
      }
      return next;
    });
  };

  const handleApplyBrief = (brief: InquiryBrief) => {
    setInquiryBrief(brief);
    setMobileMenuOpen(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.setTimeout(() => {
      const nameInput = document.getElementById('form-name') as HTMLInputElement | null;
      nameInput?.focus({ preventScroll: true });
    }, 450);
  };

  const scrollToTop = () => {
    playHoverChime('soft', audioEnabled);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-accent/30 selection:text-white">
      {/* Strict 3-Zone Architectural Noir Top Bar */}
      <header className="arch-topbar sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
          {/* Zone 1: Single Text Wordmark (Bricolage Grotesque) */}
          <a
            href="#top"
            onMouseEnter={() => playHoverChime('soft', audioEnabled)}
            className="font-display text-lg font-bold tracking-[-0.02em] text-white whitespace-nowrap shrink-0 hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent"
          >
            Fran Lee
          </a>

          {/* Zone 2: 5 Clean Single-Line Navigation Links (Bricolage Grotesque) */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => playHoverChime('soft', audioEnabled)}
                className="relative font-display text-sm font-medium text-zinc-300 whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-150 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action CTA + Mobile Drawer Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              onMouseEnter={() => playHoverChime('gold', audioEnabled)}
              className="hidden md:inline-flex items-center gap-1.5 bg-accent px-4 py-2 font-display text-sm font-semibold text-[#070708] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#DFC496] focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                playHoverChime('toggle', audioEnabled);
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="inline-flex md:hidden h-10 w-10 items-center justify-center border border-white/15 bg-[#0D0D0F] text-zinc-200 hover:border-accent hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#070708] px-6 py-5">
            <nav aria-label="Mobile" className="flex flex-col divide-y divide-white/10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3.5 font-display text-base font-medium text-zinc-200 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-5 pt-4 border-t border-white/10">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-between bg-accent px-4 py-3 font-display text-sm font-semibold text-[#070708] hover:bg-[#DFC496] transition-colors"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Editorial Flow */}
      <main>
        <Hero audioEnabled={audioEnabled} />
        <Projects audioEnabled={audioEnabled} />
        <EngineConfigurator
          audioEnabled={audioEnabled}
          onToggleAudio={toggleAudio}
          onApplyBlueprint={handleApplyBrief}
        />
        <WhyWorkWithMe audioEnabled={audioEnabled} />
        <TechnicalPortfolio audioEnabled={audioEnabled} />
        <CredentialShowcase audioEnabled={audioEnabled} />
        <Pricing audioEnabled={audioEnabled} onSelectTier={handleApplyBrief} />
        <FAQ audioEnabled={audioEnabled} />
        <ContactSection
          audioEnabled={audioEnabled}
          inquiryBrief={inquiryBrief}
          onClearBrief={() => setInquiryBrief(null)}
        />
      </main>

      {/* Quiet Architectural Noir Footer */}
      <footer className="bg-[#070708] py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/10">
            <div>
              <a
                href="#top"
                className="font-display text-xl font-bold tracking-[-0.02em] text-white hover:text-accent transition-colors"
              >
                Fran Lee
              </a>
              <p className="mt-1.5 text-sm text-zinc-400">
                Bespoke digital systems &amp; applied AI automation for clinics, coaches, and founders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <a
                href="https://www.linkedin.com/in/franleeprofile/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playHoverChime('soft', audioEnabled)}
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/frannylee"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playHoverChime('soft', audioEnabled)}
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <button
                type="button"
                onClick={toggleAudio}
                aria-pressed={audioEnabled}
                className="inline-flex items-center gap-2 border border-white/15 bg-[#0D0D0F] px-3 py-1.5 font-mono text-xs text-zinc-300 hover:border-accent hover:text-white transition-colors cursor-pointer"
              >
                {audioEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-accent" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
                )}
                <span>Sound: {audioEnabled ? 'On' : 'Muted'}</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <p>© {new Date().getFullYear()} Fran Lee · Dublin, Ireland</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-zinc-200 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact" className="hover:text-accent transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Subtle Scroll-to-Top Control */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center border border-white/15 bg-[#0D0D0F]/95 text-zinc-300 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
