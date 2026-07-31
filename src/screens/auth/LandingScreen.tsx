import React, { useState } from 'react';
import { 
  ArrowRight, Shield, Zap, Sparkles, AlertTriangle, QrCode, WifiOff, BarChart3, 
  Users, Building, Wrench, ShieldAlert, CheckCircle2, Clock, FileText, ChevronRight,
  ArrowRightLeft
} from 'lucide-react';
import Button from '../../components/common/Button';
import SectionTitle from '../../components/common/SectionTitle';
import FeatureCard from '../../components/ui/FeatureCard';
import Badge from '../../components/common/Badge';
import FeatureDetailsModal, { FeatureKey } from '../../components/ui/FeatureDetailsModal';
import DigitalVisitorPassHero from '../../components/landing/DigitalVisitorPassHero';

export interface LandingScreenProps {
  onNavigate: (route: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const [activeFeatureModal, setActiveFeatureModal] = useState<FeatureKey | null>(null);

  return (
    <div className="w-full bg-[#FAF8F2] text-[#1A1A1A]">
      {/* FEATURE MODAL SHEET */}
      <FeatureDetailsModal
        featureKey={activeFeatureModal}
        onClose={() => setActiveFeatureModal(null)}
      />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#E7E4DF]">
        {/* Subtle background glow accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#996E7D]/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#9EB8D2]/15 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#996E7D] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F4B400] animate-pulse" />
                Centralized Campus Intelligence
              </span>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] font-extrabold tracking-tight text-[#1A1A1A] mb-6">
                Smarter Hostel <span className="text-[#996E7D]">Management</span> for Safer Living
              </h1>

              <p className="font-body text-base sm:text-lg text-[#666666] leading-relaxed mb-8 max-w-[540px]">
                Project Vaigai digitizes hostel operations, connecting residents, wardens, maintenance staff, and security personnel through one intelligent platform. No more registers, only seamless flow.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => onNavigate('role-selection')}
                  className="w-full sm:w-auto shadow-xl shadow-[#996E7D]/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Launch Application
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto hover:bg-white"
                >
                  Learn More
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#E7E4DF] w-full flex flex-wrap items-center gap-6 text-xs font-semibold text-[#666666]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#4CAF50]" />
                  <span>256-bit Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-[#996E7D]" />
                  <span>Offline Sync Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#F4B400]" />
                  <span>Instant SOS Network</span>
                </div>
              </div>
            </div>

            {/* Right Column: Digital Visitor Pass Hero Visual */}
            <div className="lg:col-span-5 relative w-full flex items-center justify-center">
              <DigitalVisitorPassHero />
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" className="py-20 bg-white border-b border-[#E7E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Intelligent Modules"
            title="Comprehensive Features Built for Modern Hostels"
            subtitle="Eliminate paper ledgers, fragmented chat groups, and delayed ticket resolutions with automated campus workflows."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Smart Complaint Management"
              description="Digital ticket submission with photo attachments, room tracking, real-time status updates, and priority resolution logs."
              tag="Core System"
              accentColor="#996E7D"
              onLearnDetails={() => setActiveFeatureModal('smart-complaint')}
            />

            <FeatureCard
              icon={<QrCode className="w-6 h-6" />}
              title="QR Visitor Management"
              description="Pre-register guests, generate digital entry QR passes, and instantly verify visitors at hostel gates with live warden logs."
              tag="Gate Security"
              accentColor="#2A5C8A"
              onLearnDetails={() => setActiveFeatureModal('qr-visitor')}
            />

            <FeatureCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Emergency SOS"
              description="One-tap high-priority distress system that broadcasts live geo-location alerts immediately to campus security and wardens."
              tag="24/7 Safety"
              accentColor="#D9534F"
              onLearnDetails={() => setActiveFeatureModal('emergency-sos')}
            />

            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Assistance"
              description="Automated complaint categorization, duplicate ticket grouping, and smart priority assignment powered by Gemini AI."
              tag="Gemini AI"
              isAi={true}
              onLearnDetails={() => setActiveFeatureModal('ai-assistance')}
            />

            <FeatureCard
              icon={<WifiOff className="w-6 h-6" />}
              title="Offline Synchronization"
              description="Submit complaints and view hostel notices even during Wi-Fi outages. Data syncs seamlessly once connectivity resumes."
              tag="Reliable"
              accentColor="#9EB8D2"
              onLearnDetails={() => setActiveFeatureModal('offline-sync')}
            />

            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Analytics Dashboard"
              description="Comprehensive hostel insights: resolution turnarounds, peak complaint categories, and maintenance performance metrics."
              tag="Insights"
              accentColor="#F4B400"
              onLearnDetails={() => setActiveFeatureModal('analytics')}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#FAF8F2] border-b border-[#E7E4DF] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Smooth Workflow"
            title="How Project Vaigai Resolves Issues Seamlessly"
            subtitle="From submission to resolution, every step is automated, traceable, and transparent."
            className="mb-16"
          />

          {/* Timeline Visual Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[280px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#996E7D]/30 via-[#A73FD3]/40 to-[#4CAF50]/30 z-0 pointer-events-none" />

          {/* Flow Diagram Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-[20px] border border-[#E7E4DF] shadow-xs flex flex-col justify-between relative group hover:border-[#996E7D] hover:shadow-lg hover:shadow-[#996E7D]/10 hover:scale-[1.03] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#F5EFF2] text-[#996E7D] font-extrabold text-xs flex items-center justify-center border border-[#996E7D]/20">01</span>
                <Users className="w-5 h-5 text-[#996E7D] group-hover:rotate-6 transition-transform" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-[#1A1A1A] mb-1 group-hover:text-[#996E7D] transition-colors">Resident</h4>
                <p className="font-body text-xs text-[#666666] leading-relaxed">Submits complaint with photos and room details.</p>
              </div>
              <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-1.5 rounded-full border border-[#E7E4DF] shadow-sm text-[#996E7D] group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-b from-white to-[#F7EDFC]/40 p-5 rounded-[20px] border border-[#A73FD3]/30 shadow-xs flex flex-col justify-between relative group hover:border-[#A73FD3] hover:shadow-lg hover:shadow-[#A73FD3]/15 hover:scale-[1.03] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#F7EDFC] text-[#A73FD3] font-extrabold text-xs flex items-center justify-center border border-[#A73FD3]/30">02</span>
                <Sparkles className="w-5 h-5 text-[#A73FD3] group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-[#A73FD3] mb-1">AI Categorization</h4>
                <p className="font-body text-xs text-[#666666] leading-relaxed">Tags urgency, detects duplicates & assigns department.</p>
              </div>
              <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-1.5 rounded-full border border-[#E7E4DF] shadow-sm text-[#A73FD3] group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-[20px] border border-[#E7E4DF] shadow-xs flex flex-col justify-between relative group hover:border-[#2A5C8A] hover:shadow-lg hover:shadow-[#2A5C8A]/10 hover:scale-[1.03] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#F0F4F8] text-[#2A5C8A] font-extrabold text-xs flex items-center justify-center border border-[#2A5C8A]/20">03</span>
                <Shield className="w-5 h-5 text-[#2A5C8A] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-[#1A1A1A] mb-1 group-hover:text-[#2A5C8A] transition-colors">Warden Review</h4>
                <p className="font-body text-xs text-[#666666] leading-relaxed">Approves ticket and dispatches work order.</p>
              </div>
              <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-1.5 rounded-full border border-[#E7E4DF] shadow-sm text-[#2A5C8A] group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-[20px] border border-[#E7E4DF] shadow-xs flex flex-col justify-between relative group hover:border-[#D97706] hover:shadow-lg hover:shadow-[#D97706]/10 hover:scale-[1.03] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#FFF8E1] text-[#D97706] font-extrabold text-xs flex items-center justify-center border border-[#D97706]/20">04</span>
                <Wrench className="w-5 h-5 text-[#D97706] group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-[#1A1A1A] mb-1 group-hover:text-[#D97706] transition-colors">Maintenance Assigned</h4>
                <p className="font-body text-xs text-[#666666] leading-relaxed">Technician accepts job & repairs on site.</p>
              </div>
              <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-1.5 rounded-full border border-[#E7E4DF] shadow-sm text-[#D97706] group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#E8F5E9]/60 p-5 rounded-[20px] border border-[#4CAF50]/40 shadow-xs flex flex-col justify-between relative group hover:border-[#4CAF50] hover:shadow-lg hover:shadow-[#4CAF50]/15 hover:scale-[1.03] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#4CAF50] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">05</span>
                <CheckCircle2 className="w-5 h-5 text-[#2E7D32] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-[#2E7D32] mb-1">Resolved & Closed</h4>
                <p className="font-body text-xs text-[#2E7D32] leading-relaxed">Student verifies work & provides feedback rating.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-white border-b border-[#E7E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <Badge variant="primary" size="md" className="mb-4">
                Why Project Vaigai
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mb-6 leading-tight">
                Named after the River Vaigai — Symbolizing Smooth Communication & Connected Living
              </h2>
              <p className="font-body text-base text-[#666666] leading-relaxed mb-6">
                In many Tamil Nadu colleges, hostel blocks are named after iconic rivers. Project Vaigai was born out of real campus experiences to replace chaotic, outdated hostel management with a smooth, connected digital flow.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FDF2F2] text-[#D9534F] flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">No More Paper Complaint Books</h4>
                    <p className="font-body text-xs text-[#666666]">Eliminate lost pages, unreadable handwriting, and untracked complaints.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FDF2F2] text-[#D9534F] flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">End Visitor Gate Delays</h4>
                    <p className="font-body text-xs text-[#666666]">No manual physical registers at security gates; digital QR passes ensure instant verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">Instant Emergency Response & Offline Resilience</h4>
                    <p className="font-body text-xs text-[#666666]">24/7 SOS alert routing that works even when hostel Wi-Fi connection drops.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF8F2] p-8 rounded-[24px] border border-[#E7E4DF]">
              <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-4">
                The Centralized Campus Ecosystem
              </h3>
              <p className="font-body text-sm text-[#666666] leading-relaxed mb-6">
                Project Vaigai brings every stakeholder — student, warden, electrician, plumber, and security guard — onto a single synchronized mobile and web application.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-[16px] border border-[#E7E4DF]">
                  <p className="font-heading text-2xl font-extrabold text-[#996E7D]">100%</p>
                  <p className="font-body text-xs text-[#666666] font-medium">Digital Audit Trail</p>
                </div>
                <div className="bg-white p-4 rounded-[16px] border border-[#E7E4DF]">
                  <p className="font-heading text-2xl font-extrabold text-[#9EB8D2]">&lt; 15 min</p>
                  <p className="font-body text-xs text-[#666666] font-medium">Emergency SOS Dispatch</p>
                </div>
                <div className="bg-white p-4 rounded-[16px] border border-[#E7E4DF]">
                  <p className="font-heading text-2xl font-extrabold text-[#F4B400]">Zero</p>
                  <p className="font-body text-xs text-[#666666] font-medium">Lost Gate Logs</p>
                </div>
                <div className="bg-white p-4 rounded-[16px] border border-[#E7E4DF]">
                  <p className="font-heading text-2xl font-extrabold text-[#A73FD3]">Gemini</p>
                  <p className="font-body text-xs text-[#666666] font-medium">Smart AI Categorization</p>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onNavigate('role-selection')}
                className="mt-6"
              >
                Join Campus Deployment
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white py-12 border-t border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-heading text-xl font-extrabold tracking-tight text-white">
                  Project <span className="text-[#996E7D]">Vaigai</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#F4B400]" />
              </div>
              <p className="font-body text-xs text-gray-400">
                Smart Hostel Management Platform for Safer Student Living
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
              <a href="#about" className="hover:text-[#996E7D] transition-colors">About</a>
              <a href="#features" className="hover:text-[#996E7D] transition-colors">Features</a>
              <button onClick={() => onNavigate('login')} className="hover:text-[#996E7D] transition-colors">Sign In</button>
              <button onClick={() => onNavigate('role-selection')} className="hover:text-[#996E7D] transition-colors">Sign Up</button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Project Vaigai. All rights reserved. Designed for College Campuses.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-gray-400 cursor-pointer">Security Audit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingScreen;
