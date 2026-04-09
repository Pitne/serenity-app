import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPSignUp">;

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

export function OTPSignUpScreen({ route, navigation }: Props): React.JSX.Element {
  const { name, phoneNumber } = route.params;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
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

  const handleChange = (text: string, index: number): void => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updated.every((d) => d !== "") && updated.join("").length === OTP_LENGTH) {
      handleSubmit(updated.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number): void => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (code: string): Promise<void> => {
    try {
      setVerifying(true);
      // TODO: call real OTP verification for sign-up
      void code;
      navigation.navigate("Welcome", { userName: name });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed.";
      Alert.alert("Error", message);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = (): void => {
    // TODO: call real resend OTP service
    setDigits(Array(OTP_LENGTH).fill(""));
    startCountdown();
    Alert.alert("Sent", "A new OTP has been sent.");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.heading}>Verify Phone</Text>
        <Text style={styles.subtitle}>We sent a code to {phoneNumber}</Text>

        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={styles.otpBox}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        {verifying && <Text style={styles.verifyingText}>Verifying...</Text>}

        {countdown > 0 ? (
          <Text style={styles.countdownText}>Resend in {countdown}s</Text>
        ) : (
          <Pressable onPress={handleResend}>
            <Text style={styles.resendText}>Resend Code</Text>
          </Pressable>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 28, fontWeight: "700", color: "#1a1a2e", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 32 },
  otpRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  otpBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: 48,
    height: 56,
    fontSize: 24,
    fontWeight: "700",
  },
  verifyingText: { fontSize: 14, color: "#6C63FF", marginBottom: 16 },
  countdownText: { fontSize: 14, color: "#999" },
  resendText: { fontSize: 14, color: "#6C63FF", fontWeight: "600" },
});
