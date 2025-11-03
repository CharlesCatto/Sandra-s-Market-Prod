import type { LeafletMouseEvent } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet.css";
import styles from "./Map.module.css";
import L from "leaflet";
import { useState, useCallback } from "react";
import React from "react";
import pinMapIcon from "../../assets/img/pinMap.svg";
import searchIcon from "../../assets/img/search.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useChristmasMarkets } from "../../hooks/useChristmasMarkets";
import ChristmasLoader from "../../Components/ChristmasLoader/ChristmasLoader";
import MarkerClusterGroup from "react-leaflet-cluster";

const customIcon = new L.Icon({
  iconUrl: pinMapIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const createClusterCustomIcon = (cluster: any) => {
  return L.divIcon({
    html: `<div style="background-color: #1b263b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); border: 3px solid #ffd700;">${cluster.getChildCount()}</div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(40, 40, true),
  });
};

interface MapsProps {
  center?: [number, number];
  zoom?: number;
}

function Maps({ center = [48.8566, 2.3522], zoom = 6 }: MapsProps) {
  const { user } = useAuth();
  const { markets, loading, error, refetch } = useChristmasMarkets();
  const [isAddingMarket, setIsAddingMarket] = useState(false);
  const [newMarketPosition, setNewMarketPosition] = useState<
    [number, number] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    santaPresent: boolean;
    animalsForbidden: boolean;
  }>({
    santaPresent: false,
    animalsForbidden: false,
  });

  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [numberOfExponents, setNumberOfExponents] = useState<number>(0);
  const [numberOfCraftsmen, setNumberOfCraftsmen] = useState<number>(0);
  const [placeType, setPlaceType] = useState<string>("");
  const [animationType, setAnimationType] = useState<string[]>([]);
  const [animalsForbidden, setAnimalsForbidden] = useState<boolean>(false);
  const [exposition, setExposition] = useState<boolean>(false);
  const [santaPresent, setSantaPresent] = useState<boolean>(false);
  const [restauration, setRestauration] = useState<
    "food" | "drink" | "both" | "none"
  >("none");
  const [usualDays, setUsualDays] = useState<string[]>([]);

  const handleAddMarketButtonClick = useCallback(() => {
    if (!user) {
      alert("Vous devez être connecté pour ajouter un marché.");
      return;
    }
    setIsAddingMarket((prev) => !prev);
  }, [user]);

  const handleMapClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (isAddingMarket && user) {
        const { lat, lng } = e.latlng;
        setNewMarketPosition([lat, lng]);
        setIsModalOpen(true);
        setIsAddingMarket(false);
      }
    },
    [isAddingMarket, user],
  );

  const resetForm = useCallback(() => {
    setIsModalOpen(false);
    setNewMarketPosition(null);
    setName("");
    setAddress("");
    setNumberOfExponents(0);
    setNumberOfCraftsmen(0);
    setPlaceType("");
    setAnimationType([]);
    setAnimalsForbidden(false);
    setExposition(false);
    setSantaPresent(false);
    setRestauration("none");
    setUsualDays([]);
  }, []);

  const handleModalSubmit = useCallback(async () => {
    if (!name || !address || !newMarketPosition) {
      alert("Please fill in all required fields.");
      return;
    }

    const newMarketData = {
      name,
      location: { x: newMarketPosition[0], y: newMarketPosition[1] },
      address,
      number_of_exponents: numberOfExponents,
      number_of_craftsmen: numberOfCraftsmen,
      place_type: placeType,
      animation_type: animationType,
      animals_forbidden: animalsForbidden,
      exposition,
      santa_present: santaPresent,
      restauration,
      usual_days: usualDays,
      user_id: user?.id,
    };

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        "https://sandra-s-market-prod-backend.onrender.com";
      const response = await fetch(`${API_BASE_URL}/api/markets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMarketData),
      });

      if (!response.ok) throw new Error("Failed to save market");

      await response.json();
      refetch();
      resetForm();
    } catch (error) {
      console.error("Failed to save market:", error);
      alert("Failed to save market. Please try again.");
    }
  }, [
    name,
    address,
    newMarketPosition,
    numberOfExponents,
    numberOfCraftsmen,
    placeType,
    animationType,
    animalsForbidden,
    exposition,
    santaPresent,
    restauration,
    usualDays,
    user?.id,
    refetch,
    resetForm,
  ]);

  const toggleSearchMode = useCallback(() => {
    setIsSearchMode((prev) => !prev);
  }, []);

  const handleDaySelection = useCallback((day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day],
    );
  }, []);

  const handleFilterSelection = useCallback(
    (filter: keyof typeof selectedFilters) => {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        [filter]: !prevFilters[filter],
      }));
    },
    [],
  );

  if (loading) {
    return <ChristmasLoader />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Erreur: {error}</p>
        <button type="button" onClick={refetch} className={styles.retryButton}>
          Réessayer
        </button>
      </div>
    );
  }

  const filteredMarkets = Array.isArray(markets)
    ? markets.filter((market) => {
        const marketDays = Array.isArray(market.usual_days)
          ? market.usual_days
          : [];

        if (selectedDays.length > 0) {
          const hasSelectedDays = selectedDays.some((day) =>
            marketDays.includes(day),
          );
          if (!hasSelectedDays) return false;
        }

        if (selectedFilters.santaPresent && !market.santa_present) return false;
        if (selectedFilters.animalsForbidden && !market.animals_forbidden)
          return false;

        return true;
      })
    : [];

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        {user && (
          <button
            type="button"
            className={`${styles.icon} ${styles.searchIcon}`}
            style={{
              position: "absolute",
              top: "3%",
              right: "3%",
              zIndex: 1000,
              width: "5em",
              height: "5em",
            }}
            onClick={handleAddMarketButtonClick}
          >
            {isAddingMarket ? (
              "❌"
            ) : (
              <img
                src={pinMapIcon}
                alt="Add Market"
                style={{ width: "80%", height: "80%" }}
              />
            )}
          </button>
        )}

        <button
          type="button"
          className={`${styles.icon} ${styles.searchIcon}`}
          style={{
            position: "absolute",
            top: "12%",
            right: "3%",
            zIndex: 1000,
            width: "5em",
            height: "5em",
          }}
          onClick={toggleSearchMode}
        >
          <img
            src={searchIcon}
            alt="Search"
            style={{ width: "5em", height: "5em" }}
          />
        </button>

        {isSearchMode && (
          <div className={styles.searchModeContainer}>
            <div className={styles.h3}>Filters</div>
            <div className={styles.dayCheckboxes}>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    value={day}
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDaySelection(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
            <div className={styles.additionalFilters}>
              <label className={styles.dayCheckboxes}>
                <input
                  type="checkbox"
                  checked={selectedFilters.santaPresent}
                  onChange={() => handleFilterSelection("santaPresent")}
                />
                Santa Present
              </label>
              <label className={styles.dayCheckboxes}>
                <input
                  type="checkbox"
                  checked={selectedFilters.animalsForbidden}
                  onChange={() => handleFilterSelection("animalsForbidden")}
                />
                Animals Forbidden
              </label>
            </div>
          </div>
        )}

        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          className={styles.maps}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />

          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={50}
            chunkedLoading
          >
            {filteredMarkets.map((market) => (
              <Marker
                key={market.id}
                position={[market.location.x, market.location.y]}
                icon={customIcon}
              >
                <Popup className={styles.customPopup}>
                  <h3>{market.name}</h3>
                  <p>
                    <strong>Address:</strong> {market.address}
                  </p>
                  <p>
                    <strong>Exponents:</strong> {market.number_of_exponents}
                  </p>
                  <p>
                    <strong>Craftsmen:</strong> {market.number_of_craftsmen}
                  </p>
                  <p>
                    <strong>Place Type:</strong> {market.place_type}
                  </p>
                  <p>
                    <strong>Animations:</strong>{" "}
                    {market.animation_type?.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Restauration:</strong> {market.restauration}
                  </p>
                  <p>
                    <strong>Animals Allowed:</strong>{" "}
                    {market.animals_forbidden ? (
                      <span className={styles.forbiddenIcon}>
                        🚫🐾 Forbidden
                      </span>
                    ) : (
                      <span className={styles.pawIcon}>🐾 Allowed</span>
                    )}
                  </p>
                  <p>
                    <strong>Exposition:</strong>{" "}
                    {market.exposition ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Santa Present:</strong>{" "}
                    {market.santa_present ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Usual Days:</strong>{" "}
                    {market.usual_days?.length
                      ? market.usual_days.join(", ")
                      : "None"}
                  </p>
                </Popup>
              </Marker>
            ))}

            {newMarketPosition && (
              <Marker position={newMarketPosition} icon={customIcon}>
                <Popup>New Market</Popup>
              </Marker>
            )}
          </MarkerClusterGroup>

          <AdjustZoomControls />
        </MapContainer>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Add Christmas Market</h3>

            <div className={styles.section}>
              <label className={styles.modalLabel}>
                Market Name
                <input
                  type="text"
                  placeholder="e.g., Paris Christmas Market"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.modalInput}
                />
              </label>

              <label className={styles.modalLabel}>
                Address
                <input
                  type="text"
                  placeholder="e.g., 123 Main Street, Paris"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.modalInput}
                />
              </label>
            </div>

            <div className={styles.section}>
              <label className={styles.modalLabel}>
                Number of Exponents
                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={numberOfExponents}
                  onChange={(e) => setNumberOfExponents(Number(e.target.value))}
                  className={styles.modalInput}
                />
              </label>

              <label className={styles.modalLabel}>
                Number of Craftsmen
                <input
                  type="number"
                  placeholder="e.g., 20"
                  value={numberOfCraftsmen}
                  onChange={(e) => setNumberOfCraftsmen(Number(e.target.value))}
                  className={styles.modalInput}
                />
              </label>
            </div>

            <div className={styles.section}>
              <label className={styles.modalLabel}>
                Place Type
                <select
                  value={placeType}
                  onChange={(e) => setPlaceType(e.target.value)}
                  className={styles.modalInput}
                >
                  <option value="" disabled>
                    Select Place Type
                  </option>
                  <option value="church">Church</option>
                  <option value="main_square">Main Square</option>
                  <option value="sport_hall">Sport Hall</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className={styles.modalLabel}>
                Restauration
                <select
                  value={restauration}
                  onChange={(e) =>
                    setRestauration(
                      e.target.value as "food" | "drink" | "both" | "none",
                    )
                  }
                  className={styles.modalInput}
                >
                  <option value="none">No Restauration</option>
                  <option value="food">Food</option>
                  <option value="drink">Drink</option>
                  <option value="both">Food and Drink</option>
                </select>
              </label>
            </div>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Usual Days</h4>
              <div className={styles.dayCheckboxContainer}>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label key={day} className={styles.dayCheckbox}>
                    <input
                      type="checkbox"
                      value={day}
                      checked={usualDays.includes(day)}
                      onChange={(e) =>
                        setUsualDays((prevDays) =>
                          e.target.checked
                            ? [...prevDays, day]
                            : prevDays.filter((d) => d !== day),
                        )
                      }
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <label className={styles.dayCheckbox}>
                <input
                  type="checkbox"
                  checked={animalsForbidden}
                  onChange={(e) => setAnimalsForbidden(e.target.checked)}
                />
                Animals Forbidden
              </label>

              <label className={styles.dayCheckbox}>
                <input
                  type="checkbox"
                  checked={exposition}
                  onChange={(e) => setExposition(e.target.checked)}
                />
                Exposition
              </label>

              <label className={styles.dayCheckbox}>
                <input
                  type="checkbox"
                  checked={santaPresent}
                  onChange={(e) => setSantaPresent(e.target.checked)}
                />
                Santa Present
              </label>
            </div>

            <div className={styles.modalButtons}>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleModalSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MapClickHandler = ({
  onClick,
}: {
  onClick: (e: LeafletMouseEvent) => void;
}) => {
  useMapEvent("click", onClick);
  return null;
};

function AdjustZoomControls() {
  const map = useMap();
  React.useEffect(() => {
    map.zoomControl.setPosition("bottomright");
  }, [map]);
  return null;
}

export default Maps;
