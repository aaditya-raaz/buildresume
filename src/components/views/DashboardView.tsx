import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  Briefcase,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    masterProfile,
    resumeVersions,
    applications,
    navigateTo,
    createResumeVersion,
    duplicateResumeVersion,
    deleteResumeVersion,
    calculateProfileCompletion,
    currentAnalysis,
  } = useApp();

  const { percent: completionPercent, missing: missingProfileItems } =
    calculateProfileCompletion();

  const handleCreateResume = () => {
    const id = createResumeVersion({
      title: `Resume - ${masterProfile.careerInterests[0] || 'Target Role'}`,
      targetRole: masterProfile.careerInterests[0] || 'Software Engineer',
    });
    navigateTo('editor', id);
  };

  const handleDownloadQuick = (resumeId: string) => {
    navigateTo('editor', resumeId);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Profile Health Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                Welcome back, {masterProfile.personalInfo.fullName || user.name}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                Active Master Profile
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl">
              Maintain your credentials in your master profile, then generate role-tailored resumes in
              seconds for every job opening.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreateResume}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Build New Resume
            </button>
            <button
              onClick={() => navigateTo('analyzer')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-blue-600" />
              Match Job Description
            </button>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-800">
                Master Profile Readiness: {completionPercent}%
              </span>
              <span className="text-gray-500">
                {completionPercent === 100
                  ? 'Complete & Verified'
                  : `${missingProfileItems.length} recommendations available`}
              </span>
            </div>

            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {missingProfileItems.length > 0 && (
              <p className="text-xs text-amber-700 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Consider adding: {missingProfileItems.join(', ')}
              </p>
            )}
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={() => navigateTo('profile')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
            >
              Edit Master Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Tailored Resumes</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{resumeVersions.length}</div>
            <span className="text-[11px] text-gray-500">Active role variations</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Verified Skills</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{masterProfile.skills.length}</div>
            <span className="text-[11px] text-gray-500">Across 6 technical domains</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Tracked Applications</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{applications.length}</div>
            <span className="text-[11px] text-gray-500">
              {applications.filter((a) => a.status === 'Interview').length} active interviews
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500">Average Match Score</span>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {currentAnalysis ? `${currentAnalysis.overallScore}%` : '88%'}
            </div>
            <span className="text-[11px] text-gray-500">Explainable ATS diagnostics</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Resumes Workspace Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Tailored Resumes</h2>
            <p className="text-xs text-gray-500">
              Each resume emphasizes different authentic strengths from your Master Profile.
            </p>
          </div>
          <button
            onClick={handleCreateResume}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <Plus className="w-4 h-4" /> Add Variation
          </button>
        </div>

        {resumeVersions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">No Tailored Resumes Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Create your first job-specific resume from your master profile to start applying.
            </p>
            <button
              onClick={handleCreateResume}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Build My First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeVersions.map((version) => (
              <div
                key={version.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {version.templateId}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base mt-2 group-hover:text-blue-600 transition">
                        {version.title}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">
                        Target: {version.targetRole} {version.targetCompany && `• ${version.targetCompany}`}
                      </p>
                    </div>

                    {version.compatibilityScore && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        {version.compatibilityScore}% Match
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {version.tailoredSummary || 'Standard profile summary active for this resume.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {version.selectedSkillIds.length} Skills
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {version.selectedProjectIds.length} Projects
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {version.selectedExperienceIds.length} Experiences
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigateTo('editor', version.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Edit & Preview
                    </button>
                    <button
                      onClick={() => handleDownloadQuick(version.id)}
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                      title="Quick Print or Export PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateResumeVersion(version.id)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Duplicate version"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${version.title}"?`)) {
                          deleteResumeVersion(version.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete version"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Career Intelligence & Job Match Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Career Insights */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Career Insights & Strengths
            </h3>
            <button
              onClick={() => navigateTo('roadmap')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              View Learning Roadmap
            </button>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Based on your master profile and market requirements for modern software roles:
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-blue-900 block">
                Primary Competitive Advantage
              </span>
              <p className="text-xs text-blue-800 leading-relaxed">
                Strong hands-on full-stack delivery with demonstrable Docker and cloud deployment
                experience. High recruiter appeal for product-led engineering teams.
              </p>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-amber-900 block">
                Recommended Profile Addition
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">
                Consider detailing measurable load or latency benchmarks on your open-source projects
                to provide concrete proof of system optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Application Tracker Widget */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Recent Applications
            </h3>
            <button
              onClick={() => navigateTo('tracker')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Open Full Tracker
            </button>
          </div>

          <div className="space-y-2.5">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition flex justify-between items-center"
              >
                <div>
                  <span className="font-bold text-gray-900 text-xs">{app.company}</span>
                  <p className="text-[11px] text-gray-500">{app.role}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === 'Interview'
                        ? 'bg-purple-100 text-purple-800'
                        : app.status === 'Offer'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Applied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {app.applicationDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
