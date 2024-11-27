import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { AuthProvider } from "./context/AuthContext";
import Nav from "./components/NavigationComponent";

const App = () => {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar hidden={true} />

        <Nav />
      </View>
    </AuthProvider>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
});
