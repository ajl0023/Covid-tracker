import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { ReactComponent as Cancel } from "./cancelIcon.svg";
const Card = ({
  countryData,
  setShowCard,
  showCard,
  selectedCountry,
  isoCodes,
  timeData,
  render,
}) => {
  const [formattedData, setformattedData] = useState({});
  useEffect(() => {
    if (timeData.length > 0 && countryData) {
      let test = timeData.reduce((acc, country) => {
        if (country[countryData.location] > 0 && country.date.length > 0) {
          acc.push({
            date: d3.timeParse("%Y-%m-%d")(country.date),
            value: parseInt(country[countryData.location]),
          });
        }
        return acc;
      }, []);
      setformattedData(test);
    }
  }, [countryData, timeData]);
  const handleClick = () => {
    setShowCard(false);
  };
  if (!countryData) {
    return <div></div>;
  }
  return (
    <div className={showCard ? "info-container" : "inactive"}>
      <div className="info-title-container">
        <header className="card-title">{countryData.location}</header>
        <img
          className="flag-image"
          src={
            selectedCountry === "OWID_WRL"
              ? ""
              : `https://www.countryflags.io/${isoCodes.iso_a3}/shiny/32.png`
          }
          alt=""
        />
        <button className="cancel-button">
          <Cancel onClick={handleClick} className="cancel-icon" />
        </button>
      </div>
      <div className="body-container">{render(formattedData)}</div>
      <div className="footer-container">
        <li className="footer-item">
          <h4 className="footer-item-desc">
            {new Intl.NumberFormat().format(countryData.new_tests)}
          </h4>
          <p className="footer-item-title">new tests</p>
        </li>
        <li className="footer-item">
          <h4 className="footer-item-desc">
            {new Intl.NumberFormat().format(countryData.total_cases)}
          </h4>
          <p className="footer-item-title">cases</p>
        </li>
        <li className="footer-item">
          <h4 className="footer-item-desc">
            {Intl.NumberFormat().format(countryData.new_cases)}
          </h4>
          <p className="footer-item-title">new cases</p>
        </li>
      </div>
    </div>
  );
};
export default Card;
