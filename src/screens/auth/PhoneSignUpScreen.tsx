import React, { useState } from "react";
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "PhoneSignUp">;

export function PhoneSignUpScreen({ navigation }: Props): React.JSX.Element {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");

  const handleSendOTP = (): void => {
    if (!fullName.trim() || !dateOfBirth.trim() || !phone.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // TODO: call real phone verification service to get verificationId
    const mockVerificationId = "mock-verification-id";
    navigation.navigate("OTPSignUp", {
      verificationId: mockVerificationId,
      phoneNumber: phone,
      name: fullName,
      dateOfBirth,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.heading}>Phone Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Date of birth (YYYY-MM-DD)"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Pressable style={styles.button} onPress={handleSendOTP}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: "700", marginBottom: 24, color: "#1a1a2e" },
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
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
