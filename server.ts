import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Support larger image payload sizes (e.g. photos up to 15MB)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(geminiApiKey),
    time: new Date().toISOString(),
  });
});

// Fallback generator if API key is not yet set or for offline testing
function generateDeterministicIncidentReport(text: string, hasImage: boolean) {
  const lower = text.toLowerCase();
  
  let incidentType = "General Emergency Incident";
  let severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "HIGH";
  let severityReasoning = "Unconfirmed hazards present immediate risk to civilian safety and traffic corridors.";
  let escalationReason = "Active situational ambiguity and potential for rapid escalation if scene is uncontained.";
  let primaryAuthority = "Municipal Emergency Management & Dispatch";
  let secondaryAuthorities = ["Local Police Department", "Public Works Department"];
  let dispatchProtocol = "Dispatch initial patrol unit for scene assessment and traffic diversion.";

  if (lower.includes("flood") || lower.includes("water") || lower.includes("submerg") || lower.includes("creek")) {
    incidentType = "Flash Flooding & Trapped Motorist Hazard";
    severity = lower.includes("occupant") || lower.includes("inside") || lower.includes("stalled") ? "HIGH" : "MEDIUM";
    severityReasoning = "Standing water exceeding vehicle clearance with potential trapped occupants and active hydrostatic pressure.";
    escalationReason = "Upstream runoff and rising water levels can rapidly float or submerge stalled passenger vehicles.";
    primaryAuthority = "Fire & Rescue Technical Water Extraction Unit";
    secondaryAuthorities = ["Department of Transportation / Road Maintenance", "Municipal Stormwater Drainage Division"];
    dispatchProtocol = "Immediate perimeter barricading; dispatch swift-water rescue-equipped engine company.";
  } else if (lower.includes("accident") || lower.includes("crash") || lower.includes("collision") || lower.includes("jammed") || lower.includes("fluid")) {
    incidentType = "Multi-Vehicle Collision with Fluid Hazard";
    severity = lower.includes("jammed") || lower.includes("trapped") ? "CRITICAL" : "HIGH";
    severityReasoning = "High-energy kinetic impact with structural passenger-compartment compromise and flammable coolant/oil ignition risks.";
    escalationReason = "Compromised passenger cabin with jammed door prevents self-extrication; pooling automotive fluids pose fire threat.";
    primaryAuthority = "Emergency Medical Services (EMS) & Fire Rescue";
    secondaryAuthorities = ["Traffic Division / Highway Patrol", "Hazmat Cleanup Unit"];
    dispatchProtocol = "Code 3 response: Rescue engine with hydraulic extrication tools and dual ALS ambulances.";
  } else if (lower.includes("wire") || lower.includes("electric") || lower.includes("tree") || lower.includes("arc") || lower.includes("spark")) {
    incidentType = "Downed High-Voltage Power Line & Tree Obstruction";
    severity = "CRITICAL";
    severityReasoning = "Active electrical arcing on ground and conductive perimeter fences creates lethal electrocution and secondary structure fire hazard.";
    escalationReason = "High-voltage conductive chain-link fence and wet roadway can transfer lethal current across a wide radius until grid de-energization.";
    primaryAuthority = "Municipal Fire Department (Electrical Hazard Response)";
    secondaryAuthorities = ["Regional Electric Utility Grid Operations", "Urban Forestry / Street Maintenance"];
    dispatchProtocol = "Urgent grid de-energization request to utility operations; establish 100-foot exclusionary perimeter.";
  }

  const priorityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

  const evidence = [
    {
      claim: lower.includes("wire") || lower.includes("electric")
        ? "Downed electrical conductors are actively energized and arcing."
        : lower.includes("flood") || lower.includes("water")
        ? "Roadway is submerged to hazardous depth with a stalled vehicle."
        : "Two passenger vehicles have sustained major impact with fluid leakage.",
      source: hasImage ? "User eyewitness report corroborated by photographic evidence" : "Direct bystander text report",
      confidence: "HIGH" as const,
      reasoning: lower.includes("wire") || lower.includes("electric")
        ? "Audible popping and visible sparks indicate active live electrical potential; grid isolation unconfirmed."
        : lower.includes("flood") || lower.includes("water")
        ? "Water level reaches above vehicle tire hubs, confirming clearance hazard."
        : "Fluid pooling and mechanical distortion visible on impacted chassis."
    },
    {
      claim: lower.includes("inside") || lower.includes("occupant") || lower.includes("jammed")
        ? "At least one individual remains inside a compromised vehicle."
        : "Immediate thoroughfare is completely obstructed to civilian transit.",
      source: "Eyewitness observational report",
      confidence: "MEDIUM" as const,
      reasoning: "Occupant observed through vehicle glass; vital status, consciousness, and physical injuries remain unconfirmed from distance."
    },
    {
      claim: "Sub-surface utilities or secondary hazards may be present in immediate vicinity.",
      source: "Incident environment baseline",
      confidence: "LOW" as const,
      reasoning: "Visual and textual report cannot confirm status of gas mains, storm sewer backflow, or energized grounding rods."
    }
  ];

  const recommendedImmediateActions = [
    {
      action: lower.includes("wire")
        ? "Establish a strict 100-foot exclusionary perimeter around downed wires and metal fences."
        : lower.includes("flood")
        ? "Establish physical barricades across both approach lanes to prevent entry into submerged underpass."
        : "Establish an exclusion zone uphill and upwind of leaking automotive fluids and jammed vehicle.",
      why: lower.includes("wire")
        ? "Downed lines present lethal step-potential electrocution across wet surfaces and metal fences."
        : lower.includes("flood")
        ? "Water depth conceals open drains, manholes, and vehicle buoyancy hazards."
        : "Leaking fuel or hot engine fluids create flammable vapor and fire ignition risk.",
      evidence: hasImage
        ? "Corroborated by scene photo and bystander account."
        : "Reported directly in eyewitness intake.",
      priority: "CRITICAL" as const,
    },
    {
      action: "Direct all bystanders and eyewitnesses to withdraw to a safe standoff distance.",
      why: "Civilian proximity risks secondary casualties from arcing, traffic collisions, or sudden chemical flash.",
      evidence: "Multiple curious onlookers reported in immediate proximity.",
      priority: "HIGH" as const,
    },
    {
      action: lower.includes("wire")
        ? "Coordinate emergency electric utility dispatch for immediate feeder grid de-energization."
        : lower.includes("flood")
        ? "Dispatch technical swift-water rescue team equipped with personal flotation devices and tethered craft."
        : "Dispatch hydraulic rescue unit (jaws of life) for passenger door extrication.",
      why: "Specialized tools and jurisdiction authority required to safely neutralize core hazard.",
      evidence: "Hazard cannot be safely mitigated with standard civilian or basic patrol equipment.",
      priority: "HIGH" as const,
    },
    {
      action: "Stage incoming emergency vehicles in a clear staging corridor outside the hazard radius.",
      why: "Prevents responder vehicles from blocking mutual aid or becoming entrapped in hazard zone.",
      evidence: "Roadway blockage and congestion reported on site.",
      priority: "MEDIUM" as const,
    }
  ].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  const bystanderActions = [
    {
      action: "Do not touch standing water, metallic fences, or vehicle chassis near the scene.",
      why: "Risk of step-potential electrocution or contamination.",
      evidence: "Direct observation of environmental contact with hazard.",
      priority: "CRITICAL" as const,
    },
    {
      action: "Instruct approaching motorists to stop and turn around safely.",
      why: "Prevents pile-up collisions or additional vehicles entering danger area.",
      evidence: "Active traffic corridor with reported blind turns or heavy congestion.",
      priority: "HIGH" as const,
    },
    {
      action: "Remain in a safe location until emergency responders arrive.",
      why: "Eyewitness presence provides continuity for responding incident commanders.",
      evidence: "Caller provides primary ground truth of incident progression.",
      priority: "MEDIUM" as const,
    }
  ].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  const responderActions = [
    {
      action: "Verify scene safety and confirm power grid / flow isolation before physical entry.",
      why: "First responder life safety directive against hidden electrical or chemical hazards.",
      evidence: "Active hazard state unconfirmed by utility/infrastructure operators.",
      priority: "CRITICAL" as const,
    },
    {
      action: "Conduct rapid triage on trapped vehicle occupants and assess extrication path.",
      why: "Immediate medical stability and airway management depend on fast access.",
      evidence: "Occupant reported inside damaged or stalled passenger vehicle.",
      priority: "HIGH" as const,
    },
    {
      action: "Deploy absorbent booms or containment dikes for hazardous liquid runoff.",
      why: "Prevents hazardous hydrocarbons from entering municipal storm drains.",
      evidence: "Fluid sheen pooling on asphalt.",
      priority: "MEDIUM" as const,
    }
  ].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  return {
    incidentType,
    summary: text.trim().slice(0, 320) + (text.trim().length > 320 ? "..." : ""),
    severity,
    severityReasoning,
    escalationReason,
    evidence,
    knownInformation: [
      `Directly reported incident: "${text.slice(0, 90).trim()}..."`,
      hasImage ? "Visual photographic attachment submitted confirming on-scene conditions" : "Text report provided by on-scene bystander",
      "Physical roadway blockage confirmed at reported site"
    ],
    uncertainInformation: [
      "Exact injury severity metrics and occupant vital signs",
      "Underground infrastructure damage status (gas/drainage/sub-grade)",
      "Exact mechanical stability of leaning or damaged objects"
    ],
    missingInformation: [
      "Precise GPS geolocation coordinates or cross-street mile marker",
      "Confirmation whether utility grid or feeder line has been de-energized",
      "Hazardous materials (placard / UN numbers) presence confirmation",
      "Vehicle registration/identification for notification of kin"
    ],
    verificationNeeded: [
      "Field check: Is the electrical grid / power line isolated or still hot?",
      "Medical check: Vital signs and consciousness status of vehicle occupants",
      "Environmental check: Water depth progression rate and storm drain suction status"
    ],
    potentialHazards: [
      lower.includes("wire") || lower.includes("electric") ? "Lethal step-potential electrocution from energized ground and metal fencing" : "Secondary collision risk from unalerted oncoming traffic",
      lower.includes("fluid") ? "Combustible hydrocarbon/coolant runoff and slippery roadway hazard" : "Environmental drainage overflow and structural asphalt degradation",
      "Crowd influx and bystander proximity to active hazard zone"
    ],
    peoplePropertyAffected: [
      lower.includes("occupant") || lower.includes("inside") ? "Vehicle occupants identified inside compromised vehicles" : "Motorists on affected transit corridor",
      "Blocked municipal thoroughfare preventing civilian passage",
      "Surrounding residential or commercial utility infrastructure"
    ],
    recommendedImmediateActions,
    bystanderActions,
    responderActions,
    relevantAuthorityCategory: {
      primary: primaryAuthority,
      secondary: secondaryAuthorities,
      dispatchProtocol
    },
    metadata: {
      analyzedAt: new Date().toISOString(),
      hasImageAttachment: hasImage,
      emergencyStatusNotice: "CrisisBridge provides AI-assisted decision support. Verify critical information with appropriate emergency services and trained responders."
    }
  };
}

