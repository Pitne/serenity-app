import {
  signUp,
  signIn,
  signOut,
  verifyOTP,
  onAuthStateChanged,
} from "../authService";

// ─── Mock firebase/auth ───────────────────────────────────────────────────────

const mockUser = {
  uid: "test-uid-123",
  email: "test@serenity.app",
  displayName: "Test User",
  phoneNumber: null,
  photoURL: null,
};

const mockUpdateProfile = jest.fn().mockResolvedValue(undefined);
const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockSignInWithCredential = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  PhoneAuthProvider: Object.assign(
    jest.fn().mockImplementation(() => ({
      verifyPhoneNumber: jest.fn().mockResolvedValue("mock-verification-id"),
    })),
    {
      credential: jest.fn().mockReturnValue({ providerId: "phone" }),
    }
  ),
  signInWithCredential: (...args: unknown[]) =>
    mockSignInWithCredential(...args),
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}));

// ─── Mock ../config/firebase ──────────────────────────────────────────────────

jest.mock("../../config/firebase", () => ({
  auth: {},
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const mockCreateUser = createUserWithEmailAndPassword as jest.Mock;
const mockSignInEmail = signInWithEmailAndPassword as jest.Mock;

// ─── signUp ───────────────────────────────────────────────────────────────────

describe("signUp", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns user on success and calls updateProfile", async () => {
    mockCreateUser.mockResolvedValueOnce({ user: mockUser });

    const result = await signUp("test@serenity.app", "password123", "Test User");

    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockUser);
    expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: "Test User",
    });
  });

  it("returns error when createUserWithEmailAndPassword throws", async () => {
    mockCreateUser.mockRejectedValueOnce(new Error("Email already in use."));

    const result = await signUp("dupe@serenity.app", "password123", "Test User");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Email already in use.");
  });

  it("returns fallback error string when non-Error is thrown", async () => {
    mockCreateUser.mockRejectedValueOnce("unexpected");

    const result = await signUp("test@serenity.app", "pass", "User");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Sign up failed.");
  });
});

// ─── signIn ───────────────────────────────────────────────────────────────────

describe("signIn", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns user on successful sign in", async () => {
    mockSignInEmail.mockResolvedValueOnce({ user: mockUser });

    const result = await signIn("test@serenity.app", "password123");

    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockUser);
  });

  it("returns error when credentials are wrong", async () => {
    mockSignInEmail.mockRejectedValueOnce(new Error("Wrong password."));

    const result = await signIn("test@serenity.app", "wrongpass");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Wrong password.");
  });

  it("returns fallback error string when non-Error is thrown", async () => {
    mockSignInEmail.mockRejectedValueOnce(null);

    const result = await signIn("test@serenity.app", "pass");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Sign in failed.");
  });
});

// ─── signOut ──────────────────────────────────────────────────────────────────

describe("signOut", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns true on success", async () => {
    mockSignOut.mockResolvedValueOnce(undefined);

    const result = await signOut();

    expect(result.error).toBeNull();
    expect(result.data).toBe(true);
  });

  it("returns error when sign out fails", async () => {
    mockSignOut.mockRejectedValueOnce(new Error("Network error."));

    const result = await signOut();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Network error.");
  });
});

// ─── verifyOTP ────────────────────────────────────────────────────────────────

describe("verifyOTP", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns user on valid OTP", async () => {
    mockSignInWithCredential.mockResolvedValueOnce({ user: mockUser });

    const result = await verifyOTP("mock-verification-id", "123456");

    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockUser);
  });

  it("returns error on invalid OTP", async () => {
    mockSignInWithCredential.mockRejectedValueOnce(new Error("Invalid OTP."));

    const result = await verifyOTP("mock-verification-id", "000000");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Invalid OTP.");
  });

  it("returns fallback error string when non-Error is thrown", async () => {
    mockSignInWithCredential.mockRejectedValueOnce(undefined);

    const result = await verifyOTP("id", "123456");

    expect(result.data).toBeNull();
    expect(result.error).toBe("OTP verification failed.");
  });
});

// ─── onAuthStateChanged ───────────────────────────────────────────────────────

describe("onAuthStateChanged", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls the callback with the current user", () => {
    const mockUnsubscribe = jest.fn();
    mockOnAuthStateChanged.mockImplementationOnce(
      (_auth: unknown, cb: (user: typeof mockUser) => void) => {
        cb(mockUser);
        return mockUnsubscribe;
      }
    );

    const callback = jest.fn();
    const unsubscribe = onAuthStateChanged(callback);

    expect(callback).toHaveBeenCalledWith(mockUser);
    expect(typeof unsubscribe).toBe("function");
  });

  it("calls the callback with null when user is signed out", () => {
    const mockUnsubscribe = jest.fn();
    mockOnAuthStateChanged.mockImplementationOnce(
      (_auth: unknown, cb: (user: null) => void) => {
        cb(null);
        return mockUnsubscribe;
      }
    );

    const callback = jest.fn();
    onAuthStateChanged(callback);

    expect(callback).toHaveBeenCalledWith(null);
  });
});
