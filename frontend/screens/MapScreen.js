import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  Portal,
  Modal,
  List,
  Divider,
} from "react-native-paper";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("astar");
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [algorithms, setAlgorithms] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
    fetchAlgorithms();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to use this app."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Set current location as default start location
      const { latitude, longitude } = currentLocation.coords;
      setStartLocation(`${latitude}, ${longitude}`);

      // Center map on current location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Unable to get current location");
    }
  };

  const fetchAlgorithms = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/pathfinding/algorithms`
      );
      setAlgorithms(response.data.data);
    } catch (error) {
      console.error("Error fetching algorithms:", error);
    }
  };

  const findRoute = async () => {
    if (!startLocation.trim() || !destination.trim()) {
      Alert.alert("Error", "Please enter both start location and destination");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/pathfinding/find-path`,
        {
          startLocation: startLocation.trim(),
          destination: destination.trim(),
          algorithm: selectedAlgorithm,
        }
      );

      if (response.data.success) {
        setRouteData(response.data.data);

        // Fit map to show entire route
        if (mapRef.current && response.data.data.path.length > 0) {
          const coordinates = response.data.data.path.map((point) => ({
            latitude: point.lat,
            longitude: point.lng,
          }));

          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      } else {
        Alert.alert("Error", response.data.message || "Failed to find route");
      }
    } catch (error) {
      console.error("Error finding route:", error);
      Alert.alert(
        "Error",
        "Failed to find route. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      setStartLocation(`${latitude}, ${longitude}`);
    } else {
      Alert.alert("Error", "Current location not available");
    }
  };

  const clearRoute = () => {
    setRouteData(null);
    setDestination("");
  };

  const getRouteCoordinates = () => {
    if (!routeData || !routeData.path) return [];
    return routeData.path.map((point) => ({
      latitude: point.lat,
      longitude: point.lng,
    }));
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.inputContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Route Finder</Title>

              <TextInput
                label="Start Location"
                value={startLocation}
                onChangeText={setStartLocation}
                mode="outlined"
                style={styles.input}
                placeholder="Enter address or coordinates"
              />

              <Button
                mode="text"
                onPress={useCurrentLocation}
                style={styles.currentLocationButton}
              >
                Use Current Location
              </Button>

              <TextInput
                label="Destination"
                value={destination}
                onChangeText={setDestination}
                mode="outlined"
                style={styles.input}
                placeholder="Enter destination address"
              />

              <View style={styles.algorithmContainer}>
                <Paragraph>Algorithm:</Paragraph>
                <Chip
                  selected={selectedAlgorithm === "astar"}
                  onPress={() => setSelectedAlgorithm("astar")}
                  style={styles.chip}
                >
                  A*
                </Chip>
                <Chip
                  selected={selectedAlgorithm === "dijkstra"}
                  onPress={() => setSelectedAlgorithm("dijkstra")}
                  style={styles.chip}
                >
                  Dijkstra
                </Chip>
              </View>

              <Button
                mode="contained"
                onPress={findRoute}
                loading={loading}
                disabled={loading}
                style={styles.findRouteButton}
              >
                Find Route
              </Button>

              {routeData && (
                <Card style={styles.resultCard}>
                  <Card.Content>
                    <Title>Route Found!</Title>
                    <Paragraph>Algorithm: {routeData.algorithm}</Paragraph>
                    <Paragraph>
                      Distance: {routeData.distance.toFixed(2)} km
                    </Paragraph>
                    <Paragraph>Units: {routeData.units}</Paragraph>
                  </Card.Content>
                </Card>
              )}
            </Card.Content>
          </Card>
        </ScrollView>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 40.7128,
              longitude: -74.006,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Start marker */}
            {routeData && routeData.startLocation && (
              <Marker
                coordinate={{
                  latitude: routeData.startLocation.lat,
                  longitude: routeData.startLocation.lng,
                }}
                title="Start"
                description="Starting point"
                pinColor="green"
              />
            )}

            {/* Destination marker */}
            {routeData && routeData.destination && (
              <Marker
                coordinate={{
                  latitude: routeData.destination.lat,
                  longitude: routeData.destination.lng,
                }}
                title="Destination"
                description="End point"
                pinColor="red"
              />
            )}

            {/* Route line */}
            {routeData && routeData.path && routeData.path.length > 0 && (
              <Polyline
                coordinates={getRouteCoordinates()}
                strokeColor="#2196F3"
                strokeWidth={3}
              />
            )}
          </MapView>
        </View>
      </KeyboardAvoidingView>

      <Portal>
        <Modal
          visible={showAlgorithmModal}
          onDismiss={() => setShowAlgorithmModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>Select Algorithm</Title>
          {algorithms.map((algorithm) => (
            <List.Item
              key={algorithm.id}
              title={algorithm.name}
              description={algorithm.description}
              onPress={() => {
                setSelectedAlgorithm(algorithm.id);
                setShowAlgorithmModal(false);
              }}
              right={() =>
                selectedAlgorithm === algorithm.id ? (
                  <List.Icon icon="check" />
                ) : null
              }
            />
          ))}
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowAlgorithmModal(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inputContainer: {
    maxHeight: "40%",
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
  },
  currentLocationButton: {
    marginBottom: 12,
  },
  algorithmContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  chip: {
    marginLeft: 8,
  },
  findRouteButton: {
    marginTop: 8,
  },
  resultCard: {
    marginTop: 16,
    backgroundColor: "#e8f5e8",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
