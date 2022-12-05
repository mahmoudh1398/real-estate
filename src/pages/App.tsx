import { useRef, useEffect, useState } from "react";
import * as mapboxgl from "mapbox-gl";
import markerIcon from "../assets/img/marker.png";
import { data } from "../data";
import Tooltip from "../components/Tooltip";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import TypeSearchFilter from "../components/TypeSearchFilter";
import BedRooms from "../components/BedRooms";
import PropertyType from "../components/PropertyType";
import Price from "../components/Price";
import Slider from "../components/Slider";
import Meterage from "../components/Meterage";

const App = () => {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);

  const [sell, setSell] = useState<boolean>(true);
  const [rent, setRent] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [bedRooms, setBedRooms] = useState<Array<number>>([1]);
  const [propertyType, setPropertyType] = useState<string>("آپارتمانی");
  const [price, setPrice] = useState<Array<number>>([0, 10000000000]);
  const [metrage, setMetrage] = useState<Array<number>>([0, 99999]);

  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(1);

  // const [data, setData] = useState({
  //   type: "FeatureCollection",
  //   crs: {
  //     type: "name",
  //     properties: {
  //       name: "urn:ogc:def:crs:OGC:1.3:CRS84",
  //     },
  //   },
  //   features: [],
  // });

  // const getData = async () => {
  //   try {
  //     const response = await axios.get("http://real-state.service.fn/mockapi");
  //     console.log(response.data);

  //     // setData({ ...data, features: response.data });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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

    const e = d.filter(
      (item) =>
        item.properties.meterage >= metrage[0] &&
        item.properties.meterage <= metrage[1]
    );
    setFinalData({ ...finalData, features: e });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sell, rent, bedRooms, propertyType, price, metrage]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      accessToken:
        "pk.eyJ1IjoibWF0aW5ub3JvenBvdXIiLCJhIjoiY2xhZjZyMzY1MTIxdDN2czQycjNsdXdxbyJ9.SAwQhE_inq9Syo1F3boUCA",
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom: zoom,
      projection: {
        name: "mercator",
      },
    });

    // map.current.addControl(new mapboxgl.NavigationControl());

    const mag1 = ["<", ["get", "mag"], 2];
    const mag2 = ["all", [">=", ["get", "mag"], 2], ["<", ["get", "mag"], 3]];
    const mag3 = ["all", [">=", ["get", "mag"], 3], ["<", ["get", "mag"], 4]];
    const mag4 = ["all", [">=", ["get", "mag"], 4], ["<", ["get", "mag"], 5]];
    const mag5 = [">=", ["get", "mag"], 5];

    const colors = ["#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c"];

    map.current.on("load", () => {
      map.current.addSource("earthquakes", {
        type: "geojson",
        data: finalData,
        cluster: true,
        clusterRadius: 80,
        clusterProperties: {
          mag1: ["+", ["case", mag1, 1, 0]],
          mag2: ["+", ["case", mag2, 1, 0]],
          mag3: ["+", ["case", mag3, 1, 0]],
          mag4: ["+", ["case", mag4, 1, 0]],
          mag5: ["+", ["case", mag5, 1, 0]],
        },
      });

      map.current.addLayer({
        id: "earthquake_circle",
        type: "circle",
        source: "earthquakes",
        filter: ["!=", "cluster", true],
        paint: {
          "circle-color": [
            "case",
            mag1,
            "#FFFFFF",
            mag2,
            "#FFFFFF",
            mag3,
            "#FFFFFF",
            mag4,
            "#FFFFFF",
            "#FFFFFF",
          ],
          "circle-opacity": 0,
          "circle-radius": 12,
        },
      });

      map.current.loadImage(markerIcon, (error: any, image: any) => {
        if (error) throw error;
        map.current.addImage("store-icon", image, { sdf: true });
      });

      map.current.addLayer({
        id: "earthquake_label",
        type: "symbol",
        source: "earthquakes",
        filter: ["!=", "cluster", true],
        layout: {
          "icon-image": "store-icon",
          "icon-size": 0.5,
        },
        paint: {
          "icon-color": [
            "match",
            ["get", "type"],
            "rent",
            "#00B086",
            "sell",
            "#FA1744",
            "#000000",
          ],
        },
      });

      map.current.on("click", "earthquake_circle", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            ReactDOMServer.renderToString(
              <Tooltip item={e.features[0].properties} />
            )
          )
          .addTo(map.current);
      });

      const markers: any = {};
      let markersOnScreen: any = {};

      const updateMarkers = () => {
        const newMarkers: any = {};
        const features = map.current.querySourceFeatures("earthquakes");

        for (const feature of features) {
          const coords = feature.geometry.coordinates;
          const props = feature.properties;
          if (!props.cluster) continue;
          const id = props.cluster_id;

          let marker = markers[id];
          if (!marker) {
            const el: any = createDonutChart(props);
            marker = markers[id] = new mapboxgl.Marker({
              element: el,
            }).setLngLat(coords);
          }
          newMarkers[id] = marker;

          if (!markersOnScreen[id]) marker.addTo(map.current);
        }
        for (const id in markersOnScreen) {
          if (!newMarkers[id]) markersOnScreen[id].remove();
        }
        markersOnScreen = newMarkers;
      };

      map.current.on("render", () => {
        if (map.current.isSourceLoaded("earthquakes")) {
          updateMarkers();
        }
      });
    });

    const createDonutChart = (props: any) => {
      const offsets = [];
      const counts = [
        props.mag1,
        props.mag2,
        props.mag3,
        props.mag4,
        props.mag5,
      ];
      let total = 0;
      for (const count of counts) {
        offsets.push(total);
        total += count;
      }
      const fontSize =
        total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
      const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
      const r0 = Math.round(r * 0.6);
      const w = r * 2;

      let html = `<div>
      <svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block;">`;

      for (let i = 0; i < counts.length; i++) {
        html += donutSegment(
          offsets[i] / total,
          (offsets[i] + counts[i]) / total,
          r,
          r0,
          colors[i]
        );
      }
      html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
      <text dominant-baseline="central" transform="translate(${r}, ${r})">
      ${total.toLocaleString()}
      </text>
      </svg>
      </div>`;

      const el = document.createElement("div");
      el.innerHTML = html;
      return el.firstChild;
    };

    const donutSegment = (
      start: any,
      end: any,
      r: any,
      r0: any,
      color: any
    ) => {
      if (end - start === 1) end -= 0.00001;
      const a0 = 2 * Math.PI * (start - 0.25);
      const a1 = 2 * Math.PI * (end - 0.25);
      const x0 = Math.cos(a0),
        y0 = Math.sin(a0);
      const x1 = Math.cos(a1),
        y1 = Math.sin(a1);
      const largeArc = end - start > 0.5 ? 1 : 0;

      return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
        r + r * y0
      } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
        r + r0 * x1
      } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
        r + r0 * y0
      }" fill="${color}" />`;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    const mySource = map.current.getSource("earthquakes");
    mySource && mySource.setData(finalData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalData, map?.current?.getSource("earthquakes")]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <div className="sidbar">
        <TypeSearchFilter
          rent={rent}
          sell={sell}
          search={search}
          setRent={setRent}
          setSell={setSell}
          setSearch={setSearch}
        />
        <PropertyType
          propertyType={propertyType}
          setPropertyType={setPropertyType}
        />
        <Price range={price} setRange={setPrice} />
        <BedRooms bedRooms={bedRooms} setBedRooms={setBedRooms} />
        <Meterage metrage={metrage} setMetrage={setMetrage} />
        <Slider />
      </div>
    </div>
  );
};

export default App;
