import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUpMethod">;

export function SignUpMethodScreen({ navigation }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subtitle}>Choose your sign-up method</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("EmailSignUp")}
      >
        <Text style={styles.buttonText}>Sign up with Email</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("PhoneSignUp")}
      >
        <Text style={styles.buttonText}>Sign up with Phone</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: "700", marginBottom: 8, color: "#1a1a2e" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 32 },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { color: "#6C63FF", textAlign: "center", fontSize: 14, marginTop: 16 },
});
