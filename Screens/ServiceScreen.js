import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Swift from "./SevicesProviders/Swift";

const ServiceScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Swift />
    </View>
  );
};

export default ServiceScreen;

const styles = StyleSheet.create({});
