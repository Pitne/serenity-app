import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { AuthStackParamList } from "./types";
import { OnboardingScreen } from "../screens/auth/OnboardingScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { OTPLoginScreen } from "../screens/auth/OTPLoginScreen";
import { SignUpMethodScreen } from "../screens/auth/SignUpMethodScreen";
import { EmailSignUpScreen } from "../screens/auth/EmailSignUpScreen";
import { PhoneSignUpScreen } from "../screens/auth/PhoneSignUpScreen";
import { OTPSignUpScreen } from "../screens/auth/OTPSignUpScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTPLogin" component={OTPLoginScreen} />
      <Stack.Screen name="SignUpMethod" component={SignUpMethodScreen} />
      <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
      <Stack.Screen name="PhoneSignUp" component={PhoneSignUpScreen} />
      <Stack.Screen name="OTPSignUp" component={OTPSignUpScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}
