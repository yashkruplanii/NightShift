export function parseTimeToMinutes(timeStr: string): number {
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");
  
  const parts = clean.replace(/(AM|PM)/, "").trim().split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + (isNaN(minutes) ? 0 : minutes);
}

export function formatMinutesToTime(totalMinutes: number): string {
  const norm = Math.round(totalMinutes) % 1440;
  let hours = Math.floor(norm / 60);
  const mins = norm % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${paddedHours}:${paddedMins} ${ampm}`;
}

export function formatDurationHuman(totalMinutes: number): string {
  const roundMins = Math.max(1, Math.round(totalMinutes));
  if (roundMins < 60) {
    return `${roundMins} min`;
  }
  const hours = Math.floor(roundMins / 60);
  const mins = roundMins % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

export interface TimeExpandedConnection {
  fromNodeId: string;
  toNodeId: string;
  departureTimeMin: number;
  arrivalTimeMin: number;
  mode: 'walk' | 'bus' | 'emergency_auto' | 'haven_wait';
  segmentId?: string;
  durationMinutes: number;
  isLit: boolean;
  distanceMeters: number;
}

export function isDeadlineSatisfied(
  arrivalTimeMin: number,
  deadlineTimeMin: number
): boolean {
  return arrivalTimeMin <= deadlineTimeMin;
}

export function isBoardingFeasible(
  arrivalAtStopMin: number,
  scheduledDepartureMin: number,
  minimumTransferBufferMin: number = 2.0
): boolean {
  return (arrivalAtStopMin + minimumTransferBufferMin) <= scheduledDepartureMin;
}
