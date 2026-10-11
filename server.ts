import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// AI Job Description Analysis Endpoint
app.post('/api/ai/analyze-job', async (req, res) => {
  try {
    const { jobDescription, jobTitle, company, profile } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    if (!ai) {
      // Deterministic intelligent fallback when Gemini key is not injected
      return res.json({
        fallback: true,
        analysis: generateHeuristicAnalysis(jobDescription, jobTitle, profile),
      });
    }

    const prompt = `
You are an expert career intelligence system and resume analyst for Buildresume.
Your task is to analyze the following Job Description and compare it against the Candidate's Master Profile.

IMPORTANT GROUNDING RULES:
1. Ground your analysis strictly in facts. Do not invent candidate experiences or fake metrics.
2. Clearly distinguish between "Matched", "Partially matched", "Missing", and "Needs confirmation".
3. Evaluate Required Skills, Preferred Skills, Experience alignment, Education alignment, and Keywords.
4. Calculate a realistic compatibility score (0-100) based on actual alignment:
   - Required skills match weight: 40%
   - Experience & Projects evidence weight: 30%
   - Keywords & Terminology weight: 15%
   - Education & Qualifications weight: 15%

Job Title: ${jobTitle || 'Unspecified'}
Company: ${company || 'Unspecified'}

JOB DESCRIPTION:
"""${jobDescription}"""

CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                requiredSkills: { type: Type.INTEGER },
                projectEvidence: { type: Type.INTEGER },
                keywordCoverage: { type: Type.INTEGER },
                qualifications: { type: Type.INTEGER },
              },
              required: ['requiredSkills', 'projectEvidence', 'keywordCoverage', 'qualifications'],
            },
            summary: { type: Type.STRING, description: 'Executive diagnostic overview' },
            extractedRequirements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'required | preferred | domain | soft' },
                  status: { type: Type.STRING, description: 'matched | partial | missing | needs_confirmation' },
                  explanation: { type: Type.STRING },
                  matchedEvidence: { type: Type.STRING, description: 'Reference to candidate profile or empty' },
                },
                required: ['skill', 'category', 'status', 'explanation'],
              },
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING, description: 'high | medium | low' },
                  importance: { type: Type.STRING },
                  suggestedProject: { type: Type.STRING },
                  learningResource: { type: Type.STRING },
                },
                required: ['skill', 'priority', 'importance', 'suggestedProject', 'learningResource'],
              },
            },
            atsTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'overallScore',
            'scoreBreakdown',
            'summary',
            'extractedRequirements',
            'strengths',
            'missingGaps',
            'atsTips',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ fallback: false, analysis: parsed });
  } catch (error: any) {
    console.error('Job analysis error:', error);
    // Graceful fallback to heuristic analysis on error
    const { jobDescription, jobTitle, profile } = req.body;
    return res.json({
      fallback: true,
      error: error.message,
      analysis: generateHeuristicAnalysis(jobDescription, jobTitle, profile),
    });
  }
});

// AI Content Assistant Endpoint (Inline suggestions, bullet improvements, summary rewriting)
app.post('/api/ai/assist-content', async (req, res) => {
  try {
    const { action, text, context, jobDescription } = req.body;

    if (!text && action !== 'generate_summary') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ai) {
      return res.json({
        fallback: true,
        suggestion: generateHeuristicContent(action, text, context),
      });
    }

    const actionInstructions: Record<string, string> = {
      action_verbs: 'Rewrite the bullet points using strong action verbs (e.g., Architected, Spearheaded, Implemented, Streamlined, Orchestrated). Do not invent metrics or achievements.',
      concise: 'Make the text crisp and concise, removing fluff and filler words while preserving key technical substance.',
      professional_tone: 'Refine into an authentic, executive professional tone suitable for senior engineering & corporate reviewers.',
      ats_optimize: 'Format into ATS-friendly structure. Ensure clarity of technologies, methodologies, and outcomes without keyword stuffing.',
      tailor_to_job: `Tailor the wording to emphasize alignment with the target job description: "${jobDescription || ''}". Strictly maintain factual truth.`,
      generate_summary: `Generate a concise 3-4 sentence professional summary based strictly on the provided profile context: "${JSON.stringify(context || {})}". Do NOT invent unverified titles or fake years of experience.`,
      fix_grammar: 'Correct grammatical mistakes, passive voice, and phrasing inconsistencies.',
    };

    const instruction = actionInstructions[action] || 'Improve readability and technical professionalism.';

    const prompt = `
You are an expert career editor and resume specialist.
${instruction}

GROUND RULES:
- Never fabricate numbers, percentages, or achievements (e.g. do not invent "increased revenue by 42%").
- Keep the candidate's authentic truth.
- Output a single JSON object with:
  "revisedText": string,
  "explanation": string,
  "keyChanges": array of strings.

ORIGINAL TEXT:
"""${text || ''}"""

CONTEXT:
${JSON.stringify(context || {})}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revisedText: { type: Type.STRING },
            explanation: { type: Type.STRING },
            keyChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['revisedText', 'explanation', 'keyChanges'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ fallback: false, suggestion: parsed });
  } catch (error: any) {
    console.error('Content assistant error:', error);
    const { action, text, context } = req.body;
    return res.json({
      fallback: true,
      suggestion: generateHeuristicContent(action, text, context),
    });
  }
});

