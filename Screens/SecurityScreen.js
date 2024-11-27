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
  const { ShowDeleteModal, HideDeleteModal, deleteUserAccount } =
    useContext(AuthContext);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState(""); // New state for delete password
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "New passwords do not match.");
    }

    setLoading(true);
    try {
      const response = await axios.patch(
        `https://your-backend-url/reset-password/${resetToken || ""}`, // Attach resetToken if available
        { password: newPassword, userToken } // Send userToken if logged in
      );
      Alert.alert("Success", response.data.message);
      // navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };
  const deleteAccount = async () => {
    setLoadingDelete(true);
    await deleteUserAccount();
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
          {error ? (
            <Text style={{ color: "red", marginVertical: 5 }}>{error}</Text>
          ) : null}
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
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
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
              style={[styles.button, { backgroundColor: "crimson" }]}
              onPress={deleteAccount}
            >
              {loadingDelete ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "white" }}>Delete Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "100%",
              // flexDirection: "row",
              // alignItems: "center",
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
    backgroundColor: "teal",
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
