import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MasterProfile,
  EducationItem,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  CertificationItem,
  AdditionalItem,
} from '../../types';
import {
  User,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Plus,
  Trash2,
  Save,
  Check,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

export const ProfileBuilderView: React.FC = () => {
  const { masterProfile, updateMasterProfile } = useApp();
  const [profile, setProfile] = useState<MasterProfile>(masterProfile);
  const [activeTab, setActiveTab] = useState<
    'personal' | 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'additional' | 'import'
  >('personal');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = () => {
    updateMasterProfile(profile);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  // Personal Info change handler
  const handlePersonalInfoChange = (field: keyof MasterProfile['personalInfo'], val: string) => {
    setProfile((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: val,
      },
    }));
  };

  // Skill Add / Remove
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem['category']>('languages');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem['level']>('Advanced');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      verified: true,
    };
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
    setNewSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  };

  // Experience Add / Remove
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      role: 'Software Engineer',
      location: 'City, Country / Remote',
      startDate: '2024',
      endDate: 'Present',
      current: true,
      responsibilities: ['Engineered key software components aligning with technical specifications.'],
      visible: true,
    };
    setProfile((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const handleUpdateExp = (id: string, updates: Partial<ExperienceItem>) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const handleAddExpBullet = (expId: string) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId
          ? { ...e, responsibilities: [...e.responsibilities, 'Delivered measurable outcomes using modern engineering practices.'] }
          : e
      ),
    }));
  };

  const handleUpdateExpBullet = (expId: string, idx: number, val: string) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId
          ? {
              ...e,
              responsibilities: e.responsibilities.map((b, i) => (i === idx ? val : b)),
            }
          : e
      ),
    }));
  };

  const handleRemoveExpBullet = (expId: string, idx: number) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId
          ? {
              ...e,
              responsibilities: e.responsibilities.filter((_, i) => i !== idx),
            }
          : e
      ),
    }));
  };

  // Projects Add / Remove
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Technical Project',
      problem: 'High-level problem description addressed by this software.',
      description: 'Built a full-stack application providing reliable end-user workflows.',
      technologies: ['TypeScript', 'React', 'Node.js'],
      contribution: 'Architected database schema and core services.',
      outcomes: 'Benchmarked and tested in development environment.',
      visible: true,
    };
    setProfile((prev) => ({ ...prev, projects: [newProj, ...prev.projects] }));
  };

  const handleUpdateProj = (id: string, updates: Partial<ProjectItem>) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  // Education Add / Remove
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University / College',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2020',
      endDate: '2024',
      grade: '3.8 GPA',
      highlights: ['Relevant Coursework: Data Structures, Algorithms, Systems'],
      visible: true,
    };
    setProfile((prev) => ({ ...prev, education: [newEdu, ...prev.education] }));
  };

  const handleUpdateEdu = (id: string, updates: Partial<EducationItem>) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((ed) => (ed.id === id ? { ...ed, ...updates } : ed)),
    }));
  };

  // Certifications Add / Remove
  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Cloud / Technical Certification',
      issuer: 'Certifying Body',
      issueDate: '2024',
      visible: true,
    };
    setProfile((prev) => ({ ...prev, certifications: [newCert, ...prev.certifications] }));
  };

  // Additional Add / Remove
  const handleAddAdditional = () => {
    const newAdd: AdditionalItem = {
      id: `add-${Date.now()}`,
      type: 'leadership',
      title: 'Leadership Role or Award',
      organization: 'Organization Name',
      date: '2024',
      description: 'Mentored peers and organized technical seminars.',
      visible: true,
    };
    setProfile((prev) => ({ ...prev, additional: [newAdd, ...prev.additional] }));
  };

  // Resume Text Importer
  const handleParseImport = () => {
    if (!importText.trim()) return;
    setImportStatus('Parsing text...');

    // Simple heuristic parser for resume text
    const text = importText;
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    // Try extracting email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    // Try extracting phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);

    const updatedProfile = { ...profile };

    if (lines.length > 0 && !updatedProfile.personalInfo.fullName) {
      updatedProfile.personalInfo.fullName = lines[0];
    }
    if (emailMatch) {
      updatedProfile.personalInfo.email = emailMatch[0];
    }
    if (phoneMatch) {
      updatedProfile.personalInfo.phone = phoneMatch[0];
    }

    // Extract skills if found
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'React', 'Node.js',
      'HTML', 'CSS', 'Tailwind', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'PostgreSQL',
      'MySQL', 'MongoDB', 'Redis', 'Git', 'GraphQL', 'REST API', 'Linux'
    ];

    const detected = commonSkills.filter((s) =>
      text.toLowerCase().includes(s.toLowerCase())
    );

    if (detected.length > 0) {
      const newSkills: SkillItem[] = detected.map((s) => ({
        id: `sk-imp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: s,
        category: s.includes('SQL') || s === 'MongoDB' || s === 'Redis' ? 'databases' : s === 'AWS' || s === 'Docker' || s === 'Kubernetes' ? 'cloud' : 'languages',
        level: 'Advanced',
        verified: true,
      }));
      updatedProfile.skills = [...updatedProfile.skills, ...newSkills];
    }

    setProfile(updatedProfile);
    setImportStatus(`Extracted contact details and ${detected.length} skills! Please review and click Save.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">Master Profile</h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Source of Truth
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Keep all your experiences, education, and skills in one place. Your tailored resumes are
            derived dynamically from here.
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer ${
            savedFeedback
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {savedFeedback ? (
            <>
              <Check className="w-4 h-4" /> Changes Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Master Profile
            </>
          )}
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex overflow-x-auto gap-2 pb-1 text-xs font-semibold no-scrollbar">
        {[
          { id: 'personal', label: 'Personal & Contact', icon: <User className="w-4 h-4" /> },
          { id: 'summary', label: 'Professional Summary', icon: <FileText className="w-4 h-4" /> },
          { id: 'skills', label: `Skills (${profile.skills.length})`, icon: <Code2 className="w-4 h-4" /> },
          { id: 'experience', label: `Experience (${profile.experience.length})`, icon: <Briefcase className="w-4 h-4" /> },
          { id: 'projects', label: `Projects (${profile.projects.length})`, icon: <FolderGit2 className="w-4 h-4" /> },
          { id: 'education', label: `Education (${profile.education.length})`, icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'certifications', label: `Certifications (${profile.certifications.length})`, icon: <Award className="w-4 h-4" /> },
          { id: 'additional', label: `Leadership & Honors (${profile.additional.length})`, icon: <Sparkles className="w-4 h-4" /> },
          { id: 'import', label: 'Import Existing', icon: <Upload className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        {/* Personal & Contact Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Personal Information & Professional Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal / Preferred Name</label>
                <input
                  type="text"
                  value={profile.personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Alex Chen"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Professional Email</label>
                <input
                  type="email"
                  value={profile.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. alex.chen@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. +1 (415) 555-0192"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location / Relocation Preferences</label>
                <input
                  type="text"
                  value={profile.personalInfo.location}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. San Francisco, CA (Open to Remote)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={profile.personalInfo.linkedin || ''}
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. linkedin.com/in/alexchen-dev"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GitHub / Code Repository</label>
                <input
                  type="text"
                  value={profile.personalInfo.github || ''}
                  onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. github.com/alexchen"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Personal Portfolio / Website</label>
                <input
                  type="text"
                  value={profile.personalInfo.portfolio || ''}
                  onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. alexchen.dev"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Professional Summary & Career Interests
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Master Summary Statement</label>
              <textarea
                rows={4}
                value={profile.summary}
                onChange={(e) => setProfile((p) => ({ ...p, summary: e.target.value }))}
                className="w-full p-3 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                placeholder="High-level summary of your engineering background and core technical values..."
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Tip: Keep your master summary factual. When tailoring for specific job descriptions, the system
                will suggest role-specific emphases based on this foundation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Target Roles & Career Interests (comma separated)
              </label>
              <input
                type="text"
                value={profile.careerInterests.join(', ')}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    careerInterests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Full Stack Engineer, Cloud Architect, Backend Specialist"
              />
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Categorized Technical Skills</h2>
                <p className="text-xs text-gray-500">
                  Total {profile.skills.length} verified technical competencies documented.
                </p>
              </div>
            </div>

            {/* Quick Add Form */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. PostgreSQL, Redis, Kubernetes"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="languages">Languages</option>
                  <option value="frameworks">Frameworks</option>
                  <option value="cloud">Cloud & DevOps</option>
                  <option value="databases">Databases</option>
                  <option value="tools">Tools & Testing</option>
                  <option value="domain">Domain & Arch</option>
                  <option value="soft">Soft Skills</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Proficiency</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  onClick={handleAddSkill}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {profile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition"
                >
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">{skill.name}</span>
                    <span className="text-[10px] text-gray-500 capitalize">
                      {skill.category} • {skill.level}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Work Experience</h2>
                <p className="text-xs text-gray-500">
                  Note: Freshers and college students can keep this empty and focus on the Projects section.
                </p>
              </div>
              <button
                onClick={handleAddExperience}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            {profile.experience.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500">No work experience entries added.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Fresher candidates can rely on capstones and coursework in Education & Projects!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {profile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-xl border border-gray-200 bg-white space-y-4 shadow-2xs"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExp(exp.id, { role: e.target.value })}
                          className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
                          placeholder="Job Title / Role"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExp(exp.id, { company: e.target.value })}
                          className="text-xs text-gray-700 border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
                          placeholder="Company Name"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleUpdateExp(exp.id, { location: e.target.value })}
                          className="text-xs text-gray-500 border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
                          placeholder="Location (e.g. San Francisco, CA)"
                        />
                        <div className="flex items-center gap-2 text-xs">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExp(exp.id, { startDate: e.target.value })}
                            className="w-24 text-xs border-b border-gray-200 pb-1 focus:outline-none"
                            placeholder="Start Date"
                          />
                          <span>–</span>
                          <input
                            type="text"
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) => handleUpdateExp(exp.id, { endDate: e.target.value })}
                            className="w-24 text-xs border-b border-gray-200 pb-1 focus:outline-none"
                            placeholder="End Date"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateExp(exp.id, { visible: !exp.visible })}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded"
                          title="Toggle visibility"
                        >
                          {exp.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() =>
                            setProfile((p) => ({
                              ...p,
                              experience: p.experience.filter((e) => e.id !== exp.id),
                            }))
                          }
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                        Responsibilities & Measurable Outcomes
                      </span>
                      {exp.responsibilities.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-gray-400 text-xs mt-1">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => handleUpdateExpBullet(exp.id, bIdx, e.target.value)}
                            className="flex-1 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                          />
                          <button
                            onClick={() => handleRemoveExpBullet(exp.id, bIdx)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddExpBullet(exp.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3 h-3" /> Add Achievement Bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Technical Projects</h2>
                <p className="text-xs text-gray-500">
                  Highlight problem solved, specific technologies, and individual contribution.
                </p>
              </div>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-5">
              {profile.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-xl border border-gray-200 bg-white space-y-3 shadow-2xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleUpdateProj(proj.id, { title: e.target.value })}
                      className="font-bold text-sm text-gray-900 flex-1 border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
                      placeholder="Project Title"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateProj(proj.id, { visible: !proj.visible })}
                        className="p-1.5 text-gray-400 hover:text-gray-700"
                      >
                        {proj.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() =>
                          setProfile((p) => ({
                            ...p,
                            projects: p.projects.filter((pr) => pr.id !== proj.id),
                          }))
                        }
                        className="p-1.5 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">
                        Technologies (comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) =>
                          handleUpdateProj(proj.id, {
                            technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="TypeScript, React, Node.js"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">
                        Repository / Demo Link
                      </label>
                      <input
                        type="text"
                        value={proj.githubUrl || proj.projectUrl || ''}
                        onChange={(e) => handleUpdateProj(proj.id, { githubUrl: e.target.value })}
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="github.com/user/project"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">
                      Description & Architecture
                    </label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => handleUpdateProj(proj.id, { description: e.target.value })}
                      className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">
                        Individual Contribution
                      </label>
                      <input
                        type="text"
                        value={proj.contribution}
                        onChange={(e) => handleUpdateProj(proj.id, { contribution: e.target.value })}
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Sole author, built backend daemon and schema..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">
                        Verifiable Outcomes
                      </label>
                      <input
                        type="text"
                        value={proj.outcomes || ''}
                        onChange={(e) => handleUpdateProj(proj.id, { outcomes: e.target.value })}
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Earned 300+ GitHub stars, sub-10ms benchmark..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Education & Coursework</h2>
                <p className="text-xs text-gray-500">Degree, institution, academic honors and relevant coursework.</p>
              </div>
              <button
                onClick={handleAddEducation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-xl border border-gray-200 bg-white space-y-3 shadow-2xs"
                >
                  <div className="flex justify-between items-start">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEdu(edu.id, { institution: e.target.value })}
                      className="font-bold text-sm text-gray-900 flex-1 border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
                      placeholder="University / College Name"
                    />
                    <button
                      onClick={() =>
                        setProfile((p) => ({
                          ...p,
                          education: p.education.filter((ed) => ed.id !== edu.id),
                        }))
                      }
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEdu(edu.id, { degree: e.target.value })}
                      className="p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Degree (e.g. Bachelor of Science)"
                    />
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleUpdateEdu(edu.id, { fieldOfStudy: e.target.value })}
                      className="p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Field of Study (e.g. Computer Science)"
                    />
                    <input
                      type="text"
                      value={edu.grade || ''}
                      onChange={(e) => handleUpdateEdu(edu.id, { grade: e.target.value })}
                      className="p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Grade / GPA (e.g. 3.85 GPA)"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => handleUpdateEdu(edu.id, { startDate: e.target.value })}
                      className="w-28 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Start (2021)"
                    />
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => handleUpdateEdu(edu.id, { endDate: e.target.value })}
                      className="w-28 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="End (2025)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Certifications & Credentials</h2>
                <p className="text-xs text-gray-500">AWS, Google Cloud, Oracle, Meta certifications.</p>
              </div>
              <button
                onClick={handleAddCert}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            <div className="space-y-3">
              {profile.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl bg-white"
                >
                  <div className="space-y-1 flex-1">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          certifications: p.certifications.map((c) =>
                            c.id === cert.id ? { ...c, name: e.target.value } : c
                          ),
                        }))
                      }
                      className="font-bold text-xs text-gray-900 w-full focus:outline-none"
                      placeholder="Certification Title"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            certifications: p.certifications.map((c) =>
                              c.id === cert.id ? { ...c, issuer: e.target.value } : c
                            ),
                          }))
                        }
                        className="text-[11px] text-gray-500 w-44 focus:outline-none"
                        placeholder="Issuer (e.g. AWS)"
                      />
                      <input
                        type="text"
                        value={cert.issueDate}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            certifications: p.certifications.map((c) =>
                              c.id === cert.id ? { ...c, issueDate: e.target.value } : c
                            ),
                          }))
                        }
                        className="text-[11px] text-gray-400 w-20 focus:outline-none"
                        placeholder="Year (2023)"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setProfile((p) => ({
                        ...p,
                        certifications: p.certifications.filter((c) => c.id !== cert.id),
                      }))
                    }
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Tab */}
        {activeTab === 'additional' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Honors, Leadership & Extracurriculars</h2>
                <p className="text-xs text-gray-500">Hackathon victories, student leadership, technical writings.</p>
              </div>
              <button
                onClick={handleAddAdditional}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {profile.additional.map((add) => (
                <div key={add.id} className="p-4 border border-gray-200 rounded-xl bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={add.title}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          additional: p.additional.map((a) => (a.id === add.id ? { ...a, title: e.target.value } : a)),
                        }))
                      }
                      className="font-bold text-xs text-gray-900 flex-1 focus:outline-none"
                      placeholder="Title / Honor"
                    />
                    <button
                      onClick={() =>
                        setProfile((p) => ({
                          ...p,
                          additional: p.additional.filter((a) => a.id !== add.id),
                        }))
                      }
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={add.organization}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          additional: p.additional.map((a) => (a.id === add.id ? { ...a, organization: e.target.value } : a)),
                        }))
                      }
                      className="text-[11px] text-gray-500 p-1.5 border border-gray-200 rounded focus:outline-none"
                      placeholder="Organization"
                    />
                    <input
                      type="text"
                      value={add.date}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          additional: p.additional.map((a) => (a.id === add.id ? { ...a, date: e.target.value } : a)),
                        }))
                      }
                      className="text-[11px] text-gray-500 p-1.5 border border-gray-200 rounded focus:outline-none"
                      placeholder="Date"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={add.description}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        additional: p.additional.map((a) => (a.id === add.id ? { ...a, description: e.target.value } : a)),
                      }))
                    }
                    className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-none"
                    placeholder="Short description..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Existing Resume Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Import & Extract From Existing Resume Text
            </h2>

            <p className="text-xs text-gray-600 leading-relaxed">
              Have an existing PDF or Word resume? Copy and paste its text below. Buildresume will extract
              your contact information and technical skills into your Master Profile. You will be able to review
              everything before saving.
            </p>

            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full p-3 text-xs border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
              placeholder="Paste raw resume text here..."
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleParseImport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Extract Into Master Profile
              </button>
              {importStatus && <span className="text-xs text-emerald-700 font-medium">{importStatus}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
