export const data = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:OGC:1.3:CRS84",
    },
  },
  features: [
    {
      type: "Feature",
      properties: {
        mag: 2.3,
        type: "sell",
        title: "واحد تجاری 350 متری",
        mortgage: null,
        price: "3.450.000.000",
        rating: 4,
        bookmarked: true,
        meterage: 120,
        bedrooms: 2,
        parking: true,
        image: "",
      },
      geometry: {
        type: "Point",
        coordinates: [-151.5129, 63.1016],
      },
    },
    {
      type: "Feature",
      properties: {
        mag: 1.7,
        type: "rent",
        title: "واحد تجاری 350 متری",
        mortgage: "350000000",
        price: "3.450.000.000",
        rating: 4,
        bookmarked: true,
        meterage: 120,
        bedrooms: 2,
        parking: true,
        image: "",
      },
      geometry: {
        type: "Point",
        coordinates: [-150.4048, 63.1224],
      },
    },
  ],
};
