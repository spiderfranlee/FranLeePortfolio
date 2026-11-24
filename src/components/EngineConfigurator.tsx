import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Check, Volume2, VolumeX } from 'lucide-react';
import { playHoverChime } from '../utils/audio';
import type { InquiryBrief } from '../types';

interface EngineConfiguratorProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onApplyBlueprint: (brief: InquiryBrief) => void;
}

type VerticalId = 'clinic' | 'coach' | 'business';
type ModuleId = 'website' | 'booking' | 'aiAssistant' | 'payments' | 'mediaSovereignty';

interface VerticalPreset {
  id: VerticalId;
  label: string;
  defaultHours: number;
  defaultValue: number;
  valueLabel: string;
  defaultModules: ModuleId[];
  note: string;
}

const VERTICALS: VerticalPreset[] = [
  {
    id: 'clinic',
    label: 'Private Clinic',
    defaultHours: 9,
    defaultValue: 220,
    valueLabel: 'Average patient / consultation value',
    defaultModules: ['website', 'booking', 'aiAssistant', 'mediaSovereignty'],
    note: 'Built for dental, aesthetics, physio, and private healthcare practices.',
  },
  {
    id: 'coach',
    label: 'Coaching & Retreats',
    defaultHours: 8,
    defaultValue: 650,
    valueLabel: 'Average client package or retreat ticket',
    defaultModules: ['website', 'booking', 'payments', 'mediaSovereignty'],
    note: 'Designed for executive coaches, performance specialists, and retreat founders.',
  },
  {
    id: 'business',
    label: 'Boutique Business',
    defaultHours: 7,
    defaultValue: 350,
    valueLabel: 'Average booked job or client engagement',
    defaultModules: ['website', 'booking', 'aiAssistant'],
    note: 'Tailored for local service leaders and independent founders scaling cleanly.',
  },
];

interface EngineModule {
  id: ModuleId;
  title: string;
  outcome: string;
  daysAdded: number;
  reclaimBoost: number; // proportion of weekly admin hours saved
  recoveredLeadsPerMonth: number;
  requiresGrowth: boolean;
  locked?: boolean;
}

const MODULES: EngineModule[] = [
  {
    id: 'website',
    title: 'Bespoke High-Conversion Website',
    outcome: 'Custom-coded, mobile-first authority site engineered for sub-second speed and local SEO.',
    daysAdded: 5,
    reclaimBoost: 0.15,
    recoveredLeadsPerMonth: 1.0,
    requiresGrowth: false,
    locked: true,
  },
  {
    id: 'booking',
    title: 'Automated Booking & Calendar Sync',
    outcome: 'Clients pick open slots directly; automated reminders and calendar rules stop back-and-forth messaging.',
    daysAdded: 2,
    reclaimBoost: 0.35,
    recoveredLeadsPerMonth: 1.8,
    requiresGrowth: true,
  },
  {
    id: 'aiAssistant',
    title: '24/7 AI Intake & Smart Routing',
    outcome: 'Trained on your pricing, services, and policies to answer inquiries and qualify leads around the clock.',
    daysAdded: 3,
    reclaimBoost: 0.28,
    recoveredLeadsPerMonth: 2.2,
    requiresGrowth: true,
  },
  {
    id: 'payments',
    title: 'Deposits, Checkout & Client Portal',
    outcome: 'Collect booking deposits or package payments upfront and cut no-shows automatically.',
    daysAdded: 2,
    reclaimBoost: 0.12,
    recoveredLeadsPerMonth: 0.9,
    requiresGrowth: true,
  },
  {
    id: 'mediaSovereignty',
    title: 'Custom Domain & Full Media Sovereignty',
    outcome: 'Dedicated DNS, clean hosting, and fast media delivery that you own 100% with zero platform lock-in.',
    daysAdded: 1,
    reclaimBoost: 0.05,
    recoveredLeadsPerMonth: 0.3,
    requiresGrowth: false,
  },
];

