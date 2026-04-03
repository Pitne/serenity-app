import type { NavigatorScreenParams } from "@react-navigation/native";

// ─── Auth Stack ──────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  OTP: { verificationId: string; phoneNumber: string };
};

// ─── Main Tab ────────────────────────────────────────────────────────────────

export type MainTabParamList = {
  Dashboard: undefined;
  Meditate: undefined;
  Sleep: undefined;
  Journal: undefined;
  Settings: undefined;
};

// ─── Main Stack (wraps tabs + overlay screens) ───────────────────────────────

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Notification: undefined;
};

// ─── Root Stack ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// ─── Augment the global param list for useNavigation() type-safety ───────────

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
