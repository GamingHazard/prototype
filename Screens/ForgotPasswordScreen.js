import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const ForgotPasswordScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
  const [loading, setLoading] = useState(false); // State to manage loader visibility

  const handleRequestReset = async () => {
    setLoading(true); // Show loader when the request starts

    try {
      // Make the POST request
      const response = await axios.post(
        "https://uga-cycle-backend-1.onrender.com/forgot-password",
        {
          identifier, // Sending either email or phone number
        }
      );

      const { token } = response.data;

      // Check if token is received
      if (token) {
        // Navigate to the ResetPasswordScreen with the token
        navigation.navigate("ResetPassword", { token });
        setIdentifier("");
      } else {
        // Display an error message if token is not received
        Alert.alert(
          "Error",
          "Failed to retrieve the reset token. Please check the identifier and try again."
        );
      }
    } catch (error) {
      console.error("Error requesting reset token", error);
      Alert.alert("Error", "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false); // Hide loader after request completion
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address or phone number"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address" // Change to "default" if accepting phone numbers
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRequestReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    flexDirection: "row", // Ensure the text and loader are aligned
    justifyContent: "center", // Center loader and text horizontally
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ForgotPasswordScreen;
