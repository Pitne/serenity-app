import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  collection,
  query,
  orderBy,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import type {
  UserProfileData,
  User,
  MeditationSessionData,
  MeditationSession,
  SleepLogData,
  SleepLog,
} from "../types/firebase.types";

// ─── Result types ─────────────────────────────────────────────────────────────

export interface FirestoreSuccess<T> {
  data: T;
  error: null;
}

export interface FirestoreError {
  data: null;
  error: string;
}

export type FirestoreResult<T> = FirestoreSuccess<T> | FirestoreError;

// ─── Collection path helpers ──────────────────────────────────────────────────

const usersCol = () => collection(firestore, "users");
const meditationCol = (userId: string) =>
  collection(firestore, "users", userId, "meditationSessions");
const sleepCol = (userId: string) =>
  collection(firestore, "users", userId, "sleepLogs");

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function createUserProfile(
  userId: string,
  data: UserProfileData
): Promise<FirestoreResult<void>> {
  try {
    await setDoc(doc(usersCol(), userId), {
      ...data,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { data: undefined, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create user profile.";
    return { data: null, error: message };
  }
}

export async function getUserProfile(
  userId: string
): Promise<FirestoreResult<User | null>> {
  try {
    const snapshot: DocumentSnapshot<DocumentData> = await getDoc(
      doc(usersCol(), userId)
    );
    if (!snapshot.exists()) {
      return { data: null, error: null };
    }
    const profile = { uid: snapshot.id, ...snapshot.data() } as User;
    return { data: profile, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch user profile.";
    return { data: null, error: message };
  }
}

// ─── Meditation Sessions ──────────────────────────────────────────────────────

export async function addMeditationSession(
  userId: string,
  session: MeditationSessionData
): Promise<FirestoreResult<string>> {
  try {
    const ref = await addDoc(meditationCol(userId), {
      ...session,
      createdAt: session.createdAt ?? new Date().toISOString(),
      _serverTimestamp: serverTimestamp(),
    });
    return { data: ref.id, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to add meditation session.";
    return { data: null, error: message };
  }
}

export async function getMeditationSessions(
  userId: string
): Promise<FirestoreResult<MeditationSession[]>> {
  try {
    const q = query(meditationCol(userId), orderBy("createdAt", "desc"));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const sessions: MeditationSession[] = snapshot.docs.map((d) => ({
      id: d.id,
      userId,
      ...(d.data() as MeditationSessionData),
    }));
    return { data: sessions, error: null };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch meditation sessions.";
    return { data: null, error: message };
  }
}

// ─── Sleep Logs ───────────────────────────────────────────────────────────────

export async function addSleepLog(
  userId: string,
  log: SleepLogData
): Promise<FirestoreResult<string>> {
  try {
    const ref = await addDoc(sleepCol(userId), {
      ...log,
      createdAt: log.createdAt ?? new Date().toISOString(),
      _serverTimestamp: serverTimestamp(),
    });
    return { data: ref.id, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to add sleep log.";
    return { data: null, error: message };
  }
}

export async function getSleepLogs(
  userId: string
): Promise<FirestoreResult<SleepLog[]>> {
  try {
    const q = query(sleepCol(userId), orderBy("createdAt", "desc"));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const logs: SleepLog[] = snapshot.docs.map((d) => ({
      id: d.id,
      userId,
      ...(d.data() as SleepLogData),
    }));
    return { data: logs, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch sleep logs.";
    return { data: null, error: message };
  }
}
