import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Nav from "./components/NavigationComponent";
import MapboxMap from "./Screens/MapBoxMap";

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Nav />
    </View>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
});
