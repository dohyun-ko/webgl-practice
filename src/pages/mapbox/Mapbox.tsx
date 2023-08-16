import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2Fyb25hMjEiLCJhIjoiY2xsYzNrcmF5MGJyZjNxcW1mNWZsZW9ndSJ9.J4ziCDlgJHdTO-oc6QifMw";

const MapFrame = styled.div`
  position: absolute;
  top: 10vh;
  left: 10vw;
  height: 80vh;
  width: 80vw;
`;

const Sidebar = styled.div`
  position: absolute;
  bottom: 10vh;
`;

const Mapbox = () => {
  const mapContainer = useRef<null | HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [lng, lat],
        zoom: zoom,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      });

      map.current.on("style.load", () => {
        const layers = map.current!.getStyle().layers;
        const labelLayerId = layers!.find(
          (layer) => layer.type === "symbol" && layer.layout!["text-field"],
        )!.id;

        map.current!.addLayer(
          {
            id: "add-3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "height"],
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "min_height"],
              ],
              "fill-extrusion-opacity": 0.6,
            },
          },
          labelLayerId,
        );
      });
    }
  });

  const goGwangju = () => {
    if (map.current) {
      map.current.flyTo({
        center: [126.8443, 35.228],
        zoom: 14,
        essential: true,
      });
    }
  };

  return (
    <>
      <MapFrame ref={mapContainer}></MapFrame>
      <Sidebar>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <button onClick={goGwangju}>광주 ㄱㄱ</button>
      </Sidebar>
    </>
  );
};

export default Mapbox;
