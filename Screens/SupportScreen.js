import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

const SupportScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
      <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold" }}>
        Support
      </Text>
      <View
        style={{
          width: "100%",
          padding: 15,
          backgroundColor: "white",
          borderRadius: 10,
          marginVertical: 10,
        }}
      >
        <Text>For more assistamce and help reach us on the handles below</Text>
      </View>
      {/* Email */}
      <View
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10,
          marginVertical: 10,
          flexDirection: "row",
        }}
      >
        <Entypo
          name="mail"
          style={{ marginHorizontal: 10 }}
          size={25}
          color="lightgrey"
        />
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email :</Text>
        <Text
          style={{
            width: "60%",
            fontSize: 14,
            textAlign: "right",
          }}
        >
          ugacyclehelp@gmail.co.ug
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10,
          marginVertical: 10,
          flexDirection: "row",
        }}
      >
        <FontAwesome
          style={{ marginHorizontal: 10 }}
          name="mobile-phone"
          size={24}
          color="lightgrey"
        />

        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Contacts :</Text>
        <Text
          style={{
            width: "60%",
            fontSize: 14,
            textAlign: "right",
          }}
        >
          0741745165 / 0774205474
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10,
          marginVertical: 10,
          flexDirection: "row",
        }}
      >
        <FontAwesome
          style={{ marginHorizontal: 10 }}
          name="whatsapp"
          size={24}
          color="lightgrey"
        />
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>whatsapp :</Text>
        <Text
          style={{
            width: "60%",
            fontSize: 14,
            textAlign: "right",
          }}
        >
          0726512146
        </Text>
      </View>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({});
