import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MasterProfile,
  ResumeVersion,
  ApplicationItem,
  JobAnalysisResult,
  TemplateId,
} from '../types';
import {
  alexChenProfile,
  priyaSharmaProfile,
  defaultResumeVersions,
  defaultApplications,
} from '../data/mockProfiles';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'profile'
  | 'analyzer'
  | 'editor'
  | 'tracker'
  | 'ats_checker'
  | 'roadmap';

interface UserAuth {
  isAuthenticated: boolean;
  isGuest: boolean;
  name: string;
  email: string;
  role: string;
}

interface AppContextType {
  user: UserAuth;
  currentView: AppView;
  navigateTo: (view: AppView, resumeId?: string) => void;
  masterProfile: MasterProfile;
  updateMasterProfile: (profile: MasterProfile) => void;
  resumeVersions: ResumeVersion[];
  activeResumeId: string;
  setActiveResumeId: (id: string) => void;
  getActiveResume: () => ResumeVersion | undefined;
  createResumeVersion: (version: Partial<ResumeVersion>) => string;
  updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => void;
  deleteResumeVersion: (id: string) => void;
  duplicateResumeVersion: (id: string) => string;
  updateResumeFromMaster: (resumeId: string) => void;
  applications: ApplicationItem[];
  addApplication: (app: Omit<ApplicationItem, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<ApplicationItem>) => void;
  deleteApplication: (id: string) => void;
  currentAnalysis: JobAnalysisResult | null;
  setCurrentAnalysis: (analysis: JobAnalysisResult | null) => void;
  activePreset: 'alex' | 'priya' | 'custom';
  switchProfilePreset: (preset: 'alex' | 'priya') => void;
  loginAsGuest: () => void;
  logout: () => void;
  resetToSampleData: () => void;
  calculateProfileCompletion: () => { percent: number; missing: string[] };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MASTER_PROFILE_KEY = 'buildresume_master_profile_v2';
const RESUME_VERSIONS_KEY = 'buildresume_resumes_v2';
const APPLICATIONS_KEY = 'buildresume_applications_v2';
const USER_AUTH_KEY = 'buildresume_user_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Auth
  const [user, setUser] = useState<UserAuth>(() => {
    try {
      const saved = localStorage.getItem(USER_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isAuthenticated: true,
      isGuest: false,
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      role: 'Full Stack Engineer',
    };
  });

  // Active View
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Active Preset Tracker
  const [activePreset, setActivePreset] = useState<'alex' | 'priya' | 'custom'>('alex');

  // Master Profile
  const [masterProfile, setMasterProfile] = useState<MasterProfile>(() => {
    try {
      const saved = localStorage.getItem(MASTER_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return alexChenProfile;
  });

  // Resume Versions
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>(() => {
    try {
      const saved = localStorage.getItem(RESUME_VERSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultResumeVersions;
  });

  // Active Resume Selected for Editor/Preview
  const [activeResumeId, setActiveResumeId] = useState<string>(() => {
    return defaultResumeVersions[0]?.id || 'res-1';
  });

  // Applications Tracker
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem(APPLICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultApplications;
  });

  // Job Analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState<JobAnalysisResult | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(MASTER_PROFILE_KEY, JSON.stringify(masterProfile));
    } catch {}
  }, [masterProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(RESUME_VERSIONS_KEY, JSON.stringify(resumeVersions));
    } catch {}
  }, [resumeVersions]);

