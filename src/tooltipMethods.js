export const nodeToArray = (nodeList) => {
  const length = nodeList.length;
  if (nodeList.hasOwnProperty) {
    return Array.prototype.slice.call(nodeList);
  }
  return new Array(length).fill().map((index) => nodeList[index]);
};
export const isCapture = (target, props) => {
  return (
    (target && target.getAttribute("data-iscapture") === "true") ||
    props.isCapture ||
    false
  );
};
export const getPosition = (e, target, node, place) => {
  const { width: tipWidth, height: tipHeight } = getDimensions(node);
  const { width: targetWidth, height: targetHeight } = getDimensions(target);
  const { mouseX, mouseY } = getCurrentOffset(e, target);
  const defaultOffset = getDefaultPosition(
    targetWidth,
    targetHeight,
    tipWidth,
    tipHeight
  );
  const getTipOffsetLeft = (place) => {
    const offsetX = defaultOffset[place].l;
    return mouseX + offsetX;
  };
  const getTipOffsetRight = (place) => {
    const offsetX = defaultOffset[place].r;
    return mouseX + offsetX;
  };
  const getTipOffsetTop = (place) => {
    const offsetY = defaultOffset[place].t;
    return mouseY + offsetY;
  };
  const getTipOffsetBottom = (place) => {
    const offsetY = defaultOffset[place].b;
    return mouseY + offsetY;
  };
  return {
    position: {
      left: parseInt(getTipOffsetLeft(place)),
      top: parseInt(getTipOffsetTop(place)),
      bottom: parseInt(getTipOffsetBottom(place)),
      right: parseInt(getTipOffsetRight(place)),
    },
  };
};
const getDefaultPosition = (targetWidth, targetHeight, tipWidth, tipHeight) => {
  let top;
  let right;
  let bottom;
  let left;
  const disToMouse = 3;
  const triangleHeight = 2;
  top = {
    l: -(tipWidth / 2),
    r: tipWidth / 2,
    t: -(tipHeight + disToMouse + triangleHeight),
    b: -disToMouse,
  };
  return { top, bottom, left, right };
};
const getDimensions = (node) => {
  const { height, width } = node.getBoundingClientRect();
  return {
    height: parseInt(height, 10),
    width: parseInt(width, 10),
  };
};
const getCurrentOffset = (e, currentTarget) => {
  return {
    mouseX: e.clientX,
    mouseY: e.clientY,
  };
};
export const getTipContent = (tip, children) => {
  if (children) {
    return children;
  } else {
    return tip;
  }
};
