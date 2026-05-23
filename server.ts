import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

if (key) {
  try {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY env variable found. Operating in local fallback mode.");
}

// Helper to sanitize JSON response from possible Markdown wrappers
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// 1. SCENARIO AGENT: NL -> Simulation parameters
app.post("/api/scenario", async (req, res) => {
  const { naturalLanguageInput } = req.body;

  if (!naturalLanguageInput) {
    return res.status(400).json({ error: "Missing naturalLanguageInput prompt" });
  }

  // Plausible fallback
  const fallback = {
    totalFans: 84000,
    weather: "Sudden Rain",
    weatherChangeAt: -15,
    matchType: "IPL Playoff Derby",
    arrivalCurve: "delayed-rush",
    unticketedFansEstimate: 1600
  };

  if (!ai) {
    console.log("Gemini client unavailable. Using fallback parameters.");
    return res.json(fallback);
  }

  try {
    const prompt = `Translate the following natural language crowd condition description into exact simulation settings.
Input prompt: "${naturalLanguageInput}"

Return a single JSON object containing:
- totalFans: integer (total seat volume, typically 60000 to 110000)
- weather: string (must be one of: "Sunny", "Rainy", "Sudden Rain", "Overcast")
- weatherChangeAt: integer (minutes relative to kick-off, usually between -30 and 15)
- matchType: string (short label for match phase, e.g. "IPL Eliminator", "IPL Championship Final")
- arrivalCurve: string (must be one of: "standard", "delayed-rush", "early-surge")
- unticketedFansEstimate: integer (estimate count of unticketed outside supporters, 500 to 8000)

Return ONLY valid JSON and nothing else. No markdown wrappers if possible, or clean markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalFans: { type: Type.INTEGER, description: "Total ticketed attendance capacity" },
            weather: { type: Type.STRING, description: "Sunny, Rainy, Sudden Rain, or Overcast" },
            weatherChangeAt: { type: Type.INTEGER, description: "Weather change trigger point in minutes" },
            matchType: { type: Type.STRING, description: "Derby match tier description" },
            arrivalCurve: { type: Type.STRING, description: "standard, delayed-rush, or early-surge" },
            unticketedFansEstimate: { type: Type.INTEGER, description: "Unticketed fan crowd outside" },
          },
          required: ["totalFans", "weather", "weatherChangeAt", "matchType", "arrivalCurve", "unticketedFansEstimate"],
        }
      }
    });

    const parsed = JSON.parse(cleanJsonString(response.text || ""));
    return res.json(parsed);
  } catch (error) {
    console.error("Gemini /api/scenario call failed, utilizing high-quality fallback:", error);
    return res.json(fallback);
  }
});

// 2. ANALYST AGENT: Identifies bottleneck risk zones
app.post("/api/analyze", async (req, res) => {
  const { totalFans, weather, bottleneckCount, averageWaitTime } = req.body;

  const fallback = {
    risks: [
      {
        location: "Gate 1 (North-East Entrance)",
        severity: weather === "Sudden Rain" ? 92 : 45,
        eta: "T-12 minutes remaining",
        reasoning: "High shelter demand creating severe crowd constriction at Gate 1."
      },
      {
        location: "Gate 4 (South Entrance)",
        severity: totalFans > 90000 ? 95 : 35,
        eta: "Ongoing accumulation",
        reasoning: "Unticketed accumulation forming localized outer queue crash."
      },
      {
        location: "Gate 2 (East Entrance)",
        severity: 20,
        eta: "Stable",
        reasoning: "Queues moving within normal administrative parameters."
      }
    ]
  };

  if (!ai) {
    return res.json(fallback);
  }

  try {
    const prompt = `You are NETRA's Lead Safety Analyst Agent. Evaluate the following stadium crowd parameters and return an array of risk assessments for the entrances:
- Total ticketed fans: ${totalFans}
- Current Weather: ${weather}
- Current active bottlenecks: ${bottleneckCount}
- Estimated Average Wait Time: ${averageWaitTime} mins

Return a JSON object with a single key "risks" containing an array of items, each with:
- location: string (Gate name, e.g. "Gate 1 (North-East)")
- severity: integer (0 to 100)
- eta: string (time remaining or status message, e.g. "T-15 mins remaining")
- reasoning: string (factual description of physical crowd behavior and choking reasons)

Be precise, objective, and realistic. Return ONLY JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  location: { type: Type.STRING },
                  severity: { type: Type.INTEGER },
                  eta: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ["location", "severity", "eta", "reasoning"],
              }
            }
          },
          required: ["risks"],
        }
      }
    });

    const parsed = JSON.parse(cleanJsonString(response.text || ""));
    return res.json(parsed);
  } catch (error) {
    console.error("Gemini /api/analyze failed:", error);
    return res.json(fallback);
  }
});

