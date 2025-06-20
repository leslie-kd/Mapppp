import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  Button,
  Chip,
} from "react-native-paper";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export default function AlgorithmScreen({ navigation, route }) {
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("astar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlgorithms();
  }, []);

  const fetchAlgorithms = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/pathfinding/algorithms`
      );
      setAlgorithms(response.data.data);
    } catch (error) {
      console.error("Error fetching algorithms:", error);
      Alert.alert("Error", "Failed to fetch algorithms");
    } finally {
      setLoading(false);
    }
  };

  const handleAlgorithmSelect = (algorithmId) => {
    setSelectedAlgorithm(algorithmId);
    // You can pass the selected algorithm back to the previous screen
    if (route.params?.onAlgorithmSelect) {
      route.params.onAlgorithmSelect(algorithmId);
    }
  };

  const getAlgorithmInfo = (algorithmId) => {
    const algorithm = algorithms.find((alg) => alg.id === algorithmId);
    return algorithm || null;
  };

  const getAlgorithmDetails = (algorithmId) => {
    const details = {
      astar: {
        complexity: "O(b^d) where b is branching factor, d is depth",
        advantages: [
          "Guaranteed to find optimal path",
          "More efficient than Dijkstra for most cases",
          "Uses heuristic to guide search",
          "Good for large graphs",
        ],
        disadvantages: [
          "Requires admissible heuristic",
          "Memory usage can be high",
          "Complex to implement",
        ],
        useCases: [
          "Pathfinding in games",
          "GPS navigation",
          "Robot navigation",
          "Network routing",
        ],
      },
      dijkstra: {
        complexity: "O((V + E) log V) where V is vertices, E is edges",
        advantages: [
          "Guaranteed to find shortest path",
          "Simple to understand and implement",
          "Works with weighted graphs",
          "No heuristic required",
        ],
        disadvantages: [
          "Slower than A* for large graphs",
          "Explores all possible paths",
          "Memory usage can be high",
        ],
        useCases: [
          "Network routing",
          "GPS navigation",
          "Social network analysis",
          "Transportation planning",
        ],
      },
    };
    return details[algorithmId] || null;
  };

  const selectedDetails = getAlgorithmDetails(selectedAlgorithm);
  const selectedInfo = getAlgorithmInfo(selectedAlgorithm);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Select Pathfinding Algorithm</Title>
          <Paragraph>
            Choose the algorithm you want to use for finding the optimal route
            between two locations.
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.algorithmSelector}>
        {algorithms.map((algorithm) => (
          <Chip
            key={algorithm.id}
            selected={selectedAlgorithm === algorithm.id}
            onPress={() => handleAlgorithmSelect(algorithm.id)}
            style={styles.chip}
            mode="outlined"
          >
            {algorithm.name}
          </Chip>
        ))}
      </View>

      {selectedInfo && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>{selectedInfo.name}</Title>
            <Paragraph>{selectedInfo.description}</Paragraph>
          </Card.Content>
        </Card>
      )}

      {selectedDetails && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Algorithm Details</Title>

            <Paragraph style={styles.sectionTitle}>Time Complexity:</Paragraph>
            <Paragraph style={styles.complexity}>
              {selectedDetails.complexity}
            </Paragraph>

            <Divider style={styles.divider} />

            <Paragraph style={styles.sectionTitle}>Advantages:</Paragraph>
            <List.Section>
              {selectedDetails.advantages.map((advantage, index) => (
                <List.Item
                  key={index}
                  title={advantage}
                  left={() => <List.Icon icon="check" color="green" />}
                  titleNumberOfLines={2}
                />
              ))}
            </List.Section>

            <Divider style={styles.divider} />

            <Paragraph style={styles.sectionTitle}>Disadvantages:</Paragraph>
            <List.Section>
              {selectedDetails.disadvantages.map((disadvantage, index) => (
                <List.Item
                  key={index}
                  title={disadvantage}
                  left={() => <List.Icon icon="close" color="red" />}
                  titleNumberOfLines={2}
                />
              ))}
            </List.Section>

            <Divider style={styles.divider} />

            <Paragraph style={styles.sectionTitle}>Common Use Cases:</Paragraph>
            <List.Section>
              {selectedDetails.useCases.map((useCase, index) => (
                <List.Item
                  key={index}
                  title={useCase}
                  left={() => <List.Icon icon="map-marker" color="blue" />}
                  titleNumberOfLines={2}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>How It Works</Title>
          {selectedAlgorithm === "astar" ? (
            <Paragraph>
              A* algorithm uses a heuristic function to estimate the cost from
              the current node to the goal. It maintains an open set of nodes to
              be evaluated and a closed set of nodes already evaluated. The
              algorithm always expands the node with the lowest f-score (g-score
              + heuristic), making it more efficient than Dijkstra's algorithm
              for most pathfinding problems.
            </Paragraph>
          ) : (
            <Paragraph>
              Dijkstra's algorithm finds the shortest path from a starting node
              to all other nodes in a graph. It works by maintaining a set of
              unvisited nodes and updating the shortest distance to each node as
              it explores the graph. The algorithm guarantees the optimal path
              but may explore more nodes than necessary compared to A*.
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Back to Map
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  algorithmSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  complexity: {
    fontFamily: "monospace",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  divider: {
    marginVertical: 16,
  },
  backButton: {
    margin: 16,
  },
});
