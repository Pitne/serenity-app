import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function MeditateScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Meditate</Text>
      <Text style={styles.placeholder}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 28, fontWeight: "700", color: "#1a1a2e", marginBottom: 12 },
  placeholder: { fontSize: 16, color: "#666" },
});
