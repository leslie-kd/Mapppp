const axios = require("axios");

class GeocodingService {
  constructor() {
    this.baseUrl = "https://nominatim.openstreetmap.org";
  }

  // Convert address to coordinates
  async geocode(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: address,
          format: "json",
          limit: 1,
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "MapApp/1.0",
        },
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          display_name: result.display_name,
          address: result.address,
        };
      } else {
        throw new Error("No results found for this address");
      }
    } catch (error) {
      console.error("Geocoding error:", error.message);
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

  // Convert coordinates to address
  async reverseGeocode(lat, lng) {
    try {
      const response = await axios.get(`${this.baseUrl}/reverse`, {
        params: {
          lat: lat,
          lon: lng,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "MapApp/1.0",
        },
      });

      if (response.data) {
        return {
          lat: parseFloat(response.data.lat),
          lng: parseFloat(response.data.lon),
          display_name: response.data.display_name,
          address: response.data.address,
        };
      } else {
        throw new Error("No results found for these coordinates");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error.message);
      throw new Error(`Reverse geocoding failed: ${error.message}`);
    }
  }

  // Get location from IP
  async getCurrentLocationFromIP() {
    try {
      const response = await axios.get("https://ipapi.co/json/");
      return {
        lat: response.data.latitude,
        lng: response.data.longitude,
        city: response.data.city,
        country: response.data.country_name,
      };
    } catch (error) {
      console.error("IP geolocation error:", error.message);
      throw new Error("Unable to determine current location");
    }
  }
}

module.exports = GeocodingService;
