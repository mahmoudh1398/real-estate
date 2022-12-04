import React, { useRef, useEffect, useState } from "react";
import * as mapboxgl from "mapbox-gl";
import "./App.css";
import markerIcon from "./marker.png";
import { data } from "./data";
import wallpaper from "./wallpaper.png";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Rating } from "react-simple-star-rating";
import meterageIcon from "./meterage.png";

function App() {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);

  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(1);

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

    map.current.addControl(new mapboxgl.NavigationControl());

    const mag1 = ["<", ["get", "mag"], 2];
    const mag2 = ["all", [">=", ["get", "mag"], 2], ["<", ["get", "mag"], 3]];
    const mag3 = ["all", [">=", ["get", "mag"], 3], ["<", ["get", "mag"], 4]];
    const mag4 = ["all", [">=", ["get", "mag"], 4], ["<", ["get", "mag"], 5]];
    const mag5 = [">=", ["get", "mag"], 5];

    const colors = ["#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c"];

    map.current.on("load", () => {
      map.current.addSource("earthquakes", {
        type: "geojson",
        data: data,
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
            ["get", "tsunami"],
            0,
            "#00B086",
            1,
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
          .setHTML(``)
          .addTo(map.current);
      });

      const markers: any = {};
      let markersOnScreen: any = {};

      function updateMarkers() {
        const newMarkers: any = {};
        const features = map.current.querySourceFeatures("earthquakes");

        // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
        // and add it to the map if it's not there already
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
        // for every marker we've added previously, remove those that are no longer visible
        for (const id in markersOnScreen) {
          if (!newMarkers[id]) markersOnScreen[id].remove();
        }
        markersOnScreen = newMarkers;
      }

      map.current.on("render", () => {
        if (!map.current.isSourceLoaded("earthquakes")) return;
        updateMarkers();
      });
    });

    function createDonutChart(props: any) {
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
    }

    function donutSegment(start: any, end: any, r: any, r0: any, color: any) {
      if (end - start === 1) end -= 0.00001;
      const a0 = 2 * Math.PI * (start - 0.25);
      const a1 = 2 * Math.PI * (end - 0.25);
      const x0 = Math.cos(a0),
        y0 = Math.sin(a0);
      const x1 = Math.cos(a1),
        y1 = Math.sin(a1);
      const largeArc = end - start > 0.5 ? 1 : 0;

      // draw an SVG path
      return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
        r + r * y0
      } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
        r + r0 * x1
      } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
        r + r0 * y0
      }" fill="${color}" />`;
    }
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <div className="tooltip" dir="rtl">
        <div className="wallpaper-container">
          <img className="wallpaper" src={wallpaper} alt="wallpaper" />
          <div className="favorite">
            {/* <AiOutlineHeart /> */}
            <AiFillHeart style={{ color: "#ff0f00" }} />
          </div>
        </div>
        <div className="title">واحد آپارتمانی 4 طبقه 10 واحدی</div>
        <div className="rating">
          <Rating initialValue={4.5} readonly size={20} />
        </div>
        <div className="properties">
          <div className="meterage">
            <img src={meterageIcon} alt="meterage" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
