import { GoogleGenAI } from "@google/genai";
import { Course, CourseModule, Source, LearningPath, PathNode, DifficultyLevel } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to extract H2 sections to create a "Step-by-Step" navigation structure
const parseModules = (markdown: string): CourseModule[] => {
  const lines = markdown.split('\n');
  const modules: CourseModule[] = [];
  let currentModule: CourseModule | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (currentModule) {
      currentModule.content = buffer.join('\n');
      modules.push(currentModule);
    }
    buffer = [];
    currentModule = null;
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      const title = line.replace('## ', '').trim();
      currentModule = {
        id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        content: line + '\n', // Keep the header in the content for context
      };
    } else {
      if (currentModule) {
        buffer.push(line);
      } else {
        // Content before the first H2 (Introduction)
        if (modules.length === 0 && buffer.length === 0 && line.trim().length > 0) {
           // Create an intro module implicitly if text starts before first H2
           currentModule = {
             id: 'intro',
             title: 'Market Analysis & Course Objectives',
             content: ''
           };
           buffer.push(line);
        } else if (currentModule) {
          buffer.push(line);
        }
      }
    }
  }
  flush();
  
  // If no H2s were found, treat the whole thing as one module
  if (modules.length === 0 && markdown.trim().length > 0) {
    modules.push({
      id: 'main',
      title: 'Course Guide',
      content: markdown
    });
  }

  return modules;
};

const getLevelInstructions = (level: DifficultyLevel) => {
  switch (level) {
    case 'Beginner':
      return `
        **Academic Level: Bachelor (Undergraduate)**
        Target Audience: Entry-level candidates targeting Junior Developer roles.
        **Job Market Criteria:** Focus on "Must Haves" for junior roles (Clean Syntax, Basic Git, Understanding HTTP/REST).
        **Research Base:** Cite foundational papers that established these fields (e.g., Codd's Relational Model).
        Pedagogy: "Scaffolding". Explain every term. Use analogies. The final output should be a portfolio-ready foundational project.
        **Industry Standard Compliance:**
        - Use the latest stable versions (e.g., Python 3.12+, Node.js 20+, React 19).
        - Avoid "tutorial hell" patterns; teach project directory structures used in production.
      `;
    case 'Intermediate':
      return `
        **Academic Level: Master (Graduate)**
        Target Audience: Mid-level Engineers aiming for Senior roles.
        **Job Market Criteria:** Focus on "System Design", "Scalability", and "Cloud-Native" requirements found in Series B+ startup job postings.
        **Research Base:** Cite architectural papers (e.g., "The Google File System", "Dynamo: Amazon's Key-Value Store").
        Pedagogy: "Applied Engineering". Skip syntax. Focus on trade-offs, testing, and production deployment (CI/CD, Docker).
        **Industry Standard Compliance:**
        - Mandate TypeScript, Rust, or strongly typed patterns.
        - Include unit testing (Jest/Vitest/PyTest) as mandatory steps in labs.
      `;
    case 'Advanced':
      return `
        **Academic Level: Ph.D. (Doctorate/Research)**
        Target Audience: Staff/Principal Engineers and Specialists.
        **Job Market Criteria:** Focus on "Deep Internals", "Optimization", and "Novel Architecture" found in FAANG Staff Engineer descriptions.
        **Research Base:** Heavily cite state-of-the-art papers (e.g., "Attention Is All You Need", "Raft Consensus").
        Pedagogy: "Research & Synthesis". Deep technical dive into how things work under the hood.
        **Industry Standard Compliance:**
        - Focus on high-performance computing, kernel-level optimizations, or large-scale distributed consensus.
        - Use state-of-the-art tooling (e.g., Kubernetes operators, eBPF, LLM fine-tuning).
      `;
  }
};

