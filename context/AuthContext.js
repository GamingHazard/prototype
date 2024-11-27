import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [UserToken, setUserToken] = useState(null);
  const [UserInfo, setUserInfo] = useState(null);
  const [SelectedImage, setSelectedImage] = useState(null);
  const [MainModal, setMainModal] = useState(false);
  const [UserID, setUserID] = useState(null);
  const [deleteModal, setdeleteModal] = useState(false);

  // User Regiestration
  const register = async (name, email, phone, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://uga-cycle-backend-1.onrender.com/register",
        {
          name,
          email,
          phone,
          password,
        }
      );

      let UserInfo = response.data;

      if (response.status === 201 || response.status === 200) {
        const { token, id } = UserInfo.user;
        if (token && id) {
          setUserInfo(UserInfo);
          setUserToken(token);
          setUserID(id);

          await AsyncStorage.setItem("userInfo", JSON.stringify(UserInfo));
          await AsyncStorage.setItem("userToken", token);
          await AsyncStorage.setItem("userId", id);
        } else {
          console.log("Token or ID missing in response.");
        }
      } else {
        console.log("Registration failed:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // User Login
  const login = async (identifier, password) => {
    try {
      const response = await axios.post(
        "https://uga-cycle-backend-1.onrender.com/login",
        {
          identifier,
          password,
        }
      );

      let UserInfo = response.data;

      setUserInfo(UserInfo);
      setUserToken(UserInfo.token);
      setUserID(UserInfo.user.id);

      await AsyncStorage.setItem("userInfo", JSON.stringify(UserInfo));
      await AsyncStorage.setItem("userToken", UserInfo.token);
      AsyncStorage.setItem("userId", UserInfo.user.id);

      return UserInfo;
    } catch (error) {
      throw error;
    }
  };

  // User Logout
  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    setUserID(null);
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userId");
    AsyncStorage.removeItem("userImage");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      let userToken = await AsyncStorage.getItem("userToken");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserToken(userToken);
        setUserInfo(userInfo);
        setUserID(userInfo.user.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const ShowEditPage = () => {
    setMainModal(true);
  };

  const HideEditPage = async () => {
    setMainModal(false);
  };

  const ShowDeleteModal = () => {
    setdeleteModal(true);
  };

  const HideDeleteModal = () => {
    setdeleteModal(false);
  };

  const uploadImage = async (mode) => {
    try {
      let result = {};

      // Check permissions and launch appropriate picker
      if (mode === "gallery") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert(
            "Permission Required",
            "Permission to access gallery is required!"
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        const permissionResult =
          await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert(
            "Permission Required",
            "Permission to access camera is required!"
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      // If an image is selected, display it and then start the upload process
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        // Step 1: Display the selected image immediately
        setSelectedImage(imageUri);

        // Step 2: Upload the image to Cloudinary in the background
        uploadImageToCloudinary(imageUri);
      }
    } catch (error) {
      console.log("Error selecting image: ", error);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/ghost150/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "profile-images";

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg", // Or use the correct MIME type of the image
      name: "profilePicture.jpg", // Adjust the name if needed
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        const cloudinaryUrl = data.secure_url;

        // Save the image URL and update the backend
        await saveImageToStorage(cloudinaryUrl);
      } else {
        throw new Error("Error uploading image to Cloudinary");
      }
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
    }
  };

  const saveImageToStorage = async (imageUrl) => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem("userImage", imageUrl);

      // Update user's profile picture in the backend
      await updateProfilePicture(imageUrl);

      // Optionally update UI with the Cloudinary URL if needed
      setSelectedImage(imageUrl);
    } catch (error) {
      console.log("Error saving image:", error);
    }
  };

  const updateProfilePicture = async (profilePictureUrl) => {
    try {
      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateProfilePicture/${UserID}`,
        { profilePicture: profilePictureUrl },
        { headers: { "Content-Type": "application/json" } }
      );
      const updatedUser = response.data.user;
      if (response.status === 200) {
        // Update local storage and state with latest user info, token, and ID
        await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));
        await AsyncStorage.setItem("userId", updatedUser._id);
        await AsyncStorage.setItem("userToken", updatedUser.verificationToken);

        setUserInfo(response.data);
        setUserID(updatedUser._id);
        setUserToken(updatedUser.verificationToken);

        console.log("Profile picture updated successfully:", response.data);
      } else {
        console.log("Error updating profile picture:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const removeImage = async () => {
    try {
      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateProfilePicture/${UserID}`,
        { profilePicture: "" },
        { headers: { "Content-Type": "application/json" } }
      );
      const updatedUser = response.data.user;

      if (response.status === 200) {
        setSelectedImage(null);
        await AsyncStorage.removeItem("userImage");

        // Update local storage and state with latest user info, token, and ID
        await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));
        await AsyncStorage.setItem("userId", updatedUser._id);
        await AsyncStorage.setItem("userToken", updatedUser.verificationToken);

        setUserInfo(response.data);
        setUserID(updatedUser._id);
        setUserToken(updatedUser.verificationToken);

        console.log("Profile picture updated successfully:", response.data);

        console.log("Profile picture removed  successfully:", response.data);
      } else {
        console.log("Error updating profile picture:", response.data.error);
      }
    } catch (error) {
      console.log("Error removing image: ", error);
    }
  };

  React.useEffect(() => {
    const loadImageFromStorage = async () => {
      try {
        const imageUri = await AsyncStorage.getItem("userImage");
        if (imageUri) {
          setSelectedImage(imageUri);
        }
      } catch (error) {
        console.log("Error loading image: ", error);
      }
    };

    loadImageFromStorage();
  }, []);

  // Updating user's profile

  // Updating user profile
  const updateUserProfile = async (name, email, phone, imageUri) => {
    try {
      if (!UserToken || !UserID) {
        throw new Error("UserToken or UserID is missing.");
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;

      // Upload image to Cloudinary if imageUri is provided
      if (imageUri) {
        const imageUrl = await uploadImageToCloudinary(imageUri);
        updateData.profilePicture = imageUrl;
      }

      // Send PATCH request to update the user profile
      const updateResponse = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateUser/${UserID}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${UserToken}`,
          },
        }
      );

      if (updateResponse.status === 200) {
        const updatedUser = updateResponse.data.user;

        // Display success message from the backend, if available
        Alert.alert(
          "Success",
          updateResponse.data.message || "Profile updated successfully."
        );

        // Update local storage and state with the latest user info, token, and ID
        await AsyncStorage.setItem(
          "userInfo",
          JSON.stringify(updateResponse.data)
        );
        await AsyncStorage.setItem("userId", updatedUser._id);
        await AsyncStorage.setItem("userToken", updatedUser.verificationToken);

        setUserInfo(updateResponse.data);
        setUserID(updatedUser._id);
        setUserToken(updatedUser.verificationToken); // If token needs updating, update it here
      } else {
        // Display error message from the backend, if available
        Alert.alert(
          "Error",
          updateResponse.data.message || "Failed to update profile."
        );
      }
    } catch (error) {
      // Extract the detailed error message
      const errorMessage =
        error.response?.data || error.message || "An error occurred.";

      // Display the extracted error message in an alert
      Alert.alert(
        "Error",
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );

      // Log the error message to the console for debugging
      console.error(errorMessage);
    }
  };

  const deleteUserAccount = async () => {
    try {
      const deleteResponse = await axios.delete(
        `https://uga-cycle-backend-1.onrender.com/deleteUser/${UserID}`,
        {
          headers: {
            Authorization: `Bearer ${UserToken}`,
          },
        }
      );

      if (deleteResponse.status === 200) {
        logout();
      }
    } catch (error) {
      console.log(
        "Error deleting user account:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        isLoading,
        UserToken,
        UserInfo,
        MainModal,
        ShowEditPage,
        HideEditPage,
        updateUserProfile,
        SelectedImage,
        setSelectedImage,
        uploadImage,
        removeImage,
        ShowDeleteModal,
        HideDeleteModal,
        deleteModal,
        deleteUserAccount,
        UserID,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
