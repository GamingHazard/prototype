import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import ModalView from "../components/Modal";
import ProfileEditScreen from "./EditProfile";
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const ProfileScreen = () => {
  const {
    ShowEditPage,
    HideEditPage,
    MainModal,
    SelectedImage,
    UserInfo,
    uploadImage,
    removeImage,
  } = useContext(AuthContext);

  const [user, setUser] = useState(UserInfo?.user || {});
  const [imageUploadModal, setimageUploadModal] = useState(false);

  const ShowImageModal = () => {
    setimageUploadModal(true);
  };

  const HideImageModal = () => {
    setimageUploadModal(false);
  };

  // Update user state when UserInfo changes
  useEffect(() => {
    if (UserInfo?.user) {
      setUser(UserInfo.user);
    }
  }, [UserInfo]);

  const userName = user.name || "Name of User";
  const userPhone = user.phone ? `(+256)-${user.phone}` : "Phone not available";
  const userEmail = user.email || "Email not available";
  const ProfilePicture = user.profilePicture;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>
      <View style={styles.profileContainer}>
        <View style={styles.profilePicContainer}>
          <Image
            source={
              ProfilePicture
                ? { uri: ProfilePicture }
                : {
                    uri: SelectedImage,
                  } || {
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }
            }
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 70,
              resizeMode: "cover",
              // bottom: 20,
            }}
          />
          {/* Camera Icon */}
          <Fontisto
            onPress={ShowImageModal}
            name="camera"
            size={20}
            color="#3b6d3b"
            style={{ alignSelf: "flex-end", top: -25 }}
          />
        </View>

        <View style={{ height: 30, width: "100%" }} />

        {/* Edit Profile Modal */}
        <ModalView
          content={
            <View style={styles.modalContent}>
              <FontAwesome
                onPress={HideImageModal}
                style={styles.modalCloseIcon}
                name="times-circle-o"
                size={40}
                color="#3b6d3b"
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
                  <Entypo name="images" size={35} color="#3b6d3b" />
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
                  <AntDesign name="camera" size={35} color="#3b6d3b" />
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
                  <Entypo name="trash" size={35} color="#3b6d3b" />
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          modalVisible={imageUploadModal}
          modalStyle={styles.imgModal}
        />

        <View style={styles.tabs}>
          <Text style={{ fontSize: 24, fontWeight: "bold", flex: 1 }}>
            Username
          </Text>
          <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
            {userName}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.tabs}>
          <Text style={{ fontSize: 24, fontWeight: "bold", flex: 1 }}>
            Email
          </Text>
          <Text style={{ fontSize: 18, fontFamily: "monospace", width: "80%" }}>
            {userEmail}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.tabs}>
          <Text style={{ fontSize: 24, fontWeight: "bold", flex: 1 }}>
            Tel Number
          </Text>
          <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
            {userPhone}
          </Text>
        </View>
        <View style={styles.line} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            padding: 10,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={ShowEditPage}
            style={styles.editProfileButton}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <ModalView
        HideModal={HideEditPage}
        content={
          <ProfileEditScreen
            FetchProfileUpdate={HideEditPage}
            cancel={HideEditPage}
          />
        }
        modalVisible={MainModal}
        modalStyle={styles.modalStyle}
      />
      {/* account deleting Modal */}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
    padding: 15,
    flexDirection: "row",
  },
  modalStyle: { height: 410 },
  modalContent: {
    width: 370,
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
  cameraIcon: {
    backgroundColor: "#f2f5fc",

    borderRadius: 40,
  },
  line: {
    width: "100%",
    height: 1,
    borderWidth: 0.5,
    borderColor: "lightgrey",
  },
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: "auto",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 26,
    marginVertical: 10,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // height: 300,
    // top: 20,
    backgroundColor: "white",
    paddingTop: 10,
  },
  profilePicContainer: {
    height: 120,
    width: 120,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#3b6d3b",
    padding: 4,
    // marginVertical: 10,
    // top: 20,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 25,
  },
  userHandle: {
    fontSize: 16,
  },
  editProfileButton: {
    backgroundColor: "#3b6d3b",
    padding: 10,
    borderRadius: 30,
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  editProfileText: {
    fontSize: 16,
    color: "#fbfbda",
  },
  divider: {
    height: 0.5,
    width: 280,
    borderWidth: 0.5,
    borderColor: "whitesmoke",
    left: 20,
    right: 20,
  },
  logoutButton: {
    width: "100%",
    height: 50,
    alignItems: "center",
    backgroundColor: "#c9d0e0",
    alignSelf: "center",
    marginVertical: 30,
    borderRadius: 40,
    paddingHorizontal: 40,
  },
  logoutButtonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    fontWeight: "bold",
    fontSize: 30,
    color: "whitesmoke",
  },
});

export default ProfileScreen;
