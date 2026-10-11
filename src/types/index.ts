export type RoleType = 'fresher' | 'experienced' | 'switcher' | 'student';

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  grade?: string;
  highlights?: string[];
  visible: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'languages' | 'frameworks' | 'tools' | 'cloud' | 'databases' | 'soft' | 'domain';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  problem: string;
  description: string;
  technologies: string[];
  contribution: string;
  outcomes?: string;
  projectUrl?: string;
  githubUrl?: string;
  visible: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  visible: boolean;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  url?: string;
  visible: boolean;
}

export interface AdditionalItem {
  id: string;
  type: 'award' | 'leadership' | 'publication' | 'volunteer' | 'extracurricular';
  title: string;
  organization: string;
  date: string;
  description: string;
  visible: boolean;
}

export interface MasterProfile {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    portfolio?: string;
  };
  summary: string;
  careerInterests: string[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  additional: AdditionalItem[];
}

export type TemplateId = 'professional' | 'modern' | 'technical' | 'fresher' | 'executive' | 'creative';
export type PaperSize = 'a4' | 'letter';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type Spacing = 'compact' | 'normal' | 'relaxed';

export interface ResumeVersion {
  id: string;
  title: string;
  targetRole: string;
  targetCompany?: string;
  targetJobDescription?: string;
  templateId: TemplateId;
  paperSize: PaperSize;
  fontFamily: FontFamily;
  spacing: Spacing;
  accentColor: string;
  sectionsOrder: string[];
  tailoredSummary?: string;
  selectedSkillIds: string[];
  selectedProjectIds: string[];
  selectedExperienceIds: string[];
  selectedEducationIds: string[];
  selectedCertIds: string[];
  selectedAdditionalIds: string[];
  customBulletOverrides?: Record<string, string[]>; // itemId -> bullets
  lastModified: string;
  compatibilityScore?: number;
}

export type ApplicationStatus = 'Interested' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  applicationDate: string;
  resumeVersionId: string;
  status: ApplicationStatus;
  jobDescription?: string;
  notes?: string;
  interviewDate?: string;
  salary?: string;
  url?: string;
}

export interface JobRequirement {
  skill: string;
  category: 'required' | 'preferred' | 'domain' | 'soft';
  status: 'matched' | 'partial' | 'missing' | 'needs_confirmation';
  explanation: string;
  matchedEvidence?: string;
}

export interface MissingSkillGap {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  importance: string;
  suggestedProject: string;
  learningResource: string;
}

export interface JobAnalysisResult {
  overallScore: number;
  scoreBreakdown: {
    requiredSkills: number;
    projectEvidence: number;
    keywordCoverage: number;
    qualifications: number;
  };
  summary: string;
  extractedRequirements: JobRequirement[];
  strengths: string[];
  missingGaps: MissingSkillGap[];
  atsTips: string[];
}
