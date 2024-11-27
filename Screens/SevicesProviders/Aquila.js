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

const Aquila = () => {
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
        const storedData = await AsyncStorage.getItem("AquilaformData");
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
    let company = "Aquila Recycling Plant";
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
          "AquilaformData",
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

        await AsyncStorage.removeItem("AquilaformData");
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
              <Text style={styles.tabText}>Aquila Recycling Plant</Text>
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
            <Text style={{ alignSelf: "flex-end" }}>0759 949494</Text>
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
            <Text style={{ alignSelf: "flex-end" }}>0759 949494</Text>
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
              aquilasupport.help@gmail.co.ug
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Aquila;

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
