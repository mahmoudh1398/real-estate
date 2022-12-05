import { useState } from "react";
import Map, {
  FullscreenControl,
  LayerProps,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";

const TOKEN = `pk.eyJ1IjoibWF0aW5ub3JvenBvdXIiLCJhIjoiY2xhZjZyMzY1MTIxdDN2czQycjNsdXdxbyJ9.SAwQhE_inq9Syo1F3boUCA`;

interface BuildingMapProps {}

const BuildingMap = (props: BuildingMapProps) => {
  const [ChangeZoom, setChangeZoom] = useState<any>();

  const [currentLocation, setCurrentLocation] = useState([
    51.41462459643555, 35.6808447,
  ]);

  return (
    <Map
      initialViewState={{
        latitude: 35.755428556765054,
        longitude: 51.723633655982574,
        zoom: 5,
        bearing: 0,
        pitch: 0,
      }}
      onZoom={(e) => {
        setChangeZoom(e);
      }}
      onClick={(e) => {
        setCurrentLocation([e.lngLat.lng, e.lngLat.lat]);
      }}
      style={{ borderRadius: "15px" }}
      mapStyle="mapbox://styles/matinnorozpour/cla7tphmp000l14melgwvbob8"
      mapboxAccessToken={TOKEN}
    >
      <FullscreenControl position="bottom-left" />
      <NavigationControl position="bottom-left" />
      <ScaleControl unit="metric" maxWidth={100} />
    </Map>
  );
};

export default BuildingMap;

export const clusterLayer: LayerProps = {
  id: "clusters",
  type: "circle",
  source: "earthquakes",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "earthquakes",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "circle",
  source: "earthquakes",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};
