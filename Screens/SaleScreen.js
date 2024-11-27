import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreatePost from "../components/CreatePost";

const SaleScreen = () => {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const SCROLL_POSITION_KEY = "scrollPosition";
  const POSTS_KEY = "posts";
  const inactivityTimeoutRef = useRef(null); // To track inactivity

  // Fetch posts initially and set up periodic updates
  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // When screen is focused, fetch new posts and restore scroll position
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      restoreScrollPosition(); // Restore the scroll position when screen is focused
    }, [])
  );

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://uga-cycle-backend-1.onrender.com/get-SalePosts"
      );
      const fetchedPosts = response.data;

      // Update AsyncStorage with the fetched posts
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(fetchedPosts));
      setPosts(fetchedPosts); // Update the state with the fetched posts
    } catch (error) {
      console.log("Error fetching posts:", error);
      // If the fetch fails, try to load cached posts from AsyncStorage
      loadPostsFromStorage();
    }
  };

  // Load posts from AsyncStorage
  const loadPostsFromStorage = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem(POSTS_KEY);
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts)); // Update the state with cached posts
      }
    } catch (error) {
      console.log("Error loading posts from storage:", error);
    }
  };

  const restoreScrollPosition = async () => {
    try {
      const savedPosition = await AsyncStorage.getItem(SCROLL_POSITION_KEY);
      if (savedPosition && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: parseFloat(savedPosition),
          animated: false,
        });
      }
    } catch (error) {
      console.log("Error restoring scroll position:", error);
    }
  };

  const saveScrollPosition = async (event) => {
    try {
      const scrollPosition = event.nativeEvent.contentOffset.y;
      await AsyncStorage.setItem(
        SCROLL_POSITION_KEY,
        scrollPosition.toString()
      );
    } catch (error) {
      console.log("Error saving scroll position:", error);
    }
  };

  const refreshPosts = () => {
    fetchPosts();
  };

  const scrollToLatestPost = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Function to handle tap or scroll to show the floating button
  const handleUserInteraction = () => {
    setIsButtonVisible(true);
    resetInactivityTimeout();
  };

  // Function to reset inactivity timeout
  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsButtonVisible(false);
    }, 1000); // Hide the button after 3 seconds of inactivity
  };

  return (
    <View style={styles.container} onTouchStart={handleUserInteraction}>
      <View style={styles.header}>
        <Text
          style={{
            color: "#fbfbda",
            fontSize: 24,
            flex: 1,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Sale recyclable Wastes
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="shoppingcart" size={24} color="#3b6d3b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={(event) => {
          saveScrollPosition(event);
          handleUserInteraction(); // Show the button when scrolling
        }}
        scrollEventThrottle={16} // Adjusts the frequency of scroll events
      >
        {modalVisible && (
          <BlurView intensity={30} style={styles.absolute}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.overlay}>
                <View style={styles.modalView}>
                  <AntDesign
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                    name="close"
                    size={30}
                    color="#fbfbda"
                  />
                  <CreatePost refreshPosts={refreshPosts} />
                </View>
              </View>
            </Modal>
          </BlurView>
        )}

        <View style={styles.postsContainer}>
          {[...posts].reverse().map((post) => (
            <View key={post._id} style={styles.postContainer}>
              <View style={styles.postFooter}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri:
                      post.user?.profilePicture ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{post.user?.name}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(post.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{post.companyName}</Text>
                <Text style={styles.postSubtitle}>{post.telNumber}</Text>
                <Text style={styles.postText}>{post.content}</Text>

                {post.items.map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <Text style={styles.itemText}>
                      1kg {item.item} - {item.price} Shs
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {isButtonVisible && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={scrollToLatestPost}
        >
          <AntDesign name="arrowdown" size={24} color="#fbfbda" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#3b6d3b",
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    elevation: 10,
  },
  addButton: {
    backgroundColor: "#fbfbda",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#3b6d3b",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    height: 600,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginBottom: -10,
  },
  postsContainer: {
    paddingTop: 10,
    padding: 15,
  },
  postContainer: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  postFooter: {
    flexDirection: "row",
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  userInfo: {
    justifyContent: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
  },
  postContent: {
    paddingLeft: 12,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  postSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  postText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 6,
  },
  itemText: {
    fontSize: 14,
    color: "#777",
  },
  floatingButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#3b6d3b",
    borderRadius: 50,
    padding: 12,
    elevation: 8,
  },
});

export default SaleScreen;
