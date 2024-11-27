import axios from "axios";
import Checkbox from "expo-checkbox";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import RNPickerSelect from "react-native-picker-select";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { regionDistricts } from "../../components/Districts";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";

const Swift = () => {
  const { UserID, UserToken } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [registrationType, setRegistrationType] = useState(null);
  const [pickupSchedule, setPickupSchedule] = useState(null);
  const [wasteType, setWasteType] = useState(null);
  const [region, setRegion] = useState(null);
  const [district, setDistrict] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [Status, setStatus] = useState("");
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [location, setLocation] = useState(null); // To store user location

  // Region change handler
  const handleRegionChange = (selectedRegion) => {
    setRegion(selectedRegion);
    setDistrictOptions(regionDistricts[selectedRegion] || []);
    setDistrict(null);
  };

  // Populate input fields with saved data on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `https://uga-cycle-backend-1.onrender.com/user/${UserID}/status`
        ); // Replace with your actual server URL
        setStatus(response.data.status); // Update state with fetched status
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("SwiftformData");
        const storedLocationEnabled = await AsyncStorage.getItem(
          "isLocationEnabled"
        );

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setFullName(parsedData.fullName || "");
          setEmail(parsedData.email || "");
          setPhoneNumber(parsedData.phoneNumber || "");
          setServiceType(parsedData.serviceType || "");
          setServiceType(parsedData.wasteType || "");
          setRegistrationType(parsedData.registrationType || null);
          setPickupSchedule(parsedData.pickupSchedule || null);
          setWasteType(parsedData.pickupSchedule || null);
          setRegion(parsedData.region || null);
          setDistrict(parsedData.district || null);
          setDistrictOptions(regionDistricts[parsedData.region] || []);
          setSubmissionId(parsedData.id || null); // Set submission ID
          setIsSubmitted(true); // Mark as submitted
          setIsLocationEnabled(JSON.parse(storedLocationEnabled) || false);
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };
    fetchStatus();
    loadStoredData();

    // const interval = setInterval(() => {
    //   fetchStatus();
    // }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle checkbox toggle
  const toggleLocation = async (value) => {
    setIsLocationEnabled(value); // Update the state
    await AsyncStorage.setItem("isLocationEnabled", JSON.stringify(value)); // Persist state

    if (value) {
      // Get the user's location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to capture your current location."
        );
        setIsLocationEnabled(false);
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    } else {
      setLocation(null); // Clear location when checkbox is unchecked
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !serviceType ||
      !registrationType ||
      !pickupSchedule ||
      !wasteType ||
      !region ||
      !district
    ) {
      Alert.alert(
        "Validation Error",
        "All fields are required to submit the form."
      );
      return;
    }

    setLoading(true);
    let company = "SWIFT Waste Masters LTD";
    const formData = {
      company: company.trim(),
      district: district.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      serviceType: serviceType.trim(),
      phoneNumber: phoneNumber.trim(),
      pickupSchedule: pickupSchedule.trim(),
      wasteType: wasteType.trim(),
      region: region.trim(),
      registrationType: registrationType.trim(),
      location: location,
      userId: UserID,
    };

    try {
      const response = await axios.post(
        "https://uga-cycle-backend-1.onrender.com/service_registration",
        formData
      );

      if (response.status === 200) {
        console.log(response.data);
        console.log(response.data.serviceDetails.id);

        Alert.alert(
          "Success",
          "Registered  Successfully. Please be patient as we approve your subscription You will get feedback via whatsapp or email"
        );
        const submissionData = {
          ...formData,
          id: response.data.serviceDetails.id,
        };
        setSubmissionId(response.data.serviceDetails.id);
        setIsSubmitted(true);

        // Store response in AsyncStorage
        await AsyncStorage.setItem(
          "SwiftformData",
          JSON.stringify(submissionData)
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "Submission Failed",
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle data deletion
  const handleDelete = async () => {
    let id = submissionId;
    if (!submissionId) {
      Alert.alert("Error", "No submission found to delete.");
      return;
    }

    setLoading(true);
    try {
      const deleteResponse = await axios.delete(
        ` https://uga-cycle-backend-1.onrender.com/delete-service/${id}`
      );

      if (deleteResponse.status === 200) {
        Alert.alert("Success", "Data Deleted Successfully");

        // Clear state and AsyncStorage
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setRegistrationType(null);
        setPickupSchedule(null);
        setServiceType(null);
        setRegion(null);
        setWasteType(null);
        setDistrict(null);
        setDistrictOptions([]);
        setIsSubmitted(false);
        setSubmissionId(null);

        await AsyncStorage.removeItem("SwiftformData");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log(submissionId);

      console.error("Error deleting data:", error);
      Alert.alert(
        "Deletion Failed",
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ margin: 10, borderRadius: 15 }}>
        <ImageBackground
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 15 }}
          source={{
            uri: "data:image/jpeg;base64,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",
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)"]}
            style={styles.gradientContainer}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          >
            <View style={styles.tabContentContainer}>
              <Text style={styles.tabText}>SWIFT Waste Masters LTD</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <ScrollView style={{ width: "100%", flex: 1 }}>
        <View
          style={{
            width: "100%",
            marginVertical: 15,
            backgroundColor: "white",
            padding: 16,
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Service Registration
          </Text>

          <Text
            style={{
              marginBottom: 15,
              alignSelf: "center",
              fontSize: 12,
              fontWeight: "bold",
              color: Status === "Approved" ? "teal" : "red", // Dynamic color
            }}
          >
            Status: {Status ? Status : "Not Approved"}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter valid email"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Type</Text>
            <RNPickerSelect
              onValueChange={(value) => setServiceType(value)}
              value={serviceType}
              items={[
                { label: "Individual", value: "Individual" },
                { label: "Organization", value: "Organization" },
                { label: "Industry", value: "Industry" },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Waste Type</Text>
            <RNPickerSelect
              onValueChange={(value) => setWasteType(value)}
              value={wasteType}
              items={[
                {
                  label: "Bio-Degradable(rotting)",
                  value: "Bio-Degradable(rotting)",
                },
                {
                  label: "Non Bio-Degradable(non-rotting)",
                  value: "Non Bio-Degradable(non-rotting)",
                },
                { label: "Both", value: "Both" },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Region</Text>
            <RNPickerSelect
              onValueChange={handleRegionChange}
              value={region}
              items={[
                { label: "Central", value: "Central" },
                { label: "Eastern", value: "Eastern" },
                { label: "Northern", value: "Northern" },
                { label: "Western", value: "Western" },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select District</Text>
            <RNPickerSelect
              onValueChange={(value) => setDistrict(value)}
              value={district}
              items={districtOptions.map((district) => ({
                label: district,
                value: district,
              }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Registration Type</Text>
            <RNPickerSelect
              onValueChange={(value) => setRegistrationType(value)}
              value={registrationType}
              items={[
                { label: "Mothnly", value: "Mothnly" },
                { label: "Mid-Year", value: "Mid-Year" },
                { label: "Annualy", value: "Annualy" },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pickup Schedule</Text>
            <RNPickerSelect
              onValueChange={(value) => setPickupSchedule(value)}
              value={pickupSchedule}
              items={[
                { label: "Weekly", value: "Weekly" },
                { label: "Bi-weekly", value: "Bi-weekly" },
                { label: "Monthly", value: "Monthly" },
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                value={isLocationEnabled}
                onValueChange={toggleLocation}
                color={isLocationEnabled ? "#008080" : undefined}
              />
              <Text style={{ marginLeft: 8 }}>
                Add your Current Location to act as your garbage pickup point
              </Text>
            </View>
          </View>

          {/* Conditional Button Rendering */}
          {isSubmitted ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  "Unsubscribe"
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  "Subscribe"
                )}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            width: "100%",
            padding: 15,

            marginVertical: 16,
            backgroundColor: "whitesmoke",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Support and CustomerCare
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginTop: 10,
              backgroundColor: "white",
              padding: 15,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            <FontAwesome
              style={{ marginHorizontal: 10, flex: 1 }}
              name="phone"
              size={24}
              color="black"
            />
            <Text style={{ alignSelf: "flex-end" }}>(+256)-414-530-999</Text>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginTop: 4,
              backgroundColor: "white",
              padding: 15,
            }}
          >
            <FontAwesome
              style={{ marginHorizontal: 10, flex: 1 }}
              name="whatsapp"
              size={24}
              color="black"
            />
            <Text style={{ alignSelf: "flex-end" }}>0758892937</Text>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginTop: 4,
              backgroundColor: "white",
              padding: 15,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <FontAwesome
              style={{ marginHorizontal: 10, flex: 1 }}
              name="envelope"
              size={24}
              color="black"
            />
            <Text style={{ alignSelf: "flex-end" }}>
              swiftcaresupport@gmail.co.ug
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Swift;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  backgroundImage: {
    width: "100%",
    height: 150,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  tabContentContainer: {
    padding: 10,
    alignItems: "center",
  },
  tabText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }, // Other styles
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: "teal",
    borderRadius: 3,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "crimson",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
});
