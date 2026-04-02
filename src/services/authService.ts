import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  Unsubscribe,
  UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";

// ─── Result types ─────────────────────────────────────────────────────────────

export interface AuthSuccess<T> {
  data: T;
  error: null;
}

export interface AuthError {
  data: null;
  error: string;
}

export type AuthResult<T> = AuthSuccess<T> | AuthError;

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult<FirebaseUser>> {
  try {
    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(credential.user, { displayName });
    return { data: credential.user, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign up failed.";
    return { data: null, error: message };
  }
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn(
  email: string,
  password: string
): Promise<AuthResult<FirebaseUser>> {
  try {
    const credential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { data: credential.user, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign in failed.";
    return { data: null, error: message };
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<AuthResult<true>> {
  try {
    await firebaseSignOut(auth);
    return { data: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign out failed.";
    return { data: null, error: message };
  }
}

// ─── Phone Auth: send OTP ─────────────────────────────────────────────────────

/**
 * Step 1: Send OTP to the given phone number.
 * Returns a verificationId to be used in verifyOTP.
 *
 * Note: React Native does not support the web SDK's reCAPTCHA verifier.
 * In production, use expo-firebase-recaptcha and pass a compatible
 * ApplicationVerifier into the verifier parameter.
 */
export async function signInWithPhone(
  phoneNumber: string,
  // ApplicationVerifier from firebase/auth — use expo-firebase-recaptcha on React Native
  verifier: { verify: () => Promise<string>; type: string }
): Promise<AuthResult<string>> {
  try {
    const provider = new PhoneAuthProvider(auth);
    const verificationId: string = await provider.verifyPhoneNumber(
      phoneNumber,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      verifier as any
    );
    return { data: verificationId, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send OTP.";
    return { data: null, error: message };
  }
}

// ─── Phone Auth: verify OTP ───────────────────────────────────────────────────

/**
 * Step 2: Verify the OTP entered by the user.
 * verificationId is obtained from the signInWithPhone result.
 */
export async function verifyOTP(
  verificationId: string,
  otp: string
): Promise<AuthResult<FirebaseUser>> {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const userCredential: UserCredential = await signInWithCredential(
      auth,
      credential
    );
    return { data: userCredential.user, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "OTP verification failed.";
    return { data: null, error: message };
  }
}

// ─── Auth State Listener ──────────────────────────────────────────────────────

/**
 * Subscribe to authentication state changes.
 * Returns an unsubscribe function for cleanup.
 */
export function onAuthStateChanged(
  callback: (user: FirebaseUser | null) => void
): Unsubscribe {
  return firebaseOnAuthStateChanged(auth, callback);
}
