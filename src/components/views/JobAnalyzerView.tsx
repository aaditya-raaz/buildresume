import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobAnalysisResult, JobRequirement } from '../../types';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Building2,
  Briefcase,
  Layers,
  BookOpen,
  Loader2,
} from 'lucide-react';

const sampleJDs = [
  {
    role: 'Senior Backend Engineer',
    company: 'Stripe',
    text: `We are looking for a Senior Backend Engineer to join our Core Billing team.
Responsibilities:
- Architect, build, and maintain high-throughput distributed RESTful and gRPC microservices.
- Optimize PostgreSQL schemas, indexes, and queries handling millions of financial events.
- Implement Redis caching strategies and message queues (Kafka/SQS) for resilient async processing.
- Collaborate with infrastructure teams on Docker containerization and AWS deployments.

Requirements:
- 3+ years of professional backend software development experience.
- Strong proficiency in Node.js, TypeScript, Python, or Go.
- Solid experience with relational databases (PostgreSQL/MySQL) and data modeling.
- Working knowledge of Docker, AWS, and CI/CD pipelines.
- Bachelor's degree in Computer Science or equivalent practical experience.`,
  },
  {
    role: 'Cloud & DevOps Engineer',
    company: 'Datadog',
    text: `Datadog is seeking a Cloud Infrastructure Engineer to design scalable telemetry pipelines.
Responsibilities:
- Build and maintain infrastructure-as-code using Terraform and AWS cloud services (ECS, S3, RDS, Lambda).
- Optimize containerized microservice architectures with Docker and Kubernetes.
- Implement robust CI/CD deployment pipelines using GitHub Actions.
- Monitor application latency, error budgets, and system resource metrics.

Requirements:
- Proven experience with AWS cloud environments (AWS Certified Solutions Architect preferred).
- Deep experience with Docker containers and infrastructure orchestration.
- Proficiency in scripting and automation (Python, Bash, or TypeScript).
- Solid grasp of Linux systems, networking, and observability tools.`,
  },
  {
    role: 'Junior Java Developer Intern',
    company: 'Fintech Innovations',
    text: `Exciting opportunity for fresh computer science graduates or interns with solid foundations in Java!
Responsibilities:
- Develop modular backend components using Java and Spring Boot.
- Write robust unit tests with JUnit and participate in agile sprints.
- Query and optimize relational databases (PostgreSQL or MySQL).
- Collaborate with senior developers on API endpoints.

Requirements:
- Pursuing or recently graduated with a BS in Computer Science or related degree.
- Strong understanding of Object-Oriented Programming (OOP) and Data Structures & Algorithms.
- Hands-on project experience in Java (Spring Boot or academic projects).
- Familiarity with Git, Linux CLI, and RESTful APIs.`,
  },
];

