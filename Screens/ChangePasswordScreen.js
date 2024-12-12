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
  const [oldPassword, setOldPassword] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { id, name } = route.params || {};

  const updatePassword = async () => {
    setLoading(true);
    let currentPassword = oldPassword;
    let newPassword = Newpassword;
    let ID = id;
    try {
      if (!currentPassword || !newPassword) {
        Alert.alert("Error", "Both current and new passwords are required.");
        setLoading(false);
        return;
      }

      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/change-password/${ID}`,
        {
          currentPassword,
          newPassword,
        }
      );

      Alert.alert("Success", response.data.message);
      setOldPassword("");
      setConfirmPassword("");
      setNewPassword("");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update password."
      );
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
      <Text>user: {id}</Text>
      <Text style={styles.title}>Reset Password</Text>
      <View
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 10,
          backgroundColor: "white",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            alignSelf: "flex-start",
          }}
        >
          Change password
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter old password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm new password"
            value={Newpassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={{
              color: Newpassword === confirmPassword ? "black" : "crimson",
            }}
          />
        </View>
        <Text style={{ color: "crimson", marginBottom: 10 }}>
          {confirmPassword === Newpassword ? "" : "passwords don't match"}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: oldPassword ? "teal" : "grey",
              opacity: oldPassword ? 1 : 0.6,
            },
            ,
          ]}
          onPress={updatePassword}
          disabled={!oldPassword} // Disable the button if password is empty
        >
          {loading ? (
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Text style={{ color: "white", flex: 1 }}>Changing...</Text>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <Text style={{ color: "white" }}>Change</Text>
          )}
        </TouchableOpacity>
      </View>
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
    backgroundColor: "whitesmoke",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
  },
  button: {
    width: "40%",
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteAccountContainer: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 20,
  },
});

export default ResetPasswordScreen;
