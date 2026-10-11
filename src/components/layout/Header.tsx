import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  FileText,
  User,
  Search,
  Sparkles,
  Briefcase,
  CheckCircle2,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    navigateTo,
    user,
    activePreset,
    switchProfilePreset,
    resumeVersions,
    createResumeVersion,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <FileText className="w-4 h-4" /> },
    { view: 'profile', label: 'Master Profile', icon: <User className="w-4 h-4" /> },
    { view: 'analyzer', label: 'Job Match & Tailor', icon: <Search className="w-4 h-4" /> },
    { view: 'editor', label: 'Resume Studio', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { view: 'tracker', label: 'Applications', icon: <Briefcase className="w-4 h-4" /> },
    { view: 'ats_checker', label: 'ATS Diagnostics', icon: <CheckCircle2 className="w-4 h-4" /> },
    { view: 'roadmap', label: 'Skill Roadmap', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: AppView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  const handleQuickNewResume = () => {
    const id = createResumeVersion({
      title: `Tailored Resume #${resumeVersions.length + 1}`,
      targetRole: 'Target Position',
    });
    navigateTo('editor', id);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('landing')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-gray-950 flex items-center gap-1.5">
                  Buildresume
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Pro
                  </span>
                </span>
                <span className="text-[11px] text-gray-500 block -mt-0.5 hidden sm:block">
                  One Profile. Every Opportunity.
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Persona Preset Switcher (Alex vs Priya) */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                title="Switch sample persona to test fresher vs experienced profiles"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="hidden sm:inline">Profile:</span>
                <span className="font-semibold text-gray-900">
                  {activePreset === 'alex' ? 'Alex (3yr Exp)' : 'Priya (Fresher)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                    Select Candidate Persona
                  </div>
                  <button
                    onClick={() => {
                      switchProfilePreset('alex');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex flex-col transition ${
                      activePreset === 'alex' ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-bold">Alex Chen (Experienced)</span>
                    <span className="text-[11px] text-gray-500">
                      Full Stack & Cloud Engineer • 3+ Yrs Work History
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      switchProfilePreset('priya');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex flex-col transition mt-1 ${
                      activePreset === 'priya' ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-bold">Priya Sharma (Fresher)</span>
                    <span className="text-[11px] text-gray-500">
                      CS Graduate • Capstone Projects & Algorithms Focus
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action: New Resume */}
            <button
              onClick={handleQuickNewResume}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              New Resume
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                currentView === item.view
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                handleQuickNewResume();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Build New Resume
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
