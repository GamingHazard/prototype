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

const ReportScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Report a problem
      </Text>
      <ScrollView style={{ flex: 1, width: "100%", paddingBottom: 50 }}>
        <View
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Describe the problem
          </Text>
          <View
            style={{
              width: "100%",
              padding: 15,
              justifyContent: "center",
              backgroundColor: "whitesmoke",
              height: 50,
              borderRadius: 10,
              marginVertical: 5,
            }}
          >
            <TextInput placeholder="Enter your email..." />
          </View>
          <View
            style={{
              width: "100%",
              padding: 15,
              justifyContent: "center",
              backgroundColor: "whitesmoke",
              height: 50,
              borderRadius: 10,
              marginVertical: 5,
            }}
          >
            <TextInput placeholder="Enter your phone number +256" />
          </View>
          <View
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "whitesmoke",

              borderRadius: 10,
              marginVertical: 5,
              justifyContent: "flex-start",
            }}
          >
            <TextInput
              style={{ textAlignVertical: "top" }}
              placeholder="Tap to text....."
              multiline={true}
              numberOfLines={10}
            />
          </View>
          <TouchableOpacity
            style={{
              width: "40%",
              padding: 10,
              borderRadius: 15,
              backgroundColor: "teal",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
              alignSelf: "center",
              marginVertical: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Send</Text>
            {/* <AntDesign name="send" size={25} color="white" /> */}
            <FontAwesome name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "white",
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Other common problems
          </Text>
          {/* Crushing */}
          <View
            style={{
              width: "100%",
              padding: 15,
              marginVertical: 10,
              borderRadius: 8,
              backgroundColor: "whitesmoke",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Crushing</Text>
            <Text style={{ fontSize: 11, color: "grey" }}>
              Crushing is when you try to open the app and it abraptly closes or
              opening the app and using it ten it closes abraptly.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Possible fixes
            </Text>
            <Text style={{ fontSize: 11, color: "grey" }}>
              - Clear all background processes and restart the phone.
              {"\n"}- Clear the app cache data in the settings. {"\n"}-
              Uninstall it and reinstall the App.
            </Text>
          </View>
          {/* Profile editing  */}
          <View
            style={{
              width: "100%",
              padding: 15,
              marginVertical: 10,
              borderRadius: 8,
              backgroundColor: "whitesmoke",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Editing Profile
            </Text>
            <Text style={{ fontSize: 11, color: "grey" }}>
              Most users face problem of not being able to edit their profile
              and keep geeting errors.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Possible fixes
            </Text>
            <Text style={{ fontSize: 11, color: "grey" }}>
              - Make sure your phone has an internet connection.{"\n"} - Logout
              and login again.
              {"\n"} - Clear all background processes and restart the phone.
              {"\n"}- Clear the app cache data in the settings. {"\n"}-
              Uninstall it and reinstall the App.
            </Text>
          </View>

          {/* Profile Image */}
          <View
            style={{
              width: "100%",
              padding: 15,
              marginVertical: 10,
              borderRadius: 8,
              backgroundColor: "whitesmoke",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Profile Image upload
            </Text>
            <Text style={{ fontSize: 11, color: "grey" }}>
              Some users face problem of not being able upload their images on
              their Dps. At times the speed of your internet might be slow hence
              making the image take much longer to show after it is uploaded.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Possible fixes
            </Text>
            <Text
              style={{ fontSize: 11, color: "grey", justifyContent: "center" }}
            >
              - Make sure your phone has a stable and if possible fast internet
              connection.{"\n"} - Logout and login again.
              {"\n"} - Clear all background processes and restart the phone.
              {"\n"}- Clear the app cache data in the settings. {"\n"}-
              Uninstall it and reinstall the App.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({});
