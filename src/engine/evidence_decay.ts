export type EpistemicStatus = 'KNOWN' | 'PROBABLE' | 'OUTDATED' | 'UNKNOWN';

export interface EvidenceRecord {
  id: string;
  source: string;
  observedAtMinutes: number; // e.g. 135 for 02:15 AM
  initialConfidence: number; // 0.0 to 1.0
  decayRateLambda: number;   // rate per minute
  verificationType: 'official_feed' | 'municipal_registry' | 'sensor_ping' | 'crowd_unverified';
  impactOfFailure: 'critical' | 'moderate' | 'low';
}

export interface DecayEvaluation {
  currentConfidence: number;
  epistemicStatus: EpistemicStatus;
  ageMinutes: number;
  uncertaintyMass: number;
  displayColor: string;
  badgeLabel: string;
}

/**
 * Computes dynamic evidence decay according to the FAROS mathematical specification:
 * q(t) = q_0 * exp(-lambda * (t - t_0))
 */
export function evaluateEvidenceFreshness(
  record: EvidenceRecord,
  currentClockMinutes: number,
  isNetworkSevered: boolean = false
): DecayEvaluation {
  // If network is artificially severed, accelerate aging by 3x to simulate missing pings
  const age = Math.max(0, currentClockMinutes - record.observedAtMinutes);
  const effectiveLambda = isNetworkSevered ? record.decayRateLambda * 3.5 : record.decayRateLambda;
  
  const currentConfidence = Math.max(0.01, Math.min(1.0, 
    record.initialConfidence * Math.exp(-effectiveLambda * age)
  ));

  let epistemicStatus: EpistemicStatus = 'UNKNOWN';
  let displayColor = '#64748B'; // slate
  let badgeLabel = 'UNKNOWN';

  if (currentConfidence >= 0.80 && age < 60) {
    epistemicStatus = 'KNOWN';
    displayColor = '#00F0FF'; // Electric Cyan
    badgeLabel = 'KNOWN';
  } else if (currentConfidence >= 0.50) {
    epistemicStatus = 'PROBABLE';
    displayColor = '#F59E0B'; // Warm Amber
    badgeLabel = 'PROBABLE';
  } else if (currentConfidence >= 0.20 || age >= 60) {
    epistemicStatus = 'OUTDATED';
    displayColor = '#EF4444'; // Red-orange
    badgeLabel = 'OUTDATED';
  } else {
    epistemicStatus = 'UNKNOWN';
    displayColor = '#8B5CF6'; // Purple void
    badgeLabel = 'UNKNOWN';
  }

  // Uncertainty mass U(r) as defined in FAROS objective
  const uncertaintyMass = Number((1.0 - currentConfidence).toFixed(3));

  return {
    currentConfidence: Number(currentConfidence.toFixed(3)),
    epistemicStatus,
    ageMinutes: age,
    uncertaintyMass,
    displayColor,
    badgeLabel
  };
}
