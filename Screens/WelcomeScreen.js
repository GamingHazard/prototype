//  import React from "react";
import React from "react";

import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Image
          source={require("../assets/icon3.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 70,
            color: "#fbfbda",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          UGA{"\n"}CYCLE
        </Text>

        <Text
          style={{
            flex: 1,
            fontWeight: "bold",
            fontSize: 20,
            color: "#fbfbda",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          RECYCLE TODAY FOR A BETTER TOMORROW
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{
          width: "100%",
          height: 70,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          elevation: 10,
          backgroundColor: "#fbfbda",
        }}
      >
        <Text
          style={{
            flex: 1,
            fontWeight: "bold",
            fontSize: 26,
            color: "#3b6d3b",
          }}
        >
          Get started
        </Text>
        <Feather name="arrow-right-circle" size={35} color="#3b6d3b" />
      </TouchableOpacity>
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

export default WelcomeScreen;
