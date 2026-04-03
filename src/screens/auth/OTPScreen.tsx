import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../navigation/types";
import { verifyOTP, signInWithPhone } from "../../services/authService";

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

export function OTPScreen({ route }: Props): React.JSX.Element {
  const { verificationId: initialVerificationId, phoneNumber } = route.params;

  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(initialVerificationId);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(COUNTDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startCountdown]);

  const handleVerify = async (): Promise<void> => {
    if (code.length !== OTP_LENGTH) {
      Alert.alert("Error", `Please enter a ${OTP_LENGTH}-digit code.`);
      return;
    }

    try {
      setVerifying(true);
      const result = await verifyOTP(verificationId, code);

      if (result.error) {
        Alert.alert("Error", result.error);
      }
      // On success, onAuthStateChanged in useAuth will detect the new user
      // and RootNavigator will automatically switch to MainNavigator.
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed.";
      Alert.alert("Error", message);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    try {
      setResending(true);
      // TODO: Replace with real ApplicationVerifier (expo-firebase-recaptcha)
      const mockVerifier = { verify: async () => "mock-token", type: "recaptcha" };
      const result = await signInWithPhone(phoneNumber, mockVerifier);

      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      setVerificationId(result.data!);
      setCode("");
      startCountdown();
      Alert.alert("Sent", "A new OTP has been sent.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP.";
      Alert.alert("Error", message);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        We sent a code to {phoneNumber}
      </Text>

      <TextInput
        style={styles.otpInput}
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH))}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        placeholder="000000"
        textAlign="center"
        autoFocus
      />

      <Pressable
        style={[styles.button, verifying && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={verifying}
      >
        <Text style={styles.buttonText}>
          {verifying ? "Verifying..." : "Confirm"}
        </Text>
      </Pressable>

      {countdown > 0 ? (
        <Text style={styles.countdownText}>Resend in {countdown}s</Text>
      ) : (
        <Pressable onPress={handleResend} disabled={resending}>
          <Text style={styles.resendText}>
            {resending ? "Sending..." : "Resend Code"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 28, fontWeight: "700", color: "#1a1a2e", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 32 },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 28,
    letterSpacing: 12,
    width: "80%",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  countdownText: { fontSize: 14, color: "#999" },
  resendText: { fontSize: 14, color: "#6C63FF", fontWeight: "600" },
});
