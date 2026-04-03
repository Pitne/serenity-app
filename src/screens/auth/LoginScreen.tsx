import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../navigation/types";
import { signInWithPhone } from "../../services/authService";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props): React.JSX.Element {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendOTP = async (): Promise<void> => {
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }

    try {
      setSending(true);
      // TODO: Replace with real ApplicationVerifier (expo-firebase-recaptcha)
      const mockVerifier = { verify: async () => "mock-token", type: "recaptcha" };
      const result = await signInWithPhone(phone, mockVerifier);

      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      navigation.navigate("OTP", {
        verificationId: result.data!,
        phoneNumber: phone,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP.";
      Alert.alert("Error", message);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign In</Text>

      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleBtn, mode === "email" && styles.toggleActive]}
          onPress={() => setMode("email")}
        >
          <Text style={mode === "email" ? styles.toggleTextActive : styles.toggleText}>
            Email
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, mode === "phone" && styles.toggleActive]}
          onPress={() => setMode("phone")}
        >
          <Text style={mode === "phone" ? styles.toggleTextActive : styles.toggleText}>
            Phone
          </Text>
        </Pressable>
      </View>

      {mode === "email" ? (
        <>
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry />
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Pressable
            style={[styles.button, sending && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={sending}
          >
            <Text style={styles.buttonText}>{sending ? "Sending..." : "Send OTP"}</Text>
          </Pressable>
        </>
      )}

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: "700", marginBottom: 24, color: "#1a1a2e" },
  toggle: { flexDirection: "row", marginBottom: 24, borderRadius: 8, overflow: "hidden" },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "#f0f0f0" },
  toggleActive: { backgroundColor: "#6C63FF" },
  toggleText: { color: "#333", fontWeight: "600" },
  toggleTextActive: { color: "#fff", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { color: "#6C63FF", textAlign: "center", fontSize: 14 },
});
