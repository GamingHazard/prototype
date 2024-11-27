import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState } from "react";

const PrivacyScreen = () => {
  const [AllSwitch, setAllSwitch] = useState(false);
  const toggleAllSwitch = () => setAllSwitch((previousState) => !previousState);
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Privacy</Text>
      <View
        style={{
          width: "100%",
          borderRadius: 10,

          backgroundColor: "whitesmoke",
          top: 20,
          elevation: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            borderRadius: 10,
            padding: 10,
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ flex: 1, fontSize: 16, fontWeight: "bold" }}>
            Privacy
          </Text>
          <Switch
            trackColor={{ false: "lightgrey", true: "lightblue" }}
            thumbColor={AllSwitch ? "royalblue" : "whitesmoke"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleAllSwitch}
            value={AllSwitch}
            style={styles.switch}
          />
        </View>
        <View style={{ padding: 15, justifyContent: "center" }}>
          <Text>
            If this option is turned on, none of the other users will be able to
            see your email and number. This applies to all the posts you create
            as well.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
  },
  switch: { width: 50, transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] },
});