export default function EngineConfigurator({
  audioEnabled,
  onToggleAudio,
  onApplyBlueprint,
}: EngineConfiguratorProps) {
  const [verticalId, setVerticalId] = useState<VerticalId>('clinic');
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([
    'website',
    'booking',
    'aiAssistant',
    'mediaSovereignty',
  ]);
  const [weeklyAdminHours, setWeeklyAdminHours] = useState<number>(9);
  const [avgClientValue, setAvgClientValue] = useState<number>(220);
  const [preferBuyout, setPreferBuyout] = useState<boolean>(false);

  const activeVertical = VERTICALS.find((v) => v.id === verticalId) ?? VERTICALS[0];

  const handleVerticalSelect = (preset: VerticalPreset) => {
    playHoverChime('toggle', audioEnabled);
    setVerticalId(preset.id);
    setWeeklyAdminHours(preset.defaultHours);
    setAvgClientValue(preset.defaultValue);
    setSelectedModules(preset.defaultModules);
  };

  const toggleModule = (mod: EngineModule) => {
    if (mod.locked) return;
    playHoverChime('toggle', audioEnabled);
    setSelectedModules((prev) =>
      prev.includes(mod.id) ? prev.filter((id) => id !== mod.id) : [...prev, mod.id]
    );
  };

  const calculation = useMemo(() => {
    const activeMods = MODULES.filter((m) => selectedModules.includes(m.id));
    const needsGrowth = activeMods.some((m) => m.requiresGrowth);

    const totalReclaimRatio = Math.min(
      0.85,
      activeMods.reduce((sum, m) => sum + m.reclaimBoost, 0)
    );
    const monthlyHoursReclaimed = Math.max(
      4,
      Math.round(weeklyAdminHours * totalReclaimRatio * 4.2)
    );

    // Conservative business capacity unlocked: recovered inquiries (capped conservatively) + reclaimed founder time
    const monthlyRecoveredClients = activeMods.reduce(
      (sum, m) => sum + m.recoveredLeadsPerMonth,
      0
    );
    const conservativeMonthlyBookingsValue = Math.round(monthlyRecoveredClients * avgClientValue * 0.45);
    const annualCapacityUnlocked = Math.round(
      (conservativeMonthlyBookingsValue * 12) / 100
    ) * 100;

    const totalDays = activeMods.reduce((sum, m) => sum + m.daysAdded, 0);
    const minDays = Math.max(5, totalDays - 2);
    const maxDays = Math.min(14, totalDays + 2);
    const timeline = `${minDays}–${maxDays} Days`;

    let recommendedTier = 'Starter';
    let priceLabel = '€979 one-off';
    let tierReason = 'Clean, bespoke website and domain ownership without recurring automation fees.';

    if (needsGrowth) {
      if (preferBuyout) {
        recommendedTier = 'Buyout';
        priceLabel = '€2,400 one-off';
        tierReason = 'Full automated engine built once, handed over with walkthrough and zero monthly fees.';
      } else {
        recommendedTier = 'Growth';
        priceLabel = '€750 setup + €99/mo';
        tierReason = 'Lowest upfront cost with booking sync, 24/7 AI intake, hosting, and ongoing 1-on-1 support.';
      }
    }

    return {
      activeMods,
      needsGrowth,
      monthlyHoursReclaimed,
      annualCapacityUnlocked,
      timeline,
      recommendedTier,
      priceLabel,
      tierReason,
    };
  }, [selectedModules, weeklyAdminHours, avgClientValue, preferBuyout]);

  const handleApply = () => {
    playHoverChime('gold', audioEnabled);
    const moduleNames = calculation.activeMods.map((m) => m.title);
    const summaryText = [
      `Business type: ${activeVertical.label}`,
      `Recommended package: ${calculation.recommendedTier} (${calculation.priceLabel})`,
      `Selected modules: ${moduleNames.join(', ')}`,
      `Current admin time: ~${weeklyAdminHours} hrs/week | Avg client value: €${avgClientValue.toLocaleString()}`,
      `Estimated target: ~${calculation.monthlyHoursReclaimed} hrs/mo reclaimed (${calculation.timeline} sprint)`,
      '',
      'Additional context about my project:',
    ].join('\n');

    onApplyBlueprint({
      source: 'configurator',
      recommendedTier: calculation.recommendedTier,
      priceLabel: calculation.priceLabel,
      summaryText,
      verticalLabel: activeVertical.label,
      modules: moduleNames,
      estimatedAnnualValue: `€${calculation.annualCapacityUnlocked.toLocaleString()}/yr`,
      estimatedHoursReclaimed: `${calculation.monthlyHoursReclaimed} hrs/mo`,
      timeline: calculation.timeline,
    });
  };

  return (
    <section
      id="configurator"
      className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header + Quiet Audio Control */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">
              Interactive System Blueprint
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.06]">
              Scope your engine and preview the return.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="max-w-sm text-sm text-zinc-400 leading-relaxed">
              Toggle the capabilities your business needs. Send your blueprint straight to my inbox in one click.
            </p>
            <button
              type="button"
              onClick={onToggleAudio}
              className="inline-flex items-center gap-2 self-start sm:self-center border border-white/15 bg-[#0D0D0F] px-3.5 py-2 text-xs font-mono text-zinc-300 transition-colors hover:border-accent/50 hover:text-white cursor-pointer whitespace-nowrap shrink-0"
              aria-pressed={audioEnabled}
              title="Toggle subtle card hover chimes"
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

        {/* Main 12-Col Architectural Cockpit */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 border border-white/10 bg-[#0D0D0F]">
          {/* LEFT PANE: Interactive Configuration Controls */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 lg:border-r border-b lg:border-b-0 border-white/10 space-y-10">
            {/* Step 01: Business Vertical */}
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="font-display text-lg font-bold text-white">
                  01. Your Business Profile
                </h3>
                <span className="text-xs text-zinc-500 hidden sm:inline">
                  Tailors baseline assumptions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 border border-white/10 bg-[#08080A] divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {VERTICALS.map((preset) => {
                  const isActive = preset.id === verticalId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleVerticalSelect(preset)}
                      className={`px-4 py-3.5 text-left text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent ${
                        isActive
                          ? 'bg-accent text-[#070708] font-semibold'
                          : 'text-zinc-300 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-zinc-400">{activeVertical.note}</p>
            </div>

            {/* Step 02: Engine Modules */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="font-display text-lg font-bold text-white">
                  02. Engine Capabilities
                </h3>
                <span className="font-mono text-xs text-zinc-400 tabular-nums">
                  {selectedModules.length} of {MODULES.length} active
                </span>
              </div>

              <div className="divide-y divide-white/10 border border-white/10 bg-[#09090B]">
                {MODULES.map((mod) => {
                  const isSelected = selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleModule(mod)}
                      disabled={mod.locked}
                      className={`w-full flex items-start gap-4 p-4 sm:p-5 text-left transition-colors duration-150 ${
                        mod.locked ? 'cursor-default' : 'cursor-pointer hover:bg-white/[0.03]'
                      } ${isSelected ? 'bg-white/[0.025]' : ''}`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                          isSelected
                            ? 'border-accent bg-accent text-[#070708]'
                            : 'border-white/25 bg-transparent text-transparent'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">
                            {mod.title}
                          </span>
                          <span className="font-mono text-[11px] text-zinc-400">
                            {mod.locked ? 'Core Foundation' : mod.requiresGrowth ? 'Automation Suite' : 'Optional Add-On'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                          {mod.outcome}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 03: Time & Client Value Sliders */}
            <div className="pt-8 border-t border-white/10 space-y-7">
              <h3 className="font-display text-lg font-bold text-white">
                03. Current Admin Load &amp; Client Value
              </h3>

              <div>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <label htmlFor="slider-hours" className="text-sm text-zinc-300">
                    Weekly hours spent on website, booking &amp; client admin
                  </label>
                  <span className="font-mono text-base font-semibold text-accent tabular-nums whitespace-nowrap">
                    {weeklyAdminHours} hrs / wk
                  </span>
                </div>
                <input
                  id="slider-hours"
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={weeklyAdminHours}
                  onChange={(e) => setWeeklyAdminHours(Number(e.target.value))}
                  className="arch-slider"
                />
                <div className="mt-2 flex justify-between font-mono text-[11px] text-zinc-500 tabular-nums">
                  <span>2 hrs</span>
                  <span>12 hrs</span>
                  <span>25 hrs</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <label htmlFor="slider-value" className="text-sm text-zinc-300">
                    {activeVertical.valueLabel}
                  </label>
                  <span className="font-mono text-base font-semibold text-white tabular-nums whitespace-nowrap">
                    €{avgClientValue.toLocaleString()}
                  </span>
                </div>
                <input
                  id="slider-value"
                  type="range"
                  min={60}
                  max={2500}
                  step={20}
                  value={avgClientValue}
                  onChange={(e) => setAvgClientValue(Number(e.target.value))}
                  className="arch-slider"
                />
                <div className="mt-2 flex justify-between font-mono text-[11px] text-zinc-500 tabular-nums">
                  <span>€60</span>
                  <span>€1,250</span>
                  <span>€2,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Live Architectural Blueprint Readout */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#09090B] p-6 sm:p-10 lg:p-12">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <span className="font-mono text-xs tracking-[0.14em] text-zinc-400">
                  Live Projection
                </span>
                <span className="font-mono text-xs text-signal tabular-nums">
                  {activeVertical.label}
                </span>
              </div>

              {/* Tabular KPI Readout */}
              <div className="divide-y divide-white/10 border-b border-white/10">
                <div className="py-6">
                  <div className="text-xs font-mono text-zinc-400">
                    Estimated Time Reclaimed
                  </div>
                  <div className="mt-2 font-mono text-4xl sm:text-5xl font-semibold text-signal tabular-nums tracking-tight">
                    {calculation.monthlyHoursReclaimed} hrs
                    <span className="text-base font-normal text-zinc-400 ml-2">/ month</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Time returned to treating patients, coaching clients, or growing your business.
                  </p>
                </div>

                <div className="py-6 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-mono text-zinc-400">
                      Est. Annual Value Unlocked
                    </div>
                    <div className="mt-2 font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums tracking-tight">
                      €{calculation.annualCapacityUnlocked.toLocaleString()}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      Conservative inquiry recovery
                    </div>
                  </div>

                  <div className="border-l border-white/10 pl-6">
                    <div className="text-xs font-mono text-zinc-400">
                      Projected Sprint
                    </div>
                    <div className="mt-2 font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums tracking-tight">
                      {calculation.timeline}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      Kickoff to live launch
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Tier & Ownership Toggle */}
              <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-accent">
                    Recommended Match
                  </span>
                  {calculation.needsGrowth && (
                    <div className="inline-flex border border-white/15 bg-[#0D0D0F] p-0.5 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          playHoverChime('toggle', audioEnabled);
                          setPreferBuyout(false);
                        }}
                        className={`px-2.5 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                          !preferBuyout
                            ? 'bg-accent text-[#070708] font-semibold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Monthly Support
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playHoverChime('toggle', audioEnabled);
                          setPreferBuyout(true);
                        }}
                        className={`px-2.5 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                          preferBuyout
                            ? 'bg-accent text-[#070708] font-semibold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Full Buyout
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-display text-2xl font-bold text-white">
                    {calculation.recommendedTier} Package
                  </h4>
                  <span className="font-mono text-lg font-semibold text-accent tabular-nums">
                    {calculation.priceLabel}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {calculation.tierReason}
                </p>

                {/* Active Scope Summary List */}
                <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-xs text-zinc-300">
                  {calculation.activeMods.map((mod) => (
                    <li key={mod.id} className="flex items-center justify-between gap-3">
                      <span>{mod.title}</span>
                      <span className="font-mono text-signal shrink-0">Included</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* One-Click Blueprint Handoff CTA */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleApply}
                className="group w-full inline-flex items-center justify-between bg-accent px-6 py-4 text-sm font-semibold text-[#070708] transition-all duration-150 hover:bg-[#DFC496] active:scale-[0.99] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span>Send This Blueprint to Fran</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <p className="mt-3 text-center text-[11px] font-mono text-zinc-500">
                Pre-fills the inquiry form below · Zero commitment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
