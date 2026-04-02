// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// ─── Meditation Session ───────────────────────────────────────────────────────

export type MeditationCategory =
  | "breathing"
  | "body_scan"
  | "visualization"
  | "mindfulness"
  | "sleep"
  | "other";

export interface MeditationSession {
  id: string;
  userId: string;
  category: MeditationCategory;
  durationSeconds: number;
  completedAt: string; // ISO 8601
  notes?: string;
  moodBefore?: MoodScore;
  moodAfter?: MoodScore;
  createdAt: string; // ISO 8601
}

/** Mood score scale from 1 (very bad) to 5 (very good) */
export type MoodScore = 1 | 2 | 3 | 4 | 5;

// ─── Sleep Log ────────────────────────────────────────────────────────────────

export type SleepQuality = "poor" | "fair" | "good" | "excellent";

export interface SleepLog {
  id: string;
  userId: string;
  bedtime: string;   // ISO 8601
  wakeTime: string;  // ISO 8601
  /** Total sleep duration in minutes */
  durationMinutes: number;
  quality: SleepQuality;
  notes?: string;
  createdAt: string; // ISO 8601
}

// ─── Firestore document shapes (used for Firestore read/write) ───────────────

/** Omit id & userId since Firestore manages them via document path */
export type MeditationSessionData = Omit<MeditationSession, "id" | "userId">;
export type SleepLogData = Omit<SleepLog, "id" | "userId">;
export type UserProfileData = Omit<User, "uid">;
