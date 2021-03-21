import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
} from "react-simple-maps";
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const MapChart = ({
  setTooltipContent,
  data,
  selectCountry,
  getCountry,
  colorScale,
  setShowCard,
}) => {
  const handleClick = (geo) => {
    if (data[geo.properties.ISO_A3]) {
      setShowCard(true);
      selectCountry(geo.properties.ISO_A3, geo.properties.ISO_A2);
      getCountry(geo.properties.ISO_A3);
    } else {
      window.alert("Not enough data.");
      setShowCard(false);
    }
  };
  return (
    <div className="map-container">
      <ComposableMap xx="" data-tip="" projectionConfig={{ scale: 147 }}>
        <Graticule stroke="#dadce0" />
        <Geographies geography={geoUrl}>
          {({ geographies }) => {
            return geographies.map((geo) => {
              const { NAME, ISO_A3 } = geo.properties;
              const cur = data[ISO_A3];
              return (
                <Geography
                  cur={cur}
                  stroke="#EAEAEC"
                  strokeWidth="0.4px"
                  cursor="pointer"
                  fill={cur ? colorScale(cur.total_cases) : ""}
                  onClick={() => handleClick(geo)}
                  onMouseEnter={() => {
                    setTooltipContent(NAME);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  key={geo.rsmKey}
                  geography={geo}
                />
              );
            });
          }}
        </Geographies>
      </ComposableMap>
    </div>
  );
};
export default MapChart;
