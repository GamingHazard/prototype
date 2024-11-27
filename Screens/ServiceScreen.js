import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ServiceScreen = ({ navigation }) => {
  const { SelectedImage } = useContext(AuthContext);
  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
        paddingBottom: 16,
        backgroundColor: "whitesmoke",
      }}
    >
      <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 26 }}>
        Waste Management Services
      </Text>

      {/* Tab 1 */}
      <Pressable
        onPress={() => navigation.navigate("Asante")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>
              Name :Asante Waste Management{" "}
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Location :Luzira Industrial,Kampala
            </Text>
            {/* <Text style={{ color: "#fbfbda" }}>Founded : 2021</Text> */}
            <Text style={{ color: "#fbfbda" }}>
              Contact : (+256)414691868 / 0751272683
            </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            Asante Waste Management Ltd,a prominent waste management company in
            Uganda with head offices in Kampala, Uganda was established to
            provide a complete range of waste management services including
            collection, transportation, sorting, recycling, treatment and
            disposal of solid waste. We partner with our customers and
            communities to manage and reduce waste from collection to disposal
            while recovering valuable resources, creating a clean environment
            and renewable energy.
          </Text>
        </View>
      </Pressable>

      {/* Tab 2 */}
      <Pressable
        onPress={() => navigation.navigate("Bins")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri: "https://www.scrapmonster.com/uploads/company_logo/2023/9/1694684332.webp",
            }}
            style={{ width: 100, height: 100 }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>Name : Bins Kampala</Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : Kampala, Uganda{" "}
            </Text>
            <Text style={{ color: "#fbfbda" }}>Contact : 0772 594470</Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            Kampala's Leading and fast ever garbage collection and waste
            management service. House Hold Garbage | Office Garbage |
            Construction Sites | Events Garbage. Now introducing Cleaning
            Services for Home, Office, Schools, Hospitals & So much more.
          </Text>
        </View>
      </Pressable>

      {/* Tab 3 */}
      <Pressable
        onPress={() => navigation.navigate("Armstrong")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>
              Name : Armstrong Global Solutions Ltd
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : kibuli kakungulu,Kampala
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Contact :(+91) 9999-241-423
            </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            Armstrong global solutions offer waste collection services that
            collect both hazardous and non-hazardous waste this includes
            municipal solid waste i.e household waste, medical waste, industrial
            and commercial waste, and materials that can be recycled
          </Text>
        </View>
      </Pressable>

      {/* Tab 4 */}
      <Pressable
        onPress={() => navigation.navigate("Swift")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100, marginRight: 5 }}
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>
              Name :SWIFT Waste Masters LTD
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : Kampala, Uganda{" "}
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Contact: (+256)414530999/0758892937
            </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            Swift waste masters is a limited liability company which was founded
            2011 and later incorporated in 2013. The company was founded with an
            enduring commitment to protect people and brands, promote health and
            to safeguard the environment through providing reliable and
            responsible commercial cleaning
          </Text>
        </View>
      </Pressable>

      {/* Tab 5 */}
      <Pressable
        onPress={() => navigation.navigate("Best")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100, marginRight: 5 }}
            source={{
              uri: "https://bestofwaste.org/wp-content/uploads/2021/04/TRANS-#fbfbda-LOGO_00aa00460_2426.png",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>Name :Best of Waste </Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : Kampala, Uganda{" "}
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Contact : +256-703827850 / 0772517674
            </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            Best of Waste Limited “Best of Waste Limited” is a social enterprise
            recycling organic waste in partnership with the community of
            waste-pickers at Kiteezi landfill to make Sustainable Fuel Cooking
            Briquettes, Energy Saving Stoves and other Low-cost recycled waste
            products.
          </Text>
        </View>
      </Pressable>

      {/* Tab 6 */}
      <Pressable
        onPress={() => navigation.navigate("Nabugabo")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100, marginRight: 5 }}
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>
              Name :Nabugabo Updeal Joint Venture
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : Kampala, Uganda{" "}
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Contact: +256-704094068 | 0700983346
            </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            Nabugabo Updeal Joint Venture (NUJV) was founded in 1998 by a team
            of individuals led by the late HAJJI SENYONDO ABU MUSA, dedicated to
            enhancing cleanliness in Kampala City. As authorized by KCCA, NUJV
            holds exclusive rights to oversee the collection and disposal of
            solid waste in Zone 5
          </Text>
        </View>
      </Pressable>
      {/* Tab 7 */}
      <Pressable
        onPress={() => navigation.navigate("DeWaste")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100, marginRight: 5 }}
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>Name : De Waste (U) Ltd</Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : Kampala, Uganda{" "}
            </Text>
            <Text style={{ color: "#fbfbda" }}>Contact : 0755 316666</Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            We are waste management company that offers both hazardous and
            Non-Hazardous waste handling services. The company is ISO 45001:2018
            accredited with an experience of over 10 years. Our Services include
            the following: 1.Asbestos Removal and Disposal 2.Heavy Fuel Tank
            Cleaning 3.Medical waste Management…
          </Text>
        </View>
      </Pressable>
      {/* Tab 8 */}
      <Pressable
        onPress={() => navigation.navigate("YoWaste")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100, marginRight: 5 }}
            source={{
              uri: "data:image/png;base64,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",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>Name : YO WASTE (U) LTD</Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : Lumumba Ave Kampala
            </Text>
            <Text style={{ color: "#fbfbda" }}>Contact : 039-324-6589 </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            We are waste management company that offers both hazardous and
            Non-Hazardous waste handling services. The company is ISO 45001:2018
            accredited with an experience of over 10 years. Our Services include
            the following: 1.Asbestos Removal and Disposal 2.Heavy Fuel Tank
            Cleaning 3.Medical waste Management…
          </Text>
        </View>
      </Pressable>

      {/* Tab 9 */}
      <Pressable
        onPress={() => navigation.navigate("Aquila")}
        style={{
          width: "100%",
          height: "auto",
          padding: 10,

          marginVertical: 16,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 100, height: 100, marginRight: 5 }}
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
          />
          <View
            style={{
              padding: 5,
              height: 100,
              width: "100%",
              backgroundColor: "#3b6d3b",
              elevation: 8,
            }}
          >
            <Text style={{ color: "#fbfbda" }}>
              Name : Aquila Recycling Plant
            </Text>
            <Text style={{ color: "#fbfbda" }}>
              Location : Mpererwe, Kampala,Uganda
            </Text>
            <Text style={{ color: "#fbfbda" }}>Contact : 0759 949494 </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text>
            The business was first launched in 2012 as a recycling facility for
            Waste PET Plastics. Since those early start-up days, we’ve come
            along way. We have built up a team of knowledgeable and enthusiastic
            professionals who now work with our communities and customers across
            the globe.
          </Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default ServiceScreen;

const styles = StyleSheet.create({});
