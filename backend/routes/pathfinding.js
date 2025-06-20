const express = require("express");
const router = express.Router();
const PathfindingAlgorithms = require("../utils/pathfinding");
const GeocodingService = require("../utils/geocoding");

const geocodingService = new GeocodingService();

// Get path using selected algorithm
router.post("/find-path", async (req, res) => {
  try {
    const { startLocation, destination, algorithm } = req.body;

    if (!startLocation || !destination || !algorithm) {
      return res.status(400).json({
        success: false,
        message: "Start location, destination, and algorithm are required",
      });
    }

    // Validate algorithm
    if (!["dijkstra", "astar"].includes(algorithm.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Algorithm must be either "dijkstra" or "astar"',
      });
    }

    let startCoords, destCoords;

    // Handle start location (can be coordinates or address)
    if (typeof startLocation === "string") {
      // It's an address, geocode it
      startCoords = await geocodingService.geocode(startLocation);
    } else if (startLocation.lat && startLocation.lng) {
      // It's already coordinates
      startCoords = startLocation;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid start location format",
      });
    }

    // Handle destination (can be coordinates or address)
    if (typeof destination === "string") {
      // It's an address, geocode it
      destCoords = await geocodingService.geocode(destination);
    } else if (destination.lat && destination.lng) {
      // It's already coordinates
      destCoords = destination;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid destination format",
      });
    }

    // Generate sample graph (in a real app, this would come from a database)
    const nodes = PathfindingAlgorithms.generateSampleGraph();

    // Add start and destination as temporary nodes
    const startNode = {
      id: "start",
      lat: startCoords.lat,
      lng: startCoords.lng,
      neighbors: [],
    };

    const destNode = {
      id: "destination",
      lat: destCoords.lat,
      lng: destCoords.lng,
      neighbors: [],
    };

    // Find closest nodes to start and destination
    let closestToStart = nodes[0];
    let closestToDest = nodes[0];
    let minStartDist = Infinity;
    let minDestDist = Infinity;

    nodes.forEach((node) => {
      const startDist = PathfindingAlgorithms.calculateDistance(
        startCoords.lat,
        startCoords.lng,
        node.lat,
        node.lng
      );
      const destDist = PathfindingAlgorithms.calculateDistance(
        destCoords.lat,
        destCoords.lng,
        node.lat,
        node.lng
      );

      if (startDist < minStartDist) {
        minStartDist = startDist;
        closestToStart = node;
      }
      if (destDist < minDestDist) {
        minDestDist = destDist;
        closestToDest = node;
      }
    });

    // Add connections from start and to destination
    startNode.neighbors.push({
      nodeId: closestToStart.id,
      distance: minStartDist,
    });

    closestToDest.neighbors.push({
      nodeId: "destination",
      distance: minDestDist,
    });

    // Add nodes to the graph
    const allNodes = [...nodes, startNode, destNode];

    // Run the selected algorithm
    let result;
    if (algorithm.toLowerCase() === "dijkstra") {
      result = PathfindingAlgorithms.dijkstra(allNodes, "start", "destination");
    } else {
      result = PathfindingAlgorithms.aStar(allNodes, "start", "destination");
    }

    if (result.error) {
      return res.status(404).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      data: {
        path: result.path,
        distance: result.distance,
        algorithm: result.algorithm,
        startLocation: startCoords,
        destination: destCoords,
        units: "kilometers",
      },
    });
  } catch (error) {
    console.error("Pathfinding error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

// Geocode an address
router.post("/geocode", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const result = await geocodingService.geocode(address);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Geocoding failed",
    });
  }
});

// Reverse geocode coordinates
router.post("/reverse-geocode", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const result = await geocodingService.reverseGeocode(lat, lng);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Reverse geocoding failed",
    });
  }
});

// Get current location from IP
router.get("/current-location", async (req, res) => {
  try {
    const result = await geocodingService.getCurrentLocationFromIP();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Current location error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Unable to get current location",
    });
  }
});

// Get available algorithms
router.get("/algorithms", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "dijkstra",
        name: "Dijkstra's Algorithm",
        description: "Finds the shortest path between two nodes in a graph",
      },
      {
        id: "astar",
        name: "A* Algorithm",
        description:
          "An informed search algorithm that uses heuristics to find the optimal path",
      },
    ],
  });
});

module.exports = router;
