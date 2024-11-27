import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Text, StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../context/AuthContext";

const SettingsScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 15 }}>
        Settings
      </Text>
      <Text style={{ alignSelf: "flex-start", left: 10, color: "lightgrey" }}>
        Account
      </Text>
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.btns}
        >
          <FontAwesome name="user" size={24} color="lightgrey" />

          <Text style={{ flex: 1, left: 16, top: 5 }}>Profile</Text>
          <FontAwesome name="angle-right" size={24} color="lightgrey" />
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          style={styles.btns}
          onPress={() => navigation.navigate("Privacy")}
        >
          <FontAwesome name="lock" size={24} color="lightgrey" />

          <Text style={{ flex: 1, left: 16, top: 5 }}>Privacy</Text>
          <FontAwesome name="angle-right" size={24} color="lightgrey" />
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          style={styles.btns}
          onPress={() => navigation.navigate("Security")}
        >
          <Entypo name="shield" size={25} color="lightgrey" />

          <Text style={{ flex: 1, left: 10, top: 5 }}>
            Security and permissions
          </Text>
          <FontAwesome name="angle-right" size={24} color="lightgrey" />
        </TouchableOpacity>
      </View>
      <Text style={{ alignSelf: "flex-start", left: 10, color: "lightgrey" }}>
        Support and About
      </Text>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.btns}
          onPress={() => navigation.navigate("Report")}
        >
          <Entypo name="help-with-circle" size={25} color="lightgrey" />

          <Text style={{ flex: 1, left: 16, top: 5 }}>Report a problem</Text>
          <FontAwesome name="angle-right" size={24} color="lightgrey" />
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          style={styles.btns}
          onPress={() => navigation.navigate("Support")}
        >
          {/* <FontAwesome name="message" size={24} color="lightgrey" /> */}
          <Entypo name="chat" size={25} color="lightgrey" />

          <Text style={{ flex: 1, left: 16, top: 5 }}>
            Customercare & Support
          </Text>
          <FontAwesome name="angle-right" size={24} color="lightgrey" />
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity style={styles.btns} >
          {/* <FontAwesome name="user" size={24} color="lightgrey" /> */}
          <FontAwesome name="exclamation-circle" size={24} color="lightgrey" />

          <Text style={{ flex: 1, left: 16, top: 5 }}>Terms and policies</Text>
          <FontAwesome name="angle-right" size={24} color="lightgrey" />
        </TouchableOpacity>
      </View>
      <Text style={{ alignSelf: "flex-start", left: 10, color: "lightgrey" }}>
        Authentication
      </Text>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={logout} style={styles.btns}>
          <AntDesign name="logout" size={25} color="lightgrey" />
          <Text style={{ flex: 1, left: 16, top: 5 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",

    alignItems: "center",
    paddingHorizontal: 10,
  },
  tabs: {
    width: "100%",
    borderRadius: 20,
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 10,
  },
  btns: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
  },
  line: {
    width: "100%",
    height: 1,
    borderWidth: 0.5,
    borderColor: "lightgrey",
  },
});

export default SettingsScreen;
