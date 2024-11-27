import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const CreatePost = ({ refreshPosts }) => {
  const { UserID } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState("");
  const [telNumber, setTelNumber] = useState("");
  const [content, setContent] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [itemsList, setItemsList] = useState([]); // To store multiple items and prices
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://uga-cycle-backend-1.onrender.com/profile/${UserID}`
        );
        setUser(response.data.user);
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleAddItem = () => {
    if (item && price) {
      setItemsList([...itemsList, { item, price }]);
      setItem("");
      setPrice("");
    } else {
      Alert.alert("Error", "Please enter both item and price.");
    }
  };

  const handlePostSubmit = () => {
    if (!content.trim() || !companyName.trim() || !telNumber.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const postData = {
      userId: UserID,
      companyName,
      telNumber,
      content: content.trim(),
      items: itemsList, // Include the items list in the post data
    };

    setLoading(true);

    axios
      .post(
        "https://uga-cycle-backend-1.onrender.com/create-SalePosts",
        postData
      )
      .then(() => {
        setCompanyName("");
        setTelNumber("");
        setContent("");
        setItemsList([]);
        setLoading(false);
        refreshPosts();
      })
      .catch((error) => {
        console.log("Error creating post:", error);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Company name"
          placeholderTextColor="lightgrey"
          value={companyName}
          onChangeText={setCompanyName}
          style={styles.textInput}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Tel number"
          placeholderTextColor="lightgrey"
          value={telNumber}
          onChangeText={setTelNumber}
          keyboardType="phone-pad"
          style={styles.textInput}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter description"
          placeholderTextColor="lightgrey"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.textInput}
        />
      </View>
      <View style={styles.itemContainer}>
        <TextInput
          placeholder="Item"
          placeholderTextColor="lightgrey"
          value={item}
          onChangeText={setItem}
          style={styles.itemInput}
        />
        <TextInput
          placeholder="Price @kg"
          placeholderTextColor="lightgrey"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.itemInput}
        />
        <FontAwesome
          name="plus-square"
          size={40}
          color="#fbfbda"
          onPress={handleAddItem}
        />
      </View>
      <ScrollView style={styles.itemsList}>
        {itemsList.map((entry, index) => (
          <Text key={index} style={styles.itemText}>
            {entry.item} - {entry.price} Shs
          </Text>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#fbfbda" />
        ) : (
          <Pressable onPress={handlePostSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Share Post</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  inputContainer: {
    marginVertical: 10,
    width: 300,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    backgroundColor: "#fbfbda",
  },
  textInput: {
    padding: 10,
    fontSize: 16,
    color: "black",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  itemInput: {
    width: "41%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    backgroundColor: "#fbfbda",
    color: "black",
    marginHorizontal: 5,
  },
  itemsList: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 8,
    marginVertical: 10,
    borderRadius: 10,
    width: 300,
  },
  itemText: {
    fontSize: 16,
    color: "#3b6d3b",
    marginVertical: 5,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fbfbda",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#4c7c54",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreatePost;