export const generateCourse = async (topic: string, level: DifficultyLevel): Promise<Course> => {
  try {
    const levelPrompt = getLevelInstructions(level);
    const prompt = `
      Act as a **Chief Technical Officer (CTO)** and **Distinguished Professor** at a top-tier research university (e.g., MIT, Stanford).

      **MISSION:**
      Design a **Lab-Centric Course Syllabus** for: "${topic}".
      
      **PHASE 1: DUAL-TRACK VALIDATION (Industry + Academia)**
      1. **Market Scan**: Search for "Senior ${topic} Job Description 2025" and "${topic} Engineering Blog Netflix/Uber".
      2. **Academic Scan**: Search for "**seminal research papers ${topic}**" and "top university syllabus ${topic}".
         - Identify the *core research* that drives the industry tools (e.g., "Attention Is All You Need" for Transformers, "Paxos" for Distributed Systems).

      **PHASE 2: CONTENT GENERATION**
      ${levelPrompt}

      **Strict Industry-Standard Compliance (2025 Edition):**
      You must strictly adhere to the current "Gold Standard" of the tech industry.
      1. **No Legacy Code**: Do not teach jQuery, plain PHP, Java Swing, or older .NET frameworks.
      2. **Modern Tooling**:
         - Web: React 19, Next.js 14/15, Tailwind CSS, Shadcn/UI.
         - Backend: Node.js (Hono/Express), Go, Rust, Python (FastAPI).
         - Data: Polars, PyTorch 2.x, DuckDB.
         - DevOps: Docker, Terraform, GitHub Actions.
      3. **Real-World Context**: Every lab must simulate a real ticket from a JIRA board.

      **Structure Requirements (Strict Markdown):**
      
      1. **Abstract & Alignment Strategy**: 
         - **Market Validity**: "Why Top Companies Hire For This" (Cite specific companies).
         - **Academic Basis**: Explicitly cite 1-2 **seminal papers** or standard textbooks that form the theoretical basis of this module.
      
      2. **Modules (Use H2 '##')**: Break the course into 4-6 rigorous "Lab Assignments". 
         *Naming Convention:* Use Academic Titles. (e.g., "## Lab 101: Environment Provisioning").
      
      3. **Content Format per Module**:
         *   **Theory (Research Backed)**: Explain the *why* using concepts from the seminal papers identified in Phase 1.
         *   **## LAB PROTOCOL (MANDATORY)**:
             *   **Objective**: Clear engineering goal.
             *   **Tooling Inventory (With Links)**: List specific tools. **You MUST provide direct URLs to the official 'Get Started' or 'Download' page for every tool mentioned.** (e.g. "[Download VS Code](https://code.visualstudio.com/)").
             *   **Blueprint**: Step-by-step commands and code.
             *   **Production Readiness Check**: A checklist to ensure the code is maintainable.
             
      4. **Capstone Challenge**: The final module is a "Final Exam Project".

      **Tone**: Distinguished, demanding, encouraging, and highly technical.
      **Format**: Strict Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No content generated.";
    
    // Extract sources from grounding metadata
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        sources.push({
          title: chunk.web.title,
          uri: chunk.web.uri
        });
      }
    });

    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    const modules = parseModules(text);

    return {
      id: Date.now().toString(),
      topic,
      level,
      rawContent: text,
      modules,
      sources: uniqueSources,
      createdAt: Date.now()
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate course. Please try again.");
  }
};

export const generateLearningPath = async (goal: string, level: DifficultyLevel): Promise<LearningPath> => {
  try {
    const prompt = `
      Act as the Dean of the "Institute of Applied Technology".
      Create a **Complete Career Trajectory (Zero-to-Hero)** for: "${goal}".
      
      **PHASE 1: MARKET & RESEARCH VALIDATION (Use Google Search)**
      1. Search for "${goal} Career Path 2025", "Top Skills for ${goal} on LinkedIn".
      2. Search for "Key Research Papers in ${goal}" to ensure the curriculum covers theoretical foundations.
      3. Ensure the curriculum aligns with what recruiters AND research labs are looking for.

      **PHASE 2: CURRICULUM ARCHITECTURE**
      **Input Context:** Student entering at **${level}** level.
      
      **Phase Breakdown:**
      1. **Bachelor Phase (Foundations)**: Syntax, Core Principles, "Junior Dev" requirements.
      2. **Master Phase (Architecture)**: System Architecture, Scaling, "Senior Dev" requirements.
      3. **Ph.D. Phase (Specialization)**: Novel research, Edge Cases, "Staff/Principal" requirements.
      4. **Career Placement Phase (Job Ready)**: 
         - **Resume Engineering**: How to list these skills to pass ATS (Applicant Tracking Systems).
         - **Whiteboard Interview Prep**: LeetCode patterns frequently asked by FAANG.
         - **System Design**: Designing systems like Netflix/Twitter.

      **Format Requirements:**
      Return strictly a **raw JSON object**. Do not use Markdown code blocks (no \`\`\`json).
      
      The JSON object must match this structure:
      {
        "pathTitle": "Formal Major Name (e.g., B.S. to Ph.D. in Computer Science)",
        "steps": [
          {
            "title": "Course Code: Course Name (e.g., BS-101: Intro to Rust)",
            "description": "Academic description of the course, mentioning key theories."
          }
        ]
      }

      1. **Course Codes**: Use 'BS-100', 'MS-500', 'PHD-800', 'JOB-900' prefixes.
      2. **Industry Relevance**: Ensure specific tech stacks are mentioned (e.g. "React 19", "Kubernetes").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema removed to support googleSearch tools
      },
    });

    let jsonStr = response.text || "{}";
    
    // Clean up if the model still wraps it in markdown despite instructions
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();

    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON from AI", jsonStr);
        throw new Error("Invalid JSON response from AI");
    }
    
    // Validation fallback
    if (!data.steps) data.steps = [];
    if (!data.pathTitle) data.pathTitle = goal;

    const nodes: PathNode[] = data.steps.map((step: any, index: number) => ({
      id: `node-${Date.now()}-${index}`,
      title: step.title,
      description: step.description,
      status: index === 0 ? 'unlocked' : 'locked',
    }));

    return {
      id: `path-${Date.now()}`,
      topic: data.pathTitle || goal,
      level, 
      nodes,
      createdAt: Date.now()
    };

  } catch (error) {
    console.error("Gemini Path Error:", error);
    throw new Error("Failed to generate learning path.");
  }
};