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
  const [UserRole, setUserRole] = useState(null);

  // Helper function to handle async storage loading and saving
  const loadFromStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error loading from storage:", error);
      return null;
    }
  };

  const saveToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  };

  // User Registration
  const register = async (name, email, phone, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://uga-cycle-backend-1.onrender.com/register",
        { name, email, phone, password }
      );

      if (response.status === 200 || response.status === 201) {
        const { token, id } = response.data.user;
        if (token && id) {
          setUserInfo(response.data);
          setUserToken(token);
          setUserID(id);

          await saveToStorage("userInfo", response.data);
          await saveToStorage("userToken", token);
          await saveToStorage("userId", id);
        } else {
          Alert.alert("Error", "Token or ID missing in response.");
        }
      } else {
        Alert.alert("Error", response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      Alert.alert("Error", error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      // Try to login as an Admin first
      const response = await axios.post(
        "https://uga-cycle-backend-1.onrender.com/admin-login",
        { identifier, password }
      );

      // If admin-login is successful, process the response
      const { token, user } = response.data;
      setUserInfo(response.data);
      setUserToken(token);
      setUserID(user.id);
      setUserRole(user.role);

      // Save to local storage
      await saveToStorage("userInfo", response.data);
      await saveToStorage("userToken", token);
      await saveToStorage("userId", user.id);
      await saveToStorage("userRole", user.role);

      return response.data; // Return successful admin login data
    } catch (error) {
      // If admin-login fails, check if it's the admin login error
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 401)
      ) {
        console.log("Admin login failed, trying user login...");

        try {
          // Attempt the regular user login if admin-login fails
          const response = await axios.post(
            "https://uga-cycle-backend-1.onrender.com/login",
            { identifier, password }
          );

          // If user-login is successful, process the response
          const { token, user } = response.data;
          setUserInfo(response.data);
          setUserToken(token);
          setUserID(user.id);
          setUserRole(user.role);

          // Save to local storage
          await saveToStorage("userInfo", response.data);
          await saveToStorage("userToken", token);
          await saveToStorage("userId", user.id);

          return response.data; // Return successful user login data
        } catch (error) {
          // If both login attempts fail
          throw new Error(error.response?.data?.message || error.message);
        }
      } else {
        // If admin-login failed for some reason other than 401, throw error
        throw new Error(error.response?.data?.message || error.message);
      }
    }
  };

  // User Logout
  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    setUserID(null);
    await AsyncStorage.clear();
    setIsLoading(false);
  };

  // Check if user is logged in
  const isLoggedIn = async () => {
    setIsLoading(true);
    const userInfo = await loadFromStorage("userInfo");
    const userToken = await loadFromStorage("userToken");

    if (userInfo && userToken) {
      setUserInfo(userInfo);
      setUserToken(userToken);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  // Profile Edit Modal Toggle
  const ShowEditPage = () => setMainModal(true);
  const HideEditPage = () => setMainModal(false);

  // Image Picker Logic
  const uploadImage = async (mode) => {
    try {
      let result = {};

      // Check permissions and pick image
      if (mode === "gallery") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission Required", "Gallery permission is required.");
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
          Alert.alert("Permission Required", "Camera permission is required.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        await uploadImageToCloudinary(imageUri);
      }
    } catch (error) {
      console.log("Error selecting image: ", error);
    }
  };

  // Upload Image to Cloudinary
  const uploadImageToCloudinary = async (imageUri) => {
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/ghost150/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "profile-images";

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profilePicture.jpg",
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        await saveImageToStorage(data.secure_url);
        await saveImageToStorage();
      } else {
        throw new Error("Error uploading image to Cloudinary");
      }
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
    }
  };

  // Save image URL to AsyncStorage and update backend
  const saveImageToStorage = async (imageUrl) => {
    try {
      await updateProfilePicture(imageUrl);
    } catch (error) {
      Alert.alert(
        "Failed!",
        error.message +
          "                                             " +
          "Please check you internet connection and try again"
      );
      console.log("Error saving image:", error);
    }
  };

  // Update Profile Picture in Backend
  const updateProfilePicture = async (profilePictureUrl) => {
    try {
      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateProfilePicture/${UserID}`,
        { profilePicture: profilePictureUrl },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        let profile = response.data;
        let Id = response.data.user._id;
        console.log(Id);

        setUserInfo(profile);

        setUserID(Id);
        await saveToStorage("userInfo", profile);
        await saveToStorage("userId", Id);
        setSelectedImage(profilePictureUrl);
      }
    } catch (error) {
      console.log("Error updating profile picture:", error);
    }
  };

  // Remove Profile Picture
  const removeImage = async () => {
    try {
      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateProfilePicture/${UserID}`,
        { profilePicture: "" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setSelectedImage(null);
        setUserInfo(response.data);
        setUserID(response.data.user._id);
        await saveToStorage("userInfo", response.data);
        await saveToStorage("userId", response.data.user._id);
      }
    } catch (error) {
      Alert.alert(
        "Failed!",
        error.message +
          "                                             " +
          "                                             " +
          "Please check you internet connection and try again"
      );
      console.log("Error removing image: ", error);
    }
  };

  // Update User Profile
  const updateUserProfile = async (name, email, phone) => {
    try {
      const updateData = { name, email, phone };

      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateUser/${UserID}`,
        updateData,
        { headers: { Authorization: `Bearer ${UserToken}` } }
      );

      if (response.status === 200) {
        await saveToStorage("userInfo", response.data);
        setUserInfo(response.data);
        setUserID(response.data.user._id);
        setUserToken(response.data.verificationToken);
        Alert.alert("Success", "Profile updated successfully.");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert(
        "Failed!",
        error.message +
          "                                             " +
          "                                             " +
          "Please check you internet connection and try again"
      );
    }
  };

  // Delete User Account
  const deleteUserAccount = async () => {
    try {
      const response = await axios.delete(
        `https://uga-cycle-backend-1.onrender.com/deleteUser/${UserID}`,
        {
          headers: { Authorization: `Bearer ${UserToken}` },
        }
      );

      if (response.status === 200) {
        // Clear local storage and reset state on successful deletion
        Alert.alert("Success", "Account deleted successfully.");
        await logout();
      } else {
        Alert.alert("Error", "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      Alert.alert(
        "Failed!",
        error.message + "Please check your internet connection and try again"
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

        deleteModal,
        deleteUserAccount,
        UserID,
        updateProfilePicture,
        UserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
