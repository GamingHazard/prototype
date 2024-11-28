import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Button,
} from "react-native";
import axios from "axios";

const NewsComponent = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl =
    " https://newsdata.io/api/1/news?apikey=pub_4483701abe0a98569de3d05ba7906d966b2a5&country=ke,rw,sd,tz,ug&language=en,sw&category=crime,domestic,education,environment,politics ";

  // Fetch news data from the API
  const fetchNews = async () => {
    setLoading(true); // Start loading when fetching data
    setError(null); // Reset error before fetching
    try {
      const response = await axios.get(apiUrl);
      setNews(response.data.results); // Assuming the response has a 'results' array
    } catch (err) {
      setError("Failed to load news, check your internet connection.");
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // If loading, show the loading spinner
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If error occurs, show error message
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button color={"#3b6d3b"} title="Retry" onPress={fetchNews} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Refresh News" onPress={fetchNews} />
      {news.map((item) => (
        <View key={item.article_id} style={styles.newsItem}>
          {item.image_url && (
            <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.newsImage}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDescription}>{item.description}</Text>
          <Text style={styles.newsDate}>
            {new Date(item.pubDate).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(item.link)}
          >
            <Text style={styles.linkText}>Read More</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  newsItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  newsImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  newsDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  newsDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: "#3b6d3b",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    color: "crimson",
    marginBottom: 10,
  },
});

export default NewsComponent;
