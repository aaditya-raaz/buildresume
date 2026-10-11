import React from 'react';
import {
  MasterProfile,
  ResumeVersion,
  TemplateId,
  PaperSize,
  FontFamily,
  Spacing,
} from '../../types';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Award,
  BookOpen,
} from 'lucide-react';

interface ResumeSheetProps {
  profile: MasterProfile;
  resume: ResumeVersion;
  zoom?: number;
  isPrintView?: boolean;
}

export const ResumeSheet: React.FC<ResumeSheetProps> = ({
  profile,
  resume,
  zoom = 1,
  isPrintView = false,
}) => {
  const {
    templateId = 'modern',
    paperSize = 'a4',
    fontFamily = 'sans',
    spacing = 'normal',
    accentColor = '#1d4ed8',
    sectionsOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    selectedSkillIds = [],
    selectedProjectIds = [],
    selectedExperienceIds = [],
    selectedEducationIds = [],
    selectedCertIds = [],
    selectedAdditionalIds = [],
    customBulletOverrides = {},
    tailoredSummary,
  } = resume;

  // Filter items selected for this specific tailored version
  const activeSkills = profile.skills.filter((s) => selectedSkillIds.includes(s.id));
  const activeProjects = profile.projects.filter((p) => selectedProjectIds.includes(p.id) && p.visible);
  const activeExperience = profile.experience.filter((e) => selectedExperienceIds.includes(e.id) && e.visible);
  const activeEducation = profile.education.filter((ed) => selectedEducationIds.includes(ed.id) && ed.visible);
  const activeCerts = profile.certifications.filter((c) => selectedCertIds.includes(c.id) && c.visible);
  const activeAdditional = profile.additional.filter((a) => selectedAdditionalIds.includes(a.id) && a.visible);

  const displaySummary = tailoredSummary || profile.summary;

  // Font family class
  const fontClass =
    fontFamily === 'serif'
      ? 'font-serif'
      : fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  // Spacing class
  const spacingStyles = {
    compact: {
      padding: 'p-6 sm:p-8',
      gap: 'space-y-3',
      sectionMargin: 'mb-3',
      itemMargin: 'mb-2',
      fontSize: 'text-xs',
      headingSize: 'text-sm font-bold',
      lineHeight: 'leading-snug',
    },
    normal: {
      padding: 'p-8 sm:p-10',
      gap: 'space-y-4',
      sectionMargin: 'mb-4',
      itemMargin: 'mb-3',
      fontSize: 'text-sm',
      headingSize: 'text-base font-bold',
      lineHeight: 'leading-normal',
    },
    relaxed: {
      padding: 'p-10 sm:p-12',
      gap: 'space-y-5',
      sectionMargin: 'mb-5',
      itemMargin: 'mb-4',
      fontSize: 'text-sm sm:text-base',
      headingSize: 'text-lg font-bold',
      lineHeight: 'leading-relaxed',
    },
  }[spacing];

  // Paper dimension
  const paperDimension =
    paperSize === 'letter'
      ? 'w-full max-w-[816px] min-h-[1056px]'
      : 'w-full max-w-[794px] min-h-[1123px]';

  // Helper for Section Heading
  const renderSectionHeader = (title: string) => {
    if (templateId === 'professional') {
      return (
        <div className="border-b border-gray-400 pb-1 mb-2">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-gray-900"
            style={{ letterSpacing: '0.08em' }}
          >
            {title}
          </h2>
        </div>
      );
    }

    if (templateId === 'technical') {
      return (
        <div className="flex items-center gap-2 mb-2 pb-1 border-b border-gray-200">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: accentColor }}
          />
          <h2
            className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900"
          >
            {title}
          </h2>
        </div>
      );
    }

    if (templateId === 'creative') {
      return (
        <div className="flex items-center gap-2 mb-2">
          <h2
            className="text-sm font-extrabold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            {title}
          </h2>
          <div className="flex-1 h-0.5 bg-gray-200" />
        </div>
      );
    }

    // Modern / Fresher / Executive default
    return (
      <div className="flex items-center gap-2 mb-2 pb-1 border-b" style={{ borderColor: `${accentColor}33` }}>
        <h2
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          {title}
        </h2>
      </div>
    );
  };

  // Section Renderers
  const renderSummarySection = () => {
    if (!displaySummary) return null;
    return (
      <section className={`resume-section ${spacingStyles.sectionMargin}`}>
        {renderSectionHeader('Professional Summary')}
        <p className={`${spacingStyles.fontSize} text-gray-700 text-justify ${spacingStyles.lineHeight}`}>
          {displaySummary}
        </p>
      </section>
    );
  };

  const renderSkillsSection = () => {
    if (activeSkills.length === 0) return null;

    // Categorized grouping
    const categories: Record<string, string[]> = {};
    activeSkills.forEach((s) => {
      const cat = s.category.charAt(0).toUpperCase() + s.category.slice(1);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(s.name);
    });

    if (templateId === 'technical') {
      return (
        <section className={`resume-section ${spacingStyles.sectionMargin}`}>
          {renderSectionHeader('Technical Skills & Proficiencies')}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(categories).map(([cat, skills]) => (
              <div key={cat} className="flex flex-col bg-gray-50/70 p-2 rounded border border-gray-100">
                <span className="font-semibold text-gray-800 text-[11px] uppercase tracking-wider">
                  {cat}:
                </span>
                <span className="text-gray-700 leading-snug font-mono text-[11px]">
                  {skills.join(' • ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className={`resume-section ${spacingStyles.sectionMargin}`}>
        {renderSectionHeader('Key Competencies & Technical Skills')}
        <div className="space-y-1.5 text-xs text-gray-800">
          {Object.entries(categories).map(([cat, skills]) => (
            <div key={cat} className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-semibold text-gray-900 text-xs min-w-[90px]">
                {cat}:
              </span>
              <span className="text-gray-700 leading-snug">
                {skills.join(', ')}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderExperienceSection = () => {
    if (activeExperience.length === 0) return null;
    return (
      <section className={`resume-section ${spacingStyles.sectionMargin}`}>
        {renderSectionHeader(
          templateId === 'executive' ? 'Executive & Leadership Experience' : 'Work Experience'
        )}
        <div className={spacingStyles.gap}>
          {activeExperience.map((exp) => {
            const bullets = customBulletOverrides[exp.id] || exp.responsibilities;
            return (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">{exp.role}</span>
                    <span className="text-gray-600 text-xs font-medium ml-1.5">
                      • {exp.company}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate} | {exp.location}
                  </div>
                </div>
                <ul className="list-disc ml-4 mt-1.5 space-y-1 text-gray-700 text-xs leading-relaxed">
                  {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderProjectsSection = () => {
    if (activeProjects.length === 0) return null;
    return (
      <section className={`resume-section ${spacingStyles.sectionMargin}`}>
        {renderSectionHeader(
          templateId === 'fresher' ? 'Selected Technical Projects' : 'Key Engineering Projects'
        )}
        <div className={spacingStyles.gap}>
          {activeProjects.map((proj) => {
            const customBullets = customBulletOverrides[proj.id];
            return (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{proj.title}</span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-xs text-gray-600 italic">
                        ({proj.technologies.slice(0, 5).join(', ')})
                      </span>
                    )}
                  </div>
                  {(proj.githubUrl || proj.projectUrl) && (
                    <span className="text-xs text-gray-500 font-mono">
                      {proj.githubUrl ? proj.githubUrl.replace('https://', '') : proj.projectUrl?.replace('https://', '')}
                    </span>
                  )}
                </div>

                {customBullets ? (
                  <ul className="list-disc ml-4 mt-1 text-gray-700 text-xs space-y-0.5 leading-relaxed">
                    {customBullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    {proj.description}{' '}
                    {proj.contribution && (
                      <span className="text-gray-800 font-medium">{proj.contribution} </span>
                    )}
                    {proj.outcomes && (
                      <span className="text-gray-900 font-semibold">{proj.outcomes}</span>
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderEducationSection = () => {
    if (activeEducation.length === 0) return null;
    return (
      <section className={`resume-section ${spacingStyles.sectionMargin}`}>
        {renderSectionHeader('Education')}
        <div className="space-y-2">
          {activeEducation.map((edu) => (
            <div key={edu.id} className="break-inside-avoid">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <div>
                  <span className="font-bold text-gray-900 text-sm">{edu.institution}</span>
                  <div className="text-xs text-gray-800 font-medium">
                    {edu.degree} in {edu.fieldOfStudy}
                    {edu.grade && <span className="text-gray-600 ml-1.5">• {edu.grade}</span>}
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="list-disc ml-4 mt-1 text-xs text-gray-600 space-y-0.5">
                  {edu.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertificationsSection = () => {
    if (activeCerts.length === 0) return null;
    return (
      <section className={`resume-section ${spacingStyles.sectionMargin}`}>
        {renderSectionHeader('Certifications & Credentials')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {activeCerts.map((cert) => (
            <div key={cert.id} className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-gray-900">{cert.name}</span>
                <span className="text-gray-600 block text-[11px]">{cert.issuer}</span>
              </div>
              <span className="text-gray-500 font-medium text-[11px] whitespace-nowrap ml-2">
                {cert.issueDate}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderAdditionalSection = () => {
    if (activeAdditional.length === 0) return null;
    return (
      <section className={`resume-section ${spacingStyles.sectionMargin}`}>
        {renderSectionHeader('Honors, Leadership & Extracurriculars')}
        <div className="space-y-1.5 text-xs">
          {activeAdditional.map((add) => (
            <div key={add.id} className="flex justify-between items-baseline">
              <div>
                <span className="font-semibold text-gray-900">{add.title}</span>
                <span className="text-gray-600 ml-1.5">• {add.organization}</span>
                <span className="text-gray-700 block text-[11px] mt-0.5">{add.description}</span>
              </div>
              <span className="text-gray-500 text-[11px] whitespace-nowrap ml-2">
                {add.date}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Section switcher based on custom reordering
  const renderSection = (type: string) => {
    switch (type) {
      case 'summary':
        return renderSummarySection();
      case 'skills':
        return renderSkillsSection();
      case 'experience':
        return renderExperienceSection();
      case 'projects':
        return renderProjectsSection();
      case 'education':
        return renderEducationSection();
      case 'certifications':
        return renderCertificationsSection();
      case 'additional':
        return renderAdditionalSection();
      default:
        return null;
    }
  };

  const { personalInfo } = profile;

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top center',
      }}
      className={`transition-transform duration-150 mx-auto`}
    >
      <div
        id="printable-resume"
        className={`${paperDimension} bg-white shadow-xl rounded-sm border border-gray-200 text-gray-900 ${fontClass} ${spacingStyles.padding} flex flex-col justify-between`}
      >
        <div>
          {/* Header Section */}
          <header className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900"
                  style={{ color: templateId === 'creative' ? accentColor : undefined }}
                >
                  {personalInfo.fullName}
                </h1>
                <p className="text-sm font-medium text-gray-600 mt-0.5">
                  {resume.targetRole || profile.careerInterests[0] || 'Software Professional'}
                </p>
              </div>

              {/* Contact Information */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 font-medium sm:text-right">
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    {personalInfo.email}
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {personalInfo.phone}
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center gap-1 text-blue-700">
                    <Linkedin className="w-3 h-3" />
                    {personalInfo.linkedin.replace('linkedin.com/in/', 'in/')}
                  </span>
                )}
                {personalInfo.github && (
                  <span className="flex items-center gap-1 text-gray-800">
                    <Github className="w-3 h-3" />
                    {personalInfo.github.replace('github.com/', '')}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Dynamic Sections in User-Defined Order */}
          <main className="space-y-1">
            {sectionsOrder.map((sectionKey) => (
              <React.Fragment key={sectionKey}>
                {renderSection(sectionKey)}
              </React.Fragment>
            ))}
          </main>
        </div>

        {/* Discreet ATS-friendly footer note (doesn't hurt ATS, provides subtle provenance) */}
        <footer className="pt-4 mt-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 no-print">
          <span>Formatted for ATS compatibility & recruiter review</span>
          <span>Buildresume • {resume.title}</span>
        </footer>
      </div>
    </div>
  );
};
