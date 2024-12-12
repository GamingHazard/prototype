import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext"; // Make sure to import AuthContext
import axios from "axios"; // Don't forget to import axios if you haven't already

const SecurityScreen = () => {
  const { deleteUserAccount, UserID } = useContext(AuthContext);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const updatePassword = async () => {
    setLoading(true);
    let currentPassword = oldPassword;
    let newPassword = Newpassword;
    let id = UserID;
    try {
      if (!currentPassword || !newPassword) {
        Alert.alert("Error", "Both current and new passwords are required.");
        setLoading(false);
        return;
      }

      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/change-password/${id}`,
        {
          currentPassword,
          newPassword,
        }
      );

      Alert.alert("Success", response.data.message);
      setOldPassword("");
      setConfirmPassword("");
      setNewPassword("");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoadingDelete(true);
    if (!password) {
      Alert.alert("Error", "Password is required to delete the account.");
      return;
    } else {
      await deleteUserAccount(password);
    }

    setLoadingDelete(false);
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold" }}>
        Security & Permissions
      </Text>
      <ScrollView style={{ flex: 1, width: "100%", paddingBottom: 50 }}>
        <Text
          style={{
            alignSelf: "flex-start",
            marginHorizontal: 16,
            marginVertical: 10,
            color: "grey",
          }}
        >
          Password
        </Text>
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

        {/* Delete Account Section */}
        <View style={styles.deleteAccountContainer}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>
              Delete Account
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: password ? "crimson" : "grey",
                  opacity: password ? 1 : 0.6,
                },
                ,
              ]}
              onPress={deleteAccount}
              disabled={!password} // Disable the button if password is empty
            >
              {loadingDelete ? (
                <View style={{ width: "100%", flexDirection: "row" }}>
                  <Text style={{ color: "white", flex: 1 }}>Delete...</Text>
                  <ActivityIndicator color="#fff" />
                </View>
              ) : (
                <Text style={{ color: "white" }}>Delete Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "100%",
              backgroundColor: "whitesmoke",
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text style={{ color: "red", fontWeight: "bold" }}>Caution:</Text>
            <Text style={{ color: "red" }}>
              This proceedure cannot be undone, please continue with caution!
            </Text>
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                padding: 15,
                marginVertical: 10,
                borderRadius: 15,
                elevation: 10,
              }}
            >
              <TextInput
                placeholder="Enter password to confirm"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SecurityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingHorizontal: 10 },
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
