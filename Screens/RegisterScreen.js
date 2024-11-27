import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const { register } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (phone) => {
    if (phone.length > 10) {
      setPhoneError("Phone number must be 10 digits or less");
    } else {
      setPhoneError("");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    validateEmail(email);
    validatePhone(phone);

    if (!emailError && !phoneError && name && password) {
      setLoading(true);
      register(name, email, phone, password);
      setTimeout(() => {}, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 15,
          alignItems: "center",
          backgroundColor: "white",
          elevation: 10,
          borderRadius: 10,
          marginHorizontal: 20,
          width: "90%",
        }}
      >
        <Image
          source={require("../assets/icon3.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 25, color: "#3b6d3b" }}>
          Create an account
        </Text>
        {/* name Input */}
        <View
          style={{
            width: "100%",
            height: 60,
            padding: 15,
            borderWidth: 0.5,
            borderColor: "#3b6d3b",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          {/* <AntDesign name= size={24} color="#3b6d3b" /> */}
          <MaterialCommunityIcons name="human" size={24} color="#3b6d3b" />
          <TextInput
            style={{ width: "100%", marginLeft: 10, fontSize: 16 }}
            placeholderTextColor={"#3b6d3b"}
            placeholder="Username"
            onChangeText={setName}
            value={name}
          />
        </View>
        {/* Email Input */}
        <View
          style={{
            width: "100%",
            height: 60,
            padding: 15,
            borderWidth: 0.5,
            borderColor: emailError ? "red" : "#3b6d3b",
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <MaterialCommunityIcons name="email" size={24} color="#3b6d3b" />
          <TextInput
            style={{ width: "100%", marginLeft: 10, fontSize: 16 }}
            placeholderTextColor={"#3b6d3b"}
            placeholder="Email address"
            onChangeText={setEmail}
            onBlur={() => validateEmail(email)}
            autoCapitalize="none"
            value={email}
          />
        </View>
        {emailError ? <Text style={{ color: "red" }}>{emailError}</Text> : null}
        {/* Phone Input */}
        <View
          style={{
            width: "100%",
            height: 60,
            padding: 15,
            borderWidth: 0.5,
            borderColor: phoneError ? "red" : "#3b6d3b",
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          {/* <Feather name="phone" size={24} color="#3b6d3b" /> */}
          <MaterialCommunityIcons name="phone" size={24} color="#3b6d3b" />
          <TextInput
            style={{ width: "100%", marginLeft: 10, fontSize: 16 }}
            placeholderTextColor={"#3b6d3b"}
            placeholder="Tel number (+256)"
            keyboardType="numeric"
            onChangeText={setPhone}
            onBlur={() => validatePhone(phone)}
            value={phone}
          />
        </View>
        {phoneError ? <Text style={{ color: "red" }}>{phoneError}</Text> : null}
        {/* Password Input */}
        <View
          style={{
            width: "100%",
            height: 60,
            padding: 15,
            borderWidth: 0.5,
            borderColor: "#3b6d3b",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Fontisto name="locked" size={24} color="#3b6d3b" />
          <TextInput
            style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
            placeholderTextColor={"#3b6d3b"}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="#3b6d3b"
            />
          </TouchableOpacity>
        </View>
        {/* Submit Button */}
        <TouchableOpacity
          style={{
            height: 50,
            borderRadius: 20,
            backgroundColor: "#3b6d3b",
            marginVertical: 10,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={{ color: "#fbfbda", fontSize: 16 }}>
              Create account
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
            width: 325,
            padding: 10,
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Text style={{ color: "#3b6d3b" }}>Have an account?</Text>
          <Text
            style={{ color: "blue", fontSize: 16 }}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </View>
        {/* Divider */}
        <View
          style={{
            flexDirection: "row",
            padding: 16,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          {/* <View
            style={{
              height: 0.5,
              width: 80,
              borderWidth: 0.5,
              borderColor: "#3b6d3b",
              marginRight: 10,
            }}
          /> */}
          {/* <Text style={{ marginVertical: 15, color: "grey", fontSize: 16 }}>
            Or Continue with
          </Text>
          <View
            style={{
              height: 0.5,
              width: 80,
              borderWidth: 0.5,
              borderColor: "#3b6d3b",
              marginLeft: 10,
            }}
          /> */}
        </View>
        {/* Google & Apple Buttons */}
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              width: "45%",
              height: 50,
              borderRadius: 10,
              backgroundColor: "whitesmoke",
              flexDirection: "row",
              marginVertical: 10,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign
              style={{ marginRight: 10 }}
              name="apple1"
              size={24}
              color="black"
            />
            <Text style={{ alignSelf: "center", flex: 1, fontSize: 18 }}>
              Apple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "45%",
              height: 50,
              borderRadius: 10,
              backgroundColor: "whitesmoke",
              flexDirection: "row",
              marginVertical: 10,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign
              style={{ marginRight: 10 }}
              name="google"
              size={24}
              color="black"
            />
            <Text style={{ alignSelf: "center", flex: 1, fontSize: 18 }}>
              Google
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fbfbda", top: 60 }}>Developed by JOEL</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b6d3b",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegisterScreen;
