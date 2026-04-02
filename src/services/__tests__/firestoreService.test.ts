import {
  createUserProfile,
  getUserProfile,
  addMeditationSession,
  getMeditationSessions,
  addSleepLog,
  getSleepLogs,
} from "../firestoreService";
import type {
  UserProfileData,
  MeditationSessionData,
  SleepLogData,
} from "../../types/firebase.types";

// ─── Mock firebase/firestore ──────────────────────────────────────────────────

const mockSetDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockGetDocs = jest.fn();

jest.mock("firebase/firestore", () => ({
  doc: jest.fn((...args: unknown[]) => ({ _path: args.join("/") })),
  collection: jest.fn((...args: unknown[]) => ({ _col: args.join("/") })),
  query: jest.fn((...args: unknown[]) => ({ _query: args })),
  orderBy: jest.fn((field: string, dir: string) => ({ field, dir })),
  serverTimestamp: jest.fn(() => "SERVER_TIMESTAMP"),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
}));

// ─── Mock ../config/firebase ──────────────────────────────────────────────────

jest.mock("../../config/firebase", () => ({
  firestore: {},
}));

// ─── Test data ────────────────────────────────────────────────────────────────

const TEST_USER_ID = "user-abc-123";

const mockUserProfile: UserProfileData = {
  email: "test@serenity.app",
  phoneNumber: null,
  displayName: "Test User",
  photoURL: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const mockSessionData: MeditationSessionData = {
  category: "breathing",
  durationSeconds: 600,
  completedAt: "2026-04-01T10:00:00.000Z",
  moodBefore: 3,
  moodAfter: 5,
  createdAt: "2026-04-01T10:10:00.000Z",
};

const mockSleepLogData: SleepLogData = {
  bedtime: "2026-04-01T22:00:00.000Z",
  wakeTime: "2026-04-02T06:00:00.000Z",
  durationMinutes: 480,
  quality: "good",
  createdAt: "2026-04-02T06:05:00.000Z",
};

// ─── createUserProfile ────────────────────────────────────────────────────────

describe("createUserProfile", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls setDoc and returns success", async () => {
    mockSetDoc.mockResolvedValueOnce(undefined);

    const result = await createUserProfile(TEST_USER_ID, mockUserProfile);

    expect(result.error).toBeNull();
    expect(result.data).toBeUndefined();
    expect(mockSetDoc).toHaveBeenCalledTimes(1);
  });

  it("returns error when setDoc throws", async () => {
    mockSetDoc.mockRejectedValueOnce(new Error("Permission denied."));

    const result = await createUserProfile(TEST_USER_ID, mockUserProfile);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Permission denied.");
  });

  it("returns fallback error string when non-Error is thrown", async () => {
    mockSetDoc.mockRejectedValueOnce("unknown");

    const result = await createUserProfile(TEST_USER_ID, mockUserProfile);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Failed to create user profile.");
  });
});

// ─── getUserProfile ───────────────────────────────────────────────────────────

describe("getUserProfile", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns user profile when document exists", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      id: TEST_USER_ID,
      data: () => mockUserProfile,
    });

    const result = await getUserProfile(TEST_USER_ID);

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ uid: TEST_USER_ID, ...mockUserProfile });
  });

  it("returns null data when document does not exist", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false,
      id: TEST_USER_ID,
      data: () => null,
    });

    const result = await getUserProfile(TEST_USER_ID);

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it("returns error when getDoc throws", async () => {
    mockGetDoc.mockRejectedValueOnce(new Error("Network error."));

    const result = await getUserProfile(TEST_USER_ID);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Network error.");
  });
});

// ─── addMeditationSession ────────────────────────────────────────────────────

describe("addMeditationSession", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns new document id on success", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "session-001" });

    const result = await addMeditationSession(TEST_USER_ID, mockSessionData);

    expect(result.error).toBeNull();
    expect(result.data).toBe("session-001");
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it("returns error when addDoc throws", async () => {
    mockAddDoc.mockRejectedValueOnce(new Error("Quota exceeded."));

    const result = await addMeditationSession(TEST_USER_ID, mockSessionData);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Quota exceeded.");
  });

  it("returns fallback error string when non-Error is thrown", async () => {
    mockAddDoc.mockRejectedValueOnce(42);

    const result = await addMeditationSession(TEST_USER_ID, mockSessionData);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Failed to add meditation session.");
  });
});

// ─── getMeditationSessions ───────────────────────────────────────────────────

describe("getMeditationSessions", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns list of meditation sessions", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: "s1", data: () => mockSessionData },
        { id: "s2", data: () => ({ ...mockSessionData, durationSeconds: 300 }) },
      ],
    });

    const result = await getMeditationSessions(TEST_USER_ID);

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(2);
    expect(result.data![0]).toEqual({
      id: "s1",
      userId: TEST_USER_ID,
      ...mockSessionData,
    });
    expect(result.data![1].durationSeconds).toBe(300);
  });

  it("returns empty array when no sessions exist", async () => {
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await getMeditationSessions(TEST_USER_ID);

    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
  });

  it("returns error when getDocs throws", async () => {
    mockGetDocs.mockRejectedValueOnce(new Error("Index not ready."));

    const result = await getMeditationSessions(TEST_USER_ID);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Index not ready.");
  });
});

// ─── addSleepLog ──────────────────────────────────────────────────────────────

describe("addSleepLog", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns new document id on success", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "log-001" });

    const result = await addSleepLog(TEST_USER_ID, mockSleepLogData);

    expect(result.error).toBeNull();
    expect(result.data).toBe("log-001");
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it("returns error when addDoc throws", async () => {
    mockAddDoc.mockRejectedValueOnce(new Error("Write failed."));

    const result = await addSleepLog(TEST_USER_ID, mockSleepLogData);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Write failed.");
  });

  it("returns fallback error string when non-Error is thrown", async () => {
    mockAddDoc.mockRejectedValueOnce(false);

    const result = await addSleepLog(TEST_USER_ID, mockSleepLogData);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Failed to add sleep log.");
  });
});

// ─── getSleepLogs ─────────────────────────────────────────────────────────────

describe("getSleepLogs", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns list of sleep logs", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: "l1", data: () => mockSleepLogData },
      ],
    });

    const result = await getSleepLogs(TEST_USER_ID);

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
    expect(result.data![0]).toEqual({
      id: "l1",
      userId: TEST_USER_ID,
      ...mockSleepLogData,
    });
  });

  it("returns empty array when no logs exist", async () => {
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await getSleepLogs(TEST_USER_ID);

    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
  });

  it("returns error when getDocs throws", async () => {
    mockGetDocs.mockRejectedValueOnce(new Error("Connection timeout."));

    const result = await getSleepLogs(TEST_USER_ID);

    expect(result.data).toBeNull();
    expect(result.error).toBe("Connection timeout.");
  });
});
