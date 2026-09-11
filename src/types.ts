export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ActionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvidenceClaim {
  claim: string;
  source: string;
  confidence: ConfidenceLevel;
  reasoning: string;
}

export interface PrioritizedAction {
  action: string;
  why: string;
  evidence: string;
  priority: ActionPriority;
}

export interface AuthorityCategory {
  primary: string;
  secondary: string[];
  dispatchProtocol: string;
}

export interface VerificationCounts {
  confirmed: number;
  needsCheck: number;
  missing: number;
}

export interface IncidentReport {
  incidentType: string;
  summary: string;
  severity: SeverityLevel;
  severityReasoning: string;
  escalationReason?: string;
  
  // Evidence & Claim Analysis layer
  evidence: EvidenceClaim[];
  
  // Verification matrix
  knownInformation: string[];
  uncertainInformation: string[];
  missingInformation: string[];
  verificationNeeded?: string[];

  potentialHazards: string[];
  peoplePropertyAffected: string[];
  
  // Prioritized Actions with Why and Evidence
  recommendedImmediateActions: PrioritizedAction[];
  bystanderActions?: PrioritizedAction[];
  responderActions?: PrioritizedAction[];

  relevantAuthorityCategory: AuthorityCategory;
  
  metadata: {
    analyzedAt: string;
    hasImageAttachment: boolean;
    emergencyStatusNotice: string;
  };
}

export interface DemoExample {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  text: string;
  imageData?: {
    dataUrl: string;
    mimeType: string;
    filename: string;
  };
}
