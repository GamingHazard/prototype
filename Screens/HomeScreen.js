import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  Dimensions,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import NewsComponent from "../components/News";

const HomeScreen = ({ navigation }) => {
  const { UserInfo, SelectedImage } = useContext(AuthContext);
  const [user, setUser] = useState(UserInfo?.user || {});
  const [error, setError] = useState(null);

  // Update user state when UserInfo changes
  useEffect(() => {
    if (UserInfo?.user) {
      setUser(UserInfo.user);
    }
  }, [UserInfo]);

  const userName = user.name || "Name of User";
  const ProfilePicture = user.profilePicture;

  const images = [
    {
      uri: "https://media.istockphoto.com/id/629554844/photo/plastic-bottle-recycling.jpg?s=612x612&w=0&k=20&c=Pf4xbhpJLEov1LwG922PYagq8EtVfhYH83OAKiy9wHc=",
    },
    {
      uri: "https://media.istockphoto.com/id/681198734/photo/waste-paper-is-collected-and-packed-for-recycling-cardboard-and-paper-recycling.jpg?s=612x612&w=0&k=20&c=Njr1e0wYvQbKEjY2ZLiODhuAVpng6BqGyIRhOiC1s6s=",
    },
    {
      uri: "https://media.istockphoto.com/id/1005945884/photo/compressed-aluminum-can-for-recycle.jpg?s=612x612&w=0&k=20&c=Li2QR3ok6NsIKSqIMTauWbvR6TcVpD6pBNVz8D80UdI=",
    },
    {
      uri: "https://media.istockphoto.com/id/94987133/photo/scrapyard-for-obsolete-household-goods.jpg?s=612x612&w=0&k=20&c=x56UipOkFw6pEo0QM_I5fS5HIYslFS0jghD_0-gDt6A=",
    },

    {
      uri: "https://media.istockphoto.com/id/1416950863/photo/pile-of-used-batteries-ready-for-recycling.jpg?s=612x612&w=0&k=20&c=cAIY7REvIQSSJzhw54ZY3tHmkh5li-_dlkmKdGaT1Ts=",
    },
    {
      uri: "https://media.istockphoto.com/id/1288641819/photo/scrap-cables-and-wires-ready-for-recycling.jpg?s=612x612&w=0&k=20&c=jtE1rswuNRnI1CWnofFBC5DDg2xSRqhj50_ON_UmR5c=",
    },
    {
      uri: "https://media.istockphoto.com/id/1357861497/photo/copper-wire-scrap-secondary-raw-materials-industry.jpg?s=612x612&w=0&k=20&c=_7mOUS2A0wU5Sd223Na9AQYh3xFPjsXxNEOXsHOGK1s= ",
    },
  ];

  const scheduleBackground = {
    uri: "https://media.istockphoto.com/id/1205688858/vector/waste-management-garbage-containers-for-different-types-of-trash.jpg?s=612x612&w=0&k=20&c=Uku_Olyb09oJo4B9O5zsPjDBdpRWXsZlHcsKEBUdDk0=",
  };

  const tipsBackground = {
    uri: "https://media.istockphoto.com/id/1307462730/vector/quick-tips-geometric-message-bubble-with-light-bulb-emblem-banner-design-for-business-and.jpg?s=612x612&w=0&k=20&c=VuJH4K5xYdwyDmwAma7dIai3CvR37FYw3Bd3z9unLY4=",
  };

  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);

      Animated.timing(slideAnim, {
        toValue: -screenWidth * nextIndex, // Slide to the next image
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, slideAnim]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/icon3.png")}
          style={{ width: 60, height: 60 }}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Uga-Cycle</Text>
          <Text
            style={{
              fontSize: 18,
              color: "#fbfbda",
              textAlign: "center",
            }}
          >
            {userName}
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={
              ProfilePicture
                ? { uri: ProfilePicture }
                : {
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ width: "100%", flex: 1 }}>
        {/* Waste Market tab with background image slideshow */}

        <TouchableOpacity
          style={{ margin: 10, borderRadius: 15 }}
          onPress={() => navigation.navigate("Sale")}
        >
          <View style={styles.slideshowContainer}>
            <Animated.View
              style={[
                styles.slideWrapper,
                {
                  width: screenWidth * images.length,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              {images.map((image, index) => (
                <ImageBackground
                  key={index}
                  source={image}
                  style={[styles.backgroundImage, { width: screenWidth }]}
                  imageStyle={{ borderRadius: 15 }}
                >
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,1)",
                      "rgba(0,0,0,0.5)",
                      "rgba(0,0,0,0.2)",
                    ]}
                    style={styles.gradientContainer}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                  >
                    <View style={styles.tabContentContainer}>
                      <Text style={styles.tabText}>Waste Market</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              ))}
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Schedule Tab with background image */}
        <TouchableOpacity
          style={{ margin: 10, borderRadius: 15 }}
          onPress={() => navigation.navigate("Reminder")}
        >
          <ImageBackground
            source={scheduleBackground}
            style={styles.backgroundImage}
            imageStyle={{ borderRadius: 15 }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)"]}
              style={styles.gradientContainer}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
            >
              <View style={styles.tabContentContainer}>
                <Text style={styles.tabText}>Garbage Schedule</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* Tips Tab with background image */}
        <TouchableOpacity
          style={{ margin: 10, borderRadius: 15 }}
          onPress={() => navigation.navigate("Tips")}
        >
          <ImageBackground
            source={tipsBackground}
            style={styles.backgroundImage}
            imageStyle={{ borderRadius: 15 }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)"]}
              style={styles.gradientContainer}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
            >
              <View style={styles.tabContentContainer}>
                <Text style={styles.tabText}>Tips</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <Text style={styles.newsTitle}>Breaking News</Text>
        <NewsComponent />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
  header: {
    width: "100%",
    height: 70,
    backgroundColor: "#3b6d3b",
    elevation: 10,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    padding: 10,
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
  },
  headerText: {
    alignSelf: "center",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileImage: { width: 50, height: 50, borderRadius: 15, marginRight: 8 },

  slideshowContainer: {
    overflow: "hidden",
    borderRadius: 15,
  },
  slideWrapper: {
    flexDirection: "row",
  },
  backgroundImage: {
    height: 260,
  },
  gradientContainer: {
    width: "100%",
    height: 260,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabContentContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  tabText: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },
  newsTitle: {
    fontWeight: "bold",
    fontSize: 26,
    color: "black",
    marginVertical: 20,
    marginHorizontal: 10,
  },
});

export default HomeScreen;