  useEffect(() => {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_AUTH_KEY, JSON.stringify(user));
    } catch {}
  }, [user]);

  const navigateTo = (view: AppView, resumeId?: string) => {
    if (resumeId) {
      setActiveResumeId(resumeId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateMasterProfile = (profile: MasterProfile) => {
    setMasterProfile(profile);
  };

  const getActiveResume = (): ResumeVersion | undefined => {
    return resumeVersions.find((r) => r.id === activeResumeId) || resumeVersions[0];
  };

  const createResumeVersion = (version: Partial<ResumeVersion>): string => {
    const newId = `res-${Date.now()}`;
    const newResume: ResumeVersion = {
      id: newId,
      title: version.title || 'Custom Tailored Resume',
      targetRole: version.targetRole || 'Target Role',
      targetCompany: version.targetCompany || '',
      targetJobDescription: version.targetJobDescription || '',
      templateId: (version.templateId as TemplateId) || 'modern',
      paperSize: version.paperSize || 'a4',
      fontFamily: version.fontFamily || 'sans',
      spacing: version.spacing || 'normal',
      accentColor: version.accentColor || '#1d4ed8',
      sectionsOrder: version.sectionsOrder || [
        'summary',
        'skills',
        'experience',
        'projects',
        'education',
        'certifications',
      ],
      tailoredSummary: version.tailoredSummary || masterProfile.summary,
      selectedSkillIds: version.selectedSkillIds || masterProfile.skills.map((s) => s.id),
      selectedProjectIds: version.selectedProjectIds || masterProfile.projects.map((p) => p.id),
      selectedExperienceIds:
        version.selectedExperienceIds || masterProfile.experience.map((e) => e.id),
      selectedEducationIds:
        version.selectedEducationIds || masterProfile.education.map((ed) => ed.id),
      selectedCertIds: version.selectedCertIds || masterProfile.certifications.map((c) => c.id),
      selectedAdditionalIds:
        version.selectedAdditionalIds || masterProfile.additional.map((a) => a.id),
      customBulletOverrides: version.customBulletOverrides || {},
      lastModified: new Date().toISOString(),
      compatibilityScore: version.compatibilityScore,
    };

    setResumeVersions((prev) => [newResume, ...prev]);
    setActiveResumeId(newId);
    return newId;
  };

  const updateResumeVersion = (id: string, updates: Partial<ResumeVersion>) => {
    setResumeVersions((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ...updates,
              lastModified: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const deleteResumeVersion = (id: string) => {
    setResumeVersions((prev) => {
      const remaining = prev.filter((r) => r.id !== id);
      if (activeResumeId === id && remaining.length > 0) {
        setActiveResumeId(remaining[0].id);
      }
      return remaining;
    });
  };

  const duplicateResumeVersion = (id: string): string => {
    const original = resumeVersions.find((r) => r.id === id);
    if (!original) return '';

    const newId = `res-${Date.now()}`;
    const duplicated: ResumeVersion = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      lastModified: new Date().toISOString(),
    };

    setResumeVersions((prev) => [duplicated, ...prev]);
    setActiveResumeId(newId);
    return newId;
  };

  // Sync newly added master items to this resume version upon user confirmation
  const updateResumeFromMaster = (resumeId: string) => {
    setResumeVersions((prev) =>
      prev.map((r) => {
        if (r.id !== resumeId) return r;
        return {
          ...r,
          selectedSkillIds: Array.from(
            new Set([...r.selectedSkillIds, ...masterProfile.skills.map((s) => s.id)])
          ),
          selectedProjectIds: Array.from(
            new Set([...r.selectedProjectIds, ...masterProfile.projects.map((p) => p.id)])
          ),
          selectedExperienceIds: Array.from(
            new Set([...r.selectedExperienceIds, ...masterProfile.experience.map((e) => e.id)])
          ),
          selectedEducationIds: Array.from(
            new Set([...r.selectedEducationIds, ...masterProfile.education.map((e) => e.id)])
          ),
          lastModified: new Date().toISOString(),
        };
      })
    );
  };

  const addApplication = (app: Omit<ApplicationItem, 'id'>) => {
    const newApp: ApplicationItem = {
      ...app,
      id: `app-${Date.now()}`,
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplication = (id: string, updates: Partial<ApplicationItem>) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const switchProfilePreset = (preset: 'alex' | 'priya') => {
    if (preset === 'alex') {
      setMasterProfile(alexChenProfile);
      setUser({
        isAuthenticated: true,
        isGuest: false,
        name: alexChenProfile.personalInfo.fullName,
        email: alexChenProfile.personalInfo.email,
        role: 'Full Stack Engineer (Experienced)',
      });
      setActivePreset('alex');
    } else {
      setMasterProfile(priyaSharmaProfile);
      setUser({
        isAuthenticated: true,
        isGuest: false,
        name: priyaSharmaProfile.personalInfo.fullName,
        email: priyaSharmaProfile.personalInfo.email,
        role: 'CS Graduate (Fresher Track)',
      });
      setActivePreset('priya');
    }
  };

  const loginAsGuest = () => {
    setUser({
      isAuthenticated: true,
      isGuest: true,
      name: 'Guest Professional',
      email: 'guest@buildresume.app',
      role: 'Career Explorer',
    });
    navigateTo('dashboard');
  };

  const logout = () => {
    setUser({
      isAuthenticated: false,
      isGuest: true,
      name: 'Guest User',
      email: '',
      role: 'Guest',
    });
    navigateTo('landing');
  };

  const resetToSampleData = () => {
    setMasterProfile(alexChenProfile);
    setResumeVersions(defaultResumeVersions);
    setApplications(defaultApplications);
    setActiveResumeId(defaultResumeVersions[0]?.id || 'res-1');
    setActivePreset('alex');
  };

  const calculateProfileCompletion = () => {
    let score = 0;
    const missing: string[] = [];

    // Personal Info
    if (masterProfile.personalInfo.fullName && masterProfile.personalInfo.email) {
      score += 20;
    } else {
      missing.push('Basic contact information');
    }

    if (masterProfile.personalInfo.linkedin || masterProfile.personalInfo.github) {
      score += 10;
    } else {
      missing.push('LinkedIn or GitHub portfolio link');
    }

    // Summary
    if (masterProfile.summary && masterProfile.summary.length > 30) {
      score += 15;
    } else {
      missing.push('Professional Summary');
    }

    // Education
    if (masterProfile.education.length > 0) {
      score += 15;
    } else {
      missing.push('Education details');
    }

    // Skills
    if (masterProfile.skills.length >= 5) {
      score += 20;
    } else {
      missing.push('At least 5 core technical skills');
    }

    // Experience OR Projects (Freshers can substitute projects without penalty!)
    const hasExp = masterProfile.experience.length > 0;
    const hasProj = masterProfile.projects.length > 0;

    if (hasExp || hasProj) {
      score += 20;
    } else {
      missing.push('Either work experience or detailed projects');
    }

    return { percent: Math.min(100, score), missing };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        navigateTo,
        masterProfile,
        updateMasterProfile,
        resumeVersions,
        activeResumeId,
        setActiveResumeId,
        getActiveResume,
        createResumeVersion,
        updateResumeVersion,
        deleteResumeVersion,
        duplicateResumeVersion,
        updateResumeFromMaster,
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        currentAnalysis,
        setCurrentAnalysis,
        activePreset,
        switchProfilePreset,
        loginAsGuest,
        logout,
        resetToSampleData,
        calculateProfileCompletion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
