import React from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Source, Layer } from "react-map-gl";

const MapGL = ({ nodes, index, routes }) => {
  // const [index, setIndex] = useState(0);
  const offsetLat = 0.0015; // Adjust this offset as needed
  const offsetLon = 0.0015; // Adjust this offset as needed

  mapboxgl.accessToken =
    "pk.eyJ1IjoiYW5nZWxpbmFyaWFudGkiLCJhIjoiY2xvMHFtaHVuMHFmOTJqb2Q5N2ZpdGM3aCJ9.IlObE-hIregt9DiJKCufaw";

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div className="outer">
      <Map
        mapboxAccessToken="pk.eyJ1IjoiYW5nZWxpbmFyaWFudGkiLCJhIjoiY2xvMHFtaHVuMHFmOTJqb2Q5N2ZpdGM3aCJ9.IlObE-hIregt9DiJKCufaw"
        initialViewState={{
          longitude: 145.0714,
          latitude: -37.8119,
          zoom: 11,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        {nodes ? (
          <>
            {Object.keys(nodes).map((nodeId) => (
              <Marker
                key={nodeId}
                latitude={nodes[nodeId].lat + offsetLat}
                longitude={nodes[nodeId].long + offsetLon}
              >
                <div className="marker">{nodeId}</div>
              </Marker>
            ))}
          </>
        ) : (
          <p>Loading nodes...</p>
        )}

        {routes && index != null ? (
          <Source
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: Object.keys(routes.routes[index].path).map((key) => {
                      const node = nodes[key];
                      if (!node) return null; // Skip nodes with missing data
                      return [node.long + offsetLon, node.lat + offsetLat];
                    }),
                  },
                  properties: {
                    color: getRandomColor(),
                    cost: routes.routes[index].cost,
                  },
                },
              ],
            }}
          >
            <Layer
              id="route"
              type="line"
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
              paint={{
                "line-color": ["get", "color"], // Set the color of the edges
                "line-width": 2, // Set the width of the edges
              }}
            />
          </Source>
        ) : (
          <></>
        )}
      </Map>
    </div>
  );
};

export default MapGL;
