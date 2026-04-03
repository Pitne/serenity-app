import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import type { MainStackParamList } from "../../navigation/types";

type NavProp = NativeStackNavigationProp<MainStackParamList>;

export function DashboardScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Dashboard</Text>
        <Pressable onPress={() => navigation.navigate("Notification")}>
          <Text style={styles.bell}>🔔</Text>
        </Pressable>
      </View>
      <Text style={styles.placeholder}>Welcome to Serenity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heading: { fontSize: 28, fontWeight: "700", color: "#1a1a2e" },
  bell: { fontSize: 24 },
  placeholder: { marginTop: 24, fontSize: 16, color: "#666" },
});
