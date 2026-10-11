import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Target,
  ExternalLink,
  Code2,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const SkillRoadmapView: React.FC = () => {
  const { currentAnalysis, masterProfile, navigateTo } = useApp();

  const defaultRoadmapItems = [
    {
      skill: 'Kubernetes & Container Orchestration',
      priority: 'high',
      category: 'cloud',
      status: 'missing',
      whyItMatters:
        'Standard infrastructure foundation across modern enterprise backends and cloud services.',
      suggestedProject:
        'Deploy a multi-service Node.js & Redis cluster on Minikube with Helm charts, Ingress routing, and health checks.',
      resources: [
        { title: 'Official Kubernetes Interactive Tutorials', url: 'https://kubernetes.io/docs/tutorials/' },
        { title: 'Docker to K8s Step-by-Step Guide', url: 'https://docs.docker.com/' },
      ],
      estimatedHours: '15-20 hours',
    },
    {
      skill: 'Distributed Messaging (Kafka / SQS / RabbitMQ)',
      priority: 'high',
      category: 'backend',
      status: 'missing',
      whyItMatters:
        'Crucial for asynchronous decoupled pipelines, event-driven architectures, and high-volume data ingestion.',
      suggestedProject:
        'Implement an event-driven email delivery queue using RabbitMQ or Kafka producer/consumer in TypeScript.',
      resources: [
        { title: 'Apache Kafka Quickstart Documentation', url: 'https://kafka.apache.org/quickstart' },
      ],
      estimatedHours: '12-16 hours',
    },
    {
      skill: 'Database Query Optimization & EXPLAIN ANALYZE',
      priority: 'medium',
      category: 'databases',
      status: 'partial',
      whyItMatters:
        'Demonstrates engineering maturity beyond basic CRUD operations during technical system design rounds.',
      suggestedProject:
        'Benchmark execution plans for 100,000 synthetic rows in PostgreSQL using compound B-Tree vs GIN indexes.',
      resources: [
        { title: 'Use The Index, Luke (SQL Indexing Guide)', url: 'https://use-the-index-luke.com/' },
      ],
      estimatedHours: '8-10 hours',
    },
  ];

  const gaps = currentAnalysis?.missingGaps && currentAnalysis.missingGaps.length > 0
    ? currentAnalysis.missingGaps.map((g) => ({
        skill: g.skill,
        priority: g.priority,
        category: 'core',
        status: 'missing',
        whyItMatters: g.importance,
        suggestedProject: g.suggestedProject,
        resources: [{ title: `${g.skill} Developer Resource Guide`, url: '#' }],
        estimatedHours: g.priority === 'high' ? '15-20 hours' : '8-12 hours',
      }))
    : defaultRoadmapItems;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                Skill Gap Analysis & Learning Roadmap
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Actionable Career Strategy
              </span>
            </div>
            <p className="text-xs text-gray-600 max-w-2xl">
              Identifies missing qualifications from your target job openings and structures a
              practical hands-on roadmap to bridge them without vague theory.
            </p>
          </div>

          <button
            onClick={() => navigateTo('analyzer')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Analyze Different Role
          </button>
        </div>
      </div>

      {/* Roadmap Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">
          Targeted Growth Modules ({gaps.length} Recommended Competencies)
        </h2>

        <div className="space-y-4">
          {gaps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-gray-300 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{item.skill}</h3>
                    <span className="text-[11px] text-gray-500">
                      Estimated Investment: {item.estimatedHours}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md tracking-wider ${
                    item.priority === 'high'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.priority} Priority
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Why It Matters */}
                <div className="p-3.5 bg-gray-50 rounded-xl space-y-1">
                  <span className="font-bold text-gray-700 block text-[11px] uppercase tracking-wider">
                    Why Recruiters Look for This
                  </span>
                  <p className="text-gray-600 leading-relaxed">{item.whyItMatters}</p>
                </div>

                {/* Practical Project Idea */}
                <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                  <span className="font-bold text-blue-900 block text-[11px] uppercase tracking-wider">
                    Suggested Verifiable Project
                  </span>
                  <p className="text-blue-800 leading-relaxed font-medium">
                    {item.suggestedProject}
                  </p>
                </div>
              </div>

              {/* Learning Resource Links */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <span className="font-bold text-gray-500 text-[11px] uppercase">
                  Curated Official Resources:
                </span>
                {item.resources.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span>{res.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
