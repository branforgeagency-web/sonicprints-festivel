import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icon paths in bundled environments
const customIcon = L.divIcon({
  className: "custom-map-pin",
  html: `<div class="pin-pulse"></div><div class="pin-marker">📍</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 36],
  popupAnchor: [0, -32]
});

// Default center: South India / Coimbatore region
const DEFAULT_CENTER = [11.0168, 76.9558];

export default function AddressMapModal({ isOpen, onClose, onSelectLocation, initialCoords }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [position, setPosition] = useState(initialCoords || { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
  const [addressDetails, setAddressDetails] = useState({
    formatted: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  // Reverse geocoding via OpenStreetMap Nominatim
  const reverseGeocode = useCallback(async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`,
        { headers: { "User-Agent": "SonicPrints-FestivalStorefront" } }
      );
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      
      const addr = data.address || {};
      const road = addr.road || addr.street || addr.neighbourhood || addr.suburb || "";
      const area = addr.suburb || addr.residential || addr.quarter || addr.city_district || "";
      const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
      const state = addr.state || "";
      const postcode = addr.postcode || "";

      // Format a clean Indian delivery address
      const parts = [road, area, city, state, postcode].filter(Boolean);
      const formatted = parts.length > 0 ? parts.join(", ") : data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      const cityPin = [city, postcode].filter(Boolean).join(", ");

      setAddressDetails({
        formatted,
        city: cityPin || city,
        state,
        pincode: postcode
      });
    } catch (err) {
      console.warn("Reverse geocode fallback:", err);
      setAddressDetails({
        formatted: `Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
        city: "",
        state: "",
        pincode: ""
      });
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const startLat = position.lat || DEFAULT_CENTER[0];
    const startLng = position.lng || DEFAULT_CENTER[1];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: 15,
        zoomControl: false
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const marker = L.marker([startLat, startLng], {
        icon: customIcon,
        draggable: true
      }).addTo(map);

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setPosition({ lat, lng });
        reverseGeocode(lat, lng);
      });

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setPosition({ lat, lng });
        reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Initial reverse geocode
      reverseGeocode(startLat, startLng);
    } else {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, reverseGeocode]);

  // Handle GPS detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setPosition({ lat, lng });
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17);
          markerRef.current.setLatLng([lat, lng]);
        }
        reverseGeocode(lat, lng);
        setLocating(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        alert("Could not retrieve your live location. Please drag the pin or search your area.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Search location
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=1`,
        { headers: { "User-Agent": "SonicPrints-FestivalStorefront" } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition({ lat, lng });
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
        }
        reverseGeocode(lat, lng);
      } else {
        alert("Area not found. Try searching with a landmark, city or pincode.");
      }
    } catch (err) {
      console.warn("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleConfirm = () => {
    onSelectLocation({
      address: addressDetails.formatted,
      city: addressDetails.city,
      coordinates: position,
      mapUrl: `https://www.google.com/maps?q=${position.lat},${position.lng}`
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="map-modal-overlay" role="dialog" aria-modal="true">
      <div className="map-modal-backdrop" onClick={onClose} />
      <div className="map-modal-card">
        {/* Modal Header */}
        <div className="map-modal-header">
          <div>
            <span className="map-modal-badge">📍 Precision Delivery Pin</span>
            <h3 className="map-modal-title">Pin Your Delivery Address</h3>
          </div>
          <button className="map-modal-close-btn" onClick={onClose} aria-label="Close Map">
            ✕
          </button>
        </div>

        {/* Search Bar & GPS Locate Row */}
        <div className="map-modal-toolbar">
          <form className="map-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="map-search-input"
              placeholder="Search apartment, street, area, city or pincode…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="map-search-btn" disabled={searching}>
              {searching ? "Searching…" : "Search"}
            </button>
          </form>
          <button
            type="button"
            className="map-gps-btn"
            onClick={handleDetectLocation}
            disabled={locating}
            title="Locate my GPS position"
          >
            {locating ? "📍 Detecting…" : "🎯 Locate Me (GPS)"}
          </button>
        </div>

        {/* Interactive Map Viewport */}
        <div className="map-viewport-wrapper">
          <div ref={mapContainerRef} className="map-leaflet-container" />
          <div className="map-drag-hint">
            <span>👆 Drag pin or tap anywhere on the map to set exact drop-off spot</span>
          </div>
        </div>

        {/* Bottom Address Confirmation Bar */}
        <div className="map-modal-footer">
          <div className="map-selected-address-box">
            <span className="map-address-label">Selected Delivery Location:</span>
            <strong className="map-address-text">
              {loadingAddress ? "Detecting address for pinned coordinates…" : addressDetails.formatted || "Pin your location"}
            </strong>
            <span className="map-coords-pill">
              GPS: {position.lat.toFixed(5)}° N, {position.lng.toFixed(5)}° E
            </span>
          </div>

          <div className="map-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-gold btn-lg"
              onClick={handleConfirm}
              disabled={loadingAddress}
            >
              ✓ Confirm Location &amp; Use Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
