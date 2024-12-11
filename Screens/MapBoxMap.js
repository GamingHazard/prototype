import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";

const MapboxMap = () => {
  const { logout } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [center, setCenter] = useState(null); // Start with `null` center

  const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiYmVuYnJ1Y2UiLCJhIjoiY200YWV3bmwwMDZqZDJpcXpseTJka29pbiJ9.iTKYAZDJWV-HXavpNUwPZA";

  const fetchApprovedServices = async () => {
    try {
      const response = await axios.get(
        "https://uga-cycle-backend-1.onrender.com/services/approved"
      );
      const fetchedServices = response.data.services;
      setServices(fetchedServices);

      if (fetchedServices.length > 0) {
        const averageLat =
          fetchedServices.reduce(
            (acc, service) => acc + service.location.latitude,
            0
          ) / fetchedServices.length;
        const averageLng =
          fetchedServices.reduce(
            (acc, service) => acc + service.location.longitude,
            0
          ) / fetchedServices.length;
        setCenter({ latitude: averageLat, longitude: averageLng });
      }
    } catch (err) {
      console.error("Error fetching approved services:", err);
    }
  };

  // Periodic fetch function using setTimeout to avoid blocking UI
  const periodicFetch = () => {
    fetchApprovedServices();
    setTimeout(periodicFetch, 5000); // Continue fetching every 5 seconds without blocking
  };

  useEffect(() => {
    // Initial fetch when component mounts
    fetchApprovedServices();

    // Start the periodic fetch in the background
    periodicFetch();
  }, []);

  // Conditional rendering to ensure center is fetched before rendering the map
  if (center === null) {
    // If center is still null, don't render the map yet
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        customMapStyle={[
          {
            elementType: "geometry",
            stylers: [
              {
                hue: "lightgreen",
                saturation: 0,
                lightness: 1,
              },
            ],
          },
        ]}
        tileUrlTemplate={`https://api.mapbox.com/styles/v1/benbruce/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
        zoomEnabled={true}
        zoomControlEnabled={true}
      >
        {services.map((service) => (
          <Marker
            key={service.id}
            coordinate={{
              latitude: service.location.latitude,
              longitude: service.location.longitude,
            }}
            title={service.fullName}
            description={`District--- ${service.district}`}
          />
        ))}
      </MapView>

      {/* Floating Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
        <AntDesign name="logout" size={18} color="lightgrey" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  logoutButton: {
    position: "absolute", // Position the button absolutely on top of the map
    bottom: 20, // Distance from the bottom
    left: 20, // Distance from the left edge (instead of right)
    width: 150,
    height: 50,
    backgroundColor: "#3b6d3b",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure the button is on top of the map
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
});

export default MapboxMap;