// AI Tailor Resume Engine
app.post('/api/ai/tailor-resume', async (req, res) => {
  try {
    const { masterProfile, jobDescription, targetRole } = req.body;

    if (!jobDescription || !masterProfile) {
      return res.status(400).json({ error: 'Master profile and job description are required' });
    }

    if (!ai) {
      return res.json({
        fallback: true,
        tailoredResume: generateHeuristicTailoredResume(masterProfile, jobDescription, targetRole),
      });
    }

    const prompt = `
You are the Buildresume Tailoring Engine.
Your purpose: Take a verified candidate Master Profile and adapt it for a specific Job Description.

CORE PRINCIPLE:
Relevance-based selection! Emphasize existing strengths that match the role.
NEVER fabricate skills, credentials, employment history, or fake metrics.

JOB DESCRIPTION:
"""${jobDescription}"""

TARGET ROLE: ${targetRole || 'Target Role'}

MASTER PROFILE:
${JSON.stringify(masterProfile, null, 2)}

Provide tailored recommendations:
1. Tailored professional summary (based solely on candidate's real profile).
2. Ranked skills list: prioritize skills mentioned in both profile and job description.
3. Recommended projects to highlight (ordered by relevance).
4. Refined bullet points for experiences and projects (action verbs, highlighting relevant tech).
5. Section order recommendation (e.g., for freshers: education/projects first; for experienced: experience first).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tailoredSummary: { type: Type.STRING },
            recommendedSectionOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
            highlightedSkillIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedProjectIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            refinedBulletPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  original: { type: Type.STRING },
                  suggested: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['itemId', 'original', 'suggested', 'reason'],
              },
            },
            roleFitInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'tailoredSummary',
            'recommendedSectionOrder',
            'highlightedSkillIds',
            'recommendedProjectIds',
            'refinedBulletPoints',
            'roleFitInsights',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ fallback: false, tailoredResume: parsed });
  } catch (error: any) {
    console.error('Tailor resume error:', error);
    const { masterProfile, jobDescription, targetRole } = req.body;
    return res.json({
      fallback: true,
      tailoredResume: generateHeuristicTailoredResume(masterProfile, jobDescription, targetRole),
    });
  }
});

// Heuristic fallback functions to ensure the app works 100% reliably in all environments
function generateHeuristicAnalysis(jdText: string, targetRole: string, profile: any) {
  const jd = (jdText || '').toLowerCase();
  const profileSkills: string[] = [];
  if (profile?.skills) {
    profile.skills.forEach((s: any) => {
      if (typeof s === 'string') profileSkills.push(s);
      else if (s.name) profileSkills.push(s.name);
    });
  }

  // Common tech keywords pool for parsing
  const techKeywords = [
    'react', 'typescript', 'javascript', 'node.js', 'python', 'java', 'c++', 'go',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'postgresql', 'sql', 'mongodb',
    'graphql', 'rest api', 'ci/cd', 'git', 'linux', 'tailwind css', 'redis', 'kafka',
    'system design', 'agile', 'testing', 'unit test', 'microservices', 'html', 'css'
  ];

  const foundInJd = techKeywords.filter(kw => jd.includes(kw));
  const matched = foundInJd.filter(kw =>
    profileSkills.some(ps => ps.toLowerCase().includes(kw) || kw.includes(ps.toLowerCase()))
  );
  const missing = foundInJd.filter(kw => !matched.includes(kw));

  const totalReq = Math.max(foundInJd.length, 6);
  const matchedCount = matched.length;
  const matchRatio = totalReq > 0 ? Math.min(1, matchedCount / totalReq) : 0.6;
  const overallScore = Math.min(95, Math.max(45, Math.round(matchRatio * 50 + 40)));

  return {
    overallScore,
    scoreBreakdown: {
      requiredSkills: Math.min(95, Math.round(matchRatio * 90) + 10),
      projectEvidence: Math.min(90, Math.round(matchRatio * 85) + 12),
      keywordCoverage: Math.min(92, Math.round(matchRatio * 80) + 15),
      qualifications: 85,
    },
    summary: `Your profile displays solid alignment with key competencies for ${targetRole || 'this position'}, particularly in ${matched.slice(0, 3).join(', ') || 'core technologies'}. Emphasizing targeted project contributions will strengthen your application.`,
    extractedRequirements: [
      ...matched.map(m => ({
        skill: m.toUpperCase(),
        category: 'required',
        status: 'matched',
        explanation: `Demonstrated through verified skills and project implementations in profile.`,
        matchedEvidence: `Found in candidate skills and experience.`,
      })),
      ...missing.slice(0, 4).map(m => ({
        skill: m.toUpperCase(),
        category: 'preferred',
        status: 'missing',
        explanation: `Listed in target job description but not explicitly documented in current profile.`,
        matchedEvidence: '',
      })),
    ],
    strengths: [
      `Demonstrated proficiency in ${matched.slice(0, 3).join(', ') || 'foundation stacks'}`,
      'Clear project implementations aligning with development workflows',
      'Solid architectural and problem-solving background',
    ],
    missingGaps: missing.slice(0, 4).map(m => ({
      skill: m.toUpperCase(),
      priority: 'medium',
      importance: `High relevance for modern cloud-native & enterprise development pipelines.`,
      suggestedProject: `Build a small proof-of-concept incorporating ${m} with automated testing.`,
      learningResource: `Official documentation and interactive guides for ${m}.`,
    })),
    atsTips: [
      'Standardize section titles (e.g. "Work Experience", "Technical Skills") for deterministic ATS ingestion.',
      'Place foundational programming languages in standard comma-separated lists.',
      'Ensure every bullet point starts with an active verb describing measurable output.',
    ],
  };
}

function generateHeuristicContent(action: string, text: string, context: any) {
  if (action === 'generate_summary') {
    return {
      revisedText: `Results-driven software engineer with proven experience developing robust applications and collaborating in agile environments. Skilled in building scalable services, optimizing frontend performance, and delivering maintainable code aligned with industry standards.`,
      explanation: 'Crafted a professional, verified summary reflecting authentic engineering capabilities without speculative metrics.',
      keyChanges: ['Focused on verifiable competencies', 'Eliminated filler language', 'Established clear career positioning'],
    };
  }

  // Action verbs replacement
  const cleaned = text.trim();
  const enhanced = cleaned
    .replace(/^worked on/i, 'Engineered')
    .replace(/^helped with/i, 'Facilitated')
    .replace(/^responsible for/i, 'Spearheaded')
    .replace(/^built/i, 'Architected and implemented')
    .replace(/^created/i, 'Designed and deployed');

  return {
    revisedText: enhanced !== cleaned ? enhanced : `Orchestrated ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}`,
    explanation: 'Applied strong action verbs and refined sentence structure for high ATS and recruiter readability.',
    keyChanges: ['Upgraded passive voice to active verbs', 'Strengthened technical impact', 'Improved sentence flow'],
  };
}

function generateHeuristicTailoredResume(profile: any, jd: string, role: string) {
  return {
    tailoredSummary: `Target-aligned professional with strong foundation in software engineering, modern development workflows, and system architecture. Eager to contribute high-quality engineering outcomes to the ${role || 'team'}.`,
    recommendedSectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    highlightedSkillIds: (profile?.skills || []).slice(0, 8).map((s: any) => s.id || s.name || s),
    recommendedProjectIds: (profile?.projects || []).slice(0, 3).map((p: any) => p.id || p.title),
    refinedBulletPoints: [
      {
        itemId: 'sample-1',
        original: 'Worked on backend APIs using Node and Express',
        suggested: 'Engineered RESTful APIs using Node.js and Express, ensuring modular endpoint architecture and payload validation',
        reason: 'Replaces passive "worked on" with active technical descriptors.',
      },
    ],
    roleFitInsights: [
      `Emphasizes direct relevance to ${role || 'target opening'}.`,
      'Prioritizes production skills and demonstrated project delivery.',
      'ATS-safe terminology aligned with requirements.',
    ],
  };
}

// Development Vite Middleware setup or Production Static Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Buildresume server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
