import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
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
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tips = () => {
  const handleChange = (text) => setContent(text);

  const { UserID } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false); // Loader state for posts
  const scrollViewRef = useRef();

  // Scroll position state
  const [scrollPosition, setScrollPosition] = useState(0);

  // Reference for ScrollView
  const scrollRef = useRef(null);

  // Array of 20 longer waste management and recycling tips
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
        "https://uga-cycle-backend-1.onrender.com/create-tip",
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
    if (showLoading) setLoadingPosts(true); // Show loader when fetching posts
    try {
      const response = await axios.get(
        "https://uga-cycle-backend-1.onrender.com/get-tips"
      );
      setPosts(response.data);
      // Save fetched posts to AsyncStorage
      await AsyncStorage.setItem("tips", JSON.stringify(response.data));
    } catch (error) {
      console.log("error fetching posts", error);
    } finally {
      setLoadingPosts(false); // Hide loader after posts are fetched
    }
  };

  useEffect(() => {
    fetchPosts(true);

    const interval = setInterval(() => {
      fetchPosts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `https://uga-cycle-backend-1.onrender.com/tips/${postId}/${UserID}/like`
      );
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      // Update AsyncStorage with the new post data
      await AsyncStorage.setItem("tips", JSON.stringify(posts));
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `https://uga-cycle-backend-1.onrender.com/tips/${postId}/${UserID}/unlike`
      );
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      await AsyncStorage.setItem("tips", JSON.stringify(posts));
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const saveScrollPosition = async (yOffset) => {
    try {
      await AsyncStorage.setItem("scrollPosition2", JSON.stringify(yOffset));
    } catch (error) {
      console.log("Error saving scroll position", error);
    }
  };

  const loadScrollPosition = async () => {
    try {
      const savedPosition = await AsyncStorage.getItem("scrollPosition2");
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
        const storedPosts = await AsyncStorage.getItem("tips");
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
  const scrollToLatestPost = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const tips = [
    "Separate your recyclables from your trash to ensure that materials like paper, plastic, and glass can be processed and reused. This reduces landfill waste and helps conserve natural resources. By taking the time to sort waste properly, you can make a significant difference in reducing environmental impact.",
    "Rinse out bottles, cans, and containers before recycling them to prevent contamination. Clean containers make the recycling process much more efficient, as dirty items can contaminate the entire recycling batch. A quick rinse is all it takes to ensure that your recyclables are properly processed.",
    "Use reusable bags instead of plastic bags when shopping. Plastic bags take hundreds of years to decompose, and often end up in the ocean, harming marine life. By using reusable alternatives, you can significantly cut down on plastic waste and reduce the need for single-use items.",
    "Compost your food scraps like vegetable peels, coffee grounds, and egg shells. Composting turns organic waste into rich, fertile soil, which can be used to nourish your garden. This simple practice reduces the amount of food waste that ends up in landfills and lowers methane emissions.",
    "Avoid single-use plastics such as straws, cutlery, and bottles. These items are typically used once and discarded, contributing to massive amounts of waste. Consider using alternatives like stainless steel, bamboo, or other eco-friendly materials that can be reused or recycled, significantly reducing your environmental footprint.",
    "Donate unwanted items such as clothing, furniture, or electronics instead of throwing them away. By donating, you're giving these items a second life, reducing waste in landfills, and supporting charitable causes. Reuse and repurpose goods whenever possible to minimize unnecessary waste.",
    "Recycle electronics responsibly by taking old phones, computers, and batteries to certified e-waste recycling centers. These items often contain hazardous materials like mercury or lead that can pollute the environment. Specialized recycling helps recover valuable metals and reduces harmful environmental impacts.",
    "Use eco-friendly cleaning products that are biodegradable and free from harmful chemicals. Many conventional cleaning products release toxic substances into the environment, contributing to water pollution. Opting for greener alternatives helps protect the environment while maintaining a clean and healthy home.",
    "Buy in bulk to reduce packaging waste. Bulk buying minimizes the need for individual packaging, which is often non-recyclable. It also helps save money in the long run and reduces the environmental impact of excessive production and disposal of packaging materials.",
    "Properly dispose of hazardous waste such as batteries, fluorescent bulbs, and paints at designated disposal sites. These materials can be dangerous to both people and the environment if not handled correctly. Always follow local guidelines for the safe disposal of hazardous substances to prevent contamination and pollution.",
    "Use a rain barrel to collect water and reduce your reliance on municipal water systems. Rainwater can be used for gardening and outdoor cleaning, which reduces the amount of water you need to use from treated sources, saving both water and energy in the process.",
    "Opt for energy-efficient appliances and lighting to reduce your carbon footprint. LED bulbs and ENERGY STAR-rated appliances use significantly less energy than traditional options, helping to lower your utility bills while contributing to a more sustainable future.",
    "Refrain from using chemical pesticides and herbicides in your garden. These chemicals can contaminate the soil and water supply, harming wildlife and polluting the ecosystem. Organic gardening practices help protect biodiversity and ensure that your gardening efforts benefit the environment.",
    "Avoid products with excessive or non-recyclable packaging, like many processed foods and electronics. When you purchase items with excessive plastic or non-recyclable packaging, you're contributing to a growing waste problem. Try to select products with minimal or recyclable packaging whenever possible.",
    "Participate in community clean-up events to help reduce waste in public spaces. By volunteering your time, you can make a visible difference in your neighborhood, cleaning up parks, beaches, or streets. These efforts help maintain cleaner environments and raise awareness about waste issues.",
    "Support businesses and brands that prioritize sustainability in their practices. Look for companies that use eco-friendly materials, reduce waste, and engage in responsible sourcing and manufacturing processes. Supporting these companies helps create a market demand for more sustainable products.",
    "Teach others about waste reduction and recycling, especially children. Educating future generations about the importance of waste management can have a lasting impact on the environment. By setting an example and sharing knowledge, you help create a culture of sustainability.",
    "Install a water-efficient irrigation system to conserve water in your garden. Drip irrigation systems deliver water directly to plant roots, reducing water wastage due to evaporation or runoff. This method is more efficient and helps conserve valuable resources.",
    "Purchase secondhand items whenever possible to extend their lifecycle. By buying used items such as furniture, clothes, or appliances, you're giving them a second life and reducing demand for new products. This not only saves money but also reduces the environmental impact of manufacturing and shipping new items.",
    "Avoid buying disposable coffee cups and lids, which are often not recyclable. Consider using a reusable coffee cup or thermos to reduce the waste generated from single-use cups. Many coffee shops offer discounts for customers who bring their own cups, making it an easy and cost-effective choice.",
    "Participate in a local recycling program to ensure your waste is properly sorted. Many communities offer curbside recycling collection or drop-off locations. By taking part in these programs, you ensure that valuable materials like paper, cardboard, and metal are reused rather than sent to the landfill.",
  ];

  // Store scroll position on scroll
  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    setScrollPosition(contentOffsetY);
  };

  // Restore scroll position after posts are fetched
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: scrollPosition, animated: false });
    }
  }, [posts]);

  return (
    <View style={{ flex: 1 }}>
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
        <Text style={styles.header}>Waste Management & Recycling Tips</Text>
        {loadingPosts && (
          <ActivityIndicator
            size="small"
            color="#fbfbda"
            style={{ marginLeft: 10 }}
          />
        )}
      </View>
      <ScrollView
        // ref={scrollRef}
        style={styles.container}
        ref={scrollViewRef}
        onScroll={(event) =>
          saveScrollPosition(event.nativeEvent.contentOffset.y)
        }
        scrollEventThrottle={16}
        // scrollEventThrottle={16}
      >
        <View style={styles.postsContainer}>
          {posts.map((post) => (
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
                  <Text style={styles.timestamp}>{post?.createdAt}</Text>
                </View>
              </View>
              <View style={styles.postContent}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../assets/tip.jpg")}
                    style={{ width: 60, height: 60 }}
                  />
                  <Text
                    style={{
                      color: "#3b6d3b",
                      fontSize: 16,
                      fontWeight: "bold",
                      left: 19,
                    }}
                  >
                    Did you Know?
                  </Text>
                </View>
                <Text style={styles.postText}>{post.content}</Text>
                <View style={styles.likesContainer}>
                  <Text style={styles.likesCount}>
                    {post?.likes?.length} likes
                  </Text>
                  {post.likes.includes(UserID) ? (
                    <TouchableOpacity onPress={() => handleDislike(post._id)}>
                      <AntDesign name="heart" size={18} color="#3b6d3b" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleLike(post._id)}>
                      <AntDesign name="hearto" size={18} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {tips.map((tip, index) => (
          <View key={index} style={styles.tipContainer}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/tip.jpg")}
                style={{ width: 60, height: 60 }}
              />
              <Text
                style={{ color: "#3b6d3b", fontSize: 16, fontWeight: "bold" }}
              >
                Did you Know?
              </Text>
            </View>
            <Text style={styles.tip}>{tip}</Text>
          </View>
        ))}
        <View style={{ width: "100%", height: 20 }} />
      </ScrollView>
      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={scrollToLatestPost}
      >
        <AntDesign name="arrowdown" size={24} color="#fbfbda" />
      </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fbfbda",
  },
  postsContainer: {
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  postContainer: {
    marginVertical: 8,
    // backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  postContent: {
    marginVertical: 12,
  },
  postText: {
    marginTop: 8,
    fontSize: 16,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    // backgroundColor: "white",
  },
  likesCount: {
    marginRight: 8,
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fbfbda",
    padding: 15,
  },
  tipContainer: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tip: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "justify",
  },
  floatingButton: {
    position: "absolute",
    bottom: 65,
    right: 20,
    backgroundColor: "#3b6d3b",
    padding: 8,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Tips;
