/**
 * Firebase Auth v12 exports getReactNativePersistence only via the
 * react-native condition in @firebase/auth's exports map, but the
 * fallback "types" entry (auth-public.d.ts) takes precedence during
 * TypeScript resolution, hiding the export.
 *
 * This augmentation re-exposes it so we can import from "firebase/auth"
 * cleanly while the upstream issue persists.
 *
 * @see https://github.com/firebase/firebase-js-sdk/issues/7425
 */
import "firebase/auth";

declare module "firebase/auth" {
  interface ReactNativeAsyncStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }

  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage,
  ): Persistence;
}
