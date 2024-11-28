import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { AuthContext } from "../context/AuthContext";

const ProfileEditScreen = ({ cancel, FetchProfileUpdate }) => {
  const { UserInfo, updateUserProfile } = useContext(AuthContext);

  // State for form inputs
  const [name, setName] = useState(UserInfo.user.name);
  const [email, setEmail] = useState(UserInfo.user.email);
  const [phone, setPhone] = useState(UserInfo.user.phone);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    // Basic validation (you can improve this)
    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }
    setIsLoading(true);
    try {
      await updateUserProfile(name, email, phone);
      // SaveProfile();
      FetchProfileUpdate();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Edit Profile</Text>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => setName(text)}
          keyboardType="default"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Tel Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={(text) => setPhone(text)}
          keyboardType="phone-pad"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={cancel} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdateProfile}
            style={styles.button}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" /> // Show spinner when loading
            ) : (
              <Text style={styles.buttonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 15,
    width: "80%",
    padding: 16,
  },
  header: {
    width: "100%",
    height: "auto",
    padding: 10,
  },
  headerInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  profilePicContainer: {
    alignItems: "center",
    width: "100%",
    height: 230,
    paddingTop: 30,
    justifyContent: "center",
    alignSelf: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 26,
  },
  profilePicWrapper: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#3061e4",
    padding: 4,
    marginVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
    resizeMode: "cover",
  },

  line: {
    borderBottomWidth: 1,
    borderColor: "#e4e4e6",
    marginVertical: 10,
  },
  inputContainer: {
    width: 280,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    marginBottom: 15,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#3b6d3b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileEditScreen;
