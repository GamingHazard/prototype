import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CommunityScreen = () => {
  const { UserID } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [isVisible, setisVisible] = useState(false);
  const [content, setContent] = useState("");
  const [isFloatingBtnVisible, setIsFloatingBtnVisible] = useState(false); // State for button visibility
  const scrollViewRef = useRef();

  const handleChange = (text) => setContent(text);

  const handlePostSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter content before submitting.");
      return;
    }

    const postData = {
      userId: UserID,
      content: content.trim(),
    };

    try {
      setLoading2(true);
      const response = await axios.post(
        "https://uga-cycle-backend-1.onrender.com/create-post",
        postData
      );

      if (response.status === 200) {
        setContent("");
        fetchPosts(); // Refresh posts after submission
      } else {
        Alert.alert("Error", "Failed to submit post. Please try again.");
      }
    } catch (error) {
      console.log("Error creating post", error);
    } finally {
      setLoading2(false);
    }
  };

  const fetchPosts = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const response = await axios.get(
        "https://uga-cycle-backend-1.onrender.com/get-posts"
      );
      setPosts(response.data);

      // Save fetched posts to AsyncStorage
      await AsyncStorage.setItem("posts", JSON.stringify(response.data));
    } catch (error) {
      console.log("Error fetching posts", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const saveScrollPosition = async (yOffset) => {
    try {
      await AsyncStorage.setItem("scrollPosition", JSON.stringify(yOffset));
    } catch (error) {
      console.log("Error saving scroll position", error);
    }
  };

  const loadScrollPosition = async () => {
    try {
      const savedPosition = await AsyncStorage.getItem("scrollPosition");
      if (savedPosition && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: parseFloat(savedPosition),
          animated: true,
        });
      }
    } catch (error) {
      console.log("Error loading scroll position", error);
    }
  };

  useEffect(() => {
    const loadPostsFromStorage = async () => {
      try {
        const storedPosts = await AsyncStorage.getItem("posts");
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        }
      } catch (error) {
        console.log("Error loading posts from storage", error);
      } finally {
        setLoading(false);
      }
    };

    loadPostsFromStorage();
    fetchPosts(true);
    loadScrollPosition(); // Scroll to last saved position on mount

    const interval = setInterval(() => {
      fetchPosts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      loadScrollPosition(); // Reload scroll position on focus
    }, [])
  );

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `https://uga-cycle-backend-1.onrender.com/posts/${postId}/${UserID}/like`
      );
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );

      // Update AsyncStorage with the new post data
      await AsyncStorage.setItem("posts", JSON.stringify(posts));
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `https://uga-cycle-backend-1.onrender.com/posts/${postId}/${UserID}/unlike`
      );
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );

      // Update AsyncStorage with the new post data
      await AsyncStorage.setItem("posts", JSON.stringify(posts));
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const scrollToLatestPost = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    // Show floating button if scrolling down
    setIsFloatingBtnVisible(yOffset > 200); // You can adjust the scroll position threshold as needed
    saveScrollPosition(yOffset);
  };

  // Function to handle touch events and make the button visible temporarily
  const handleTouch = () => {
    setIsFloatingBtnVisible(true);
    // Hide the button after 3 seconds
    setTimeout(() => {
      setIsFloatingBtnVisible(false);
    }, 3000); // Adjust the duration as needed
  };

  return (
    <View style={styles.container} onTouchStart={handleTouch}>
      {/* Detect touch */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.headerText}>Community</Text>
        </View>
        <TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="small" color="#fbfbda" />
          ) : (
            <AntDesign name="bells" size={24} color="#fbfbda" />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        onScroll={handleScroll} // Add the scroll handler here
        scrollEventThrottle={16}
      >
        <View style={styles.postsContainer}>
          {posts
            .slice()
            .reverse()
            .map((post) => (
              <View key={post._id} style={styles.postContainer}>
                <View style={styles.postFooter}>
                  <Image
                    style={styles.profileImage}
                    source={
                      post?.user?.profilePicture
                        ? { uri: post?.user?.profilePicture }
                        : {
                            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                          }
                    }
                  />
                  <View>
                    <Text style={styles.username}>{post?.user?.name}</Text>
                    <Text style={styles.timestamp}>
                      {new Date(post?.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.postContent}>
                  <Text style={styles.postText}>{post?.content}</Text>
                  <View style={styles.likesContainer}>
                    <Text style={styles.likesCount}>
                      {post?.likes?.length} likes
                    </Text>
                    {post?.likes?.includes(UserID) ? (
                      <TouchableOpacity
                        onPress={() => handleDislike(post?._id)}
                      >
                        <AntDesign name="heart" size={18} color="#3b6d3b" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => handleLike(post?._id)}>
                        <AntDesign name="hearto" size={18} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
        </View>
        <View style={{ width: "100%", height: 30 }} />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Write your post here..."
          value={content}
          onChangeText={handleChange}
        />
        <TouchableOpacity
          onPress={handlePostSubmit}
          disabled={!content.trim()} // Disable the button if the input is empty or whitespace
          style={[
            styles.sendButton,
            { opacity: content.trim() ? 1 : 0.5 }, // Adjust opacity based on button state
          ]}
        >
          {loading2 ? (
            <ActivityIndicator size="small" color="green" />
          ) : (
            <FontAwesome
              name="send"
              size={24}
              color={content.trim() ? "#3b6d3b" : "#888"}
            />
          )}
        </TouchableOpacity>
      </View>

      {isFloatingBtnVisible && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={scrollToLatestPost}
        >
          <FontAwesome name="arrow-down" size={18} color="#fff" />
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
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#3b6d3b",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  postsContainer: {
    marginTop: 10,
  },
  postContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "white",
  },
  postFooter: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    // backgroundColor: "lightblue",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    color: "green",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    // top: -10,
  },
  postContent: {
    marginBottom: 10,
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesCount: {
    fontSize: 14,
    marginRight: 10,
    flex: 1,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fbfbda",
  },
  floatingButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#3b6d3b",
    padding: 8,
    borderRadius: 50,
    elevation: 5,
  },
});

export default CommunityScreen;
