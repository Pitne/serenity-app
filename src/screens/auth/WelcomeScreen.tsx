import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store/authStore";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ route }: Props): React.JSX.Element {
  const { userName } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const timer = setTimeout(() => {
      completeOnboarding();
    }, 3000);

    return () => clearTimeout(timer);
  }, [completeOnboarding]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        Welcome, {userName}! 🧘
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  text: { fontSize: 32, fontWeight: "700", color: "#1a1a2e" },
});
