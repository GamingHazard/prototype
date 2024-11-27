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
import Icon from "react-native-vector-icons/FontAwesome";

const ResetPasswordScreen = ({ route, navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { token } = route.params || {};

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        ` https://uga-cycle-backend-1.onrender.com/reset-password/${token}`,
        { password }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password has been updated successfully");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error resetting password", error);
      Alert.alert("Error", "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text.toLowerCase()); // Convert text to lowercase
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text.toLowerCase()); // Convert text to lowercase
  };

  return (
    <View style={styles.container}>
      {token ? <Text>Token: {token}</Text> : <Text>No Token Provided</Text>}
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={handlePasswordChange} // Use the handler
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon
            name={passwordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry={!confirmPasswordVisible}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange} // Use the handler
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        >
          <Icon
            name={confirmPasswordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
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
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ResetPasswordScreen;
