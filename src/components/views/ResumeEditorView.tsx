import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResumeSheet } from '../resume/ResumeSheet';
import {
  TemplateId,
  PaperSize,
  FontFamily,
  Spacing,
  ResumeVersion,
} from '../../types';
import {
  SlidersHorizontal,
  Eye,
  Download,
  Printer,
  Sparkles,
  Copy,
  Save,
  Check,
  ChevronUp,
  ChevronDown,
  Layers,
  Palette,
  Type,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ArrowLeftRight,
  RefreshCw,
  Edit3,
  Trash2,
  AlertCircle,
  FileDown,
} from 'lucide-react';

export const ResumeEditorView: React.FC = () => {
  const {
    masterProfile,
    resumeVersions,
    activeResumeId,
    setActiveResumeId,
    getActiveResume,
    updateResumeVersion,
    duplicateResumeVersion,
    updateResumeFromMaster,
    navigateTo,
  } = useApp();

  const currentResume = getActiveResume();
  const [zoom, setZoom] = useState(1);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [compareMode, setCompareMode] = useState(false);
  const [compareResumeId, setCompareResumeId] = useState<string>(
    resumeVersions.find((r) => r.id !== activeResumeId)?.id || activeResumeId
  );
  const [activeEditorSection, setActiveEditorSection] = useState<string>('formatting');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // AI Assistant Inline Modal
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiTargetText, setAiTargetText] = useState('');
  const [aiTargetKey, setAiTargetKey] = useState<{ itemId?: string; bulletIdx?: number; isSummary?: boolean }>({});
  const [aiAction, setAiAction] = useState('action_verbs');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  if (!currentResume) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-gray-600">No active resume found.</p>
        <button onClick={() => navigateTo('dashboard')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<ResumeVersion>) => {
    updateResumeVersion(currentResume.id, updates);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentResume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentResume.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Section Reordering
  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const order = [...currentResume.sectionsOrder];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const temp = order[idx];
    order[idx] = order[targetIdx];
    order[targetIdx] = temp;
    handleUpdate({ sectionsOrder: order });
  };

  // Item Selection Toggle for this Resume
  const toggleItemSelection = (
    listKey:
      | 'selectedSkillIds'
      | 'selectedProjectIds'
      | 'selectedExperienceIds'
      | 'selectedEducationIds'
      | 'selectedCertIds'
      | 'selectedAdditionalIds',
    id: string
  ) => {
    const currentList = currentResume[listKey] || [];
    const updated = currentList.includes(id)
      ? currentList.filter((item) => item !== id)
      : [...currentList, id];
    handleUpdate({ [listKey]: updated });
  };

  // AI Assistant Trigger
  const triggerAiForText = (
    text: string,
    key: { itemId?: string; bulletIdx?: number; isSummary?: boolean },
    defaultAction = 'action_verbs'
  ) => {
    setAiTargetText(text);
    setAiTargetKey(key);
    setAiAction(defaultAction);
    setAiSuggestion(null);
    setAiAssistantOpen(true);
  };

  const runAiAssistance = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/assist-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: aiAction,
          text: aiTargetText,
          jobDescription: currentResume.targetJobDescription,
          context: {
            role: currentResume.targetRole,
            company: currentResume.targetCompany,
          },
        }),
      });
      const data = await response.json();
      setAiSuggestion(data.suggestion);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion?.revisedText) return;
    const revised = aiSuggestion.revisedText;

    if (aiTargetKey.isSummary) {
      handleUpdate({ tailoredSummary: revised });
    } else if (aiTargetKey.itemId && aiTargetKey.bulletIdx !== undefined) {
      const currentOverrides = { ...(currentResume.customBulletOverrides || {}) };
      const exp = masterProfile.experience.find((e) => e.id === aiTargetKey.itemId);
      const proj = masterProfile.projects.find((p) => p.id === aiTargetKey.itemId);
      const baseBullets = exp ? exp.responsibilities : proj ? [proj.description] : [];

      const activeBullets = currentOverrides[aiTargetKey.itemId]
        ? [...currentOverrides[aiTargetKey.itemId]]
        : [...baseBullets];

      activeBullets[aiTargetKey.bulletIdx] = revised;
      currentOverrides[aiTargetKey.itemId] = activeBullets;
      handleUpdate({ customBulletOverrides: currentOverrides });
    }
    setAiAssistantOpen(false);
  };

  const compareResume = resumeVersions.find((r) => r.id === compareResumeId) || resumeVersions[0];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Editor Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 no-print sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Resume Version Selector & Title */}
          <div className="flex items-center gap-3">
            <select
              value={currentResume.id}
              onChange={(e) => setActiveResumeId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none max-w-[240px] truncate"
            >
              {resumeVersions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>

            <span className="hidden sm:inline text-gray-300">|</span>

            <input
              type="text"
              value={currentResume.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="font-bold text-xs text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
              placeholder="Resume Name"
            />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Compare Toggle */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                compareMode
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Compare Mode
            </button>

            {/* Sync from Master Profile */}
            <button
              onClick={() => {
                updateResumeFromMaster(currentResume.id);
                setSavedFeedback(true);
                setTimeout(() => setSavedFeedback(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold transition"
              title="Add newly created skills/projects from master profile"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              Sync from Master
            </button>

            {/* Print / PDF Export */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={handleExportJSON}
              className="p-1.5 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg text-xs"
              title="Export structured JSON"
            >
              <FileDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden mt-3 border-t border-gray-100 pt-2 gap-2">
          <button
            onClick={() => setMobileTab('edit')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${
              mobileTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Edit Content & Layout
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${
              mobileTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Live Preview Sheet
          </button>
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Controls, Sections & Inline Bullet Customizer */}
          <div
            className={`lg:col-span-5 space-y-5 no-print ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Navigation Tabs for Controls */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 flex gap-1 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'formatting', label: 'Design & Style' },
                { id: 'sections', label: 'Section Order' },
                { id: 'content', label: 'Content Selection' },
                { id: 'bullets', label: 'AI Bullet Polish' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorSection(tab.id)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer flex-1 text-center ${
                    activeEditorSection === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Formatting & Design */}
            {activeEditorSection === 'formatting' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 shadow-xs">
                <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
                  Template & Typographic Hierarchy
                </h3>

                {/* Template Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Resume Template</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'modern', name: 'Modern', ats: 'High' },
                      { id: 'professional', name: 'Professional', ats: 'Very High' },
                      { id: 'technical', name: 'Technical', ats: 'High' },
                      { id: 'fresher', name: 'Fresher / Acad', ats: 'Very High' },
                      { id: 'executive', name: 'Executive', ats: 'High' },
                      { id: 'creative', name: 'Creative', ats: 'Standard' },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => handleUpdate({ templateId: tpl.id as TemplateId })}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          currentResume.templateId === tpl.id
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-bold text-gray-900 block">{tpl.name}</span>
                        <span className="text-[10px] text-gray-500">ATS: {tpl.ats}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paper Size & Font Family */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Paper Dimensions</label>
                    <select
                      value={currentResume.paperSize}
                      onChange={(e) => handleUpdate({ paperSize: e.target.value as PaperSize })}
                      className="w-full p-2 text-xs border border-gray-300 rounded-lg focus:outline-none"
                    >
                      <option value="a4">A4 (210 × 297 mm)</option>
                      <option value="letter">US Letter (8.5 × 11 in)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Font Family</label>
                    <select
                      value={currentResume.fontFamily}
                      onChange={(e) => handleUpdate({ fontFamily: e.target.value as FontFamily })}
                      className="w-full p-2 text-xs border border-gray-300 rounded-lg focus:outline-none"
                    >
                      <option value="sans">Clean Sans-Serif</option>
                      <option value="serif">Corporate Serif</option>
                      <option value="mono">Technical Monospace</option>
                    </select>
                  </div>
                </div>

                {/* Spacing & Density */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Content Density / Spacing</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['compact', 'normal', 'relaxed'] as Spacing[]).map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleUpdate({ spacing: sp })}
                        className={`py-2 px-3 rounded-lg border font-semibold capitalize text-center transition ${
                          currentResume.spacing === sp
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color Palette */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Accent Theme Color</label>
                  <div className="flex items-center gap-3">
                    {[
                      { name: 'Corporate Blue', hex: '#1d4ed8' },
                      { name: 'Navy Slate', hex: '#1e293b' },
                      { name: 'Teal Emerald', hex: '#0f766e' },
                      { name: 'Deep Burgundy', hex: '#831843' },
                      { name: 'Classic Black', hex: '#111827' },
                    ].map((col) => (
                      <button
                        key={col.hex}
                        onClick={() => handleUpdate({ accentColor: col.hex })}
                        style={{ backgroundColor: col.hex }}
                        className={`w-7 h-7 rounded-full transition transform cursor-pointer ${
                          currentResume.accentColor === col.hex
                            ? 'ring-4 ring-blue-300 scale-110'
                            : 'hover:scale-105'
                        }`}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Section Reordering */}
            {activeEditorSection === 'sections' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Arrange Resume Sections</h3>
                  <p className="text-xs text-gray-500">
                    Freshers typically prioritize Education & Projects first. Experienced pros lead with Experience.
                  </p>
                </div>

                <div className="space-y-2">
                  {currentResume.sectionsOrder.map((sec, idx) => (
                    <div
                      key={sec}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                    >
                      <span className="capitalize">{sec}</span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, 'up')}
                          className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === currentResume.sectionsOrder.length - 1}
                          onClick={() => moveSection(idx, 'down')}
                          className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Content Selection (Pick which master items appear) */}
            {activeEditorSection === 'content' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 shadow-xs">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Select Profile Entries for this Resume</h3>
                  <p className="text-xs text-gray-500">
                    Only checked items from your master profile will be included in this specific version.
                  </p>
                </div>

                {/* Tailored Summary Editor */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-800">Tailored Professional Summary</label>
                    <button
                      onClick={() =>
                        triggerAiForText(
                          currentResume.tailoredSummary || masterProfile.summary,
                          { isSummary: true },
                          'generate_summary'
                        )
                      }
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Rewrite Summary
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={currentResume.tailoredSummary || masterProfile.summary}
                    onChange={(e) => handleUpdate({ tailoredSummary: e.target.value })}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                {/* Skills Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-800 block">
                    Active Skills ({currentResume.selectedSkillIds.length}/{masterProfile.skills.length})
                  </span>
                  <div className="max-h-40 overflow-y-auto space-y-1 p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                    {masterProfile.skills.map((s) => {
                      const checked = currentResume.selectedSkillIds.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center gap-2 py-1 px-1.5 hover:bg-white rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleItemSelection('selectedSkillIds', s.id)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className={checked ? 'font-semibold text-gray-900' : 'text-gray-500'}>
                            {s.name} ({s.category})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Projects Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-800 block">
                    Active Projects ({currentResume.selectedProjectIds.length}/{masterProfile.projects.length})
                  </span>
                  <div className="space-y-1 text-xs">
                    {masterProfile.projects.map((p) => {
                      const checked = currentResume.selectedProjectIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-white hover:border-blue-300 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleItemSelection('selectedProjectIds', p.id)}
                            />
                            <span className="font-bold text-gray-800">{p.title}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {p.technologies.slice(0, 3).join(', ')}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Checkboxes */}
                {masterProfile.experience.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-800 block">
                      Active Experience ({currentResume.selectedExperienceIds.length}/{masterProfile.experience.length})
                    </span>
                    <div className="space-y-1 text-xs">
                      {masterProfile.experience.map((e) => {
                        const checked = currentResume.selectedExperienceIds.includes(e.id);
                        return (
                          <label
                            key={e.id}
                            className="flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-white hover:border-blue-300 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleItemSelection('selectedExperienceIds', e.id)}
                              />
                              <span className="font-bold text-gray-800">{e.role} • {e.company}</span>
                            </div>
                            <span className="text-[11px] text-gray-400">{e.startDate} - {e.endDate}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Inline Bullet Polish with AI Assistant */}
            {activeEditorSection === 'bullets' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Contextual Bullet Point Optimizer</h3>
                  <p className="text-xs text-gray-500">
                    Click any bullet to refine action verbs, conciseness, or technical clarity with AI.
                  </p>
                </div>

                {masterProfile.experience.map((exp) => (
                  <div key={exp.id} className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-800 block">
                      {exp.role} @ {exp.company}
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {exp.responsibilities.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-2.5 bg-gray-50 hover:bg-blue-50/50 border border-gray-200 rounded-lg flex items-start justify-between gap-2 transition"
                        >
                          <span className="text-gray-700 flex-1 leading-relaxed">{b}</span>
                          <button
                            onClick={() => triggerAiForText(b, { itemId: exp.id, bulletIdx: bIdx })}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 bg-white px-2 py-1 rounded border border-blue-200 shadow-2xs"
                          >
                            <Sparkles className="w-3 h-3" /> Polish
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Live Interactive Paper Preview */}
          <div
            className={`lg:col-span-7 flex flex-col items-center space-y-4 ${
              mobileTab === 'edit' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Zoom & Viewport Controls Bar */}
            <div className="w-full flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-2xs no-print text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">Preview Layout:</span>
                <span className="capitalize text-blue-700 font-semibold">{currentResume.templateId}</span>
                <span className="text-gray-400">•</span>
                <span className="uppercase text-gray-500">{currentResume.paperSize}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom((z) => Math.max(0.65, z - 0.1))}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-gray-700 text-xs px-1">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-2 py-1 rounded text-[11px] font-bold text-gray-600 hover:bg-gray-100 ml-1"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Side-by-Side Comparison Container or Single Sheet */}
            {compareMode ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-blue-700 bg-blue-50 p-2 rounded-lg text-center border border-blue-200">
                    Active: {currentResume.title}
                  </div>
                  <div className="overflow-x-auto p-2 bg-gray-200/60 rounded-xl flex justify-center">
                    <ResumeSheet profile={masterProfile} resume={currentResume} zoom={zoom * 0.7} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 bg-gray-100 p-2 rounded-lg border border-gray-200">
                    <span>Comparing With:</span>
                    <select
                      value={compareResumeId}
                      onChange={(e) => setCompareResumeId(e.target.value)}
                      className="text-xs bg-white border border-gray-300 rounded px-2 py-0.5"
                    >
                      {resumeVersions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="overflow-x-auto p-2 bg-gray-200/60 rounded-xl flex justify-center">
                    <ResumeSheet profile={masterProfile} resume={compareResume} zoom={zoom * 0.7} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto p-4 sm:p-6 bg-gray-200/70 rounded-2xl flex justify-center border border-gray-300 shadow-inner">
                <ResumeSheet profile={masterProfile} resume={currentResume} zoom={zoom} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Content Assistant Modal */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm">AI Content Assistant</h3>
                  <span className="text-[11px] text-gray-500">
                    Factual enhancement • No invented statistics
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Original Text */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Original Text
              </span>
              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed font-mono">
                {aiTargetText}
              </p>
            </div>

            {/* Action Selector */}
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Improvement Strategy
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'action_verbs', label: 'Action Verbs' },
                  { id: 'concise', label: 'Crisp & Concise' },
                  { id: 'professional_tone', label: 'Executive Tone' },
                  { id: 'ats_optimize', label: 'ATS Optimization' },
                  { id: 'tailor_to_job', label: 'Tailor to Role' },
                  { id: 'fix_grammar', label: 'Grammar Polish' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setAiAction(act.id)}
                    className={`p-2 rounded-lg border font-semibold text-center transition cursor-pointer ${
                      aiAction === act.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={runAiAssistance}
                disabled={aiLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Generate Suggestion
                  </>
                )}
              </button>
            </div>

            {/* AI Output preview */}
            {aiSuggestion && (
              <div className="space-y-3 pt-3 border-t border-gray-100 bg-blue-50/40 p-4 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-900">Revised Suggestion</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready to Apply
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={aiSuggestion.revisedText}
                  onChange={(e) =>
                    setAiSuggestion({ ...aiSuggestion, revisedText: e.target.value })
                  }
                  className="w-full p-2.5 text-xs bg-white border border-blue-300 rounded-lg focus:outline-none leading-relaxed"
                />

                <p className="text-[11px] text-gray-600 italic">
                  Rationale: {aiSuggestion.explanation}
                </p>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setAiAssistantOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Discard
                  </button>
                  <button
                    onClick={applyAiSuggestion}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Apply Revision
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
