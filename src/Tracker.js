import React, { useEffect } from "react";
import CountUp from "react-countup";

const Tracker = ({ countryData, getCountry, render }) => {
  useEffect(() => {
    getCountry("OWID_WRD");
  }, []);
  if (!countryData) {
    return <div></div>;
  }

  const handleClick = () => {};

  return (
    <div className="tracker-container">
      <div className="counter-container">
        <header className="tracker-item-title">Total Cases:</header>
        {countryData.total_cases ? (
          <CountUp
            separator=","
            format="d"
            duration="1"
            end={countryData.total_cases}
          />
        ) : "---"}
      </div>
      <div className="counter-container">
        <header className="tracker-item-title">Total Deaths:</header>
        {countryData.total_deaths ? (
          <CountUp
            separator=","
            format="d"
            duration="1"
            end={countryData.total_deaths}
          />
        ) : "---"}
      </div>
      <div onClick={handleClick} className="counter-container">
        <header className="tracker-item-title">Total Vaccinated:</header>
        {countryData.total_vaccinations ? (
          <CountUp
            separator=","
            format="d"
            duration="1"
            end={countryData.total_vaccinations}
          />
        ) : "---"}
      </div>
    </div>
  );
};

export default Tracker;
