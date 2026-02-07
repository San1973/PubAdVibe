
export interface AuditResult {
  harmonyScore: number;
  deceptiveUIScan: {
    status: 'CLEAN' | 'THREAT_DETECTED';
    findings: string[];
  };
  rafPolicyViolation: {
    detected: boolean;
    details: string;
  };
  summary: string;
}

export interface AdItem {
  id: string;
  name: string;
  status: 'SCANNING' | 'SAFE' | 'BLOCKED';
  score: number;
  timestamp: string;
  result?: AuditResult;
  image?: string;
}

export enum SecurityStatus {
  SAFE = '#10B981',
  THREAT = '#EF4444',
  SCANNING = '#3B82F6',
}