export const JobAnalyzerView: React.FC = () => {
  const {
    masterProfile,
    currentAnalysis,
    setCurrentAnalysis,
    createResumeVersion,
    navigateTo,
  } = useApp();

  const [jobTitle, setJobTitle] = useState('Senior Backend Engineer');
  const [company, setCompany] = useState('Stripe');
  const [jobDescription, setJobDescription] = useState(sampleJDs[0].text);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectSample = (sample: typeof sampleJDs[0]) => {
    setJobTitle(sample.role);
    setCompany(sample.company);
    setJobDescription(sample.text);
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setErrorMsg('Please enter or paste a job description.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          jobTitle,
          company,
          profile: masterProfile,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setCurrentAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to complete analysis');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Analysis failed. Using local heuristic diagnostics.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTailoredResume = () => {
    if (!currentAnalysis) return;

    // Filter skills matching required
    const matchedSkillNames = currentAnalysis.extractedRequirements
      .filter((r) => r.status === 'matched')
      .map((r) => r.skill.toLowerCase());

    const prioritizedSkillIds = masterProfile.skills
      .filter((s) =>
        matchedSkillNames.some((msn) => s.name.toLowerCase().includes(msn) || msn.includes(s.name.toLowerCase()))
      )
      .map((s) => s.id);

    // Create tailored resume
    const newId = createResumeVersion({
      title: `${jobTitle} — ${company || 'Target'}`,
      targetRole: jobTitle,
      targetCompany: company,
      targetJobDescription: jobDescription,
      tailoredSummary: currentAnalysis.summary,
      selectedSkillIds:
        prioritizedSkillIds.length > 0 ? prioritizedSkillIds : masterProfile.skills.map((s) => s.id),
      compatibilityScore: currentAnalysis.overallScore,
    });

    navigateTo('editor', newId);
  };

  const getStatusBadge = (status: JobRequirement['status']) => {
    switch (status) {
      case 'matched':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Matched
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Partially Matched
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" /> Missing in Profile
          </span>
        );
      case 'needs_confirmation':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-gray-50 text-gray-700 border border-gray-200">
            <HelpCircle className="w-3 h-3 text-gray-500" /> Needs Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                Job Description Analyzer & Tailoring Engine
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Explainable Diagnostics
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Paste any target job description. The platform identifies required qualifications, compares them
              against your Master Profile, and calculates a transparent alignment score.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Sample Presets:</span>
            {sampleJDs.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(s)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition"
              >
                {s.company}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-gray-700 mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Senior Backend Engineer"
            />
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-gray-700 mb-1">Company / Organization</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Stripe, Datadog, etc."
            />
          </div>

          <div className="md:col-span-12">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Job Description Text (paste requirements, responsibilities, qualifications)
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 text-xs border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
              placeholder="Paste full job description text here..."
            />
          </div>

          <div className="md:col-span-12 flex items-center justify-between">
            {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="ml-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Qualifications...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Run Compatibility Diagnostics
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {currentAnalysis && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-blue-700">
                  <span className="text-3xl font-black">{currentAnalysis.overallScore}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Match Score</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Diagnostic Overview
                  </span>
                  <h2 className="text-xl font-black text-gray-900">
                    Role Alignment for {jobTitle} at {company}
                  </h2>
                  <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
                    {currentAnalysis.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={handleGenerateTailoredResume}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Tailored Resume
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-700">Required Skills</span>
                  <span className="font-bold text-gray-900">{currentAnalysis.scoreBreakdown.requiredSkills}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${currentAnalysis.scoreBreakdown.requiredSkills}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-700">Project Evidence</span>
                  <span className="font-bold text-gray-900">{currentAnalysis.scoreBreakdown.projectEvidence}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${currentAnalysis.scoreBreakdown.projectEvidence}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-700">Keywords & Terms</span>
                  <span className="font-bold text-gray-900">{currentAnalysis.scoreBreakdown.keywordCoverage}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${currentAnalysis.scoreBreakdown.keywordCoverage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-700">Qualifications</span>
                  <span className="font-bold text-gray-900">{currentAnalysis.scoreBreakdown.qualifications}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${currentAnalysis.scoreBreakdown.qualifications}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-4 italic">
              * Note: This score is an internal heuristic diagnostic measuring profile evidence against the job description.
              It does not guarantee employment or reflect any proprietary employer ATS algorithms.
            </p>
          </div>

          {/* Extracted Requirements Breakdown Table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              Detailed Qualification Alignment ({currentAnalysis.extractedRequirements.length} signals)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 pr-4">Requirement / Competency</th>
                    <th className="py-2.5 pr-4">Category</th>
                    <th className="py-2.5 pr-4">Match Status</th>
                    <th className="py-2.5">Candidate Evidence & Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentAnalysis.extractedRequirements.map((req, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-4 font-bold text-gray-900">{req.skill}</td>
                      <td className="py-3 pr-4 capitalize text-gray-500">{req.category}</td>
                      <td className="py-3 pr-4">{getStatusBadge(req.status)}</td>
                      <td className="py-3 text-gray-600">
                        <span>{req.explanation}</span>
                        {req.matchedEvidence && (
                          <span className="block text-[11px] text-blue-700 font-medium mt-0.5">
                            Evidence: {req.matchedEvidence}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Missing Gaps & ATS Guidance Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Missing Skills Gap */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  Identified Gaps & Learning Recommendations
                </h3>
                <button
                  onClick={() => navigateTo('roadmap')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Full Roadmap
                </button>
              </div>

              <div className="space-y-3">
                {currentAnalysis.missingGaps.map((gap, i) => (
                  <div key={i} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">{gap.skill}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {gap.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600">{gap.importance}</p>
                    <div className="text-[11px] text-blue-700 font-medium">
                      Project Idea: {gap.suggestedProject}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Formatting Recommendations */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ATS Formatting Best Practices for this Role
              </h3>

              <div className="space-y-2.5">
                {currentAnalysis.atsTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[11px]">
                      {i + 1}
                    </div>
                    <p className="leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigateTo('ats_checker')}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Run Full ATS Rule Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
