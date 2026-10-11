import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Target,
  SlidersHorizontal,
  Download,
  ShieldCheck,
  Code2,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Compass,
  Check,
  AlertCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, switchProfilePreset, activePreset } = useApp();
  const [activeTab, setActiveTab] = useState<'tailored' | 'generic'>('tailored');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Buildresume differ from generic resume builders?',
      a: 'Traditional builders require you to rewrite or copy-paste separate resumes each time you apply, leading to fragmented information. Buildresume maintains one authoritative Master Profile and dynamically generates job-specific resumes by emphasizing your genuine matching strengths without fabricating credentials.',
    },
    {
      q: 'Does Buildresume fabricate experience or inflate numbers?',
      a: 'Never. Our core product principle is strict authenticity. We believe misleading metrics (like "improved velocity by 48%" out of nowhere) harm candidates during technical interviews. Buildresume reorganizes, highlights, and refines wording strictly from your verified achievements.',
    },
    {
      q: 'Can college students and freshers use this without employment history?',
      a: 'Yes! Our Fresher template and relevance engine highlight academic coursework, capstone projects, algorithmic competencies, and student leadership without penalizing you for not having multi-year corporate tenure.',
    },
    {
      q: 'Are the exported resumes compatible with Applicant Tracking Systems (ATS)?',
      a: 'Yes. All templates use standard semantic headings, clean single-column or ATS-tested layouts, selectable vector text, and zero inaccessible graphics, tables, or parsing traps.',
    },
    {
      q: 'How is the Resume Compatibility Score calculated?',
      a: 'Unlike tools that generate arbitrary percentages, our score is completely explainable: 40% required skill alignment, 30% project & experience evidence, 15% keyword coverage, and 15% qualifications matching.',
    },
  ];

  return (
    <div className="bg-[#F7F9FC] text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Gen Career Intelligence • Zero Hallucinations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 leading-[1.1]">
                Your Experience. <br />
                Your Strengths. <br />
                <span className="text-blue-600">The Right Resume.</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Create a master profile once. Build tailored resumes for every opportunity with
                intelligent job matching, ATS-friendly formatting, and personalized career insights.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Build My Resume
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl font-semibold text-sm shadow-xs transition cursor-pointer"
                >
                  See How It Works
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  No fake credentials
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Print-ready vector PDF
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  100% Free Demo Mode
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Live Product Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Live Match Preview: Target Opportunity</span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-400">Buildresume Engine</span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Step 1: Input Job Description snippet */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs">
                    <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block mb-1">
                      1. Pasted Job Description (Backend / Cloud Role)
                    </span>
                    <p className="text-gray-600 font-mono text-[11px] line-clamp-2">
                      "Seeking a Backend Engineer with strong Node.js, PostgreSQL optimization, Docker containerization, and AWS microservices experience..."
                    </p>
                  </div>

                  {/* Step 2: Relevance Match */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-800">2. Profile Match Signals</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        88% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 flex items-center gap-1">
                        <Check className="w-3 h-3 text-blue-600" /> Node.js & Express
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 flex items-center gap-1">
                        <Check className="w-3 h-3 text-blue-600" /> PostgreSQL & Redis
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 flex items-center gap-1">
                        <Check className="w-3 h-3 text-blue-600" /> Docker & AWS
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Adapted Resume Card */}
                  <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-3.5 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-900 text-xs">
                        3. Dynamically Adapted Output
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">Template: Modern</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-gray-200 text-[11px] space-y-1 text-gray-700 shadow-xs">
                      <p className="font-bold text-gray-900">Alex Chen • Backend Specialist Resume</p>
                      <p className="text-gray-600 line-clamp-2">
                        Summary: Backend Engineer focused on high-throughput REST APIs, database indexing, and low-latency caching architectures in Node.js and PostgreSQL.
                      </p>
                    </div>

                    <button
                      onClick={() => navigateTo('editor')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Open Full Studio Workspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem with Generic Resumes */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              The Reality of Hiring
            </h2>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              Why Generic Resumes Get Screened Out
            </h3>
            <p className="text-gray-600 mt-3 text-base">
              Recruiters spend 6–8 seconds reviewing a resume. If your most relevant accomplishments
              are buried on page two under irrelevant technologies, opportunities slip away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-2">Clutter & Mismatched Focus</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Applying to a backend role with frontend-heavy highlights distracts reviewers and obscures
                your relevant database and API architecture experience.
              </p>
            </div>

            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-2">Fragmented Resume Files</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Managing "Resume_Final_v3.pdf" and "Resume_Cloud_New.docx" leads to outdated contact info,
                missing certifications, and administrative chaos.
              </p>
            </div>

            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-2">The Buildresume Solution</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Maintain <strong>one verified master profile</strong>. Generate tailored versions in seconds
                with targeted bullet points, ranked skills, and complete version tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works in 3 Steps */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
            Seamless Workflow
          </h2>
          <h3 className="text-3xl font-black text-gray-950 tracking-tight">
            How Buildresume Works in Three Steps
          </h3>
          <p className="text-gray-600 mt-3 text-base">
            From single profile to targeted, interview-ready applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
              1
            </div>
            <h4 className="text-xl font-bold text-gray-900">Create Master Profile</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Document your education, verified skills, engineering projects, employment history, and
              certifications once. Never repeat manual data entry.
            </p>
            <button
              onClick={() => navigateTo('profile')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Explore Master Editor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
              2
            </div>
            <h4 className="text-xl font-bold text-gray-900">Analyze Job Description</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Paste the target opening. Our career intelligence engine extracts required skills,
              preferred qualifications, and identifies your genuine matching evidence.
            </p>
            <button
              onClick={() => navigateTo('analyzer')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Test Job Analyzer <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
              3
            </div>
            <h4 className="text-xl font-bold text-gray-900">Tailor & Export PDF</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Choose an ATS-compliant template, refine active bullet points with the AI writing
              assistant, and print or download crisp vector PDFs ready for submission.
            </p>
            <button
              onClick={() => navigateTo('editor')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              Preview Live Studio <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Before & After Resume Comparison */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Side-by-Side Comparison
            </h2>
            <h3 className="text-3xl font-black text-gray-950 tracking-tight">
              See the Difference: Generic vs Role-Tailored
            </h3>
            <p className="text-gray-600 mt-3 text-base">
              The same candidate profile, presented for a <strong>Senior Backend Role</strong>. Notice how
              relevance and strong action verbs transform impact without inventing facts.
            </p>

            {/* Toggle */}
            <div className="inline-flex p-1 bg-gray-100 rounded-xl mt-6 border border-gray-200">
              <button
                onClick={() => setActiveTab('tailored')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === 'tailored'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✨ Buildresume Tailored Version
              </button>
              <button
                onClick={() => setActiveTab('generic')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === 'generic'
                    ? 'bg-gray-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ❌ Standard Generic Resume
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {activeTab === 'tailored' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">
                      Target Role: Senior Backend Engineer
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 mt-1">Alex Chen</h4>
                    <p className="text-xs text-gray-600 font-medium">San Francisco, CA • alex.chen@example.com</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    92% Relevance Alignment
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                    Professional Summary
                  </h5>
                  <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                    Backend Engineer with 3+ years of experience engineering high-throughput microservices,
                    optimizing PostgreSQL query latency, and building scalable cloud ingestion pipelines in Node.js and AWS.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                    Key Highlighted Experience (AeroCloud Solutions)
                  </h5>
                  <ul className="list-disc ml-5 space-y-1.5 text-xs text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
                    <li>
                      Designed decoupled RESTful and WebSocket ingestion microservices in Node.js and Express, maintaining 99.98% uptime.
                    </li>
                    <li>
                      Optimized PostgreSQL query latency and added Redis cache layer, reducing average response time on heavy reporting queries from 840ms to 120ms.
                    </li>
                    <li>
                      Automated CI/CD build and container deployment pipelines via GitHub Actions and AWS ECS, eliminating manual release steps.
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                    Prioritized Technical Skills
                  </h5>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-semibold rounded">Node.js</span>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-semibold rounded">PostgreSQL</span>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-semibold rounded">Redis</span>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-semibold rounded">Docker</span>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-semibold rounded">AWS ECS</span>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-semibold rounded">REST API</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 opacity-85">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                      Generic Unfocused Layout
                    </span>
                    <h4 className="text-xl font-bold text-gray-700 mt-1">Alex Chen</h4>
                    <p className="text-xs text-gray-500">San Francisco, CA</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                    54% Relevance Alignment
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Objective
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                    Hardworking software developer looking for any challenging job at an innovative organization where I can learn new things and help the company.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Experience
                  </h5>
                  <ul className="list-disc ml-5 space-y-1.5 text-xs text-gray-600 leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
                    <li>Worked on company web pages using HTML, CSS and React.</li>
                    <li>Helped the team with meetings and bug tickets.</li>
                    <li>Used database and servers for daily tasks.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Unfiltered Skill List
                  </h5>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">HTML</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">CSS</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">Photoshop</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">Microsoft Office</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">Coding</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Supported User Types */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
            Tailored For Every Stage
          </h2>
          <h3 className="text-3xl font-black text-gray-950 tracking-tight">
            Built for Real Career Paths
          </h3>
          <p className="text-gray-600 mt-3 text-base">
            No matter where you are in your journey, Buildresume presents your genuine strengths in the best light.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Students & Freshers</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Showcase capstone projects, algorithmic coursework, and hackathons without being penalized for zero commercial years.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Software Engineers</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tailor between Frontend, Backend, DevOps, or Full Stack openings. Highlight relevant frameworks and architecture.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Career Switchers</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Identify transferable skills, emphasize newly completed technical certifications, and surface relevant cross-domain projects.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Experienced Leads</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Emphasize system architecture, strategic initiatives, cross-functional delivery, and mentorship milestones.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Questions & Answers
            </h2>
            <h3 className="text-3xl font-black text-gray-950 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex justify-between items-center font-bold text-gray-900 text-sm hover:bg-gray-100 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-200 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Build Smarter Resumes for Every Opportunity?
          </h2>
          <p className="text-blue-100 text-base max-w-2xl mx-auto">
            Take control of your job search with a centralized profile, verifiable tailoring, and ATS-tested formats.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-extrabold text-sm shadow-xl transition cursor-pointer"
            >
              Start Building Now — No Credit Card Needed
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">Buildresume</span>
            <span className="text-gray-500">• One Profile. Every Opportunity.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <button onClick={() => navigateTo('profile')} className="hover:text-white transition">
              Master Profile
            </button>
            <button onClick={() => navigateTo('analyzer')} className="hover:text-white transition">
              Job Matcher
            </button>
            <button onClick={() => navigateTo('editor')} className="hover:text-white transition">
              Resume Studio
            </button>
            <button onClick={() => navigateTo('tracker')} className="hover:text-white transition">
              Applications
            </button>
            <button onClick={() => navigateTo('ats_checker')} className="hover:text-white transition">
              ATS Diagnostics
            </button>
          </div>

          <div className="text-gray-500 text-[11px]">
            © {new Date().getFullYear()} Buildresume. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
