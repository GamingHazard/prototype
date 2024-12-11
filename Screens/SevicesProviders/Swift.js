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
  Image,
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
  const { UserID } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceType, setServiceType] = useState(null);
  const [registrationType, setRegistrationType] = useState(null);
  const [pickupSchedule, setPickupSchedule] = useState(null);
  const [wasteType, setWasteType] = useState(null);
  const [region, setRegion] = useState(null);
  const [district, setDistrict] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [loading, setLoading] = useState(false);
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
          "SwiftisLocationEnabled"
        );

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setFullName(parsedData.fullName || "");
          setEmail(parsedData.email || "");
          setPhoneNumber(parsedData.phoneNumber || "");
          setServiceType(parsedData.serviceType || null);
          setWasteType(parsedData.wasteType || null);
          setRegistrationType(parsedData.registrationType || null);
          setPickupSchedule(parsedData.pickupSchedule || null);
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
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Handle checkbox toggle
  const toggleLocation = async (value) => {
    setIsLocationEnabled(value); // Update the state
    await AsyncStorage.setItem("SwiftisLocationEnabled", JSON.stringify(value)); // Persist state

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
        await AsyncStorage.removeItem("SwiftisLocationEnabled");
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
      <View style={{ elevation: 10 }}>
        <Image
          source={{
            uri: "data:image/jpeg;base64,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",
          }}
          style={{ width: "100%", height: 300, resizeMode: "stretch" }}
        />
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
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Subscription Fees (UGX)
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
            <Text style={{ marginHorizontal: 10, flex: 1, fontWeight: "bold" }}>
              Monthly
            </Text>
            <Text style={{ alignSelf: "flex-end" }}>100,000.0 Shs</Text>
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
            <Text style={{ marginHorizontal: 10, flex: 1, fontWeight: "bold" }}>
              Mid-Year
            </Text>
            <Text style={{ alignSelf: "flex-end" }}>590,000.0 Shs</Text>
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
            <Text style={{ marginHorizontal: 10, flex: 1, fontWeight: "bold" }}>
              Annualy
            </Text>
            <Text style={{ alignSelf: "flex-end" }}>1,100,000.0 Shs</Text>
          </View>
        </View>
        {/* Payment methods */}
        <View
          style={{
            width: "100%",
            padding: 15,
            marginVertical: 16,
            backgroundColor: "whitesmoke",
            borderRadius: 10,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Supported Payment Methods
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
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Image
                source={{
                  uri: "data:image/png;base64,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",
                }}
                style={{ width: 90, height: 90, marginHorizontal: 10 }}
              />
              <Image
                source={{
                  uri: "data:image/png;base64,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",
                }}
                style={{ width: 90, height: 90, marginHorizontal: 10 }}
              />
              <Image
                source={{
                  uri: "data:image/png;base64,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",
                }}
                style={{ width: 90, height: 90, marginHorizontal: 10 }}
              />
              <Image
                source={{
                  uri: "data:image/png;base64,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",
                }}
                style={{ width: 90, height: 90, marginHorizontal: 10 }}
              />
              <Image
                source={{
                  uri: "data:image/png;base64,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",
                }}
                style={{ width: 90, height: 90, marginHorizontal: 10 }}
              />
              <Image
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS824JUZsQ44lV17N2y8WivpxyU-vkWwERNdA&s",
                }}
                style={{ width: 110, height: 90, marginHorizontal: 10 }}
              />
            </ScrollView>
          </View>
        </View>
        {/* Support  */}
        <View
          style={{
            width: "100%",
            padding: 15,
            marginVertical: 16,
            backgroundColor: "whitesmoke",
            borderRadius: 10,
            marginHorizontal: 10,
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
            <Text style={{ alignSelf: "flex-end" }}>0758892937</Text>
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
            <Text style={{ alignSelf: "flex-end" }}>(+256)-414-530-999</Text>
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
            <Text style={{ alignSelf: "flex-end" }}>swiftwaste@yahoo.com</Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",

            marginTop: 10,
            backgroundColor: "white",
            padding: 18,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Note !</Text>

          <Text style={{ color: "black", fontSize: 16, flexWrap: "wrap" }}>
            If you want to make any changes, Unsubscribe an re subscribe again.
          </Text>
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
  },
  backgroundImage: {
    width: "100%",
    height: 300,
    top: -10,
  },

  tabText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
