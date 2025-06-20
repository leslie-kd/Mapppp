class Node {
  constructor(id, lat, lng, neighbors = []) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.neighbors = neighbors;
    this.g = Infinity;
    this.h = 0;
    this.f = Infinity;
    this.parent = null;
  }
}

class PathfindingAlgorithms {
  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static heuristic(lat1, lng1, lat2, lng2) {
    return this.calculateDistance(lat1, lng1, lat2, lng2);
  }

  static dijkstra(nodes, startId, goalId) {
    const startNode = nodes.find((node) => node.id === startId);
    const goalNode = nodes.find((node) => node.id === goalId);
    if (!startNode || !goalNode) {
      return { path: [], distance: 0, error: "Start or goal node not found" };
    }

    const unvisited = new Set(nodes.map((node) => node.id));
    const distances = {};
    const previous = {};
    nodes.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[startId] = 0;

    while (unvisited.size > 0) {
      let currentId = null;
      let minDistance = Infinity;
      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentId = nodeId;
        }
      }

      if (currentId === null || currentId === goalId) break;
      unvisited.delete(currentId);

      const currentNode = nodes.find((n) => n.id === currentId);
      for (const neighbor of currentNode.neighbors) {
        if (!unvisited.has(neighbor.nodeId)) continue;

        const newDist = distances[currentId] + neighbor.distance;
        if (newDist < distances[neighbor.nodeId]) {
          distances[neighbor.nodeId] = newDist;
          previous[neighbor.nodeId] = currentId;
        }
      }
    }

    const path = [];
    let currentId = goalId;
    while (currentId) {
      const node = nodes.find((n) => n.id === currentId);
      if (!node) break;
      path.unshift({ id: node.id, lat: node.lat, lng: node.lng });
      currentId = previous[currentId];
    }

    return { path, distance: distances[goalId], algorithm: "Dijkstra" };
  }

  static aStar(nodes, startId, goalId) {
    const startNode = nodes.find((node) => node.id === startId);
    const goalNode = nodes.find((node) => node.id === goalId);
    if (!startNode || !goalNode) {
      return { path: [], distance: 0, error: "Start or goal node not found" };
    }

    const openSet = new Set([startId]);
    const closedSet = new Set();
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    nodes.forEach((node) => {
      gScore[node.id] = Infinity;
      fScore[node.id] = Infinity;
    });
    gScore[startId] = 0;
    fScore[startId] = this.heuristic(
      startNode.lat,
      startNode.lng,
      goalNode.lat,
      goalNode.lng
    );

    while (openSet.size > 0) {
      let currentId = null;
      let lowestF = Infinity;
      for (const nodeId of openSet) {
        if (fScore[nodeId] < lowestF) {
          lowestF = fScore[nodeId];
          currentId = nodeId;
        }
      }

      if (currentId === goalId) {
        const path = [];
        let current = currentId;
        while (current) {
          const node = nodes.find((n) => n.id === current);
          path.unshift({ id: node.id, lat: node.lat, lng: node.lng });
          current = cameFrom[current];
        }
        return { path, distance: gScore[goalId], algorithm: "A*" };
      }

      openSet.delete(currentId);
      closedSet.add(currentId);

      const currentNode = nodes.find((n) => n.id === currentId);
      for (const neighbor of currentNode.neighbors) {
        if (closedSet.has(neighbor.nodeId)) continue;

        const tentativeG = gScore[currentId] + neighbor.distance;
        if (tentativeG < gScore[neighbor.nodeId]) {
          cameFrom[neighbor.nodeId] = currentId;
          gScore[neighbor.nodeId] = tentativeG;
          const neighborNode = nodes.find((n) => n.id === neighbor.nodeId);
          fScore[neighbor.nodeId] =
            gScore[neighbor.nodeId] +
            this.heuristic(
              neighborNode.lat,
              neighborNode.lng,
              goalNode.lat,
              goalNode.lng
            );
          openSet.add(neighbor.nodeId);
        }
      }
    }

    return { path: [], distance: 0, error: "No path found" };
  }

  static generateSampleGraph() {
    const nodes = [
      new Node(1, 40.7128, -74.006),
      new Node(2, 34.0522, -118.2437),
      new Node(3, 41.8781, -87.6298),
      new Node(4, 29.7604, -95.3698),
      new Node(5, 33.749, -84.388),
      new Node(6, 39.9526, -75.1652),
      new Node(7, 25.7617, -80.1918),
      new Node(8, 47.6062, -122.3321),
      new Node(9, 39.7392, -104.9903),
      new Node(10, 32.7767, -96.797),
    ];

    nodes[0].neighbors = [
      { nodeId: 2, distance: 3935 },
      { nodeId: 3, distance: 1147 },
      { nodeId: 6, distance: 97 },
    ];
    nodes[1].neighbors = [
      { nodeId: 0, distance: 3935 },
      { nodeId: 3, distance: 2800 },
      { nodeId: 4, distance: 2180 },
    ];
    nodes[2].neighbors = [
      { nodeId: 0, distance: 1147 },
      { nodeId: 1, distance: 2800 },
      { nodeId: 4, distance: 715 },
      { nodeId: 8, distance: 1730 },
    ];
    nodes[3].neighbors = [
      { nodeId: 4, distance: 940 },
      { nodeId: 9, distance: 239 },
    ];
    nodes[4].neighbors = [
      { nodeId: 1, distance: 2180 },
      { nodeId: 2, distance: 715 },
      { nodeId: 3, distance: 940 },
      { nodeId: 5, distance: 640 },
    ];
    nodes[5].neighbors = [
      { nodeId: 0, distance: 97 },
      { nodeId: 4, distance: 640 },
    ];
    nodes[6].neighbors = [{ nodeId: 4, distance: 660 }];
    nodes[7].neighbors = [
      { nodeId: 2, distance: 1730 },
      { nodeId: 8, distance: 1310 },
    ];
    nodes[8].neighbors = [
      { nodeId: 2, distance: 1730 },
      { nodeId: 7, distance: 1310 },
      { nodeId: 9, distance: 780 },
    ];
    nodes[9].neighbors = [
      { nodeId: 3, distance: 239 },
      { nodeId: 8, distance: 780 },
    ];

    return nodes;
  }
}

module.exports = PathfindingAlgorithms;
