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

const YoWaste = () => {
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
        const storedData = await AsyncStorage.getItem("YoWasteformData");
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

    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);

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
    let company = "YO WASTE (U) LTD";
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
          "YoWasteformData",
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

        await AsyncStorage.removeItem("YoWasteformData");
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
            uri: "data:image/png;base64,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",
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)"]}
            style={styles.gradientContainer}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          >
            <View style={styles.tabContentContainer}>
              <Text style={styles.tabText}>YO WASTE (U) LTD</Text>
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
            <Text style={{ alignSelf: "flex-end" }}>039-324-6589</Text>
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
            <Text style={{ alignSelf: "flex-end" }}>039-324-6589</Text>
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
              yosupportcare.help@gmail.co.ug
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default YoWaste;

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
