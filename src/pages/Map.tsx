import { useEffect, useState } from "react";
import Map, {
  FullscreenControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import BedRooms from "../components/BedRooms";
import Pins from "../components/Pins";
import Price from "../components/Price";
import PropertyType from "../components/PropertyType";
import TypeSearchFilter from "../components/TypeSearchFilter";
import { data } from "../data";

const TOKEN = `pk.eyJ1IjoibWF0aW5ub3JvenBvdXIiLCJhIjoiY2xhZjZyMzY1MTIxdDN2czQycjNsdXdxbyJ9.SAwQhE_inq9Syo1F3boUCA`;

interface BuildingMapProps {}

const BuildingMap: React.FC<BuildingMapProps> = () => {
  const [ChangeZoom, setChangeZoom] = useState<any>();

  const [currentLocation, setCurrentLocation] = useState([
    51.41462459643555, 35.6808447,
  ]);

  const [sell, setSell] = useState<boolean>(true);
  const [rent, setRent] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [bedRooms, setBedRooms] = useState<Array<number>>([1]);
  const [propertyType, setPropertyType] = useState<string>("آپارتمانی");
  const [price, setPrice] = useState<Array<number>>([0, 10000000000]);

  const [finalData, setFinalData] = useState<any>({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: [],
  });

  useEffect(() => {
    const a = data.features.filter((item) =>
      sell && rent
        ? true
        : !sell && rent
        ? item.properties.type === "rent"
        : sell && !rent
        ? item.properties.type === "sell"
        : false
    );
    const b = a.filter((item) => bedRooms.includes(item.properties.bedrooms));

    const c = b.filter(
      (item) =>
        +item.properties.price >= price[0] && +item.properties.price <= price[1]
    );

    const d = c.filter((item) => item.properties.buildingType === propertyType);

    setFinalData({ ...finalData, features: d });
  }, [sell, rent, bedRooms, propertyType, price]);

  return (
    <div style={{ height: "100vh" }}>
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
        <Pins data={finalData.features} ChangeZoom={ChangeZoom} />
      </Map>
      <div className="sidbar">
        <TypeSearchFilter
          rent={rent}
          sell={sell}
          search={search}
          setRent={setRent}
          setSell={setSell}
          setSearch={setSearch}
        />
        <BedRooms bedRooms={bedRooms} setBedRooms={setBedRooms} />
        <PropertyType
          propertyType={propertyType}
          setPropertyType={setPropertyType}
        />
        <Price range={price} setRange={setPrice} />
      </div>
    </div>
  );
};

export default BuildingMap;
