import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";

const TrashReminder = () => {
  const [selectedDays, setSelectedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Load saved days and time from AsyncStorage when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      const savedDays = await AsyncStorage.getItem("selectedDays");
      const savedTime = await AsyncStorage.getItem("reminderTime");
      if (savedDays) setSelectedDays(JSON.parse(savedDays));
      if (savedTime) setReminderTime(new Date(JSON.parse(savedTime)));
    };
    loadSettings();
  }, []);

  // Save selected days and time to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem("selectedDays", JSON.stringify(selectedDays));
    AsyncStorage.setItem("reminderTime", JSON.stringify(reminderTime));
  }, [selectedDays, reminderTime]);

  // Toggle selection for a day
  const toggleDay = (day) => {
    setSelectedDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  // Handle time change from time picker
  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setReminderTime(selectedTime);
  };

  // Reset selected days and time
  const resetSettings = async () => {
    const defaultTime = new Date();
    defaultTime.setHours(7); // Default to 7:00 AM
    defaultTime.setMinutes(0);

    setSelectedDays({
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    });
    setReminderTime(defaultTime);

    await AsyncStorage.removeItem("selectedDays");
    await AsyncStorage.removeItem("reminderTime");

    Alert.alert("Settings Reset", "Reminder days and time have been reset.");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          backgroundColor: "#3b6d3b",
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text style={styles.header}>Garbage Reminder</Text>
      </View>

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          padding: 15,
          backgroundColor: "whitesmoke",
        }}
      >
        <Text style={{ color: "grey", marginBottom: 16 }}>
          Days of the week
        </Text>
        {Object.keys(selectedDays).map((day) => (
          <View key={day} style={styles.dayRow}>
            <Text style={styles.dayText}>{day}</Text>
            <Switch
              value={selectedDays[day]}
              onValueChange={() => toggleDay(day)}
            />
          </View>
        ))}
        <Text style={{ color: "grey", marginVertical: 16 }}>Time</Text>

        <View
          style={{
            padding: 10,
            backgroundColor: "white",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <View style={styles.timePickerContainer}>
            <Text style={styles.timeText}>
              Reminder Time:{" "}
              {reminderTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Button title="Set Time" onPress={() => setShowTimePicker(true)} />
          </View>
          <View
            style={{
              padding: 5,
              width: "100%",
              backgroundColor: "whitesmoke",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "grey" }}>
              This will be the time you will get reminded about taking out your
              trash
            </Text>
          </View>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={onChangeTime}
          />
        )}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryHeader}>
            Reminder <AntDesign name="bells" size={24} color="#fbfbda" />
          </Text>
          <Text style={styles.summaryText}>
            Selected Days:{" "}
            {Object.keys(selectedDays)
              .filter((day) => selectedDays[day])
              .join(", ") || "None"}
          </Text>
          <Text style={styles.summaryText}>
            Reminder Time:{" "}
            {reminderTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Button title="Reset Settings" color="red" onPress={resetSettings} />
        </View>
        <View style={{ height: 70, width: "100%" }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fbfbda",
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  dayText: {
    fontSize: 16,
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  timeText: {
    fontSize: 16,
  },
  summaryContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#3b6d3b",
    borderRadius: 10,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fbfbda",
  },
  summaryText: {
    fontSize: 16,
    color: "#fbfbda",
    fontWeight: "bold",
  },
});

export default TrashReminder;