// Main Analyze Incident Endpoint
app.post("/api/analyze-incident", async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ error: "Please provide either incident description text or an image." });
    }

    const reportText = typeof text === "string" ? text.trim() : "";
    const hasImage = Boolean(image && image.data);

    // If Gemini client is not initialized or no key, return high-fidelity fallback
    if (!ai) {
      console.warn("GEMINI_API_KEY not detected, using deterministic crisis intelligence engine.");
      const fallbackReport = generateDeterministicIncidentReport(reportText || "Unspecified visual emergency situation", hasImage);
      return res.json({ report: fallbackReport, isFallback: true });
    }

    const systemInstruction = `You are CrisisBridge AI, an emergency incident triage and intelligence synthesis engine.
Your mission is to act as a universal bridge transforming unstructured, messy bystander crisis reports and photographic evidence into structured, evidence-aware, actionable incident intelligence for dispatchers, incident commanders, and first responders.

CRITICAL OPERATIONAL SAFETY & FACTUAL RIGOR RULES:
1. NEVER invent facts. Base all assessments exclusively on the provided text report and photographic observations. Do not invent exact street addresses, casualties, authority names, weather conditions, or road conditions that were not actually provided.
2. NEVER present an assumption as a confirmed fact.
3. Every important observation or conclusion must be classified:
   - 'knownInformation': Strictly verified facts directly observed in the photo or stated unambiguously in the text.
   - 'uncertainInformation': Assumptions, estimates, hearsay, or ambiguous conditions requiring field corroboration.
   - 'missingInformation': Critical operational data currently unknown that emergency teams immediately need upon arrival (e.g. grid isolation status, patient vitals, chemical placard numbers).
4. Provide an 'evidence' layer for key claims:
   - claim: Specific factual conclusion
   - source: e.g. "User eyewitness description", "Photographic evidence", "User description + photographic evidence"
   - confidence: "HIGH", "MEDIUM", or "LOW"
   - reasoning: Why this claim is made and why that confidence level is assigned (e.g. "Visible arcing/sparking is consistent with an energized electrical hazard, but grid isolation cannot be confirmed from available data.").
5. For all recommended actions ('recommendedImmediateActions', 'bystanderActions', 'responderActions'):
   - action: Concise operational directive
   - why: Direct hazard explanation for why this action is needed
   - evidence: Specific report detail or visual evidence supporting this action
   - priority: "CRITICAL", "HIGH", "MEDIUM", or "LOW" (Critical safety actions must appear first).
6. Provide 'verificationNeeded': List of explicit on-scene physical checks needed to confirm uncertain facts.
7. Provide 'escalationReason': Concise operational analysis of why and how the incident could escalate if left uncontained.
8. Severity MUST be one of: "LOW", "MEDIUM", "HIGH", "CRITICAL".
9. Identify 'relevantAuthorityCategory' with 'primary' lead agency, 'secondary' mutual aid partners, and 'dispatchProtocol'.`;

    // Construct parts
    const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [];

    if (hasImage && image.data) {
      let base64Data = image.data;
      let mimeType = image.mimeType || "image/jpeg";

      if (base64Data.startsWith("data:")) {
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          // If svg+xml or plain url
          const commaIdx = base64Data.indexOf(",");
          if (commaIdx !== -1) {
            const header = base64Data.substring(0, commaIdx);
            const content = base64Data.substring(commaIdx + 1);
            if (header.includes("base64")) {
              base64Data = content;
            } else {
              // Convert plain encoded text (like encoded svg) to base64
              base64Data = Buffer.from(decodeURIComponent(content)).toString("base64");
              mimeType = "image/svg+xml";
            }
          }
        }
      }

      // Gemini supports standard image formats: image/jpeg, image/png, image/webp, image/heic, image/heif
      if (mimeType === "image/svg+xml") {
        try {
          const svgContent = Buffer.from(base64Data, "base64").toString("utf-8");
          parts.push({
            text: `[Attached Incident Photo/Visual SVG Schema Representation]:\n${svgContent.slice(0, 4000)}`
          });
        } catch {
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: "image/png"
            }
          });
        }
      } else {
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
    }

    parts.push({
      text: `Bystander Emergency Incident Report Input:\n${reportText || "(No written text provided, analyze the attached photo directly)"}`
    });

    const actionItemSchema = {
      type: Type.OBJECT,
      properties: {
        action: { type: Type.STRING, description: "Specific operational action directive" },
        why: { type: Type.STRING, description: "Tactical reason why this action is necessary" },
        evidence: { type: Type.STRING, description: "Specific observation or report detail supporting this action" },
        priority: { type: Type.STRING, description: "CRITICAL, HIGH, MEDIUM, or LOW" },
      },
      required: ["action", "why", "evidence", "priority"],
    };

    const modelConfig = {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          incidentType: {
            type: Type.STRING,
            description: "Concise formal incident classification (e.g., 'Flash Flooding & Trapped Motorist', 'Multi-Vehicle Collision with Fluid Leak')",
          },
          summary: {
            type: Type.STRING,
            description: "Concise 2-3 sentence executive summary of the emergency event.",
          },
          severity: {
            type: Type.STRING,
            description: "Severity tier: LOW, MEDIUM, HIGH, or CRITICAL",
          },
          severityReasoning: {
            type: Type.STRING,
            description: "Objective explanation justifying the assigned severity rating.",
          },
          escalationReason: {
            type: Type.STRING,
            description: "Analysis of how and why the incident could escalate if left uncontained.",
          },
          evidence: {
            type: Type.ARRAY,
            description: "Evidence and claim analysis. Every important conclusion classified with source, confidence, and reasoning.",
            items: {
              type: Type.OBJECT,
              properties: {
                claim: { type: Type.STRING, description: "Specific factual claim or deduction" },
                source: { type: Type.STRING, description: "Source of evidence: text, photo, or combination" },
                confidence: { type: Type.STRING, description: "HIGH, MEDIUM, or LOW" },
                reasoning: { type: Type.STRING, description: "Objective reasoning justifying the claim and confidence rating" },
              },
              required: ["claim", "source", "confidence", "reasoning"],
            },
          },
          knownInformation: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Confirmed observations directly witnessed or stated without assumption.",
          },
          uncertainInformation: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Assumptions, estimates, hearsay, or ambiguous conditions requiring corroboration.",
          },
          missingInformation: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Critical unknowns that emergency responders immediately need (e.g. power grid isolation, patient vitals, GPS).",
          },
          verificationNeeded: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific on-scene physical checks or measurements required to verify uncertain details.",
          },
          potentialHazards: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Potential acute hazards, secondary cascade risks, or environmental threats.",
          },
          peoplePropertyAffected: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key individuals, trapped victims, structures, or transit lines affected.",
          },
          recommendedImmediateActions: {
            type: Type.ARRAY,
            description: "Immediate prioritized response actions with why and evidence.",
            items: actionItemSchema,
          },
          bystanderActions: {
            type: Type.ARRAY,
            description: "Prioritized actions specifically for eyewitnesses and bystanders.",
            items: actionItemSchema,
          },
          responderActions: {
            type: Type.ARRAY,
            description: "Prioritized actions specifically for incoming emergency responders.",
            items: actionItemSchema,
          },
          relevantAuthorityCategory: {
            type: Type.OBJECT,
            properties: {
              primary: {
                type: Type.STRING,
                description: "Primary lead responding service (e.g. Fire & Rescue, EMS, Police, Electric Utility)",
              },
              secondary: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Supporting agencies needed on scene",
              },
              dispatchProtocol: {
                type: Type.STRING,
                description: "Recommended dispatch priority and equipment profile",
              },
            },
            required: ["primary", "dispatchProtocol"],
          },
        },
        required: [
          "incidentType",
          "summary",
          "severity",
          "severityReasoning",
          "evidence",
          "knownInformation",
          "uncertainInformation",
          "missingInformation",
          "potentialHazards",
          "peoplePropertyAffected",
          "recommendedImmediateActions",
          "relevantAuthorityCategory",
        ],
      },
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: { parts },
        config: modelConfig,
      });
    } catch (liteErr: any) {
      console.warn("gemini-3.1-flash-lite call failed, trying gemini-3.8-flash:", liteErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts },
        config: modelConfig,
      });
    }

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Empty response returned by Gemini model.");
    }

    const parsedData = JSON.parse(responseText);

    // Sort action arrays by priority: CRITICAL -> HIGH -> MEDIUM -> LOW
    const priorityWeights: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const sortActions = (items: any[]) => {
      if (!Array.isArray(items)) return [];
      return [...items].sort((a, b) => {
        const pA = priorityWeights[a?.priority?.toUpperCase()] ?? 9;
        const pB = priorityWeights[b?.priority?.toUpperCase()] ?? 9;
        return pA - pB;
      });
    };

    const finalReport = {
      ...parsedData,
      recommendedImmediateActions: sortActions(parsedData.recommendedImmediateActions),
      bystanderActions: sortActions(parsedData.bystanderActions),
      responderActions: sortActions(parsedData.responderActions),
      metadata: {
        analyzedAt: new Date().toISOString(),
        hasImageAttachment: hasImage,
        emergencyStatusNotice: "CrisisBridge provides AI-assisted decision support. Verify critical information with appropriate emergency services and trained responders.",
      },
    };

    return res.json({ report: finalReport, isFallback: false });
  } catch (error: any) {
    console.error("Error in /api/analyze-incident:", error);
    // On unexpected error, produce the safe deterministic report rather than stranding the user
    const text = req.body?.text || "Emergency incident report";
    const hasImage = Boolean(req.body?.image);
    const fallbackReport = generateDeterministicIncidentReport(text, hasImage);
    return res.json({
      report: fallbackReport,
      isFallback: true,
      errorNotice: error?.message || "Analysis processed using safety intelligence fallback.",
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CrisisBridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
