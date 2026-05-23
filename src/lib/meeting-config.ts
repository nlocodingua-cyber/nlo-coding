export interface MeetingType {
  id: string;
  duration: number; // minutes
}

export const MEETING_TYPES: MeetingType[] = [
  { id: "consultation", duration: 30 },
  { id: "mentoring", duration: 60 },
  { id: "audit", duration: 90 },
];

// Working hours in Europe/Lisbon (UTC offset applied in API)
export const WORKING_START_HOUR = 10; // 10:00
export const WORKING_END_HOUR = 18;   // 18:00
export const SLOT_STEP_MINUTES = 30;
