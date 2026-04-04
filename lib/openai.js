import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Shared System Prompt for structured JSON parsing.
 */
const SYSTEM_PROMPT = `You are an AI agent powered by OpenAI, acting as a clinical extraction engine with Memory. 
Your task is to analyze medical reports and generate structured insights. 

CONTEXT AWARENESS:
- You will be provided with the current report and a brief history of the patient's previous reports.
- Use this history to identify:
  * Recurring conditions (Persistent symptoms or diagnoses).
  * Changes over time (Progression or improvement).
  * Risk trends (Is the clinical situation stabilizing or deteriorating?).

SAFETY & COMPLIANCE (PHASE 8):
- You are an ANALYSIS SUPPORT TOOL ONLY.
- MedAI Results are NOT a substitute for professional medical judgment.
- Do NOT provide definitive medical advice or direct diagnoses.
- Do NOT prescribe medicines or suggest self-medication.
- Only analyze and compare the provided clinical text.
- Be strictly factual, objective, and neutral.

OUTPUT FORMAT (STRICT JSON ONLY, no markdown formatting, no codeblocks):
{
  "disease": "",
  "symptoms": [],
  "medications": [],
  "tests": [],
  "differences": [],
  "conflicts": [],
  "missing_tests": [],
  "risk_score": 0,
  "risk_level": "",
  "explanation": "Detailed explanation of findings and context-aware insights.",
  "summary": "Key recurring themes or new developments."
}

BEHAVIOR:
- Always return JSON only.
- Do not add extra text or markdown \`\`\`json wrappers.
- If data is missing or if this is a single report (no comparison possible), return empty values/arrays.
- Keep responses concise and accurate.
- Risk score is 0-100. Risk level is Low, Medium, or High.`;

/**
 * Extracts insights from a single report text with patient history context.
 */
export async function extractInsights(text, history = []) {
  try {
    const historyContext = history.length > 0 
      ? `\n\n--- [PATIENT CLINICAL HISTORY] ---\n${history.map(h => `Date: ${h.created_at}\nFindings: ${h.disease}\nSummary: ${h.summary}`).join('\n\n')}\n--- [END HISTORY] ---`
      : "\n\n(No clinical history available for this patient.)";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Please extract data from this medical report. Take into account the provided history to highlight any shifts or recurring patterns in the explanation/summary fields.\n\n[CURRENT REPORT]:\n${text}${historyContext}` 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Extraction Error:", error);
    throw new Error("Failed to process document through Neural Engine.");
  }
}

/**
 * Generates an embedding for clinical search.
 */
export async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("OpenAI Embedding Error:", error);
    throw error;
  }
}

/**
 * Compares two reports and generates differential insights.
 */
export async function compareReports(textA, textB) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Please compare the following TWO distinct medical reports.
Focus primarily on highlighting differences in diagnosis, conflicting medications, and any missing tests.
Generate a cohesive risk analysis and summary.

--- [REPORT ALPHA (Baseline)] ---
${textA}

--- [REPORT OMEGA (Latest)] ---
${textB}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Comparison Error:", error);
    throw new Error("Failed to generate longitudinal sync through Neural Engine.");
  }
}
