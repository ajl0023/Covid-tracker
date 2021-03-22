import axios from "axios";
import { scaleQuantile } from "d3-scale";
import React, { useEffect, useState } from "react";
import { readRemoteFile } from "react-papaparse";
import "./App.css";
import Card from "./Card";
import { ReactComponent as Covid } from "./covid-19.svg";
import Graph from "./Graph";
import MapChart from "./MapChart";
import Tooltip from "./Tooltip";
import Tracker from "./Tracker";
const App = () => {
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [rawData, setRawData] = useState({});
  const [showCard, setShowCard] = useState(false);
  const [isoCodes, setisoCodes] = useState({
    iso_a2: "",
    iso_a3: "",
  });
  const [timeData, setTimeData] = useState([]);
  useEffect(() => {
    readRemoteFile(
      "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/jhu/biweekly_cases.csv",
      {
        complete: (results) => {
          setTimeData(results.data);
        },
        header: true,
      }
    );
  }, []);
  useEffect(() => {
    axios({
      url:
        "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json",
      method: "GET",
    }).then((res) => {
      let rawArr = Object.keys(res.data).map((key) => {
        return res.data[key];
      });
      setRawData(rawArr);
      setData(res.data);
      setCountryData(res.data["OWID_WRL"]);
    });
  }, []);
  let colorScale;
  if (rawData.length > 0) {
    colorScale = scaleQuantile()
      .domain(rawData.map((d) => d.total_cases))
      .range([
        "#EAF2F8",
        "#7FB3D5",
        "#7FB3D5",
        "#5499C7",
        "#2980B9",
        "#2471A3",
        "#1F618D",
        "#1A5276",
        "#154360",
      ]);
  }
  const getCountry = (newCountry) => {
    let dataCheck = data[newCountry];
    if (dataCheck) {
      setCountryData(data[newCountry]);
    } else {
    }
  };
  const getData = (geo) => {
    if (data) {
      return data.filter((abv) => {
        if (Object.getOwnPropertyNames(abv)[0] === geo.properties.ISO_A3) {
          return abv;
        }
      });
    }
  };
  const selectCountry = (country, iso2) => {
    let temp = { iso_a2: country, iso_a3: iso2 };
    setisoCodes(temp);
  };
  if (!data) {
    return <div></div>;
  }
  return (
    <>
      <Tooltip>{content}</Tooltip>
      <div className="wrapper">
        {" "}
        {showCard ? (
          <Card
            timeData={timeData}
            isoCodes={isoCodes}
            showCard={showCard}
            setShowCard={setShowCard}
            countryData={countryData}
            render={(graph) => {
              return <Graph isoCodes={isoCodes} formattedData={graph} />;
            }}
          />
        ) : null}
        <div className="title-container">
          <header className="title">Covid-19 Tracker</header>
          <div className="cov-image-container">
            <Covid style={{ fill: "white" }} />
          </div>
        </div>
        <div className="map-wrapper">
          <Tracker getCountry={getCountry} countryData={countryData} />
          <MapChart
            setShowCard={setShowCard}
            colorScale={colorScale}
            getCountry={getCountry}
            selectCountry={selectCountry}
            getData={getData}
            selectedCountry={selectedCountry}
            data={data}
            setTooltipContent={setContent}
          ></MapChart>
        </div>
      </div>
    </>
  );
};
export default App;
