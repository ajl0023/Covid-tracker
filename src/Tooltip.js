import React, { useEffect, useRef, useState } from "react";
import { getPosition, getTipContent, nodeToArray } from "./tooltipMethods";
const Tooltip = (props) => {
  const [, setCurrentEvent] = useState(false);
  const [, setCurrentTarget] = useState(false);
  const [, setShow] = useState(false);
  const [place, setPlace] = useState("");
  const [, setType] = useState("");
  const [originTool, setOriginoriginTool] = useState("");
  useEffect(() => {
    bindListener();
    return () => {
      unbindListener();
    };
  }, [props.children]);
  const tooltipRef = useRef(null);
  const bindListener = () => {
    const targetArray = getTargetArray();
    targetArray.forEach((target) => {
      target.addEventListener("mouseenter", showTooltip, false);
      target.addEventListener("mousemove", updateTooltip, false);
    });
  };
  const getTooltipContent = () => {
    let content;
    const children = props.children;
    return getTipContent(originTool, children, content);
  };
  const showTooltip = (e) => {
    if (!tooltipRef) {
      return;
    }
    const desiredPlace = "top";
    const originTooltip = e.currentTarget.getAttribute("data-tip");
    const target = e.currentTarget;
    const place = desiredPlace;
    const updateState = function updateState() {
      setType("dark");
      setPlace(place);
      setCurrentTarget((state) => (state = target));
      setOriginoriginTool(originTooltip);
    };
    updateState();
  };
  const getTargetArray = () => {
    let targetArray = [];
    let selector;
    selector = "[data-tip]";
    nodeToArray(document.getElementsByTagName("*"))
      .filter((element) => element.shadowRoot)
      .forEach((element) => {
        targetArray = targetArray.concat(
          nodeToArray(element.shadowRoot.querySelector(selector))
        );
      });
    return targetArray.concat(nodeToArray(document.querySelectorAll(selector)));
  };
  const updateTooltip = (e) => {
    const eventTarget = e.currentTarget || e.target;
    const node = tooltipRef.current;
    node.style.display = "block";
    const updateState = () => {
      setCurrentEvent(() => {
        const placeholder = getTooltipContent();
        if (isEmptyTip(placeholder)) {
          node.style.display = "none";
          return;
        }
        let obj = {};
        obj["currentEvent"] = e;
        obj["currentTarget"] = eventTarget;
        const result = getPosition(
          obj.currentEvent,
          obj.currentTarget,
          node,
          place
        );
        node.style.left = result.position.left + "px";
        node.style.top = result.position.top - 20 + "px";
        return obj;
      });
      setCurrentTarget((state) => {
        state = eventTarget;
        return state;
      });
      setShow(true);
    };
    updateState();
  };
  const isEmptyTip = (placeholder) => {
    return (
      (typeof placeholder === "string" && placeholder === "") ||
      placeholder === null
    );
  };
  const unbindListener = () => {
    const targetArray = getTargetArray();
    targetArray.forEach((target) => {
      target.removeEventListener("mouseenter", showTooltip, false);
      target.removeEventListener("mousemove", updateTooltip, false);
    });
  };
  return (
    <div className="tooltip-map" ref={tooltipRef}>
      {props.children}
    </div>
  );
};
export default Tooltip;
