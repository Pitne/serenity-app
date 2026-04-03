import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { signOut } from "../../services/authService";

export function SettingsScreen(): React.JSX.Element {
  const handleLogout = async (): Promise<void> => {
    try {
      const result = await signOut();
      if (result.error) {
        Alert.alert("Error", result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed.";
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 28, fontWeight: "700", color: "#1a1a2e", marginBottom: 32 },
  logoutBtn: {
    backgroundColor: "#FF4757",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
  },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