// 3. STRATEGIST AGENT: Propose interventions using function calling / schema structured tools
app.post("/api/strategize", async (req, res) => {
  const { currentMetrics, activeRisks } = req.body;

  const fallback = {
    interventions: [
      {
        id: 'open_gate_side',
        action: 'Open North-East Side Gate 1A',
        reasoning: 'Re-distributes entry density from Gate 1 to side turnstiles. Eliminates bottleneck within 4 minutes.',
        applied: false,
        preview: false,
      },
      {
        id: 'redirect_flow',
        action: 'Reroute 35% East Traffic to Gate 8',
        reasoning: 'Redistribute fans from high-congestion East sectors to low-density North sector using video boards & stewards.',
        applied: false,
        preview: false,
      },
      {
        id: 'preemp_push',
        action: 'Pre-emptive Security Placement at Gate 4',
        reasoning: 'Pre-positions 2 rapid security details and deploys physical queue barriers to prevent un-ticketed crowd formation.',
        applied: false,
        preview: false,
      }
    ]
  };

  if (!ai) {
    return res.json(fallback);
  }

  try {
    const prompt = `You are NETRA's Strategic Safety Dispatcher. Analyze active stadium risks and output exactly three tactical interventions to secure the crowd flow:
Risks list: ${JSON.stringify(activeRisks)}
Metrics snapshot: ${JSON.stringify(currentMetrics)}

Return a JSON object with key "interventions" containing exactly three items:
- id: string (unique identifier like "open_gate_side", "redirect_flow")
- action: string (bold specific directive label, e.g., "Deploy Stewards at Concourse 3B")
- reasoning: string (Gemini-explained reasoning justifying the physical fluid dynamics effect of this action)
- applied: false
- preview: false`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  action: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  applied: { type: Type.BOOLEAN },
                  preview: { type: Type.BOOLEAN },
                },
                required: ["id", "action", "reasoning", "applied", "preview"],
              }
            }
          },
          required: ["interventions"],
        }
      }
    });

    const parsed = JSON.parse(cleanJsonString(response.text || ""));
    return res.json(parsed);
  } catch (error) {
    console.error("Gemini /api/strategize failed:", error);
    return res.json(fallback);
  }
});

// 4. NARRATOR AGENT: Streaming plain-English briefing
app.post("/api/narrate", async (req, res) => {
  const { params, metrics, risks } = req.body;

  const fallbackText = `Commander, we are tracking ${params.totalFans.toLocaleString()} matches for the current ${params.matchType}. Currently, weather is set to ${params.weather}. 

1. Gate 1 bottleneck remains an immediate hazard. Crowds fleeing from rain are converging on covered turnstiles. Density ratios here are currently at critical levels, showing severe queuing.
2. Estimated administrative checkout queues average ${metrics.averageWaitTime} minutes, causing safety buffer erosion.
3. Recommend immediate deployment of side gate 1A to relieve back pressure. We project safety indices will restore to safe greens within 5 minutes of activation. Proceed with caution.`;

  if (!ai) {
    return res.json({ text: fallbackText });
  }

  try {
    const prompt = `Write a high-level concise pre-match commander directive briefing (3 short paragraphs) based on these parameters:
Params: ${JSON.stringify(params)}
Metrics: ${JSON.stringify(metrics)}
Active Risks: ${JSON.stringify(risks)}

Keep a calm, authoritative, decisive, and professional safety commander tone. Suggest specific numbers, times, and actions directly. Avoid any introductory pleasantries.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return res.json({ text: response.text || fallbackText });
  } catch (error) {
    console.error("Gemini /api/narrate failed:", error);
    return res.json({ text: fallbackText });
  }
});

// Setup Vite & API integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite Server Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Serving static production files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NETRA Failsafe Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
