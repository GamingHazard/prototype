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
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ModalView from "../components/Modal";
import { AuthContext } from "../context/AuthContext";

const ProfileEditScreen = ({ cancel, FetchProfileUpdate }) => {
  const {
    uploadImage,
    removeImage,
    SelectedImage,
    UserInfo,
    updateUserProfile,
  } = useContext(AuthContext);

  // State for form inputs
  const [name, setName] = useState(UserInfo.user.name);
  const [email, setEmail] = useState(UserInfo.user.email);
  const [phone, setPhone] = useState(UserInfo.user.phone);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadModal, setimageUploadModal] = useState(false);

  const ShowImageModal = () => {
    setimageUploadModal(true);
  };
  const HideImageModal = () => {
    setimageUploadModal(false);
  };

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}></View>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Profile pic */}
        <View style={styles.profilePicContainer}>
          <Text style={styles.headerText}>Edit Profile</Text>
          <View style={styles.profilePicWrapper}>
            <Image
              source={
                SelectedImage
                  ? { uri: SelectedImage }
                  : require("../assets/profile.jpg")
              }
              style={styles.profilePic}
            />
          </View>
          {/* Camera Icon */}
          <TouchableOpacity onPress={ShowImageModal} style={styles.cameraIcon}>
            <Fontisto name="camera" size={15} color="#3061e4" />
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <ModalView
          content={
            <View style={styles.modalContent}>
              <FontAwesome
                onPress={HideImageModal}
                style={styles.modalCloseIcon}
                name="times-circle-o"
                size={24}
                color="black"
              />
              <View style={styles.modalOptions}>
                {/* Select image from gallery */}
                <TouchableOpacity
                  onPress={() => {
                    uploadImage("gallery");
                    setimageUploadModal(false);
                  }}
                  style={styles.modalOption}
                >
                  <Entypo name="images" size={35} color="#3061e4" />
                  <Text>Gallery</Text>
                </TouchableOpacity>
                {/* Select image by camera */}
                <TouchableOpacity
                  onPress={() => {
                    uploadImage("camera");
                    setimageUploadModal(false);
                  }}
                  style={styles.modalOption}
                >
                  <AntDesign name="camera" size={35} color="#3061e4" />
                  <Text>Camera</Text>
                </TouchableOpacity>

                {/* Delete image */}
                <TouchableOpacity
                  onPress={() => {
                    removeImage();
                    setimageUploadModal(false);
                  }}
                  style={styles.modalOption}
                >
                  <Entypo name="trash" size={35} color="#3061e4" />
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          modalVisible={imageUploadModal}
        />

        {/* Line */}
        <View style={styles.line} />

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
          {/* Password - Consider removing or managing state if needed */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Enter your password"
            keyboardType="default"
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  header: {
    width: "100%",
    height: "auto",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "80%",
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
  cameraIcon: {
    left: 48,
    top: -48,
    backgroundColor: "#f2f5fc",
    padding: 8,
    borderRadius: 40,
  },
  modalContent: {
    width: 370,
    height: "auto",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  modalCloseIcon: {
    alignSelf: "flex-end",
  },
  modalOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  modalOption: {
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#3061e4",
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
