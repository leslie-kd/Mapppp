# Map App with Pathfinding Algorithms

A mobile application that uses heuristic search algorithms (A\* and Dijkstra's) to find optimal routes between locations. Built with MERN stack and OpenStreetMap integration.

## Features

- **Location Input**: Enter start and destination locations manually or use device GPS
- **Algorithm Selection**: Choose between A\* and Dijkstra's algorithms
- **Interactive Map**: Visual route display using OpenStreetMap
- **Distance Calculation**: Real-time distance calculation in kilometers
- **Mobile-First Design**: Optimized for mobile devices with React Native
- **Geocoding**: Convert addresses to coordinates using OpenStreetMap's Nominatim API

## Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** (configured but not used in current implementation)
- **OpenStreetMap Nominatim API** for geocoding
- **Custom pathfinding algorithms** (A\* and Dijkstra's)

### Frontend

- **React Native** with Expo
- **React Native Maps** for map display
- **React Native Paper** for UI components
- **Expo Location** for GPS functionality
- **Axios** for API communication

## Project Structure

```
proooo/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   └── pathfinding.js
│   ├── utils/
│   │   ├── pathfinding.js
│   │   └── geocoding.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── screens/
│   │   ├── MapScreen.js
│   │   └── AlgorithmScreen.js
│   ├── App.js
│   ├── app.json
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- MongoDB (optional, for future database integration)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/map-app
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npm start
   ```

4. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator.

## API Endpoints

### Pathfinding

- `POST /api/pathfinding/find-path` - Find route between two locations
- `GET /api/pathfinding/algorithms` - Get available algorithms
- `GET /api/pathfinding/current-location` - Get current location from IP

### Geocoding

- `POST /api/pathfinding/geocode` - Convert address to coordinates
- `POST /api/pathfinding/reverse-geocode` - Convert coordinates to address

## Algorithm Details

### A\* Algorithm

- **Time Complexity**: O(b^d) where b is branching factor, d is depth
- **Advantages**:
  - Guaranteed to find optimal path
  - More efficient than Dijkstra for most cases
  - Uses heuristic to guide search
- **Use Cases**: GPS navigation, game pathfinding, robot navigation

### Dijkstra's Algorithm

- **Time Complexity**: O((V + E) log V) where V is vertices, E is edges
- **Advantages**:
  - Guaranteed to find shortest path
  - Simple to understand and implement
  - Works with weighted graphs
- **Use Cases**: Network routing, transportation planning, social network analysis

## Usage

1. **Launch the app** and grant location permissions
2. **Enter start location** (or use current location)
3. **Enter destination** address
4. **Select algorithm** (A\* or Dijkstra's)
5. **Tap "Find Route"** to calculate the optimal path
6. **View results** on the map with distance information

## Configuration

### API Base URL

Update the `API_BASE_URL` in frontend screens if your backend is running on a different port or host.

### Map Provider

The app uses OpenStreetMap through React Native Maps. You can configure additional map providers in the MapView component.

## Future Enhancements

- [ ] Real-time traffic data integration
- [ ] Multiple route options
- [ ] Turn-by-turn navigation
- [ ] Offline map support
- [ ] Route history and favorites
- [ ] Public transportation integration
- [ ] User authentication and profiles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.
